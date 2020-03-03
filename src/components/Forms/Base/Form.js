import React from 'react';
import { Formik } from 'formik';
import { Form as SemanticForm } from 'semantic-ui-react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import FormikDropdown from './Dropdown';
import FormikTextArea from './TextArea';
import FormikCheckbox from './Checkbox';
import FormikToggle from './Toggle';
import FormikInput from './Input';

const componentFactory = schema => {
  if (!schema) {
    return undefined;
  }

  const typeMap = {
    input: FormikInput,
    dropdown: FormikDropdown,
    textarea: FormikTextArea,
    checkbox: FormikCheckbox,
    toggle: FormikToggle,
  };

  return Object.keys(schema).map(name => {
    const property = schema[name];
    const Component = typeMap[property.type] || typeMap.input;
    const { type, value, ...props } = property;
    if (Component === FormikInput) {
      props.inputProps = props.inputProps || {};
      props.inputProps.type = type;
    }
    return <Component key={name} name={name} {...props} />;
  });
};

class FormikForm extends React.Component {
  static defaultProps = {
    validate: values => {
      return {};
    },
  };

  state = {
    schemaComponents: componentFactory(this.props.schema),
  };

  componentDidMount() {
    this._mounted = true;
    if (this.props.serverValidation) {
      this._setStatus({ serverValidation: true });
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  _validate = values => {
    return new Promise((resolve, reject) => {
      const mappedValidation = Object.keys(this._errors).reduce((acc, key) => {
        if (!this._touched[key] && this._errors[key]) {
          acc[key] = this._errors[key];
        }
        return acc;
      }, {});
      if (Object.keys(mappedValidation).length) {
        reject(mappedValidation);
      } else {
        resolve();
      }
    });
  };

  _onSubmit = (values, formikApi) => {
    const result = this.props.onSubmit(values, formikApi);
    const touched = Object.keys(values).reduce(
      (acc, key) => ({
        ...acc,
        [key]: false,
      }),
      {}
    );
    if (result && result.then) {
      result.then(() => {
        if (this._mounted) {
          formikApi.setTouched(touched);
        }
      });
    } else {
      if (this._mounted) {
        formikApi.setTouched(touched);
      }
    }
  };

  render() {
    const { className, inverted, size, ignoreLoading, children, render, component, initialValues = {}, ...formikProps } = this.props;

    const testid = formikProps['data-testid'];
    const { serverValidation } = formikProps;
    const formProps = {
      className,
      inverted,
      size,
    };

    if (testid) {
      formProps['data-testid'] = testid;
    }

    if (component) {
      console.error(
        `
        The formik component prop is not supported in this wrapper.
        Import the Formik control from the formik package to use this scenario.
        `
      );
      throw new Error('Unsupported prop');
    }

    const { schema = {} } = this.props;

    const mappedValues = Object.keys(schema || initialValues || {}).reduce((acc, key) => {
      const property = schema[key] || {};
      acc[key] = property.value || initialValues[key] || (property.type === 'checkbox' ? false : '');
      return acc;
    }, initialValues);

    const serverProps = serverValidation
      ? {
          validate: this._validate,
          onSubmit: this._onSubmit,
        }
      : {};

    return (
      <Formik
        validateOnChange={false}
        {...{
          initialValues: mappedValues,
          ...formikProps,
          ...serverProps,
        }}
      >
        {renderProps => {
          const { handleSubmit, isSubmitting, errors, touched, setFieldError, setStatus, setErrors } = renderProps;
          this._errors = errors;
          this._touched = touched;
          this._setFieldError = setFieldError;
          this._setStatus = setStatus;
          return (
            <SemanticForm
              {...formProps}
              onSubmit={e => {
                if (serverValidation) {
                  e.persist();
                  setErrors({});
                  Promise.resolve().then(() => {
                    handleSubmit(e);
                  });
                } else {
                  handleSubmit(e);
                }
              }}
              loading={isSubmitting && !ignoreLoading}
            >
              {this.state.schemaComponents}
              {typeof children === 'function' || typeof render === 'function' ? (render || children)(renderProps) : children}
            </SemanticForm>
          );
        }}
      </Formik>
    );
  }
}

const Form = hoistNonReactStatics(FormikForm, SemanticForm);
Form.Children = React.Fragment;

export default Form;
