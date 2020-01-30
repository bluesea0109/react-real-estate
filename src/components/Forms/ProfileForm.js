import _ from 'lodash';
import arrayMutators from 'final-form-arrays';
import { Header, Form } from 'semantic-ui-react';
import React, { Fragment, useState } from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { Form as FinalForm } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  email,
  popup,
  isMobile,
  required,
  renderField,
  ExternalChanges,
  WhenFieldChanges,
  composeValidators,
  renderSelectField,
  renderPicturePickerField,
  requiredOnlyInCalifornia,
} from './helpers';
import Loading from '../Loading';
import { ContentTopHeaderLayout } from '../../layouts';
import { saveProfilePending } from '../../store/modules/profile/actions';
import { saveTeamProfilePending } from '../../store/modules/teamProfile/actions';
import { Button, Icon, Segment, Image, Divider, Menu, Page, Snackbar } from '../Base';

const changeMsg = 'This information comes from Brivity CRM. If you want to modify this information, you need to do it there.';

const ProfileForm = ({ profileAvailable, teamProfileAvailable }) => {
  const [personalNotificationEmailEnabled, setPersonalNotificationEmailEnabled] = useState(false);

  const dispatch = useDispatch();
  const auth0 = useSelector(store => store.auth0 && store.auth0.details);
  const boards = useSelector(store => store.boards && store.boards.available);
  const states = useSelector(store => store.states && store.states.available);
  const onLoginMode = useSelector(store => store.onLogin.mode);
  const multiUser = onLoginMode === 'multiuser';
  // const singleUser = onLoginMode === 'singleuser';

  const isAdmin = useSelector(store => store.onLogin.permissions && store.onLogin.permissions.teamAdmin);
  const selectedPeerId = useSelector(store => store.peer.peerId);

  const profileError = useSelector(store => store.profile.error && store.profile.error.message);
  const profileSaveError = useSelector(store => store.profile.saveError && store.profile.saveError.message);
  const teamProfileError = useSelector(store => store.teamProfile.error && store.teamProfile.error.message);
  const teamProfileSaveError = useSelector(store => store.profile.saveError && store.profile.saveError.message);

  const realtorPhoto = useSelector(store => store.onLogin && store.onLogin.realtorPhoto && store.onLogin.realtorPhoto.resized);
  const teamLogo = useSelector(store => store.onLogin && store.onLogin.teamLogo && store.onLogin.teamLogo.resized);
  const brokerageLogo = useSelector(store => store.onLogin && store.onLogin.brokerageLogo && store.onLogin.brokerageLogo.resized);

  const picturesRealtorPhoto = useSelector(store => store.pictures && store.pictures.realtorPhoto && store.pictures.realtorPhoto.resized);
  const picturesTeamLogo = useSelector(store => store.pictures && store.pictures.teamLogo && store.pictures.teamLogo.resized);
  const picturesBrokerageLogo = useSelector(store => store.pictures && store.pictures.brokerageLogo && store.pictures.brokerageLogo.resized);

  const picturesPending = useSelector(store => store.pictures && store.pictures.pending);
  const picturesError = useSelector(store => store.pictures && store.pictures.error);

  const profileSavePending = useSelector(store => store.profile.savePending);
  const teamProfileSavePending = useSelector(store => store.teamProfile.savePending);
  const mailoutsGeneratePending = useSelector(store => store.mailouts.generatePending);

  const isInitiatingTeam = useSelector(store => store.teamInitialize.polling);
  const isInitiatingUser = useSelector(store => store.initialize.polling);

  const saveProfile = profile => dispatch(saveProfilePending(profile));
  const saveTeamProfile = teamProfile => dispatch(saveTeamProfilePending(teamProfile));
  const onSubmit = values => {
    const profile = {
      notificationEmail: values.notificationEmail,
      first: values.first,
      last: values.last,
      email: values.email,
      phone: values.phone,
      dre: values.dre,
      teamId: values.teamId,
      setupComplete: Date.now(),
      boards: values.boards,
      website: values.personalWebsite,
    };

    if (profileAvailable) {
      profile._id = profileAvailable._id;
      profile._rev = profileAvailable._rev;
      profile.teamId = values.teamId || profileAvailable.teamId;
      profile.brivitySync = profileAvailable.brivitySync;
    }

    saveProfile(profile);

    if ((isAdmin || !multiUser) && !selectedPeerId) {
      const business = {
        teamProfile: true,
        notificationEmail: values.businessNotificationEmail,
        teamName: values.teamName,
        brokerageName: values.brokerageName,
        address: values.address,
        city: values.city,
        state: values.state,
        zip: values.zip,
        phone: values.officePhone,
        website: values.businessWebsite,
      };

      if (teamProfileAvailable) {
        business._id = teamProfileAvailable._id;
        business._rev = teamProfileAvailable._rev;
        business.brivitySync = teamProfileAvailable.brivitySync;
        business.phone = values.officePhone || teamProfileAvailable.phone;
        business.website = values.businessWebsite || teamProfileAvailable.website;
      }

      saveTeamProfile(business);
    }
  };

  let initialValues = {
    email: auth0.idTokenPayload && auth0.idTokenPayload.email,
    boards: [null],
    realtorPhoto: realtorPhoto,
    teamLogo: teamLogo,
    brokerageLogo: brokerageLogo,
  };

  let profileAvailableBoards;
  let mlsArr;

  if (profileAvailable && !teamProfileAvailable) {
    profileAvailableBoards = profileAvailable && profileAvailable.boards;
    mlsArr = [];

    if (profileAvailableBoards) {
      profileAvailableBoards.forEach(board => {
        const userBoard = boards.filter(boardObj => boardObj.mlsid === board.name);
        mlsArr.push({ name: userBoard[0] && userBoard[0].value, mlsId: board.mlsId });
      });
    } else {
      mlsArr.push(null);
    }

    const notificationEmail = profileAvailable && profileAvailable.notificationEmail;

    initialValues = {
      ...initialValues,
      ...profileAvailable,
      boards: mlsArr,
      notificationEmail: notificationEmail,
    };
  }

  if (profileAvailable && teamProfileAvailable) {
    profileAvailableBoards = profileAvailable && profileAvailable.boards;
    mlsArr = [];

    if (profileAvailableBoards) {
      profileAvailableBoards.forEach(board => {
        const userBoard = boards.filter(boardObj => boardObj.mlsid === board.name);
        mlsArr.push({ name: userBoard[0] && userBoard[0].value, mlsId: board.mlsId });
      });
    } else {
      mlsArr.push(null);
    }

    let notificationEmail = profileAvailable && profileAvailable.notificationEmail;
    const businessNotificationEmail = teamProfileAvailable && teamProfileAvailable.notificationEmail ? teamProfileAvailable.notificationEmail : null;

    if (!notificationEmail) notificationEmail = businessNotificationEmail;

    initialValues = {
      ...initialValues,
      ...profileAvailable,
      ...teamProfileAvailable,
      boards: mlsArr,
      teamLogo: picturesTeamLogo,
      brokerageLogo: picturesBrokerageLogo,
      notificationEmail: notificationEmail,
      businessNotificationEmail: businessNotificationEmail,
    };
  }

  return (
    <FinalForm
      keepDirtyOnReinitialize={true}
      onSubmit={onSubmit}
      initialValues={initialValues}
      mutators={{
        ...arrayMutators,
      }}
      render={({
        handleSubmit,
        form: {
          mutators: { push },
        },
        form,
        submitting,
        pristine,
        values,
      }) => {
        if (profileSavePending || teamProfileSavePending || mailoutsGeneratePending) {
          return (
            <Segment style={{ minHeight: '80vh' }}>
              <Loading message="Saving, please wait..." />
            </Segment>
          );
        }

        return (
          <Page basic>
            <Form onSubmit={handleSubmit}>
              <ContentTopHeaderLayout>
                <Segment style={isMobile() ? { marginTop: '58px' } : {}}>
                  <Menu borderless fluid secondary>
                    <Menu.Item>
                      <Header as="h1">Profile</Header>
                    </Menu.Item>
                    <Menu.Menu position="right">
                      <Menu.Item>
                        <span>
                          <Button primary type="submit" disabled={submitting}>
                            Save
                          </Button>
                        </span>
                      </Menu.Item>
                    </Menu.Menu>
                  </Menu>
                </Segment>
              </ContentTopHeaderLayout>

              {profileError && <Snackbar error>{profileError}</Snackbar>}
              {profileSaveError && <Snackbar error>{profileSaveError}</Snackbar>}
              {teamProfileError && <Snackbar error>{teamProfileError}</Snackbar>}
              {teamProfileSaveError && <Snackbar error>{teamProfileSaveError}</Snackbar>}

              <Segment style={isMobile() ? { marginTop: '6em' } : { marginTop: '6.5em' }}>
                <Header as="h2">
                  Personal
                  {selectedPeerId ? (
                    <Header.Subheader>Peers information will be shown on their postcards and will enable recipients to reach them.</Header.Subheader>
                  ) : (
                    <Header.Subheader>Your information will be shown on your postcards and will enable recipients to reach you.</Header.Subheader>
                  )}
                </Header>

                <Divider style={{ margin: '1em -1em' }} />

                <ExternalChanges whenTrue={picturesRealtorPhoto} set="realtorPhoto" to={picturesRealtorPhoto} />

                <div
                  style={
                    isMobile()
                      ? {}
                      : {
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr 1fr',
                          gridTemplateRows: '1fr 1fr 1fr 1fr',
                          gridTemplateAreas: `"First Last Headshot Picture" "Phone Email Headshot Picture" "Dre OfficePhone Headshot Picture" "NotificationEmail NotificationEmailToggle Website Website"`,
                          gridColumnGap: '2em',
                        }
                  }
                >
                  <div style={{ gridArea: 'Headshot' }}>
                    {renderPicturePickerField({
                      name: 'realtorPhoto',
                      label: 'Headshot',
                      dispatch: dispatch,
                      required: true,
                      validate: required,
                      pending: picturesPending,
                      error: picturesError,
                    })}
                  </div>
                  <div style={{ gridArea: 'First' }}>
                    {renderField({
                      name: 'first',
                      label: 'First Name',
                      popup: multiUser ? popup(changeMsg) : null,
                      type: 'text',
                      required: true,
                      validate: required,
                      disabled: multiUser,
                    })}
                  </div>
                  <div style={{ gridArea: 'Last' }}>
                    {renderField({
                      name: 'last',
                      label: 'Last Name',
                      popup: multiUser ? popup(changeMsg) : null,
                      type: 'text',
                      required: true,
                      validate: required,
                      disabled: multiUser,
                    })}
                  </div>
                  <div style={{ gridArea: 'Phone' }}>
                    {renderField({
                      name: 'phone',
                      label: 'Phone Number',
                      popup: multiUser ? popup(changeMsg) : null,
                      type: 'text',
                      required: true,
                      validate: required,
                      disabled: multiUser,
                    })}
                  </div>
                  <div style={{ gridArea: 'Email' }}>
                    {renderField({
                      name: 'email',
                      label: 'Email',
                      popup: multiUser ? popup(changeMsg) : null,
                      type: 'text',
                      required: true,
                      validate: composeValidators(required, email),
                      disabled: multiUser,
                    })}
                  </div>
                  <div style={{ gridArea: 'NotificationEmail' }}>
                    {renderField({
                      name: 'notificationEmail',
                      label: 'Personal Notification Email',
                      type: 'text',
                      required: !personalNotificationEmailEnabled,
                      validate: !personalNotificationEmailEnabled ? composeValidators(required, email) : null,
                      disabled: personalNotificationEmailEnabled,
                    })}
                  </div>
                  <div style={{ gridArea: 'NotificationEmailToggle' }}>
                    {personalNotificationEmailEnabled ? (
                      <span style={{ color: '#F2714D' }}>
                        <FontAwesomeIcon
                          icon="toggle-on"
                          size="2x"
                          style={{ marginTop: '1em', verticalAlign: '-0.3em', color: '#59C4C4' }}
                          onClick={() => setPersonalNotificationEmailEnabled(!personalNotificationEmailEnabled)}
                        />{' '}
                        Same as business notification email
                      </span>
                    ) : (
                      <span style={{ color: '#969696' }}>
                        <FontAwesomeIcon
                          icon="toggle-on"
                          size="2x"
                          className="fa-flip-horizontal"
                          style={{ marginTop: '1em', verticalAlign: '-0.3em' }}
                          onClick={() => setPersonalNotificationEmailEnabled(!personalNotificationEmailEnabled)}
                        />{' '}
                        Same as business notification email
                      </span>
                    )}
                  </div>
                  <div style={{ gridArea: 'Dre' }}>
                    {renderField({
                      name: 'dre',
                      label: 'DRE Number',
                      subHeader: '(Required in California)',
                      type: 'text',
                      validate: requiredOnlyInCalifornia,
                    })}
                  </div>
                  <div style={{ gridArea: 'OfficePhone' }}>
                    {renderField({
                      name: 'officePhone',
                      label: 'Office Phone Number',
                      subHeader: '(Optional)',
                      type: 'text',
                    })}
                  </div>
                  <div style={{ gridArea: 'Website' }}>
                    {renderField({
                      name: 'personalWebsite',
                      label: 'Personal Website',
                      subHeader: '(Optional)',
                      type: 'text',
                    })}
                  </div>
                  <div style={{ gridArea: 'Picture' }}>
                    <Image size="large" src={require('../../assets/onboard-profile.png')} alt="Brivity Marketer Mailout" />
                  </div>
                </div>
              </Segment>

              {(isAdmin || !multiUser) && !selectedPeerId && (
                <Segment>
                  <Header as="h2">
                    Business
                    <Header.Subheader>Enter your company details for branding purposes and for the return addresss of your mailers.</Header.Subheader>
                  </Header>

                  <Divider style={{ margin: '1em -1em' }} />

                  <WhenFieldChanges
                    field="businessNotificationEmail"
                    becomes={values.businessNotificationEmail}
                    set="notificationEmail"
                    to={values.businessNotificationEmail}
                    when={personalNotificationEmailEnabled}
                  />

                  <ExternalChanges whenTrue={personalNotificationEmailEnabled} set="notificationEmail" to={values.businessNotificationEmail} />

                  {!teamLogo && !picturesTeamLogo && <ExternalChanges whenTrue={true} set="teamLogo" to={require('../../assets/image-placeholder.svg')} />}

                  {teamLogo && !picturesTeamLogo && <ExternalChanges whenTrue={teamLogo} set="teamLogo" to={teamLogo} />}

                  {picturesTeamLogo && <ExternalChanges whenTrue={picturesTeamLogo} set="teamLogo" to={picturesTeamLogo} />}

                  {brokerageLogo && !picturesBrokerageLogo && <ExternalChanges whenTrue={brokerageLogo} set="brokerageLogo" to={brokerageLogo} />}

                  {picturesBrokerageLogo && <ExternalChanges whenTrue={picturesBrokerageLogo} set="brokerageLogo" to={picturesBrokerageLogo} />}

                  <div
                    style={
                      isMobile()
                        ? {}
                        : {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr 1fr',
                            gridTemplateRows: '1fr 1fr 1fr 1fr 1fr 1fr',
                            gridTemplateAreas: `"TeamName TeamName TeamLogo BrokerageLogo" "BrokerageName BrokerageName TeamLogo BrokerageLogo" "OfficePhone OfficePhone TeamLogo BrokerageLogo" "Address Address City City" "State State ZipCode ZipCode" "BusinessNotificationEmail BusinessNotificationEmail BusinessWebsite BusinessWebsite"`,
                            gridRowGap: '1em',
                            gridColumnGap: '2em',
                          }
                    }
                  >
                    <div style={{ gridArea: 'TeamName' }}>
                      {renderField({
                        name: 'teamName',
                        label: 'Team Name',
                        popup: multiUser ? popup(changeMsg) : null,
                        type: 'text',
                        required: true,
                        validate: required,
                        disabled: multiUser,
                      })}
                    </div>
                    <div style={{ gridArea: 'TeamLogo' }}>
                      {renderPicturePickerField({
                        name: 'teamLogo',
                        label: 'Team Logo',
                        dispatch: dispatch,
                        disabled: multiUser,
                        pending: picturesPending,
                        error: picturesError,
                      })}
                    </div>
                    <div style={{ gridArea: 'BrokerageName' }}>
                      {renderField({
                        name: 'brokerageName',
                        label: 'Brokerage Name',
                        popup: multiUser ? popup(changeMsg) : null,
                        type: 'text',
                        required: true,
                        validate: required,
                        disabled: multiUser,
                      })}
                    </div>
                    <div style={{ gridArea: 'BrokerageLogo' }}>
                      {renderPicturePickerField({
                        name: 'brokerageLogo',
                        label: 'Brokerage Logo',
                        dispatch: dispatch,
                        required: true,
                        validate: required,
                        pending: picturesPending,
                        error: picturesError,
                      })}
                    </div>
                    <div style={{ gridArea: 'OfficePhone' }}>{renderField({ name: 'officePhone', label: 'Office Phone Number (Optional)', type: 'text' })}</div>
                    <div style={{ gridArea: 'Address' }}>
                      {renderField({
                        name: 'address',
                        label: 'Address',
                        popup: multiUser ? popup(changeMsg) : null,
                        type: 'text',
                        required: true,
                        validate: required,
                        disabled: multiUser,
                      })}
                    </div>
                    <div style={{ gridArea: 'City' }}>
                      {renderField({
                        name: 'city',
                        label: 'City',
                        popup: multiUser ? popup(changeMsg) : null,
                        type: 'text',
                        required: true,
                        validate: required,
                        disabled: multiUser,
                      })}
                    </div>
                    <div style={{ gridArea: 'State' }}>
                      {renderSelectField({
                        name: 'state',
                        label: 'State',
                        popup: multiUser ? popup(changeMsg) : null,
                        type: 'text',
                        required: true,
                        validate: multiUser ? null : required,
                        options: states ? states : [],
                        search: true,
                        disabled: multiUser,
                      })}
                    </div>
                    <div style={{ gridArea: 'ZipCode' }}>
                      {renderField({
                        name: 'zip',
                        label: 'Zip Code',
                        popup: multiUser ? popup(changeMsg) : null,
                        type: 'text',
                        required: true,
                        validate: required,
                        disabled: multiUser,
                      })}
                    </div>
                    <div style={{ gridArea: 'BusinessNotificationEmail' }}>
                      {renderField({
                        name: 'businessNotificationEmail',
                        label: 'Business Notification Email',
                        type: 'text',
                        required: true,
                        validate: composeValidators(required, email),
                      })}
                    </div>
                    <div style={{ gridArea: 'BusinessWebsite' }}>
                      {renderField({ name: 'businessWebsite', label: 'Business Website (Optional)', type: 'text' })}
                    </div>
                  </div>
                </Segment>
              )}

              <Segment>
                <Header as="h2">
                  MLS
                  {selectedPeerId ? (
                    <Header.Subheader>Enter peers MLS information so we can generate postcards for their listings.</Header.Subheader>
                  ) : (
                    <Header.Subheader>Enter your MLS information so we can generate postcards for your listings.</Header.Subheader>
                  )}
                </Header>

                <Divider style={{ margin: '1em -1em' }} />

                <ExternalChanges
                  whenTrue={initialValues.boards.length !== 0 && _.isEqual(values.boards, initialValues.boards)}
                  set="boards"
                  to={initialValues.boards}
                />

                {isInitiatingTeam || isInitiatingUser ? (
                  <Loading message="Updating MLS settings, please wait..." />
                ) : (
                  <Fragment>
                    <FieldArray name="boards">
                      {({ fields }) =>
                        fields.map((name, index) => (
                          <Segment basic key={index}>
                            <div style={isMobile() ? { display: 'grid' } : { display: 'grid', gridTemplateColumns: '1fr 1fr 45px', gridColumnGap: '2em' }}>
                              {renderSelectField({
                                name: `${name}.name`,
                                label: 'MLS',
                                type: 'text',
                                required: true,
                                validate: required,
                                options: boards ? boards : [],
                                search: true,
                              })}
                              {renderField({ name: `${name}.mlsId`, label: 'MLS Agent ID', type: 'text', required: true, validate: required })}
                              <Button
                                primary
                                inverted
                                icon
                                disabled={fields.length === 1}
                                onClick={() => fields.remove(index)}
                                style={isMobile() ? { cursor: 'pointer' } : { maxHeight: '45px', margin: '1.7em 0', cursor: 'pointer' }}
                                aria-label="remove mls"
                              >
                                <Icon name="trash" />
                              </Button>
                            </div>
                          </Segment>
                        ))
                      }
                    </FieldArray>

                    <div className="buttons">
                      <Button primary inverted onClick={() => push('boards', undefined)}>
                        Add MLS
                      </Button>
                    </div>
                  </Fragment>
                )}
              </Segment>
            </Form>
          </Page>
        );
      }}
    />
  );
};

export default ProfileForm;
