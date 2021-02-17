import Dinero from 'dinero.js/build/esm/dinero.js';
import { format } from 'date-fns';
import * as brandColors from '../../utils/brandColors';

export const calculateCost = (recipientCount, size = '4x6') => {
  if (!recipientCount || typeof recipientCount !== 'number') return '-';
  let unitCost = 59;
  if (size === '6x9' || size === '9x6') unitCost = 99;
  if (size === '6x11' || size === '11x6') unitCost = 120;
  // The amount is represented in cents
  return Dinero({ amount: unitCost, currency: 'USD' })
    .multiply(recipientCount)
    .toFormat('$0,0.00');
};

export const canSend = mailoutStatus => {
  return mailoutStatus === 'calculated';
};

export const canPickDestinations = mailoutStatus => {
  return mailoutStatus === 'created' || mailoutStatus === 'calculation-deferred';
};

export const formatDate = created => {
  if (!created || typeof created !== 'number') return '-';
  return format(new Date(created), 'MM/dd/yyyy');
};

export const resolveMailoutStatusIcon = mailoutStatus => {
  if (mailoutStatus === 'created') return 'edit';
  if (mailoutStatus === 'calculation-deferred') return 'edit';
  if (mailoutStatus === 'calculated') return 'eye';
  if (mailoutStatus === 'submitted') return 'sync-alt';
  // if (mailoutStatus === 'scheduled') return 'eye' // this has been sent to lob
  if (mailoutStatus === 'hide') return 'ban';
  if (mailoutStatus === 'archived') return 'archive';
  if (mailoutStatus === 'errored') return 'exclamation-triangle';
  if (mailoutStatus === 'cancelled') return 'times';

  if (mailoutStatus === 'queued-for-printing') return 'hourglass-half';
  if (mailoutStatus === 'printing') return 'print';
  if (mailoutStatus === 'mailing') return 'mail-bulk';
  if (mailoutStatus === 'complete') return 'check';

  return 'check';
};

export const resolveMailoutStatus = mailoutStatus => {
  if (mailoutStatus === 'created') return 'Created';
  if (mailoutStatus === 'calculation-deferred') return 'Created';
  if (mailoutStatus === 'calculated') return 'Awaiting Approval';
  if (mailoutStatus === 'submitted') return 'Processing';
  if (mailoutStatus === 'hide') return 'Excluded';
  if (mailoutStatus === 'archived') return 'Archived';
  if (mailoutStatus === 'errored') return 'Errored';
  if (mailoutStatus === 'cancelled') return 'Canceled';

  return 'Sent';
};

export const resolveMailoutStatusUI = mailoutStatus => {
  if (mailoutStatus === 'created') return 'Created';
  if (mailoutStatus === 'calculation-deferred') return 'Created';
  if (mailoutStatus === 'calculated') return 'Awaiting Approval';
  if (mailoutStatus === 'submitted') return 'Processing';
  if (mailoutStatus === 'hide') return 'Excluded';
  if (mailoutStatus === 'archived') return 'Archived';
  if (mailoutStatus === 'errored') return 'Errored';
  if (mailoutStatus === 'cancelled') return 'Canceled';

  if (mailoutStatus === 'queued-for-printing') return 'Queued for Printing';
  if (mailoutStatus === 'printing') return 'Printing';
  if (mailoutStatus === 'mailing') return 'Mailing';
  if (mailoutStatus === 'complete') return 'Complete';

  return 'Sent';
};

export const resolveMailoutStatusColor = mailoutStatus => {
  if (mailoutStatus === 'created') return brandColors.grey03;
  if (mailoutStatus === 'calculation-deferred') return brandColors.grey03;
  if (mailoutStatus === 'calculated') return brandColors.grey03;
  if (mailoutStatus === 'submitted') return brandColors.grey03;
  if (mailoutStatus === 'errored') return brandColors.error;
  if (mailoutStatus === 'cancelled') return brandColors.grey05;
  if (mailoutStatus === 'hide') return brandColors.grey05;
  if (mailoutStatus === 'archived') return brandColors.grey04;

  if (mailoutStatus === 'queued-for-printing') return brandColors.grey03;
  if (mailoutStatus === 'printing') return brandColors.grey03;
  if (mailoutStatus === 'mailing') return brandColors.grey03;
  if (mailoutStatus === 'complete') return brandColors.primary;

  return brandColors.primary;
};

export const resolveLabelStatus = (listingStatus, mailoutStatus) => {
  if (mailoutStatus === 'hide') return 'grey';
  if (mailoutStatus === 'archived') return 'grey';
  if (listingStatus === 'custom') return 'grey';
  if (listingStatus === 'sold') return 'orange';
  if (listingStatus === 'listed') return 'teal';
};
