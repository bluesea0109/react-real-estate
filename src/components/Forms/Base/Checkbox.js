import React, { Component } from 'react';
import { FastField, Field, getIn } from 'formik';
import { Form, Checkbox } from 'semantic-ui-react';

import { getFieldError, setFieldValue } from './helpers';
import ErrorMessage from './ErrorMessage';
import { InputRef } from './InputRef';

class FormikCheckbox extends Component {
  constructor(props) {
    super(props);
    const { id, name } = props;
    this.id = id || `field_checkbox_${name}`;
  }

  render() {
    const { name, label, validate, inputProps = {}, fieldProps = {}, errorComponent = ErrorMessage, inputRef, fast } = this.props;
    const { onChange, ...safeInputProps } = inputProps;
    const DesiredField = fast === true ? FastField : Field;
    return (
      <DesiredField name={name} validate={validate}>
        {({ field, form }) => {
          const error = getFieldError(field, form);
          return (
            <Form.Field error={!!error} {...fieldProps}>
              <InputRef inputRef={inputRef}>
                <Checkbox
                  {...safeInputProps}
                  id={this.id}
                  label={label}
                  name={name}
                  checked={field.value}
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
  }
}

export default FormikCheckbox;
