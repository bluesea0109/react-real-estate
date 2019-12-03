// import * as isInt from 'validator/lib/isInt';
import * as isURL from 'validator/lib/isURL';
import * as isEmail from 'validator/lib/isEmail';
import { Field } from 'react-final-form';
import { Form } from 'semantic-ui-react';
import React from 'react';

import { Card, Header, Image, Button, Label, Item, Input, Segment } from 'semantic-ui-react';

import { uploadPhotoPending } from '../../store/modules/pictures/actions';

// export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const isEmpty = value => value === undefined || value === null || value === '';
export const email = value => !isEmpty(value) && !isEmail(value) && 'Invalid email address';
export const required = value => isEmpty(value) && 'Required field';
export const requiredOnlyInCalifornia = (value, condition) => {
  if (condition && condition.state === 'California') {
    return value ? undefined : 'Required by state of California';
  }
  return undefined;
};
export const url = value => !isEmpty(value) && !isURL(value) && 'Invalid URL';

// export const minLength = min => value => !isEmpty(value) && value.length < min && `Must be at least ${min} characters`;
// export const maxLength = max => value => !isEmpty(value) && value.length > max && `Must be no more than ${max} characters`;
// export const integer = value => !isInt(value) && 'Must be an integer';
// export const mustBeNumber = value => (isNaN(value) ? 'Must be a number' : undefined);
// export const minValue = min => value => (isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`);
export const composeValidators = (...validators) => value => validators.reduce((error, validator) => error || validator(value), undefined);

const mql = window.matchMedia('(max-width: 599px)');
export const isMobile = () => mql.matches;

// composeValidators(required, mustBeNumber, minValue(18))

export const renderSelectField = ({ name, label, type, options, validate }) => (
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

export const renderField = ({ name, label, type, validate }) => (
  <Field name={name} validate={validate}>
    {({ input, meta }) => (
      <Form.Field>
        <Form.Input {...input} type={type} label={label} error={meta.error && meta.touched && { content: `${meta.error}` }} />
      </Form.Field>
    )}
  </Field>
);

export const renderPicturePickerField = ({ name, label, dispatch, validate }) => {
  const onChangeHandler = event => {
    const data = new FormData();
    data.append(name, event.target.files[0]);
    dispatch(uploadPhotoPending(data));
  };

  return (
    <Field name={name} validate={validate}>
      {({ input, meta }) => {
        return (
          <Form.Field>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gridTemplateAreas: `"Label Func" "Image Image"`,
                width: '12em',
              }}
            >
              <div style={{ gridArea: 'Label' }}>
                <Header as="h4">{label}</Header>
              </div>
              <div style={{ gridArea: 'Func', justifySelf: 'end' }}>
                <Item as="label" htmlFor={name} style={{ cursor: 'pointer' }}>
                  <Header as="h4" color={meta.error && meta.touched ? 'red' : 'teal'}>
                    Upload
                  </Header>
                  <input hidden id={name} type="file" onChange={onChangeHandler} />
                </Item>
              </div>

              <div style={{ gridArea: 'Image', margin: '.4em 0' }}>
                <Card style={meta.error && meta.touched ? { border: '3px solid red' } : {}}>
                  <Image size="small" src="https://react.semantic-ui.com/images/avatar/large/matthew.png" wrapped ui={false} />
                </Card>
                {meta.error && meta.touched && (
                  <Label basic color="red" pointing>
                    {meta.error}
                  </Label>
                )}
              </div>
            </div>
          </Form.Field>
        );
      }}
    </Field>
  );
};
