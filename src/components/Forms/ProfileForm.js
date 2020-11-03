import _ from 'lodash';
import * as Yup from 'yup';
import { FieldArray, useFormikContext } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useReducer, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Divider, Header, Icon, Image, Menu, Page, Segment, Snackbar } from '../Base';
import { saveTeamProfilePending } from '../../store/modules/teamProfile/actions';
import { saveProfilePending } from '../../store/modules/profile/actions';
import { Button, Dropdown, FileUpload, Form, Input } from './Base';
import { phoneRegExp, popup, tag } from '../utils';
import { ContentTopHeaderLayout } from '../../layouts';
import PageTitleHeader from '../PageTitleHeader';
import Loading from '../Loading';
import { useIsMobile } from '../Hooks/useIsMobile';

import styled from 'styled-components';

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

const PersonalForm = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 80px) 90px;
  grid-template-areas:
    'FirstLast FirstLast Headshot Picture'
    'PhoneEmail PhoneEmail Headshot Picture'
    'DreOfficePhone DreOfficePhone Headshot Picture'
    'NotificationEmailToggle NotificationEmailToggle Website Website';
  column-gap: 2em;
  row-gap: 0.5rem;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 200px 1fr 1fr;
    grid-template-rows: repeat(7, 75px);
    grid-template-areas:
      'FirstLast Headshot Picture'
      'FirstLast Headshot Picture'
      'PhoneEmail Headshot Picture'
      'PhoneEmail  Headshot Picture'
      'DreOfficePhone Headshot Picture'
      'NotificationEmailToggle Website Website'
      'NotificationEmailToggle Website Website';
  }
  @media only screen and (max-width: 600px) {
    display: initial;
  }
`;

const BusinessForm = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(6, 75px);
  grid-template-areas:
    'TeamName TeamName TeamLogo BrokerageLogo'
    'BrokerageName BrokerageName TeamLogo BrokerageLogo'
    'OfficePhone OfficePhone TeamLogo BrokerageLogo'
    'AddressCity AddressCity AddressCity AddressCity'
    'StateZipCode StateZipCode StateZipCode StateZipCode'
    'BusinessNotificationEmail BusinessNotificationEmail BusinessWebsite BusinessWebsite';
  column-gap: 2em;
  row-gap: 0.5rem;

  @media only screen and (max-width: 1080px) {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(8, 75px);
    grid-template-areas:
      'TeamName TeamName . .'
      'TeamLogo TeamLogo BrokerageLogo BrokerageLogo'
      'TeamLogo TeamLogo BrokerageLogo BrokerageLogo'
      'TeamLogo TeamLogo BrokerageLogo BrokerageLogo'
      'BrokerageName BrokerageName OfficePhone OfficePhone'
      'AddressCity AddressCity AddressCity AddressCity'
      'StateZipCode StateZipCode StateZipCode StateZipCode'
      'BusinessNotificationEmail BusinessNotificationEmail BusinessWebsite BusinessWebsite';
    column-gap: 2em;
    row-gap: 0.5rem;
  }

  @media only screen and (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(10, 75px);
    grid-template-areas:
      'TeamName TeamName . .'
      'TeamLogo TeamLogo BrokerageLogo BrokerageLogo'
      'TeamLogo TeamLogo BrokerageLogo BrokerageLogo'
      'TeamLogo TeamLogo BrokerageLogo BrokerageLogo'
      'BrokerageName BrokerageName OfficePhone OfficePhone'
      'AddressCity AddressCity AddressCity AddressCity'
      'AddressCity AddressCity AddressCity AddressCity'
      'StateZipCode StateZipCode StateZipCode StateZipCode'
      'StateZipCode StateZipCode StateZipCode StateZipCode'
      'BusinessNotificationEmail BusinessNotificationEmail BusinessWebsite BusinessWebsite';
    column-gap: 2em;
    row-gap: 0.5rem;
  }

  @media only screen and (max-width: 600px) {
    display: initial;
  }
`;

