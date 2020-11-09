import React from 'react';
import { getIn, useFormikContext } from 'formik';

export const getFieldError = (field, form) => {
  const { name } = field;
  const serverValidation = form.status?.[name];
  const touched = getIn(form.touched, name);
  const checkTouched = serverValidation ? !touched : touched;

  if (serverValidation) {
    return serverValidation;
  }

  return checkTouched && getIn(form.errors, name);
};

// export const setFieldErrors = (form, name, value) => {
//   form.setFieldError(name, value);
// };

export const setFieldValue = (form, name, value, shouldValidate) => {
  form.setFieldValue(name, value, shouldValidate);
  form.setFieldTouched(name, true, shouldValidate);
};

export const useFocusOnError = ({ fieldRef, name }) => {
  const formik = useFormikContext();
  const prevSubmitCountRef = React.useRef(formik.submitCount);
  const firstErrorKey = Object.keys(formik.errors)[0];
  React.useEffect(() => {
    if (prevSubmitCountRef.current !== formik.submitCount && !formik.isValid) {
      if (
        (fieldRef.current && firstErrorKey === name) ||
        (fieldRef.current && name.includes(firstErrorKey))
      ) {
        if (fieldRef.current.scrollIntoView) fieldRef.current.scrollIntoView();
        if (fieldRef.current.focus) fieldRef.current.focus();
      }
    }
    prevSubmitCountRef.current = formik.submitCount;
  }, [formik.submitCount, formik.isValid, firstErrorKey, fieldRef, name]);
};
