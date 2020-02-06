import _ from 'lodash';
import * as Yup from 'yup';
import { FieldArray } from 'formik';
import { Header } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useReducer, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { saveTeamProfilePending } from '../../store/modules/teamProfile/actions';
import { Divider, Icon, Image, Menu, Page, Segment, Snackbar } from '../Base';
import { saveProfilePending } from '../../store/modules/profile/actions';
import { Button, Dropdown, Form, Input, FileUpload } from './Base';
import { isMobile, phoneRegExp, popup, tag } from './utils';
import { ContentTopHeaderLayout } from '../../layouts';
import Loading from '../Loading';

const changeMsg = 'This information comes from Brivity CRM. If you want to modify this information, you need to do it there.';

const formReducer = (state, action) => {
  return _.merge({}, state, action);
};

const initialValues = {
  userProfile: {
    _id: '',
    _rev: '',
    notificationEmail: '',
    first: '',
    last: '',
    email: '',
    phone: '',
    dre: '',
    teamId: '',
    setupComplete: '',
    brivitySync: '',
    boards: [{ name: '', mlsId: '' }],
  },
  businessProfile: {
    _id: '',
    _rev: '',
    teamProfile: '',
    notificationEmail: '',
    brivitySync: '',
    teamName: '',
    brokerageName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    website: '',
  },
};

