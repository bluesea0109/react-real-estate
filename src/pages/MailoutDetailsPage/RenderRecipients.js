import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Button, Input } from '../../components/Base';
import { resolveMailoutStatus } from '../../components/MailoutListItem/utils/helpers';

const changeButtonStyles = {
  marginLeft: '10px',
  minWidth: '5em',
  textTransform: 'none',
};

export default function RenderRecipients({ currentNumberOfRecipients, details }) {
  const history = useHistory();
  const updateMailoutSizePendingState = useSelector(
    store => store.mailout.updateMailoutSizePending
  );
  const handleEditDestinationsClick = () => {
    history.push(`/postcards/edit/${details._id}/destinations`);
  };
  const enableEditRecipients =
    resolveMailoutStatus(details.mailoutStatus) !== 'Sent' &&
    resolveMailoutStatus(details.mailoutStatus) !== 'Processing';
  return (
    <Button as="div" labelPosition="left">
      <Input
        className="display-only"
        style={{ maxWidth: '4.5em', maxHeight: '2em' }}
        value={currentNumberOfRecipients}
      />
      {enableEditRecipients && (
        <Button
          icon
          primary
          onClick={handleEditDestinationsClick}
          style={changeButtonStyles}
          disabled={updateMailoutSizePendingState}
          loading={updateMailoutSizePendingState}
        >
          Change
        </Button>
      )}
    </Button>
  );
}
