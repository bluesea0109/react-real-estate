import arrayMutators from 'final-form-arrays';
import React, { Fragment } from 'react';
import { Form as FinalForm } from 'react-final-form';
import { Form } from 'semantic-ui-react';

import { isMobile, required, renderField } from './helpers';
import { Button, Segment } from '../Base';

const CustomizeNewListingForm = () => {
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
            <Segment>
              <div
                style={
                  isMobile()
                    ? {}
                    : {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr',
                        gridTemplateRows: '1fr 1fr 1fr 1fr',
                        gridTemplateAreas: `"Agent Agent BrandColor BrandColor" "Headline NumberOfPostcards BrandColor BrandColor" "CallToAction CallToAction ChooseTemplate ChooseTemplate" "ShortenedURL ShortenedURL ChooseTemplate ChooseTemplate"`,
                        gridColumnGap: '2em',
                      }
                }
              >
                <div style={{ gridArea: 'Agent' }}>
                  {renderField({ name: 'agent', label: 'Choose agent to display on postcards', type: 'text', validate: required })}
                </div>
                <div style={{ gridArea: 'BrandColor' }}></div>
                <div style={{ gridArea: 'ChooseTemplate' }}></div>
                <div style={{ gridArea: 'Headline' }}>{renderField({ name: 'headline', label: 'Headline', type: 'text', validate: required })}</div>
                <div style={{ gridArea: 'NumberOfPostcards' }}>
                  {renderField({ name: 'numberOfPostcards', label: 'Number of postcards to send per listing', type: 'text', validate: required })}
                </div>
                <div style={{ gridArea: 'CallToAction' }}>
                  {renderField({ name: 'actionURL', label: 'Call to action URL', type: 'text', validate: required })}
                </div>
                <div style={{ gridArea: 'ShortenedURL' }}>Shortened URL: briv.it/12a</div>
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

export default CustomizeNewListingForm;
