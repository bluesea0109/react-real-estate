import React from 'react';
import { FastField, Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';

import { getFieldError, setFieldValue, useFocusOnError } from './utils/helpers';
import ErrorMessage from './ErrorMessage';
import { InputRef } from './InputRef';

import './Toggle.css';

const FormikToggle = ({
  name,
  label,
  validate,
  inputProps = {},
  fieldProps = {},
  errorComponent = ErrorMessage,
  inputRef,
  fast,
  disabled = false,
  onChange,
  defaultChecked,
  id = `field_checkbox_${name}`,
  invertInput = false,
}) => {
  const { ...safeInputProps } = inputProps;
  const DesiredField = fast === true ? FastField : Field;
  const fieldRef = React.useRef();
  useFocusOnError({ fieldRef, name });

  if (defaultChecked) {
    return (
      <DesiredField name={name} validate={validate}>
        {({ field, form }) => {
          const error = getFieldError(field, form);
          return (
            <Form.Field error={!!error} {...fieldProps}>
              <InputRef inputRef={inputRef}>
                <input
                  {...safeInputProps}
                  type="checkbox"
                  id={id}
                  name={name}
                  ref={fieldRef}
                  defaultChecked={invertInput ? !defaultChecked : defaultChecked}
                  style={{ opacity: disabled ? 0.4 : 1 }}
                />
                <label htmlFor={id} style={{ opacity: disabled ? 0.4 : 1 }}>
                  {label}
                </label>
              </InputRef>
              {error && React.createElement(errorComponent, { message: getIn(form.errors, name) })}
            </Form.Field>
          );
        }}
      </DesiredField>
    );
  } else {
    return (
      <DesiredField name={name} validate={validate}>
        {({ field, form }) => {
          const error = getFieldError(field, form);

          return (
            <Form.Field error={!!error} {...fieldProps}>
              <InputRef inputRef={inputRef}>
                <input
                  {...safeInputProps}
                  type="checkbox"
                  id={id}
                  name={name}
                  ref={fieldRef}
                  checked={invertInput ? !field.value : field.value}
                  onChange={e => {
                    setFieldValue(form, name, invertInput ? field.value : !field.value, true);
                    Promise.resolve().then(() => {
                      onChange &&
                        onChange(e, { name, value: invertInput ? field.value : !field.value });
                    });
                  }}
                  style={{ opacity: disabled ? 0.4 : 1 }}
                />
                <label htmlFor={id} style={{ opacity: disabled ? 0.4 : 1 }}>
                  {label}
                </label>
              </InputRef>
              {error && React.createElement(errorComponent, { message: getIn(form.errors, name) })}
            </Form.Field>
          );
        }}
      </DesiredField>
    );
  }
};

export default FormikToggle;
