import React, { Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Form, Image, Segment, Dimmer, Menu } from '../Base';

import { ButtonBack, ButtonNext, CarouselProvider, Slide, Slider } from 'pure-react-carousel';

const renderRadio = field => {
  return (
    <Slide tag="a" index={field.radioValue}>
      <Form.Radio
        checked={field.input.value === field.radioValue}
        name={field.input.name}
        onChange={(e, { checked }) => field.input.onChange(field.radioValue)}
        style={{ visibility: 'hidden' }}
      />
      <Dimmer.Dimmable dimmed={field.input.value === field.radioValue}>
        <Image onClick={e => field.input.onChange(field.radioValue)} src={field.src} />
        <Dimmer inverted active={field.input.value === field.radioValue} onClickOutside={e => field.input.onChange(field.radioValue)} />
      </Dimmer.Dimmable>
    </Slide>
  );
};
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

const CustomizeNewListingForm = props => {
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
        <Segment attached="bottom">
          <CarouselProvider
            visibleSlides={3}
            totalSlides={6}
            step={3}
            naturalSlideWidth={360}
            naturalSlideHeight={240}
            style={{
              marginBottom: '-3em',
            }}
          >
            <Slider
              style={{
                top: '-2em',
              }}
            >
              <Field component={renderRadio} name="quantity" radioValue={1} src="https://lorempixel.com/800/800/cats/1" />
              <Field component={renderRadio} name="quantity" radioValue={2} src="https://lorempixel.com/800/800/cats/2" />
              <Field component={renderRadio} name="quantity" radioValue={3} src="https://lorempixel.com/800/800/cats/3" />
              <Field component={renderRadio} name="quantity" radioValue={4} src="https://lorempixel.com/800/800/cats/4" />
              <Field component={renderRadio} name="quantity" radioValue={5} src="https://lorempixel.com/800/800/cats/5" />
              <Field component={renderRadio} name="quantity" radioValue={6} src="https://lorempixel.com/800/800/cats/6" />
            </Slider>
            <ButtonBack
              style={{
                position: 'relative',
                top: '-6.5em',
                left: '-1.5em',
              }}
            >
              <FontAwesomeIcon icon="angle-left" />
            </ButtonBack>
            <ButtonNext
              style={{
                position: 'relative',
                right: '-42.5em',
                top: '-6.5em',
              }}
            >
              <FontAwesomeIcon icon="angle-right" />
            </ButtonNext>
          </CarouselProvider>
        </Segment>

        <Form.Group inline>
          <Menu borderless fluid secondary>
            <Menu.Menu position="right">
              <Menu.Item>
                <Form.Button primary>Submit</Form.Button>
                <Form.Button onClick={reset}>Reset</Form.Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Form.Group>
      </Form>
    </Fragment>
  );
};
export default reduxForm({
  form: 'customizeNewListing',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(CustomizeNewListingForm);
