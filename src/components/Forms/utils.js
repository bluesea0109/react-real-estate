import React from 'react';
import { Popup } from '../Base';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const mql = window.matchMedia('(max-width: 599px)');
export const isMobile = () => mql.matches;

export const popup = msg => <Popup flowing trigger={<FontAwesomeIcon icon="info-circle" style={{ color: '#2DB5AD' }} />} content={msg} position="top right" />;

export const tag = type => {
  const types = {
    Required: (
      <span style={{ fontWeight: 700 }}>
        (Required)<span style={{ margin: '-.2em 0 0 .2em', color: '#db2828' }}>*</span>
      </span>
    ),
    Optional: <span style={{ fontWeight: 700 }}>(Optional)</span>,
    Dre: <span style={{ fontWeight: 700 }}>(Required in California)</span>,
    undefined: <span> </span>,
  };
  return type ? types[type] : types['undefined'];
};

export const phoneRegExp = /^(\+?\d{0,4})?\s?[-.]?\s?(\(?\d{3}\)?)\s?[-.]?\s?(\(?\d{3}\)?)\s?[-.]?\s?(\(?\d{4}\)?)?$/;

export function objectIsEmpty(obj) {
  return !obj || Object.keys(obj).length === 0;
}
