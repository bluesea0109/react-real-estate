import arrayMutators from 'final-form-arrays';
import React, { Fragment } from 'react';
import { Form as FinalForm } from 'react-final-form';
import { Form } from 'semantic-ui-react';

import { isMobile, email, required, composeValidators, renderField } from './helpers';
import { Button, Segment } from '../Base';

const CustomizeSoldListingForm = () => {
  // const dispatch = useDispatch();
  // const [initiated, setInitiated] = useState(false);
  // const auth0 = useSelector(store => store.auth0 && store.auth0.details);
  // const profile = useSelector(store => store.profile && store.profile.available);
  // const profileError = useSelector(store => store.profile && store.profile.error);
  // const boards = useSelector(store => store.boards && store.boards.available);
  // const states = useSelector(store => store.states && store.states.available);
  //
  // const saveProfile = profile => dispatch(saveProfilePending(profile));
  const onSubmit = values => {
    console.log('submitted: ', values);
    // saveProfile(values);
  };

  return (
    <Fragment>
      <FinalForm
        onSubmit={onSubmit}
        // initialValues={profileValues}
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
            <Segment style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
              <div style={isMobile() ? {} : { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridColumnGap: '2em' }}>
                {renderField({ name: 'firstName', label: 'First Name', type: 'text', validate: required })}
                {renderField({ name: 'lastName', label: 'Last Name', type: 'text', validate: required })}

                {renderField({ name: 'email', label: 'Email', type: 'text', validate: composeValidators(required, email) })}
              </div>

              <br />

              <div style={isMobile() ? {} : { display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '2em' }}>
                {renderField({ name: 'phoneNumber', label: 'Phone Number', type: 'text', validate: required })}
                {renderField({ name: 'phoneNumber', label: 'Phone Number', type: 'text', validate: required })}
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

export default CustomizeSoldListingForm;
