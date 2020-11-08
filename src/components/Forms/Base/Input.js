import React from 'react';
import { FastField, Field } from 'formik';
import { Form, Input } from 'semantic-ui-react';

import { getFieldError, setFieldValue, useFocusOnError } from './utils/helpers';
import ErrorMessage from './ErrorMessage';
import { InputRef } from './InputRef';

const FormikInput = ({
  name,
  label,
  validate,
  inputProps = {},
  fieldProps = {},
  validateOnChange,
  errorComponent = ErrorMessage,
  inputRef,
  fast,
  disabled = false,
  tag = undefined,
  id = `field_input_${name}`,
  onBlur,
  onChange,
  ...rest
}) => {
  const DesiredField = fast === true ? FastField : Field;
  const fieldRef = React.useRef();
  useFocusOnError({ fieldRef, name });

  return (
    <DesiredField name={name} validate={validate}>
      {({ field, form }) => {
        const error = getFieldError(field, form);

        return (
          <Form.Field
            error={!!error}
            {...fieldProps}
            className={disabled ? 'disabled-form-field' : null}
          >
            {!!label && (
              <label htmlFor={id} style={{ opacity: disabled ? '0.4' : 1 }}>
                {label} {tag}
              </label>
            )}

            <InputRef inputRef={inputRef}>
              <Input
                id={id}
                name={name}
                ref={fieldRef}
                value={field.value || ''}
                disabled={disabled}
                onChange={(e, { name, value }) => {
                  setFieldValue(form, name, value, validateOnChange);
                  Promise.resolve().then(() => {
                    onChange && onChange(e, { name, value });
                  });
                }}
                onBlur={e => {
                  form.handleBlur(e);
                  Promise.resolve().then(() => {
                    onBlur && onBlur(e);
                  });
                }}
                {...rest}
              />
            </InputRef>

            {error && React.createElement(errorComponent, { message: error })}
          </Form.Field>
        );
      }}
    </DesiredField>
  );
};

export default FormikInput;
