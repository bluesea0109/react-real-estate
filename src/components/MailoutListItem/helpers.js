import Dinero from 'dinero.js/build/esm/dinero.js';
import { format } from 'date-fns';

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

export const canPickDestinations = mailoutStatus => {
  return mailoutStatus === 'created';
}

export const formatDate = created => {
  if (!created || typeof created !== 'number') return '-';
  return format(new Date(created), 'MM/dd/yyyy');
};

export const resolveMailoutStatusIcon = mailoutStatus => {
  if (mailoutStatus === 'created') return 'edit';
  if (mailoutStatus === 'calculated') return 'eye';
  if (mailoutStatus === 'submitted') return 'sync-alt';
  // if (mailoutStatus === 'scheduled') return 'eye' // this has been sent to lob
  if (mailoutStatus === 'hide') return 'ban';
  if (mailoutStatus === 'archived') return 'archive';
  if (mailoutStatus === 'errored') return 'exclamation-triangle';
  if (mailoutStatus === 'cancelled') return 'times';

  return 'check';
};

export const resolveMailoutStatus = mailoutStatus => {
  if (mailoutStatus === 'created') return 'Created';
  if (mailoutStatus === 'calculated') return 'Awaiting Approval';
  if (mailoutStatus === 'submitted') return 'Processing';
  // if (mailoutStatus === 'scheduled') return 'Awaiting Approval' // this has been sent to lob
  if (mailoutStatus === 'hide') return 'Excluded';
  if (mailoutStatus === 'archived') return 'Archived';
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
  if (mailoutStatus === 'hide') return '#555555';
  if (mailoutStatus === 'archived') return 'grey';

  return '#59c4c4';
};

export const resolveLabelStatus = (listingStatus, mailoutStatus) => {
  if (mailoutStatus === 'hide') return 'grey';
  if (mailoutStatus === 'archived') return 'grey';
  if (listingStatus === 'sold') return 'orange';
  if (listingStatus === 'listed') return 'teal';

  return 'red';
};
