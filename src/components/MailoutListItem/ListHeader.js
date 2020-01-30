import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MobileDisabledLayout, MobileEnabledLayout, ItemHeaderLayout, ItemHeaderMenuLayout } from '../../layouts';
import { canSend, resolveLabelStatus, resolveMailoutStatus } from './helpers';
import { Button, Header } from '../Base';
import { Label } from 'semantic-ui-react';

const ApproveAndSendButton = ({ data, mailoutDetailPage, onClickApproveAndSend, lockControls = false }) => {
  if (!data) return;

  if (!mailoutDetailPage) {
    return (
      <Fragment>
        {canSend(data.mailoutStatus) && (
          <Link to={`dashboard/${data._id}`}>
            <Button primary>
              <MobileDisabledLayout>
                <Fragment>Review & Send</Fragment>
              </MobileDisabledLayout>
              <MobileEnabledLayout>
                <FontAwesomeIcon icon="thumbs-up" />
              </MobileEnabledLayout>
            </Button>
          </Link>
        )}
      </Fragment>
    );
  }

  return (
    <Fragment>
      {canSend(data.mailoutStatus) && (
        <Button primary onClick={onClickApproveAndSend} disabled={lockControls} loading={lockControls}>
          <MobileDisabledLayout>
            <Fragment>Approve & Send</Fragment>
          </MobileDisabledLayout>
          <MobileEnabledLayout>
            <FontAwesomeIcon icon="thumbs-up" />
          </MobileEnabledLayout>
        </Button>
      )}
    </Fragment>
  );
};

const ListHeader = ({ data, mailoutDetailPage = false, onClickEdit, onClickApproveAndSend, onClickDelete, lockControls = false, onClickRevertEdit }) => {
  if (!data) return;
  const enableEdit = resolveMailoutStatus(data.mailoutStatus) !== 'Sent' && resolveMailoutStatus(data.mailoutStatus) !== 'Processing';
  const enableDelete = resolveMailoutStatus(data.mailoutStatus) === 'Sent';
  const activeWhen = new Date(Date.now()).toISOString().split('T')[0] < data.send_date;
  const enableRevertEdit = data.edited;

  return (
    <ItemHeaderLayout attached="top" block>
      <span style={{ gridArea: 'label' }}>
        <Label size="large" color={resolveLabelStatus(data.listingStatus)} ribbon style={{ textTransform: 'capitalize', top: '-0.9em', left: '-2.7em' }}>
          {data.listingStatus}
        </Label>
      </span>
      <span style={{ gridArea: 'address', alignSelf: 'center' }}>
        {!mailoutDetailPage && (
          <Link to={`dashboard/${data._id}`} className="ui header">
            <Header as="h3" className="bm-color-effect">
              {data.details && data.details.displayAddress}
            </Header>
          </Link>
        )}
        {mailoutDetailPage && <Header as="h3">{data.details && data.details.displayAddress}</Header>}
      </span>
      <ItemHeaderMenuLayout>
        {mailoutDetailPage && enableRevertEdit && (
          <span>
            <Button secondary inverted onClick={onClickRevertEdit} disabled={lockControls} loading={lockControls}>
              Revert Edit
            </Button>
          </span>
        )}
        {mailoutDetailPage && enableEdit && (
          <span>
            <Button primary inverted onClick={onClickEdit} disabled={lockControls} loading={lockControls}>
              Edit
            </Button>
          </span>
        )}
        <span>
          <ApproveAndSendButton data={data} mailoutDetailPage={mailoutDetailPage} onClickApproveAndSend={onClickApproveAndSend} lockControls={lockControls} />
        </span>
        <span>
          {mailoutDetailPage && enableDelete && activeWhen && (
            <Button primary inverted onClick={onClickDelete} disabled={lockControls} loading={lockControls}>
              Stop Sending
            </Button>
          )}
        </span>
      </ItemHeaderMenuLayout>
    </ItemHeaderLayout>
  );
};

ListHeader.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ListHeader;
