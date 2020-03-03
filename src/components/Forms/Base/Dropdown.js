import React, { useState } from 'react';
import { FastField, Field, getIn } from 'formik';
import { Form, Dropdown } from 'semantic-ui-react';

import { getFieldError, setFieldValue, useFocusOnError } from './helpers';
import ErrorMessage from './ErrorMessage';

const FormikDropdown = ({
  name,
  label,
  validate,
  inputProps = {},
  fieldProps = {},
  errorComponent = ErrorMessage,
  fast,
  disabled = false,
  tag = undefined,
  defaultValue,
  id = `field_dropdown_${name}`,
  options,
  onChange,
}) => {
  const [options2, setOptions2] = useState(options);
  const { ...safeInputProps } = inputProps;
  const DesiredField = fast === true ? FastField : Field;
  const fieldRef = React.useRef();
  useFocusOnError({ fieldRef, name });

  const handleAddition = (e, { value }) => {
    setOptions2(prevState => [{ text: value, key: value, value }, ...prevState]);
  };

  return (
    <DesiredField name={name} validate={validate}>
      {({ field, form }) => {
        const error = getFieldError(field, form);

        return (
          <Form.Field error={!!error} {...fieldProps} className={disabled ? 'disabled-form-field' : null}>
            {!!label && (
              <label htmlFor={id} onClick={() => fieldRef.open()} style={{ opacity: disabled ? '0.4' : 1 }}>
                {label} {tag}
              </label>
            )}
            <Dropdown
              ref={fieldRef}
              id={id}
              name={name}
              options={options2}
              selectOnBlur={false}
              selectOnNavigation={false}
              selection
              search
              {...safeInputProps}
              value={defaultValue ? defaultValue : field.value}
              disabled={disabled}
              onAddItem={handleAddition}
              onChange={(e, { name, value }) => {
                setFieldValue(form, name, value, true);
                Promise.resolve().then(() => {
                  onChange && onChange(e, { name, value, options: options2 });
                });
              }}
              style={{ opacity: disabled ? 0.4 : 1 }}
            />
            {error && React.createElement(errorComponent, { message: getIn(form.errors, name) })}
          </Form.Field>
        );
      }}
    </DesiredField>
  );
};

export default FormikDropdown;
