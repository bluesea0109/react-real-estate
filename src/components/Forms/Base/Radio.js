import React from 'react';
import { Form, Radio } from 'semantic-ui-react';
import { FastField, Field, getIn } from 'formik';

import { getFieldError, setFieldValue, useFocusOnError } from './utils/helpers';
import ErrorMessage from './ErrorMessage';
import { InputRef } from './InputRef';

const FormikCheckbox = ({
  name,
  label,
  value,
  validate,
  inputProps = {},
  fieldProps = {},
  errorComponent = ErrorMessage,
  inputRef,
  fast,
  disabled = false,
  id,
}) => {
  const id2 = id ? `${id}_${value}` : `field_radio_${name}_${value}`;
  const { onChange, ...safeInputProps } = inputProps;
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
            <InputRef inputRef={inputRef}>
              <Radio
                {...safeInputProps}
                id={id2}
                ref={fieldRef}
                label={label}
                name={name}
                value={value}
                disabled={disabled}
                checked={field.value === value}
                onChange={(e, { name, value }) => {
                  setFieldValue(form, name, value, true);
                  Promise.resolve().then(() => {
                    onChange && onChange(e, { name, value });
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
