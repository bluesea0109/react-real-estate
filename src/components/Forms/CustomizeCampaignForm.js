import React, { Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form } from '../Base';

const renderRadio = field => (
  <Form.Radio
    checked={field.input.value === field.radioValue}
    label={field.label}
    name={field.input.name}
    onChange={(e, { checked }) => field.input.onChange(field.radioValue)}
  />
);

const renderSelect = field => (
  <Form.Select
    label={field.label}
    name={field.input.name}
    onChange={(e, { value }) => field.input.onChange(value)}
    options={field.options}
    placeholder={field.placeholder}
    value={field.input.value}
  />
);

const CustomizeCampaignForm = props => {
  const { handleSubmit, reset } = props;

  return (
    <Fragment>
      <Form onSubmit={handleSubmit}>
        <Form.Group widths="equal">
          <Field
            component={renderSelect}
            label="Choose agent to display on postcards"
            name="gender"
            options={[
              { key: 'o1', text: 'Option 1', value: 'option1' },
              { key: 'o2', text: 'Option 2', value: 'option2' },
            ]}
            placeholder="Josiah Ubben"
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Field
            component={renderSelect}
            label="New listing headline"
            name="gender"
            options={[
              { key: 'o1', text: 'Option 1', value: 'option1' },
              { key: 'o2', text: 'Option 2', value: 'option2' },
            ]}
            placeholder="Just Listed"
          />
          <Field
            component={renderSelect}
            label="Number of postcards to send per listing"
            name="gender"
            options={[
              { key: 'o1', text: 'Option 1', value: 'option1' },
              { key: 'o2', text: 'Option 2', value: 'option2' },
            ]}
            placeholder="500"
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Field
            component={renderSelect}
            label="New listing call to action URL"
            name="gender"
            options={[
              { key: 'o1', text: 'Option 1', value: 'option1' },
              { key: 'o2', text: 'Option 2', value: 'option2' },
            ]}
            placeholder="benkinney.com/home_value"
          />
        </Form.Group>
        <label>Choose template for New Listing</label>
        <Form.Group widths="equal">
          <Field component={renderRadio} label="One" name="quantity" radioValue={1} />
          <Field component={renderRadio} label="Two" name="quantity" radioValue={2} />
          <Field component={renderRadio} label="Three" name="quantity" radioValue={3} />
        </Form.Group>
        <Form.Group inline>
          <Form.Button primary>Submit</Form.Button>
          <Form.Button onClick={reset}>Reset</Form.Button>
        </Form.Group>
      </Form>
    </Fragment>
  );
};
export default reduxForm({
  form: 'customizeCampaign',
})(CustomizeCampaignForm);
