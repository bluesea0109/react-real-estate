import React from 'react';

const ErrorMessage = ({ message, style }) => (
  <span className="sui-error-message" style={style}>
    {message}
  </span>
);

export default ErrorMessage;
