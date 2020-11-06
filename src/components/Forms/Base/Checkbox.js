import React from 'react';
import { FastField, Field, getIn } from 'formik';
import { Form, Checkbox } from 'semantic-ui-react';

import { getFieldError, setFieldValue, useFocusOnError } from './utils/helpers';
import ErrorMessage from './ErrorMessage';
import { InputRef } from './InputRef';

const FormikCheckbox = ({
  name,
  label,
  validate,
  inputProps = {},
  fieldProps = {},
  errorComponent = ErrorMessage,
  inputRef,
  fast,
  disabled = false,
  id = `field_checkbox_${name}`,
}) => {
  const { onChange, ...safeInputProps } = inputProps;
  const DesiredField = fast === true ? FastField : Field;
  const fieldRef = React.useRef();
  useFocusOnError({ fieldRef, name });

  return (
    <DesiredField name={name} validate={validate}>
      {({ field, form }) => {
        const error = getFieldError(field, form);
        return (
          <Form.Field error={!!error} {...fieldProps} className={disabled ? 'disabled-form-field' : null}>
            <InputRef inputRef={inputRef}>
              <Checkbox
                {...safeInputProps}
                id={id}
                label={label}
                name={name}
                ref={fieldRef}
                checked={field.value}
                disabled={disabled}
                onChange={(e, { name, checked }) => {
                  setFieldValue(form, name, checked, true);
                  Promise.resolve().then(() => {
                    onChange && onChange(e, { name, value: checked });
                  });
                }}
              />
            </InputRef>
            {error && React.createElement(errorComponent, { message: getIn(form.errors, name) })}
          </Form.Field>
        );
      }}
    </DesiredField>
  );
};

export default FormikCheckbox;