const ProfileForm = ({ profileAvailable, teamProfileAvailable }) => {
  const dispatch = useDispatch();
  const boards = useSelector(store => store.boards && store.boards.available);
  const states = useSelector(store => store.states && store.states.available);

  const onLoginMode = useSelector(store => store.onLogin.mode);
  const multiUser = onLoginMode === 'multiuser';
  const isAdmin = useSelector(store => store.onLogin.permissions && store.onLogin.permissions.teamAdmin);
  const selectedPeerId = useSelector(store => store.peer.peerId);

  const picturesPending = useSelector(store => store.pictures && store.pictures.pending);
  const picturesError = useSelector(store => store.pictures && store.pictures.error);

  const realtorPhoto = useSelector(store => store.onLogin && store.onLogin.realtorPhoto && store.onLogin.realtorPhoto.resized);
  const teamLogo = useSelector(store => store.onLogin && store.onLogin.teamLogo && store.onLogin.teamLogo.resized);
  const brokerageLogo = useSelector(store => store.onLogin && store.onLogin.brokerageLogo && store.onLogin.brokerageLogo.resized);

  const picturesRealtorPhoto = useSelector(store => store.pictures && store.pictures.realtorPhoto && store.pictures.realtorPhoto.resized);
  const picturesTeamLogo = useSelector(store => store.pictures && store.pictures.teamLogo && store.pictures.teamLogo.resized);
  const picturesBrokerageLogo = useSelector(store => store.pictures && store.pictures.brokerageLogo && store.pictures.brokerageLogo.resized);

  const profileSavePending = useSelector(store => store.profile.savePending);
  const profileSaveError = useSelector(store => store.profile.saveError && store.profile.saveError.message);
  const teamProfileSavePending = useSelector(store => store.teamProfile.savePending);
  const teamProfileSaveError = useSelector(store => store.profile.saveError && store.profile.saveError.message);
  const mailoutsGeneratePending = useSelector(store => store.mailouts.generatePending);

  const isInitiatingTeam = useSelector(store => store.teamInitialize.polling);
  const isInitiatingUser = useSelector(store => store.initialize.polling);

  const [formValues, setFormValues] = useReducer(formReducer, initialValues);
  const [personalNotificationEmailEnabled, setPersonalNotificationEmailEnabled] = useState(false);

  useEffect(() => {
    if (profileAvailable && teamProfileAvailable) {
      const updatedFormValues = _.merge({}, formValues, { userProfile: profileAvailable }, { businessProfile: teamProfileAvailable });
      if (profileAvailable.notificationEmail === teamProfileAvailable.notificationEmail) {
        setPersonalNotificationEmailEnabled(true);
      }
      setFormValues(updatedFormValues);
    } else {
      if (profileAvailable && !teamProfileAvailable) {
        const updatedFormValues = _.merge({}, formValues, { userProfile: profileAvailable });
        setFormValues(updatedFormValues);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileAvailable, teamProfileAvailable, setFormValues, setPersonalNotificationEmailEnabled]);

  const saveProfile = profile => dispatch(saveProfilePending(profile));
  const saveTeamProfile = teamProfile => dispatch(saveTeamProfilePending(teamProfile));

  const _handleSubmit = values => {
    const profile = {
      notificationEmail: values.personalNotificationEmail,
      first: values.first,
      last: values.last,
      email: values.email,
      phone: values.personalPhone,
      dre: values.dre,
      setupComplete: Date.now(),
      boards: values.boards,
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
        notificationEmail: values.businessNotificationEmail,
        teamName: values.teamName,
        brokerageName: values.brokerageName,
        address: values.address,
        city: values.city,
        state: values.state,
        zip: values.zip,
        phone: values.businessPhone,
      };

      if (teamProfileAvailable) {
        business._id = teamProfileAvailable._id;
        business._rev = teamProfileAvailable._rev;
        business.teamProfile = teamProfileAvailable.teamProfile;
        business.brivitySync = teamProfileAvailable.brivitySync;
        business.phone = values.businessPhone || teamProfileAvailable.phone;
      }

      saveTeamProfile(business);
    }
  };

  if (profileSavePending || teamProfileSavePending || mailoutsGeneratePending) {
    return (
      <Segment basic style={{ minHeight: '95vh' }}>
        <Loading message="Saving, please wait..." />
      </Segment>
    );
  }

  return (
    <Page basic>
      <Form
        ignoreLoading
        enableReinitialize
        initialValues={{
          realtorPhoto: picturesRealtorPhoto || realtorPhoto,
          first: formValues.userProfile.first,
          last: formValues.userProfile.last,
          personalPhone: formValues.userProfile.phone,
          email: formValues.userProfile.email,
          dre: formValues.userProfile.dre,
          personalOfficePhone: '',
          personalNotificationEmail: personalNotificationEmailEnabled ? formValues.businessProfile.notificationEmail : formValues.userProfile.notificationEmail,
          boards: formValues.userProfile.boards,
          teamName: formValues.businessProfile.teamName,
          brokerageName: formValues.businessProfile.brokerageName,
          businessPhone: formValues.businessProfile.phone,
          teamLogo: picturesTeamLogo || teamLogo,
          brokerageLogo: picturesBrokerageLogo || brokerageLogo,
          address: formValues.businessProfile.address,
          city: formValues.businessProfile.city,
          state: formValues.businessProfile.state,
          zip: formValues.businessProfile.zip,
          businessNotificationEmail: formValues.businessProfile.notificationEmail,
        }}
        validationSchema={Yup.object().shape({
          realtorPhoto: Yup.string().required('Required'),
          first: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
          last: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
          personalPhone: Yup.string()
            .matches(phoneRegExp, 'Phone number is not valid')
            .required('Required'),
          email: Yup.string()
            .email('Invalid email')
            .required('Required'),
          dre: Yup.string().when('state', {
            is: 'CA',
            then: Yup.string().required('Required by state of California'),
          }),
          personalOfficePhone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
          personalNotificationEmail: Yup.string()
            .email('Invalid email')
            .when('businessNotificationEmail', {
              is: () => !personalNotificationEmailEnabled,
              then: Yup.string().required('Required!'),
            }),
          boards: Yup.array()
            .of(
              Yup.object({
                name: Yup.string()
                  .ensure()
                  .required('MLS is require'),
                mlsId: Yup.string()
                  .ensure()
                  .required('MLS Agent ID is require'),
              })
            )
            .required('All MLS data is required'),
          teamName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
          brokerageName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
          businessPhone: Yup.string()
            .matches(phoneRegExp, 'Phone number is not valid')
            .required('Required'),
          teamLogo: Yup.string(),
          brokerageLogo: Yup.string().required('Required'),
          address: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
          city: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
          state: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
          zip: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
          businessNotificationEmail: Yup.string()
            .email('Invalid email')
            .required('Required'),
        })}
        onSubmit={_handleSubmit}
        render={({ isSubmitting, values, errors }) => (
          <Form.Children>
            <ContentTopHeaderLayout>
              <Segment style={isMobile() ? { marginTop: '58px' } : {}}>
                <Menu borderless fluid secondary>
                  <Menu.Item>
                    <Header as="h1">Profile</Header>
                  </Menu.Item>
                  <Menu.Menu position="right">
                    <Menu.Item>
                      <span>
                        {profileAvailable ? (
                          <Button.Submit primary disabled={isSubmitting}>
                            Save
                          </Button.Submit>
                        ) : (
                          <Button.Submit primary disabled={isSubmitting}>
                            Submit
                          </Button.Submit>
                        )}
                      </span>
                    </Menu.Item>
                  </Menu.Menu>
                </Menu>
              </Segment>
            </ContentTopHeaderLayout>

            {picturesError && <Snackbar error>{JSON.stringify(picturesError, 0, 2)}</Snackbar>}

            {profileSaveError && <Snackbar error>{JSON.stringify(profileSaveError, 0, 2)}</Snackbar>}

            {teamProfileSaveError && <Snackbar error>{JSON.stringify(teamProfileSaveError, 0, 2)}</Snackbar>}

            <Segment style={isMobile() ? { marginTop: '6em' } : { marginTop: '6.5em' }}>
              <Header as="h2">
                Personal
                {selectedPeerId ? (
                  <Header.Subheader>Peers information will be shown on their postcards and will enable recipients to reach them.</Header.Subheader>
                ) : (
                  <Header.Subheader>Your information will be shown on your postcards and will enable recipients to reach you.</Header.Subheader>
                )}
              </Header>

              <Divider style={{ margin: '2em -1em' }} />

              <div
                style={
                  isMobile()
                    ? {}
                    : {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr',
                        gridTemplateRows: 'minmax(90px, 90px) minmax(90px, 90px) minmax(90px, 90px) minmax(90px, 90px)',
                        gridTemplateAreas: `"FirstLast FirstLast Headshot Picture"
                                          "PhoneEmail PhoneEmail Headshot Picture"
                                          "DreOfficePhone DreOfficePhone Headshot Picture"
                                          "NotificationEmailToggle NotificationEmailToggle Website Website"`,
                        gridColumnGap: '2em',
                      }
                }
              >
                <FileUpload
                  style={{ gridArea: 'Headshot' }}
                  label="Headshot"
                  name="realtorPhoto"
                  dispatch={dispatch}
                  pending={picturesPending}
                  tag={tag('Required')}
                />

                {isMobile() ? null : (
                  <div style={{ gridArea: 'Picture' }}>
                    <Image size="large" src={require('../../assets/onboard-profile.png')} alt="Brivity Marketer Mailout" />
                  </div>
                )}

                <Form.Group widths="2" style={{ gridArea: 'FirstLast' }}>
                  <Input label="First Name" name="first" disabled={multiUser} tag={multiUser ? popup(changeMsg) : tag('Required')} />
                  <Input label="Last Name" name="last" disabled={multiUser} tag={multiUser ? popup(changeMsg) : tag('Required')} />
                </Form.Group>

                <Form.Group widths="2" style={{ gridArea: 'PhoneEmail' }}>
                  <Input label="Phone Number" name="personalPhone" disabled={multiUser} tag={multiUser ? popup(changeMsg) : tag('Required')} />
                  <Input label="Email" name="email" disabled={multiUser} tag={multiUser ? popup(changeMsg) : tag('Required')} />
                </Form.Group>

                <Form.Group widths="2" style={{ gridArea: 'DreOfficePhone' }}>
                  <Input label="DRE Number" name="dre" tag={tag('Dre')} />
                  <Input label="Office Phone Number" name="personalOfficePhone" tag={tag('Optional')} />
                </Form.Group>

                <Form.Group widths="2" style={{ gridArea: 'NotificationEmailToggle' }}>
                  <Input
                    label="Personal Notification Email"
                    name="personalNotificationEmail"
                    disabled={personalNotificationEmailEnabled}
                    tag={personalNotificationEmailEnabled ? null : tag('Required')}
                  />
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
                </Form.Group>
              </div>
            </Segment>

            <Segment>
              <Header as="h2">
                MLS
                {selectedPeerId ? (
                  <Header.Subheader>Enter peers MLS information so we can generate postcards for their listings.</Header.Subheader>
                ) : (
                  <Header.Subheader>Enter your MLS information so we can generate postcards for your listings.</Header.Subheader>
                )}
              </Header>

              <Divider style={{ margin: '2em -1em' }} />

              {isInitiatingTeam || isInitiatingUser ? (
                <Loading message="Updating MLS settings, please wait..." />
              ) : (
                <FieldArray
                  name="boards"
                  render={arrayHelpers => (
                    <div>
                      {values.boards.map((board, index) => (
                        <Segment basic key={index} style={{ paddingTop: 0, paddingBottom: 0 }}>
                          <div style={isMobile() ? { display: 'grid' } : { display: 'grid', gridTemplateColumns: '1fr 45px', gridColumnGap: '2em' }}>
                            <Form.Group widths="2">
                              <Dropdown label="MLS" name={`boards[${index}].name`} options={boards} tag={tag('Required')} />
                              <Input label="MLS Agent ID" name={`boards.${index}.mlsId`} tag={tag('Required')} />
                            </Form.Group>
                            <Button
                              type="button"
                              primary
                              inverted
                              icon
                              disabled={values.boards.length === 1}
                              onClick={() => arrayHelpers.remove(index)}
                              style={isMobile() ? { cursor: 'pointer' } : { maxHeight: '45px', margin: '1.7em 0', cursor: 'pointer' }}
                              aria-label="remove mls"
                            >
                              <Icon name="trash" />
                            </Button>
                          </div>
                        </Segment>
                      ))}
                      <div className="buttons">
                        <Button primary inverted type="button" onClick={() => arrayHelpers.push({ name: '', mlsId: '' })}>
                          Add MLS
                        </Button>
                      </div>
                    </div>
                  )}
                />
              )}
            </Segment>

            {(isAdmin || !multiUser) && !selectedPeerId && (
              <Segment>
                <Header as="h2">
                  Business
                  <Header.Subheader>Enter your company details for branding purposes and for the return addresss of your mailers.</Header.Subheader>
                </Header>

                <Divider style={{ margin: '2em -1em' }} />

                <div
                  style={
                    isMobile()
                      ? {}
                      : {
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr 1fr',
                          gridTemplateRows: 'minmax(75px, 75px) minmax(75px, 75px) minmax(75px, 75px) minmax(75px, 75px) minmax(75px, 75px) minmax(75px, 75px)',
                          gridTemplateAreas: `"TeamName TeamName TeamLogo BrokerageLogo"
                                            "BrokerageName BrokerageName TeamLogo BrokerageLogo"
                                            "OfficePhone OfficePhone TeamLogo BrokerageLogo"
                                            "AddressCity AddressCity AddressCity AddressCity"
                                            "StateZipCode StateZipCode StateZipCode StateZipCode"
                                            "BusinessNotificationEmail BusinessNotificationEmail BusinessWebsite BusinessWebsite"`,
                          gridRowGap: '1em',
                          gridColumnGap: '2em',
                        }
                  }
                >
                  <div style={{ gridArea: 'TeamName' }}>
                    <Input label="Team Name" name="teamName" disabled={multiUser} tag={multiUser ? popup(changeMsg) : tag('Required')} />
                  </div>

                  <div style={{ gridArea: 'BrokerageName' }}>
                    <Input label="Brokerage Name" name="brokerageName" disabled={multiUser} tag={multiUser ? popup(changeMsg) : tag('Required')} />
                  </div>

                  <div style={{ gridArea: 'OfficePhone' }}>
                    <Input label="Office Phone Number" name="businessPhone" tag={tag('Optional')} />
                  </div>

                  <FileUpload style={{ gridArea: 'TeamLogo' }} label="Team Logo" name="teamLogo" dispatch={dispatch} pending={picturesPending} />

                  <FileUpload
                    style={{ gridArea: 'BrokerageLogo' }}
                    label="Brokerage Logo"
                    name="brokerageLogo"
                    dispatch={dispatch}
                    pending={picturesPending}
                    tag={tag('Required')}
                  />

                  <Form.Group widths="2" style={{ gridArea: 'AddressCity' }}>
                    <Input label="Address" name="address" disabled={multiUser} tag={multiUser ? popup(changeMsg) : tag('Required')} />
                    <Input label="City" name="city" disabled={multiUser} tag={multiUser ? popup(changeMsg) : tag('Required')} />
                  </Form.Group>

                  <Form.Group widths="2" style={{ gridArea: 'StateZipCode' }}>
                    <Dropdown label="State" name="state" options={states} disabled={multiUser} tag={multiUser ? popup(changeMsg) : tag('Required')} />
                    <Input label="Zip Code" name="zip" disabled={multiUser} tag={multiUser ? popup(changeMsg) : tag('Required')} />
                  </Form.Group>

                  <div style={{ gridArea: 'BusinessNotificationEmail' }}>
                    <Input label="Business Notification Email" name="businessNotificationEmail" tag={tag('Required')} />
                  </div>
                </div>
              </Segment>
            )}
          </Form.Children>
        )}
      />
      <br />
    </Page>
  );
};

export default ProfileForm;
