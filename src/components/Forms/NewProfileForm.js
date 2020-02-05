import React from 'react';
import { Header } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Checkbox, Dropdown, Form, Input, FileUpload } from './Base';

import { Divider, Image, Menu, Page, Segment } from '../Base';
import { isMobile } from './helpers';
import { ContentTopHeaderLayout } from '../../layouts';

// const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
//
// const mql = window.matchMedia('(max-width: 599px)');
// export const isMobile = () => mql.matches;

const NewProfileForm = ({ profileAvailable, teamProfileAvailable }) => {
  const dispatch = useDispatch();
  const states = useSelector(store => store.states && store.states.available);

  const onLoginMode = useSelector(store => store.onLogin.mode);
  const multiUser = onLoginMode === 'multiuser';
  const isAdmin = useSelector(store => store.onLogin.permissions && store.onLogin.permissions.teamAdmin);
  const selectedPeerId = useSelector(store => store.peer.peerId);

  const picturesPending = useSelector(store => store.pictures && store.pictures.pending);

  const _handleSubmit = (values, formikApi) => {
    console.log(values);
    setTimeout(() => {
      Object.keys(values).forEach(key => {
        formikApi.setFieldError(key, 'Some Error');
      });
      formikApi.setSubmitting(false);
    }, 1000);
  };

  return (
    <Page basic>
      <Form
        initialValues={{
          realtorPhoto: '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
          emailAddress: '',
          dreNumber: '',
          officePhoneNumber: '',
          personalNotificationEmail: '',
          personalNotificationEmailEnabled: false,
          teamName: '',
          brokerageName: '',
          officePhone: '',
          teamLogo: '',
          brokerageLogo: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          businessNotificationEmail: '',
        }}
        onSubmit={_handleSubmit}
        render={({ handleReset, isSubmitting }) => (
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
                        <Button.Submit primary disabled={isSubmitting}>
                          Submit
                        </Button.Submit>
                        <Button basic onClick={handleReset}>
                          Reset
                        </Button>
                      </span>
                    </Menu.Item>
                  </Menu.Menu>
                </Menu>
              </Segment>
            </ContentTopHeaderLayout>

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
                <FileUpload style={{ gridArea: 'Headshot' }} label="Headshot" name="realtorPhoto" dispatch={dispatch} pending={picturesPending} />

                {isMobile() ? null : (
                  <div style={{ gridArea: 'Picture' }}>
                    <Image size="large" src={require('../../assets/onboard-profile.png')} alt="Brivity Marketer Mailout" />
                  </div>
                )}

                <Form.Group widths="2" style={{ gridArea: 'FirstLast' }}>
                  <Input label="First Name" name="firstName" />
                  <Input label="Last Name" name="lastName" />
                </Form.Group>

                <Form.Group widths="2" style={{ gridArea: 'PhoneEmail' }}>
                  <Input label="Phone Number" name="phoneNumber" />
                  <Input label="Email" name="emailAddress" />
                </Form.Group>

                <Form.Group widths="2" style={{ gridArea: 'DreOfficePhone' }}>
                  <Input label="DRE Number" name="dreNumber" />
                  <Input label="Office Phone Number" name="officePhoneNumber" />
                </Form.Group>

                <Form.Group widths="2" style={{ gridArea: 'NotificationEmailToggle' }}>
                  <Input label="Personal Notification Email" name="personalNotificationEmail" />
                  <Checkbox label="Same as business notification email" name="personalNotificationEmailEnabled" />
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

              <Divider style={{ margin: '1em -1em' }} />
            </Segment>

            {(isAdmin || !multiUser) && !selectedPeerId && (
              <Segment>
                <Header as="h2">
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
                    <Input label="Team Name" name="teamName" />
                  </div>

                  <div style={{ gridArea: 'BrokerageName' }}>
                    <Input label="Brokerage Name" name="brokerageName" />
                  </div>

                  <div style={{ gridArea: 'OfficePhone' }}>
                    <Input label="Office Phone Number" name="officePhone" />
                  </div>

                  <FileUpload style={{ gridArea: 'TeamLogo' }} label="Team Logo" name="teamLogo" dispatch={dispatch} pending={picturesPending} />

                  <FileUpload style={{ gridArea: 'BrokerageLogo' }} label="Brokerage Logo" name="brokerageLogo" dispatch={dispatch} pending={picturesPending} />

                  <Form.Group widths="2" style={{ gridArea: 'AddressCity' }}>
                    <Input label="Address" name="address" />
                    <Input label="City" name="city" />
                  </Form.Group>

                  <Form.Group widths="2" style={{ gridArea: 'StateZipCode' }}>
                    <Dropdown label="State" name="state" options={states} />
                    <Input label="Zip Code" name="zip" />
                  </Form.Group>

                  <div style={{ gridArea: 'BusinessNotificationEmail' }}>
                    <Input label="Business Notification Email" name="businessNotificationEmail" />
                  </div>
                </div>
              </Segment>
            )}
          </Form.Children>
        )}
      />
    </Page>
  );
};

export default NewProfileForm;
