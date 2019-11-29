import { useDispatch, useSelector } from 'react-redux';
import arrayMutators from 'final-form-arrays';
import React, { Fragment, useState } from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { Header, Divider, Form } from 'semantic-ui-react';
import { Form as FinalForm, Field } from 'react-final-form';

import { Button, Icon, Segment } from '../Base';
import { isMobile, email, required, composeValidators, requiredOnlyInCalifornia } from './helpers';
import { saveProfilePending } from '../../store/modules/profile/actions';

const renderSelectField = ({ name, label, type, options, validate }) => (
  <Field name={name} validate={validate}>
    {({ input, meta }) => (
      <Form.Field>
        <Form.Select
          onChange={(param, data) => input.onChange(data.value)}
          value={input.value}
          options={options}
          name={name}
          label={label}
          type={type}
          error={meta.error && meta.touched && { content: `${meta.error}` }}
        />
      </Form.Field>
    )}
  </Field>
);

const renderField = ({ name, label, type, validate }) => (
  <Field name={name} validate={validate}>
    {({ input, meta }) => (
      <Form.Field>
        <Form.Input {...input} type={type} label={label} error={meta.error && meta.touched && { content: `${meta.error}` }} />
      </Form.Field>
    )}
  </Field>
);

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
  const [initiated, setInitiated] = useState(false);
  const auth0 = useSelector(store => store.auth0 && store.auth0.details);
  const profile = useSelector(store => store.profile && store.profile.available);
  const profileError = useSelector(store => store.profile && store.profile.error);
  const boards = useSelector(store => store.boards && store.boards.available);
  const states = useSelector(store => store.states && store.states.available);

  const saveProfile = profile => dispatch(saveProfilePending(profile));

  const onSubmit = values => {
    saveProfile(values);
  };

  let profileValues;

  if (profileError === '410 Gone') {
    profileValues = {
      firstName: auth0.idTokenPayload && auth0.idTokenPayload['http://firstname'],
      lastName: auth0.idTokenPayload && auth0.idTokenPayload['http://lastname'],
      email: auth0.idTokenPayload && auth0.idTokenPayload.email,
      phoneNumber: auth0.idTokenPayload && auth0.idTokenPayload['http://phonenumber'],
      mls: [null],
    };
  } else {
    profileValues = profile;
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
        }) => {
          if (!initiated) {
            setInitiated(true);
            push('mls', undefined);
          }

          return (
            <Form onSubmit={handleSubmit}>
              <Segment>
                <Header as="h1">
                  Profile
                  <Header.Subheader>Your information will be shown on your postcards and will enable recipients to reach you.</Header.Subheader>
                </Header>

                <Divider style={{ margin: '1em -1em' }} />

                <div style={isMobile() ? {} : { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridColumnGap: '2em' }}>
                  {renderField({ name: 'firstName', label: 'First Name', type: 'text', validate: required })}
                  {renderField({ name: 'lastName', label: 'Last Name', type: 'text', validate: required })}

                  {renderField({ name: 'email', label: 'Email', type: 'text', validate: composeValidators(required, email) })}
                </div>

                <br />

                <div style={isMobile() ? {} : { display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '2em' }}>
                  {renderField({ name: 'phoneNumber', label: 'Phone Number', type: 'text', validate: required })}
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
                  {renderField({ name: 'zipCode', label: 'Zip Code', type: 'text', validate: required })}
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
                      <Segment secondary key={name}>
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
                    Submit
                  </Button>
                </span>
              </div>
            </Form>
          );
        }}
      />
    </Fragment>
  );
};

export default ProfileForm;
