import React, { Component } from 'react';
import { FastField, Field, getIn } from 'formik';
import { Form, Dropdown } from 'semantic-ui-react';

import { getFieldError, setFieldValue } from './helpers';
import ErrorMessage from './ErrorMessage';

class FormikDropdown extends Component {
  constructor(props) {
    super(props);
    const { id, name } = props;
    this.id = id || `field_dropdown_${name}`;
    this.state = { options: props.options };
  }

  handleAddition(e, { value }) {
    this.setState(prevState => ({
      options: [{ text: value, key: value, value }, ...prevState.options],
    }));
  }

  render() {
    const { name, label, validate, inputProps = {}, fieldProps = {}, errorComponent = ErrorMessage, fast, disabled = false, tag = undefined } = this.props;
    const { onChange, ...safeInputProps } = inputProps;
    const DesiredField = fast === true ? FastField : Field;
    return (
      <DesiredField name={name} validate={validate}>
        {({ field, form }) => {
          const error = getFieldError(field, form);
          return (
            <Form.Field error={!!error} {...fieldProps} className={disabled ? 'disabled-form-field' : null}>
              {!!label && (
                <label htmlFor={this.id} onClick={() => this._dropdown.open()}>
                  {label} {tag}
                </label>
              )}
              <Dropdown
                ref={el => (this._dropdown = el)}
                id={this.id}
                name={name}
                options={this.state.options}
                selectOnBlur={false}
                selectOnNavigation={false}
                selection
                {...safeInputProps}
                value={field.value}
                disabled={disabled}
                onAddItem={this.handleAddition.bind(this)}
                onChange={(e, { name, value }) => {
                  setFieldValue(form, name, value, true);
                  Promise.resolve().then(() => {
                    onChange && onChange(e, { name, value });
                  });
                }}
              />
              {error && React.createElement(errorComponent, { message: getIn(form.errors, name) })}
            </Form.Field>
          );
        }}
      </DesiredField>
    );
  }
}

export default FormikDropdown;
