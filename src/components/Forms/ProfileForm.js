import React from 'react';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { Form as FinalForm } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Header, Divider, Form, Image } from 'semantic-ui-react';

import {
  email,
  isMobile,
  required,
  renderField,
  WhenFieldChanges,
  composeValidators,
  renderSelectField,
  renderPicturePickerField,
  requiredOnlyInCalifornia,
} from './helpers';
import { Button, Icon, Segment } from '../Base';
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

const ProfileForm = () => {
  const dispatch = useDispatch();
  const auth0 = useSelector(store => store.auth0 && store.auth0.details);
  // const profile = useSelector(store => store.profile && store.profile.available);
  const profileError = useSelector(store => store.profile && store.profile.error);
  const boards = useSelector(store => store.boards && store.boards.available);
  const states = useSelector(store => store.states && store.states.available);
  const isMultimode = useSelector(store => store.onLogin.mode === 'multiuser');
  const isAdmin = useSelector(store => store.onLogin.permissions && store.onLogin.permissions.teamAdmin);

  const onLoginUserProfile = useSelector(store => store.onLogin && store.onLogin.userProfile);
  const onLoginTeamProfile = useSelector(store => store.onLogin && store.onLogin.teamProfile);

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
      _id: onLoginUserProfile && onLoginUserProfile._id,
      _rev: onLoginUserProfile && onLoginUserProfile._rev,
      brivitySync: onLoginUserProfile && onLoginUserProfile.brivitySync,
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

    saveProfile(profile);

    if (isAdmin) {
      const business = {
        _id: onLoginTeamProfile && onLoginTeamProfile._id,
        _rev: onLoginTeamProfile && onLoginTeamProfile._rev,
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

      saveTeamProfile(business);
    }
  };

  let profileValues;
  let mlsArr = [];

  if (profileError === '410 Gone') {
    profileValues = {
      first: auth0.idTokenPayload && auth0.idTokenPayload['http://firstname'],
      last: auth0.idTokenPayload && auth0.idTokenPayload['http://lastname'],
      email: auth0.idTokenPayload && auth0.idTokenPayload.email,
      phone: auth0.idTokenPayload && auth0.idTokenPayload['http://phonenumber'],
      boards: [null],
    };
  } else {
    const onLoginUserProfileBoards = onLoginUserProfile && onLoginUserProfile.boards;

    onLoginUserProfileBoards &&
      onLoginUserProfileBoards.forEach(board => {
        const userBoard = boards.filter(boardObj => boardObj.mlsid === board.name);
        mlsArr.push({ name: userBoard[0] && userBoard[0].value, mlsId: board.mlsId });
      });

    const businessNotificationEmail = onLoginTeamProfile && onLoginTeamProfile.notificationEmail ? onLoginTeamProfile.notificationEmail : null;
    const notificationEmail = onLoginUserProfile && onLoginUserProfile.notificationEmail ? onLoginUserProfile.notificationEmail : businessNotificationEmail;

    profileValues = Object.assign(
      {},
      onLoginUserProfile,
      onLoginTeamProfile,
      { boards: mlsArr },
      { realtorPhoto: picturesRealtorPhoto || realtorPhoto },
      { teamLogo: picturesTeamLogo || teamLogo },
      { brokerageLogo: picturesBrokerageLogo || brokerageLogo },
      { notificationEmail: notificationEmail },
      { businessNotificationEmail: businessNotificationEmail }
    );
  }

  return (
    <FinalForm
      onSubmit={onSubmit}
      initialValues={profileValues}
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
            <WhenFieldChanges
              field="businessNotificationEmail"
              becomes={values.businessNotificationEmail}
              set="notificationEmail"
              to={values.businessNotificationEmail}
            />

            <Segment>
              <Header as="h1">
                Profile
                <Header.Subheader>Your information will be shown on your postcards and will enable recipients to reach you.</Header.Subheader>
              </Header>

              <Divider style={{ margin: '1em -1em' }} />

              <div
                style={
                  isMobile()
                    ? {}
                    : {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr',
                        gridTemplateRows: '1fr 1fr 1fr 1fr',
                        gridTemplateAreas: `"First Last Headshot Picture" "Phone Email Headshot Picture" "Dre OfficePhone Headshot Picture" "NotificationEmail NotificationEmail Website Website"`,
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
                  {renderField({ name: 'first', label: 'First Name', type: 'text', required: true, validate: required, disabled: isMultimode })}
                </div>
                <div style={{ gridArea: 'Last' }}>
                  {renderField({ name: 'last', label: 'Last Name', type: 'text', required: true, validate: required, disabled: isMultimode })}
                </div>
                <div style={{ gridArea: 'Phone' }}>
                  {renderField({ name: 'phone', label: 'Phone Number', type: 'text', required: true, validate: required, disabled: isMultimode })}
                </div>
                <div style={{ gridArea: 'Email' }}>
                  {renderField({
                    name: 'email',
                    label: 'Email',
                    type: 'text',
                    required: true,
                    validate: composeValidators(required, email),
                    disabled: isMultimode,
                  })}
                </div>
                <div style={{ gridArea: 'NotificationEmail' }}>
                  {renderField({
                    name: 'notificationEmail',
                    label: renderLabelWithSubHeader('Notification Email', '( Optional, defaults to Business Notification Email if not set )'),
                    type: 'text',
                  })}
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

            {isAdmin && (
              <Segment>
                <Header as="h1">
                  Business
                  <Header.Subheader>Enter your company details for branding purposes and for the return addresss of your mailers.</Header.Subheader>
                </Header>

                <Divider style={{ margin: '1em -1em' }} />

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
                    {renderField({ name: 'teamName', label: 'Team Name', type: 'text', required: true, validate: required, disabled: isMultimode })}
                  </div>
                  <div style={{ gridArea: 'TeamLogo' }}>
                    {renderPicturePickerField({ name: 'teamLogo', label: 'Team Logo', dispatch: dispatch, disabled: isMultimode })}
                  </div>
                  <div style={{ gridArea: 'BrokerageName' }}>
                    {renderField({ name: 'brokerageName', label: 'Brokerage Name', type: 'text', required: true, validate: required })}
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
                    {renderField({ name: 'address', label: 'Address', type: 'text', required: true, validate: required, disabled: isMultimode })}
                  </div>
                  <div style={{ gridArea: 'City' }}>
                    {renderField({ name: 'city', label: 'City', type: 'text', required: true, validate: required, disabled: isMultimode })}
                  </div>
                  <div style={{ gridArea: 'State' }}>
                    {renderSelectField({
                      name: 'state',
                      label: 'State',
                      type: 'text',
                      required: true,
                      validate: required,
                      options: states ? states : [],
                      search: true,
                      disabled: isMultimode,
                    })}
                  </div>
                  <div style={{ gridArea: 'ZipCode' }}>
                    {renderField({ name: 'zip', label: 'Zip Code', type: 'text', required: true, validate: required, disabled: isMultimode })}
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
                <Header.Subheader>Enter your MLS information so we can generate postcards for your listings.</Header.Subheader>
              </Header>

              <Divider style={{ margin: '1em -1em' }} />

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

            <div style={{ display: 'grid', justifyContent: 'end' }}>
              <span>
                <Button basic type="button" onClick={form.reset} disabled={submitting || pristine} color="teal">
                  Discard
                </Button>
                <Button type="submit" disabled={submitting} color="teal">
                  Save
                </Button>
              </span>
            </div>
          </Form>
        );
      }}
    />
  );
};

export default ProfileForm;
