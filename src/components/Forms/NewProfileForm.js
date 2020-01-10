import _ from 'lodash';
import React, { Fragment, useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header, Form, Radio, Label, Dropdown } from 'semantic-ui-react';
// import { saveProfilePending } from "../../store/modules/profile/actions";
// import { saveTeamProfilePending } from "../../store/modules/teamProfile/actions";
import { Button, Card, Divider, Icon, Image, Item, Menu, Segment } from '../Base';
import { composeValidators, email, isMobile, labelWithPopup, popup, required, requiredOnlyInCalifornia } from './helpers';

import { deletePhotoPending, uploadPhotoPending } from '../../store/modules/pictures/actions';

const renderLabelWithSubHeader = (label, subHeader) =>
  isMobile() ? (
    <Header as={'label'} content={label} subheader={subHeader} />
  ) : (
    <label>
      {label} <span style={{ fontWeight: 300 }}>{subHeader}</span>
    </label>
  );

const disabledCss = {
  pointerEvents: 'none',
  opacity: 0.5,
};

const formReducer = (state, action) => {
  return _.merge({}, state, action);
};

const changeMsg = 'This comes from Brivity. If you want to modify this information, you will need to modify it there';

const NewProfileForm = ({ profileAvailable, teamProfileAvailable }) => {
  const dispatch = useDispatch();
  // const saveProfile = profile => dispatch(saveProfilePending(profile));
  // const saveTeamProfile = teamProfile => dispatch(saveTeamProfilePending(teamProfile));

  const [personalNotificationEmailEnabled, setPersonalNotificationEmailEnabled] = useState(false);

  const boards = useSelector(store => store.boards && store.boards.available);
  const states = useSelector(store => store.states && store.states.available);

  const onLoginMode = useSelector(store => store.onLogin.mode);
  const multiUser = onLoginMode === 'multiuser';
  const isAdmin = useSelector(store => store.onLogin.permissions && store.onLogin.permissions.teamAdmin);
  const selectedPeerId = useSelector(store => store.peer.peerId);

  const realtorPhoto = useSelector(store => store.onLogin && store.onLogin.realtorPhoto && store.onLogin.realtorPhoto.resized);
  const teamLogo = useSelector(store => store.onLogin && store.onLogin.teamLogo && store.onLogin.teamLogo.resized);
  const brokerageLogo = useSelector(store => store.onLogin && store.onLogin.brokerageLogo && store.onLogin.brokerageLogo.resized);

  const picturesRealtorPhoto = useSelector(store => store.pictures && store.pictures.realtorPhoto && store.pictures.realtorPhoto.resized);
  const picturesTeamLogo = useSelector(store => store.pictures && store.pictures.teamLogo && store.pictures.teamLogo.resized);
  const picturesBrokerageLogo = useSelector(store => store.pictures && store.pictures.brokerageLogo && store.pictures.brokerageLogo.resized);

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
      boards: '',
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

  const [formValues, setFormValues] = useReducer(formReducer, initialValues);

  useEffect(() => {
    if (profileAvailable) {
      const updatedFormValues = _.merge({}, initialValues.userProfile, { userProfile: profileAvailable });
      setFormValues(updatedFormValues);
    }
    if (teamProfileAvailable) {
      const updatedFormValues = _.merge({}, initialValues.businessProfile, { businessProfile: teamProfileAvailable });
      setFormValues(updatedFormValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileAvailable, teamProfileAvailable, setFormValues]);

  // console.log('formValues', formValues);

  const renderField = ({ name, section, value = null, label, type, required = undefined, disabled = undefined }) => {
    const error = false;
    if (!value) value = formValues[section][name];

    if (typeof label !== 'string') {
      return (
        <Form.Field required={required}>
          {label}
          <Form.Input fluid value={value} type={type} error={error && { content: `${error}` }} style={disabled ? disabledCss : {}} />
        </Form.Field>
      );
    } else {
      return (
        <Form.Input
          fluid
          value={value}
          required={required}
          type={type}
          label={label}
          error={error && { content: `${error}` }}
          style={disabled ? disabledCss : {}}
        />
      );
    }
  };

  const renderSelectField = ({ name, section, value = null, label, type, options, required = undefined, search = undefined, disabled = undefined }) => {
    const error = false;
    if (!value) value = formValues[section][name];

    return (
      <Form.Field>
        <Header as="h4" style={{ margin: '0 0 .28571429rem 0' }}>
          {label}
          {required && !disabled ? <span style={{ margin: '-.2em 0 0 .2em', color: '#db2828' }}>*</span> : null}
        </Header>
        <Dropdown
          fluid
          // onChange={(param, data) => input.onChange(data.value)}
          value={value}
          options={options}
          name={name}
          label={label}
          type={type}
          required={required && !disabled}
          search={search}
          selection
          error={!disabled && error}
          style={disabled ? disabledCss : {}}
        />
        {!disabled && error && (
          <Label basic color="red" pointing>
            {error}
          </Label>
        )}
      </Form.Field>
    );
  };

  const renderPicturePickerField = ({ name, section, value = null, label, dispatch, required = undefined }) => {
    const onChangeHandler = event => {
      const data = [name, event.target.files[0]];
      dispatch(uploadPhotoPending(data));
    };

    const onClickHandler = target => {
      dispatch(deletePhotoPending(target));
    };

    const error = false;
    if (!value) value = formValues[section][name];

    return (
      <Form.Field required={required}>
        <div
          style={
            name === 'teamLogo'
              ? {
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr',
                  gridTemplateAreas: `"Label Func Func2" "Image Image Image"`,
                  width: '14em',
                }
              : {
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gridTemplateAreas: `"Label Func" "Image Image"`,
                  width: '14em',
                }
          }
        >
          <div style={{ gridArea: 'Label' }}>
            <Header as="h4">
              {label}
              {required ? <span style={{ margin: '-.2em 0 0 .2em', color: '#db2828' }}>*</span> : null}
            </Header>
          </div>
          <div style={{ gridArea: 'Func', justifySelf: 'end' }}>
            <Item as="label" htmlFor={name} style={{ cursor: 'pointer' }}>
              <Header as="h4" style={error ? { color: 'red' } : { color: 'teal' }}>
                Upload
              </Header>
              <input hidden id={name} type="file" onChange={onChangeHandler} />
            </Item>
          </div>

          {name === 'teamLogo' && (
            <div style={{ gridArea: 'Func2', justifySelf: 'end' }}>
              <Item as="label" style={{ cursor: 'pointer' }}>
                <Header as="h4" style={error ? { color: 'red' } : { color: 'teal' }} onClick={() => onClickHandler(name)}>
                  Delete
                </Header>
              </Item>
            </div>
          )}

          <div style={{ gridArea: 'Image' /*margin: '-.8em 0'*/ }}>
            <Card style={error ? { maxHeight: '15em', overflow: 'hidden', border: '3px solid red' } : { maxHeight: '15em', overflow: 'hidden' }}>
              {value ? (
                <Image size="tiny" src={value} wrapped ui={false} />
              ) : name === 'realtorPhoto' ? (
                <Image size="tiny" src={require('../../assets/photo-placeholder.svg')} wrapped ui={false} />
              ) : (
                <Image size="tiny" src={require('../../assets/image-placeholder.svg')} wrapped ui={false} />
              )}
            </Card>
            {error && (
              <Label basic color="red" pointing>
                {error}
              </Label>
            )}
          </div>
        </div>
      </Form.Field>
    );
  };

  return (
    <Fragment>
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
              <Button type="submit" color="teal">
                Save
              </Button>
            </span>
          </Menu.Menu>
        </Menu>

        <Divider style={{ margin: '1em -1em' }} />

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
              section: 'userProfile',
              value: picturesRealtorPhoto || realtorPhoto,
              label: 'Headshot',
              dispatch: dispatch,
              required: true,
              validate: required,
            })}
          </div>
          <div style={{ gridArea: 'First' }}>
            {renderField({
              name: 'first',
              section: 'userProfile',
              label: multiUser ? labelWithPopup('First Name', popup(changeMsg)) : 'First Name',
              type: 'text',
              required: true,
              validate: required,
              disabled: multiUser,
            })}
          </div>
          <div style={{ gridArea: 'Last' }}>
            {renderField({
              name: 'last',
              section: 'userProfile',
              label: multiUser ? labelWithPopup('Last Name', popup(changeMsg)) : 'Last Name',
              type: 'text',
              required: true,
              validate: required,
              disabled: multiUser,
            })}
          </div>
          <div style={{ gridArea: 'Phone' }}>
            {renderField({
              name: 'phone',
              section: 'userProfile',
              label: multiUser ? labelWithPopup('Phone Number', popup(changeMsg)) : 'Phone Number',
              type: 'text',
              required: true,
              validate: required,
              disabled: multiUser,
            })}
          </div>
          <div style={{ gridArea: 'Email' }}>
            {renderField({
              name: 'email',
              section: 'userProfile',
              label: multiUser ? labelWithPopup('Email', popup(changeMsg)) : 'Email',
              type: 'text',
              required: true,
              validate: composeValidators(required, email),
              disabled: multiUser,
            })}
          </div>
          <div style={{ gridArea: 'NotificationEmail' }}>
            {renderField({
              name: 'notificationEmail',
              section: 'userProfile',
              label: renderLabelWithSubHeader('Personal Notification Email'),
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
              section: 'userProfile',
              label: renderLabelWithSubHeader('DRE Number', '( Required in California )'),
              type: 'text',
              validate: requiredOnlyInCalifornia,
            })}
          </div>
          <div style={{ gridArea: 'OfficePhone' }}>
            {renderField({ name: 'phone', section: 'userProfile', label: renderLabelWithSubHeader('Office Phone Number', '( Optional )'), type: 'text' })}
          </div>
          <div style={{ gridArea: 'Website' }}>
            {renderField({ name: 'website', section: 'userProfile', label: renderLabelWithSubHeader('Personal Website', '( Optional )'), type: 'text' })}
          </div>
          <div style={{ gridArea: 'Picture' }}>
            <Image size="large" src={require('../../assets/onboard-profile.png')} alt="Brivity Marketer Mailout" />
          </div>
        </div>
      </Segment>

      {(isAdmin || !multiUser) && !selectedPeerId && (
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
              {renderField({
                name: 'teamName',
                section: 'businessProfile',
                label: multiUser ? labelWithPopup('Team Name', popup(changeMsg)) : 'Team Name',
                type: 'text',
                required: true,
                validate: required,
                disabled: multiUser,
              })}
            </div>
            <div style={{ gridArea: 'TeamLogo' }}>
              {renderPicturePickerField({
                name: 'teamLogo',
                section: 'businessProfile',
                value: picturesTeamLogo || teamLogo,
                label: 'Team Logo',
                dispatch: dispatch,
                disabled: multiUser,
              })}
            </div>
            <div style={{ gridArea: 'BrokerageName' }}>
              {renderField({
                name: 'brokerageName',
                section: 'businessProfile',
                label: multiUser ? labelWithPopup('Brokerage Name', popup(changeMsg)) : 'Brokerage Name',
                type: 'text',
                required: true,
                validate: required,
                disabled: multiUser,
              })}
            </div>
            <div style={{ gridArea: 'BrokerageLogo' }}>
              {renderPicturePickerField({
                name: 'brokerageLogo',
                section: 'businessProfile',
                value: picturesBrokerageLogo || brokerageLogo,
                label: 'Brokerage Logo',
                dispatch: dispatch,
                required: true,
                validate: required,
              })}
            </div>
            <div style={{ gridArea: 'OfficePhone' }}>
              {renderField({ name: 'phone', section: 'businessProfile', label: 'Office Phone Number (Optional)', type: 'text' })}
            </div>
            <div style={{ gridArea: 'Address' }}>
              {renderField({
                name: 'address',
                section: 'businessProfile',
                label: multiUser ? labelWithPopup('Address', popup(changeMsg)) : 'Address',
                type: 'text',
                required: true,
                validate: required,
                disabled: multiUser,
              })}
            </div>
            <div style={{ gridArea: 'City' }}>
              {renderField({
                name: 'city',
                section: 'businessProfile',
                label: multiUser ? labelWithPopup('City', popup(changeMsg)) : 'City',
                type: 'text',
                required: true,
                validate: required,
                disabled: multiUser,
              })}
            </div>
            <div style={{ gridArea: 'State' }}>
              {renderSelectField({
                name: 'state',
                section: 'businessProfile',
                label: multiUser ? labelWithPopup('State', popup(changeMsg)) : 'State',
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
                section: 'businessProfile',
                label: multiUser ? labelWithPopup('Zip Code', popup(changeMsg)) : 'Zip Code',
                type: 'text',
                required: true,
                validate: required,
                disabled: multiUser,
              })}
            </div>
            <div style={{ gridArea: 'BusinessNotificationEmail' }}>
              {renderField({
                name: 'notificationEmail',
                section: 'businessProfile',
                label: renderLabelWithSubHeader('Business Notification Email', '( Required )'),
                type: 'text',
                required: true,
                validate: composeValidators(required, email),
              })}
            </div>
            <div style={{ gridArea: 'BusinessWebsite' }}>
              {renderField({ name: 'businessWebsite', section: 'businessProfile', label: 'Business Website (Optional)', type: 'text' })}
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

        <div>
          {formValues &&
            formValues.userProfile &&
            formValues.userProfile.boards &&
            formValues.userProfile.boards.map((board, index) => (
              <Segment secondary key={index}>
                <div
                  style={
                    isMobile()
                      ? { display: 'grid' }
                      : {
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 45px',
                          gridColumnGap: '2em',
                        }
                  }
                >
                  {renderSelectField({
                    name: 'board.name',
                    section: 'userProfile',
                    value: board.name,
                    label: 'MLS',
                    type: 'text',
                    required: true,
                    validate: required,
                    options: boards ? boards : [],
                    search: true,
                  })}
                  {renderField({
                    name: 'board.mlsId',
                    section: 'userProfile',
                    value: board.mlsId,
                    label: 'MLS Agent ID',
                    type: 'text',
                    required: true,
                    validate: required,
                  })}
                  <Button
                    basic
                    icon
                    color="teal"
                    disabled={formValues.userProfile.boards.length === 1}
                    // onClick={() => fields.remove(index)}
                    style={
                      isMobile()
                        ? { cursor: 'pointer' }
                        : {
                            maxHeight: '45px',
                            margin: '1.7em 0',
                            cursor: 'pointer',
                          }
                    }
                    aria-label="remove mls"
                  >
                    <Icon name="trash" />
                  </Button>
                </div>
              </Segment>
            ))}
        </div>

        <div className="buttons">
          <Button
            basic
            // onClick={() => push('boards', undefined)}
            color="teal"
          >
            Add MLS
          </Button>
        </div>
      </Segment>
    </Fragment>
  );
};

export default NewProfileForm;
