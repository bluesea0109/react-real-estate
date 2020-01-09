import React from 'react';
import { useLocation } from 'react-router-dom';
import { Redirect } from 'react-router';

const EmailVerifiedPage = () => {
  const location = useLocation();

  const paramsString = decodeURI(location.search.substr(1));
  const paramsArr = paramsString.split('&');
  const params = {};
  paramsArr.map(str => {
    const splitStrArr = str.split('=');
    return (params[splitStrArr[0]] = splitStrArr[1]);
  });

  console.log('EmailVerifiedPage: ');
  console.log(JSON.stringify(params, 0, 2));

  return <Redirect to="/" />;
};

export default EmailVerifiedPage;
