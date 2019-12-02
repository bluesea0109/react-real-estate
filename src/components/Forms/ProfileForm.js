import React, { Fragment } from 'react';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { Form as FinalForm } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Header, Divider, Form } from 'semantic-ui-react';

import { isMobile, email, required, composeValidators, requiredOnlyInCalifornia, renderSelectField, renderField } from './helpers';
import { saveProfilePending } from '../../store/modules/profile/actions';
import { Button, Icon, Segment } from '../Base';

const renderDreNumberField = () =>
  isMobile() ? (
    <Header as={'label'} content="DRE Number" subheader="( Required in California )" />
  ) : (
    <label>
      DRE Number <span style={{ fontWeight: 300 }}>( Required in California )</span>
    </label>
  );

const ProfileForm = () => {
  const dispatch = useDispatch();
  const auth0 = useSelector(store => store.auth0 && store.auth0.details);
  // const profile = useSelector(store => store.profile && store.profile.available);
  const profileError = useSelector(store => store.profile && store.profile.error);
  const boards = useSelector(store => store.boards && store.boards.available);
  const states = useSelector(store => store.states && store.states.available);

  const onLoginUserProfile = useSelector(store => store.onLogin && store.onLogin.userProfile);
  const onLoginTeamProfile = useSelector(store => store.onLogin && store.onLogin.teamProfile);

  const saveProfile = profile => dispatch(saveProfilePending(profile));
  const onSubmit = values => {
    saveProfile(values);
  };

  let profileValues;
  let mlsArr = [];

  if (profileError === '410 Gone') {
    profileValues = {
      first: auth0.idTokenPayload && auth0.idTokenPayload['http://firstname'],
      last: auth0.idTokenPayload && auth0.idTokenPayload['http://lastname'],
      email: auth0.idTokenPayload && auth0.idTokenPayload.email,
      phone: auth0.idTokenPayload && auth0.idTokenPayload['http://phonenumber'],
      mls: [null],
    };
  } else {
    const onLoginUserProfileBoards = onLoginUserProfile && onLoginUserProfile.boards;

    onLoginUserProfileBoards &&
      onLoginUserProfileBoards.forEach(board => {
        const userBoard = boards.filter(boardObj => boardObj.mlsid === board.name);
        mlsArr.push({ mls: userBoard[0] && userBoard[0].value, mlsAgentId: board.mlsId });
      });

    profileValues = Object.assign({}, onLoginUserProfile, onLoginTeamProfile, { mls: mlsArr });
  }

  return (
    <Fragment>
      <FinalForm
        onSubmit={onSubmit}
        initialValues={profileValues}
        mutators={{
          ...arrayMutators,
        }}
        render={({
          handleSubmit,
          form: {
            mutators: { push, pop },
          },
          form,
          submitting,
          pristine,
          values,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Segment>
              <Header as="h1">
                Profile
                <Header.Subheader>Your information will be shown on your postcards and will enable recipients to reach you.</Header.Subheader>
              </Header>

              <Divider style={{ margin: '1em -1em' }} />

              <div style={isMobile() ? {} : { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridColumnGap: '2em' }}>
                {renderField({ name: 'first', label: 'First Name', type: 'text', validate: required })}
                {renderField({ name: 'last', label: 'Last Name', type: 'text', validate: required })}

                {renderField({ name: 'email', label: 'Email', type: 'text', validate: composeValidators(required, email) })}
              </div>

              <br />

              <div style={isMobile() ? {} : { display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '2em' }}>
                {renderField({ name: 'phone', label: 'Phone Number', type: 'text', validate: required })}
                {renderField({ name: 'dreNumber', label: renderDreNumberField(), type: 'text', validate: requiredOnlyInCalifornia })}
              </div>
            </Segment>

            <Segment>
              <Header as="h1">
                Business
                <Header.Subheader>Enter your company details for branding purposes and for the return addresss of your mailers.</Header.Subheader>
              </Header>

              <Divider style={{ margin: '1em -1em' }} />

              <div style={isMobile() ? {} : { display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '2em' }}>
                {renderField({ name: 'teamName', label: 'Team name', type: 'text', validate: required })}
                {renderField({ name: 'brokerageName', label: 'Brokerage name', type: 'text', validate: required })}
              </div>

              <div style={isMobile() ? {} : { display: 'grid', gridTemplateColumns: '1fr', gridColumnGap: '2em' }}>
                {renderField({ name: 'address', label: 'Address', type: 'text', validate: required })}
              </div>

              <div style={isMobile() ? {} : { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridColumnGap: '2em' }}>
                {renderField({ name: 'city', label: 'City', type: 'text', validate: required })}
                {renderSelectField({ name: 'state', label: 'State', type: 'text', validate: required, options: states ? states : [] })}
                {renderField({ name: 'zip', label: 'Zip Code', type: 'text', validate: required })}
              </div>

              <div style={isMobile() ? {} : { display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '2em' }}>
                {renderField({ name: 'officePhone', label: 'Office phone (Optional)', type: 'text' })}
                {renderField({ name: 'website', label: 'Website (Optional)', type: 'text' })}
              </div>
            </Segment>

            <Segment>
              <Header as="h1">
                MLS
                <Header.Subheader>Enter your MLS information so we can generate postcards for your listings.</Header.Subheader>
              </Header>

              <Divider style={{ margin: '1em -1em' }} />

              <FieldArray name="mls">
                {({ fields }) =>
                  fields.map((name, index) => (
                    <Segment secondary key={index}>
                      <div style={isMobile() ? { display: 'grid' } : { display: 'grid', gridTemplateColumns: '1fr 1fr 45px', gridColumnGap: '2em' }}>
                        {renderSelectField({ name: `${name}.mls`, label: 'MLS', type: 'text', validate: required, options: boards ? boards : [] })}
                        {renderField({ name: `${name}.mlsAgentId`, label: 'MLS Agent ID', type: 'text', validate: required })}
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
                <Button basic onClick={() => push('mls', undefined)} color="teal">
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
        )}
      />
    </Fragment>
  );
};

export default ProfileForm;
