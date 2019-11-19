import React from 'react';
import Dinero from 'dinero.js/build/esm/dinero.js';
import { format } from 'date-fns';

import { Header } from '../Base';

/*
 * This function is used to prevent long address text from shifting buttons out of user view on mobile/tablet platforms
 */
export const resizeLongText = text => {
  if (!text) return;

  if (text.length >= 32 && window.innerWidth < 600) {
    return <Header as="h6">{text}</Header>;
  }

  return <Header as="h4">{text}</Header>;
};

export const calculateCost = recipientCount => {
  if (!recipientCount || typeof recipientCount !== 'number') return '-';
  // The amount is represented in cents
  return Dinero({ amount: 59, currency: 'USD' })
    .multiply(recipientCount)
    .toFormat('$0,0.00');
};

export const canSend = mailoutStatus => {
  return mailoutStatus === 'calculated';
};

export const canDelete = mailoutStatus => {
  return mailoutStatus === 'calculated';
};

export const formatDate = created => {
  if (!created || typeof created !== 'number') return '-';
  return format(new Date(created), 'MM/dd/yyyy');
};

export const resolveMailoutStatusIcon = mailoutStatus => {
  if (mailoutStatus === 'created') return 'sync-alt';
  if (mailoutStatus === 'calculated') return 'eye';
  if (mailoutStatus === 'submitted') return 'sync-alt';
  // if (mailoutStatus === 'scheduled') return 'eye' // this has been sent to lob
  if (mailoutStatus === 'excluded') return 'ban';
  if (mailoutStatus === 'errored') return 'exclamation-triangle';
  if (mailoutStatus === 'cancelled') return 'times';

  return 'check';
};

export const resolveMailoutStatus = mailoutStatus => {
  if (mailoutStatus === 'created') return 'Processing';
  if (mailoutStatus === 'calculated') return 'Awaiting Approval';
  if (mailoutStatus === 'submitted') return 'Processing';
  // if (mailoutStatus === 'scheduled') return 'Awaiting Approval' // this has been sent to lob
  if (mailoutStatus === 'excluded') return 'Excluded';
  if (mailoutStatus === 'errored') return 'Errored';
  if (mailoutStatus === 'cancelled') return 'Canceled';

  return 'Sent';
};

export const resolveMailoutStatusColor = mailoutStatus => {
  if (mailoutStatus === 'created') return '#666666';
  if (mailoutStatus === 'calculated') return '#000000';
  if (mailoutStatus === 'submitted') return '#666666';
  // if (mailoutStatus === 'scheduled') return '#000000' // this has been sent to lob
  if (mailoutStatus === 'excluded') return '#555555';
  if (mailoutStatus === 'errored') return '#f2714d';
  if (mailoutStatus === 'cancelled') return '#f2714d';

  return '#59c4c4';
};

export const resolveLabelStatus = listingStatus => {
  if (listingStatus === 'sold') return 'blue';
  if (listingStatus === 'listed') return 'teal';

  return 'red';
};
