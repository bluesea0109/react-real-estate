import _ from 'lodash';
import React, { useState } from 'react';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { Form as FinalForm } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Header, Form, Radio } from 'semantic-ui-react';

import {
  email,
  popup,
  isMobile,
  required,
  renderField,
  labelWithPopup,
  ExternalChanges,
  WhenFieldChanges,
  composeValidators,
  renderSelectField,
  renderPicturePickerField,
  requiredOnlyInCalifornia,
} from './helpers';
import { Button, Icon, Segment, Image, Divider, Menu } from '../Base';
import { saveProfilePending } from '../../store/modules/profile/actions';
import { saveTeamProfilePending } from '../../store/modules/teamProfile/actions';

const renderLabelWithSubHeader = (label, subHeader) =>
  isMobile() ? (
    <Header as={'label'} content={label} subheader={subHeader} />
  ) : (
    <label>
      {label} <span style={{ fontWeight: 300 }}>{subHeader}</span>
    </label>
  );

const changeMsg = 'This comes from Brivity. If you want to modify this information, you will need to modify it there';

const RevProfileForm = ({ profileAvailable, teamProfileAvailable }) => {
  const [personalNotificationEmailEnabled, setPersonalNotificationEmailEnabled] = useState(false);

  const dispatch = useDispatch();
  const auth0 = useSelector(store => store.auth0 && store.auth0.details);
  const boards = useSelector(store => store.boards && store.boards.available);
  const states = useSelector(store => store.states && store.states.available);
  const isMultimode = useSelector(store => store.onLogin.mode === 'multiuser');
  const isAdmin = useSelector(store => store.onLogin.permissions && store.onLogin.permissions.teamAdmin);
  const selectedPeerId = useSelector(store => store.peer.peerId);

  const realtorPhoto = useSelector(store => store.onLogin && store.onLogin.realtorPhoto && store.onLogin.realtorPhoto.resized);
  const teamLogo = useSelector(store => store.onLogin && store.onLogin.teamLogo && store.onLogin.teamLogo.resized);
  const brokerageLogo = useSelector(store => store.onLogin && store.onLogin.brokerageLogo && store.onLogin.brokerageLogo.resized);

  const picturesRealtorPhoto = useSelector(store => store.pictures && store.pictures.realtorPhoto && store.pictures.realtorPhoto.resized);
  const picturesTeamLogo = useSelector(store => store.pictures && store.pictures.teamLogo && store.pictures.teamLogo.resized);
  const picturesBrokerageLogo = useSelector(store => store.pictures && store.pictures.brokerageLogo && store.pictures.brokerageLogo.resized);

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

    if (isAdmin && !selectedPeerId) {
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

  if (profileAvailable) {
    const profileAvailableBoards = profileAvailable && profileAvailable.boards;
    const mlsArr = [];

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

  if (teamProfileAvailable) {
    const businessNotificationEmail = teamProfileAvailable && teamProfileAvailable.notificationEmail ? teamProfileAvailable.notificationEmail : null;

    if (!initialValues.notificationEmail) initialValues.notificationEmail = businessNotificationEmail;

    initialValues = {
      ...initialValues,
      ...teamProfileAvailable,
      teamLogo: picturesTeamLogo,
      brokerageLogo: picturesBrokerageLogo,
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
        return (
          <Form onSubmit={handleSubmit}>
            <Segment>
              <Menu borderless fluid secondary>
                <Menu.Item>
                  <Header as="h1">
                    Profile
                    {selectedPeerId ? (
                      <Header.Subheader>Peers information will be shown on their postcards and will enable recipients to reach them.</Header.Subheader>
                    ) : (
                      <Header.Subheader>Your information will be shown on your postcards and will enable recipients to reach you.</Header.Subheader>
                    )}
                  </Header>
                </Menu.Item>
                <Menu.Menu position="right">
                  <span>
                    <Button basic type="button" onClick={form.reset} disabled={submitting || pristine} color="teal">
                      Discard
                    </Button>
                    <Button type="submit" disabled={submitting} color="teal">
                      Save
                    </Button>
                  </span>
                </Menu.Menu>
              </Menu>

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
                  })}
                </div>
                <div style={{ gridArea: 'First' }}>
                  {renderField({
                    name: 'first',
                    label: isMultimode ? labelWithPopup('First Name', popup(changeMsg)) : 'First Name',
                    type: 'text',
                    required: true,
                    validate: required,
                    disabled: isMultimode,
                  })}
                </div>
                <div style={{ gridArea: 'Last' }}>
                  {renderField({
                    name: 'last',
                    label: isMultimode ? labelWithPopup('Last Name', popup(changeMsg)) : 'Last Name',
                    type: 'text',
                    required: true,
                    validate: required,
                    disabled: isMultimode,
                  })}
                </div>
                <div style={{ gridArea: 'Phone' }}>
                  {renderField({
                    name: 'phone',
                    label: isMultimode ? labelWithPopup('Phone Number', popup(changeMsg)) : 'Phone Number',
                    type: 'text',
                    required: true,
                    validate: required,
                    disabled: isMultimode,
                  })}
                </div>
                <div style={{ gridArea: 'Email' }}>
                  {renderField({
                    name: 'email',
                    label: isMultimode ? labelWithPopup('Email', popup(changeMsg)) : 'Email',
                    type: 'text',
                    required: true,
                    validate: composeValidators(required, email),
                    disabled: isMultimode,
                  })}
                </div>
                <div style={{ gridArea: 'NotificationEmail' }}>
                  {renderField({
                    name: 'notificationEmail',
                    label: renderLabelWithSubHeader('Notification Email'),
                    type: 'text',
                    required: !personalNotificationEmailEnabled,
                    disabled: personalNotificationEmailEnabled,
                  })}
                </div>
                <div style={{ gridArea: 'NotificationEmailToggle' }}>
                  <Radio
                    toggle
                    label="Same as business notification email"
                    onChange={() => setPersonalNotificationEmailEnabled(!personalNotificationEmailEnabled)}
                    checked={personalNotificationEmailEnabled}
                    onClick={() => setPersonalNotificationEmailEnabled(!personalNotificationEmailEnabled)}
                    style={{ marginTop: '2.25em', opacity: personalNotificationEmailEnabled ? '1' : '0.4' }}
                  />
                </div>
                <div style={{ gridArea: 'Dre' }}>
                  {renderField({
                    name: 'dre',
                    label: renderLabelWithSubHeader('DRE Number', '( Required in California )'),
                    type: 'text',
                    validate: requiredOnlyInCalifornia,
                  })}
                </div>
                <div style={{ gridArea: 'OfficePhone' }}>
                  {renderField({ name: 'officePhone', label: renderLabelWithSubHeader('Office Phone Number', '( Optional )'), type: 'text' })}
                </div>
                <div style={{ gridArea: 'Website' }}>
                  {renderField({ name: 'personalWebsite', label: renderLabelWithSubHeader('Personal Website', '( Optional )'), type: 'text' })}
                </div>
                <div style={{ gridArea: 'Picture' }}>
                  <Image size="large" src={require('../../assets/onboard-profile.png')} alt="Brivity Marketer Mailout" />
                </div>
              </div>
            </Segment>

            {isAdmin && !selectedPeerId && (
              <Segment>
                <Header as="h1">
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
                      label: isMultimode ? labelWithPopup('Team Name', popup(changeMsg)) : 'Team Name',
                      type: 'text',
                      required: true,
                      validate: required,
                      disabled: isMultimode,
                    })}
                  </div>
                  <div style={{ gridArea: 'TeamLogo' }}>
                    {renderPicturePickerField({ name: 'teamLogo', label: 'Team Logo', dispatch: dispatch, disabled: isMultimode })}
                  </div>
                  <div style={{ gridArea: 'BrokerageName' }}>
                    {renderField({
                      name: 'brokerageName',
                      label: isMultimode ? labelWithPopup('Brokerage Name', popup(changeMsg)) : 'Brokerage Name',
                      type: 'text',
                      required: true,
                      validate: required,
                      disabled: isMultimode,
                    })}
                  </div>
                  <div style={{ gridArea: 'BrokerageLogo' }}>
                    {renderPicturePickerField({
                      name: 'brokerageLogo',
                      label: 'Brokerage Logo',
                      dispatch: dispatch,
                      required: true,
                      validate: required,
                    })}
                  </div>
                  <div style={{ gridArea: 'OfficePhone' }}>{renderField({ name: 'officePhone', label: 'Office Phone Number (Optional)', type: 'text' })}</div>
                  <div style={{ gridArea: 'Address' }}>
                    {renderField({
                      name: 'address',
                      label: isMultimode ? labelWithPopup('Address', popup(changeMsg)) : 'Address',
                      type: 'text',
                      required: true,
                      validate: required,
                      disabled: isMultimode,
                    })}
                  </div>
                  <div style={{ gridArea: 'City' }}>
                    {renderField({
                      name: 'city',
                      label: isMultimode ? labelWithPopup('City', popup(changeMsg)) : 'City',
                      type: 'text',
                      required: true,
                      validate: required,
                      disabled: isMultimode,
                    })}
                  </div>
                  <div style={{ gridArea: 'State' }}>
                    {renderSelectField({
                      name: 'state',
                      label: isMultimode ? labelWithPopup('State', popup(changeMsg)) : 'State',
                      type: 'text',
                      required: true,
                      validate: isMultimode ? null : required,
                      options: states ? states : [],
                      search: true,
                      disabled: isMultimode,
                    })}
                  </div>
                  <div style={{ gridArea: 'ZipCode' }}>
                    {renderField({
                      name: 'zip',
                      label: isMultimode ? labelWithPopup('Zip Code', popup(changeMsg)) : 'Zip Code',
                      type: 'text',
                      required: true,
                      validate: required,
                      disabled: isMultimode,
                    })}
                  </div>
                  <div style={{ gridArea: 'BusinessNotificationEmail' }}>
                    {renderField({
                      name: 'businessNotificationEmail',
                      label: renderLabelWithSubHeader('Business Notification Email', '( Required )'),
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
              <Header as="h1">
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

              <FieldArray name="boards">
                {({ fields }) =>
                  fields.map((name, index) => (
                    <Segment secondary key={index}>
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
                          basic
                          icon
                          color="teal"
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
                <Button basic onClick={() => push('boards', undefined)} color="teal">
                  Add MLS
                </Button>
              </div>
            </Segment>
          </Form>
        );
      }}
    />
  );
};

export default RevProfileForm;