const ProfileForm = ({ profileAvailable, teamProfileAvailable }) => {
  const isMobile = useIsMobile();

  const dispatch = useDispatch();
  const boards = useSelector(store => store.boards.available);
  const states = useSelector(store => store.states.available);

  const onLoginMode = useSelector(store => store.onLogin?.mode);
  const multiUser = onLoginMode === 'multiuser';
  const isAdminOnLogin = useSelector(store => store.onLogin?.permissions?.teamAdmin);
  const selectedPeerId = useSelector(store => store.peer.peerId);
  const currentProfileRole = useSelector(store => store.profile.available?.brivitySync?.role);
  const isAdmin = selectedPeerId ? currentProfileRole === 'Administrator' : isAdminOnLogin;

  const picturesPending = useSelector(store => store.pictures.pending);
  const picturesError = useSelector(store => store.pictures.error);

  const realtorPhoto = useSelector(store => store.onLogin?.realtorPhoto?.resized);
  const teamLogo = useSelector(store => store.onLogin?.teamLogo?.resized);
  const brokerageLogo = useSelector(store => store.onLogin?.brokerageLogo?.resized);

  const picturesRealtorPhoto = useSelector(store => store.pictures.realtorPhoto?.resized);
  const picturesTeamLogo = useSelector(store => store.pictures.teamLogo?.resized);
  const picturesBrokerageLogo = useSelector(store => store.pictures.brokerageLogo?.resized);

  const profileChangePending = useSelector(store => store.profile.pending);
  const profileSavePending = useSelector(store => store.profile.savePending);
  const profileSaveErrorMessage = useSelector(store => store.profile.saveError?.message);
  const profileSaveErrorStatusCode = useSelector(store => store.profile.saveError?.statusCode);
  const teamProfileSavePending = useSelector(store => store.teamProfile.savePending);
  const teamProfileSaveErrorMessage = useSelector(store => store.teamProfile.saveError?.message);
  const teamProfileSaveErrorStatusCode = useSelector(store => store.teamProfile.saveError?.statusCode);
  const mailoutsGeneratePending = useSelector(store => store.mailouts.generatePending);

  const isInitiatingTeam = useSelector(store => store.teamInitialize.polling);
  const isInitiatingUser = useSelector(store => store.initialize.polling);

  const [formValues, setFormValues] = useReducer(formReducer, initialValues);
  const [personalNotificationEmailDisabled, setPersonalNotificationEmailDisabled] = useState(false);

  useEffect(() => {
    if (profileAvailable && teamProfileAvailable) {
      if (profileAvailable.boards && formValues.userProfile.boards !== profileAvailable.boards) {
        delete formValues.userProfile.boards;
      }

      const updatedFormValues = _.merge({}, formValues, { userProfile: profileAvailable }, { businessProfile: teamProfileAvailable });
      if (profileAvailable.notificationEmail === teamProfileAvailable.notificationEmail) {
        setPersonalNotificationEmailDisabled(true);
      }
      setFormValues(updatedFormValues);
    } else {
      if (profileAvailable && !teamProfileAvailable) {
        const updatedFormValues = _.merge({}, formValues, { userProfile: profileAvailable });
        setFormValues(updatedFormValues);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileAvailable, teamProfileAvailable, setFormValues, setPersonalNotificationEmailDisabled]);

  const saveProfile = profile => dispatch(saveProfilePending(profile));
  const saveTeamProfile = teamProfile => dispatch(saveTeamProfilePending(teamProfile));

  const _handleSubmit = values => {
    const profile = {
      notificationEmail: personalNotificationEmailDisabled ? values.businessNotificationEmail : values.personalNotificationEmail,
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

  const pictureCheck = src => {
    if (src) {
      if (src.includes('/undefined')) {
        return undefined;
      } else {
        return src;
      }
    }
  };

  const UpdateWithoutRerender = () => {
    const { setFieldValue } = useFormikContext();
    React.useEffect(() => {
      setFieldValue('realtorPhoto', pictureCheck(picturesRealtorPhoto) || (!selectedPeerId && pictureCheck(realtorPhoto)), true);
      setFieldValue('teamLogo', pictureCheck(picturesTeamLogo) || pictureCheck(teamLogo), true);
      setFieldValue('brokerageLogo', pictureCheck(picturesBrokerageLogo) || pictureCheck(brokerageLogo), true);

      setFieldValue(
        'personalNotificationEmail',
        personalNotificationEmailDisabled ? formValues.businessProfile.notificationEmail : formValues.userProfile.notificationEmail,
        true
      );
    }, [setFieldValue]);
    return null;
  };

  return (
    <Page basic>
      <Form
        ignoreLoading
        enableReinitialize
        validateOnMount
        initialValues={{
          realtorPhoto: '',
          first: formValues.userProfile.first,
          last: formValues.userProfile.last,
          personalPhone: formValues.userProfile.phone,
          email: formValues.userProfile.email,
          dre: formValues.userProfile.dre,
          personalNotificationEmail: '',
          boards: formValues.userProfile.boards,
          teamName: formValues.businessProfile.teamName,
          brokerageName: formValues.businessProfile.brokerageName,
          businessPhone: formValues.businessProfile.phone,
          teamLogo: '',
          brokerageLogo: '',
          address: formValues.businessProfile.address,
          city: formValues.businessProfile.city,
          state: formValues.businessProfile.state,
          zip: formValues.businessProfile.zip,
          businessNotificationEmail: formValues.businessProfile.notificationEmail,
        }}
        validationSchema={Yup.object().shape({
          realtorPhoto: Yup.string().required('Required'),
          first: Yup.string().when('undefined', {
            is: () => !multiUser,
            then: Yup.string()
              .min(2, 'Too Short!')
              .max(50, 'Too Long!')
              .required('Required!'),
          }),
          last: Yup.string().when('undefined', {
            is: () => !multiUser,
            then: Yup.string()
              .min(2, 'Too Short!')
              .max(50, 'Too Long!')
              .required('Required!'),
          }),
          personalPhone: Yup.string().when('undefined', {
            is: () => !multiUser,
            then: Yup.string()
              .matches(phoneRegExp, 'Phone number is not valid')
              .required('Required!'),
          }),
          email: Yup.string().when('undefined', {
            is: () => !multiUser,
            then: Yup.string()
              .email('Invalid email')
              .required('Required!'),
          }),
          dre: Yup.string()
            .nullable()
            .when('state', {
              is: 'CA',
              then: Yup.string().required('Required by state of California'),
            }),
          personalNotificationEmail: Yup.string().when('undefined', {
            is: () => !personalNotificationEmailDisabled,
            then: Yup.string()
              .email('Invalid email')
              .required('Required!'),
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
            .notRequired(),
          teamName: Yup.string().when('undefined', {
            is: () => !multiUser,
            then: Yup.string()
              .min(2, 'Too Short!')
              .max(50, 'Too Long!')
              .required('Required!'),
          }),
          brokerageName: Yup.string().when('undefined', {
            is: () => !multiUser,
            then: Yup.string()
              .min(2, 'Too Short!')
              .max(50, 'Too Long!')
              .required('Required!'),
          }),
          businessPhone: Yup.string().when('undefined', {
            is: () => !multiUser,
            then: Yup.string()
              .matches(phoneRegExp, 'Phone number is not valid')
              .required('Required!'),
          }),
          teamLogo: Yup.string(),
          brokerageLogo: Yup.string().required('Required'),
          address: Yup.string().when('undefined', {
            is: () => !multiUser,
            then: Yup.string()
              .min(2, 'Too Short!')
              .max(50, 'Too Long!')
              .required('Required!'),
          }),
          city: Yup.string().when('undefined', {
            is: () => !multiUser,
            then: Yup.string()
              .min(2, 'Too Short!')
              .max(50, 'Too Long!')
              .required('Required!'),
          }),
          state: Yup.string().when('undefined', {
            is: () => !multiUser,
            then: Yup.string()
              .min(2, 'Too Short!')
              .max(50, 'Too Long!')
              .required('Required!'),
          }),
          zip: Yup.string().when('undefined', {
            is: () => !multiUser,
            then: Yup.string()
              .min(2, 'Too Short!')
              .max(50, 'Too Long!')
              .required('Required!'),
          }),
          businessNotificationEmail: Yup.string()
            .email('Invalid email')
            .required('Required'),
        })}
        onSubmit={_handleSubmit}
        render={({ isSubmitting, values, errors }) => (
          <Form.Children>
            <ContentTopHeaderLayout>
              <PageTitleHeader>
                <Menu borderless fluid secondary>
                  <Menu.Item>
                    <Header as="h1">Profile</Header>
                  </Menu.Item>
                  <Menu.Menu position="right">
                    <Menu.Item>
                      <span>
                        {profileAvailable ? (
                          <Button.Submit primary disabled={isSubmitting || profileChangePending}>
                            Save
                          </Button.Submit>
                        ) : (
                          <Button.Submit primary disabled={isSubmitting || profileChangePending}>
                            Submit
                          </Button.Submit>
                        )}
                      </span>
                    </Menu.Item>
                  </Menu.Menu>
                </Menu>
              </PageTitleHeader>
            </ContentTopHeaderLayout>

            {picturesError && <Snackbar error>{JSON.stringify(picturesError, 0, 2)}</Snackbar>}

            {profileSaveErrorMessage && profileSaveErrorStatusCode !== 412 && <Snackbar error>{profileSaveErrorMessage}</Snackbar>}

            {teamProfileSaveErrorMessage && teamProfileSaveErrorStatusCode !== 412 && <Snackbar error>{teamProfileSaveErrorMessage}</Snackbar>}

            {((teamProfileSaveErrorMessage && teamProfileSaveErrorStatusCode === 412) || (profileSaveErrorMessage && profileSaveErrorStatusCode === 412)) && (
              <Snackbar error>The data on the page has changed and the save has failed. Please reload to get the latest data.</Snackbar>
            )}

            <Segment style={{ margin: '20px 0' }}>
              <Header as="h2">
                Personal
                {selectedPeerId ? (
                  <Header.Subheader>Peers information will be shown on their postcards and will enable recipients to reach them.</Header.Subheader>
                ) : (
                  <Header.Subheader>Your information will be shown on your postcards and will enable recipients to reach you.</Header.Subheader>
                )}
              </Header>

              <Divider style={{ margin: '2em -1em' }} />

              <PersonalForm>
                <FileUpload
                  style={{ gridArea: 'Headshot' }}
                  label="Headshot"
                  name="realtorPhoto"
                  dispatch={dispatch}
                  pending={picturesPending}
                  tag={tag('Required')}
                />

                {isMobile ? null : (
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

                <div style={{ gridArea: 'DreOfficePhone' }}>
                  <Input label="DRE Number" name="dre" tag={tag('Dre')} />
                </div>

                <Form.Group widths="2" style={{ gridArea: 'NotificationEmailToggle' }}>
                  <Input
                    label="Personal Notification Email"
                    name="personalNotificationEmail"
                    disabled={personalNotificationEmailDisabled}
                    tag={personalNotificationEmailDisabled ? null : tag('Required')}
                  />
                  {personalNotificationEmailDisabled ? (
                    <span style={{ color: '#F2714D' }}>
                      <FontAwesomeIcon
                        icon="toggle-on"
                        size="2x"
                        style={{ marginTop: '1em', verticalAlign: '-0.3em', color: '#59C4C4' }}
                        onClick={() => setPersonalNotificationEmailDisabled(!personalNotificationEmailDisabled)}
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
                        onClick={() => setPersonalNotificationEmailDisabled(!personalNotificationEmailDisabled)}
                      />{' '}
                      Same as business notification email
                    </span>
                  )}
                </Form.Group>
              </PersonalForm>
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
                      {values.boards &&
                        values.boards.map((board, index) => (
                          <Segment basic key={index} style={{ padding: '0px 25px 0px 0px' }}>
                            <div style={isMobile ? { display: 'grid' } : { display: 'grid', gridTemplateColumns: '1fr 75px', gridColumnGap: '1em' }}>
                              <Form.Group widths="2">
                                <Dropdown label="MLS" name={`boards[${index}].name`} options={boards} tag={tag('Required')} />
                                <Input label="MLS Agent ID" name={`boards.${index}.mlsId`} tag={tag('Required')} />
                              </Form.Group>
                              <Button
                                type="button"
                                primary
                                inverted
                                icon
                                onClick={() => arrayHelpers.remove(index)}
                                style={isMobile ? { cursor: 'pointer' } : { maxHeight: '45px', margin: '1.7em 0', cursor: 'pointer' }}
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

            {(isAdmin || !multiUser) && !profileChangePending && (
              <Segment>
                <Header as="h2">
                  Business
                  <Header.Subheader>Enter your company details for branding purposes and for the return addresss of your mailers.</Header.Subheader>
                </Header>

                <Divider style={{ margin: '2em -1em' }} />

                <BusinessForm>
                  <div style={{ gridArea: 'TeamName' }}>
                    <Input label="Team Name" name="teamName" disabled={multiUser} tag={multiUser ? popup(changeMsg) : tag('Required')} />
                  </div>

                  <div style={{ gridArea: 'BrokerageName' }}>
                    <Input label="Brokerage Name" name="brokerageName" disabled={multiUser} tag={multiUser ? popup(changeMsg) : tag('Required')} />
                  </div>

                  <div style={{ gridArea: 'OfficePhone' }}>
                    <Input label="Office Phone Number" name="businessPhone" disabled={multiUser} tag={multiUser ? popup(changeMsg) : tag('Optional')} />
                  </div>

                  <div style={{ gridArea: 'TeamLogo' }}>
                    <FileUpload label="Team Logo" name="teamLogo" dispatch={dispatch} pending={picturesPending} />
                  </div>

                  <div style={{ gridArea: 'BrokerageLogo' }}>
                    <FileUpload label="Brokerage Logo" name="brokerageLogo" dispatch={dispatch} pending={picturesPending} tag={tag('Required')} />
                  </div>

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
                </BusinessForm>
              </Segment>
            )}
            <UpdateWithoutRerender />
          </Form.Children>
        )}
      />
      <br />
    </Page>
  );
};

export default ProfileForm;
