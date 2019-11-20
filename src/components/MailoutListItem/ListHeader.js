import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MobileDisabledLayout, MobileEnabledLayout, ItemHeaderLayout, ItemHeaderMenuLayout } from '../../layouts';
import { canDelete, canSend, resizeLongText, resolveLabelStatus } from './helpers';
import { Button } from '../Base';
import { Label } from 'semantic-ui-react';

const ApproveAndSendButton = ({ data, mailoutDetailPage, onClickApproveAndSend }) => {
  if (!data) return;

  if (!mailoutDetailPage) {
    return (
      <Fragment>
        {canSend(data.mailoutStatus) && (
          <Link to={`dashboard/${data._id}`}>
            <Button color="teal">
              <MobileDisabledLayout>
                <Fragment>Approve & Send</Fragment>
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
        <Button color="teal" onClick={onClickApproveAndSend}>
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

const DeleteButton = ({ data, mailoutDetailPage, onClickDelete }) => {
  if (!data) return;

  if (!mailoutDetailPage) {
    return (
      <Fragment>
        {canDelete(data.mailoutStatus) && (
          <Link to={`dashboard/${data._id}`}>
            <Button basic color="teal">
              <FontAwesomeIcon icon="trash-alt" />
            </Button>
          </Link>
        )}
      </Fragment>
    );
  }

  return (
    <Fragment>
      {canDelete(data.mailoutStatus) && (
        <Button basic color="teal" onClick={onClickDelete}>
          <FontAwesomeIcon icon="trash-alt" />
        </Button>
      )}
    </Fragment>
  );
};

const ListHeader = ({ data, mailoutDetailPage = false, onClickEdit, onClickApproveAndSend, onClickDelete }) => {
  if (!data) return;

  return (
    <ItemHeaderLayout attached="top" block>
      <span style={{ gridArea: 'label' }}>
        <Label size="big" color={resolveLabelStatus(data.listingStatus)} ribbon style={{ textTransform: 'capitalize', top: '-0.7em', left: '-2.4em' }}>
          {data.listingStatus}
        </Label>
      </span>
      <span style={{ gridArea: 'address' }}>
        {!mailoutDetailPage && <Link to={`dashboard/${data._id}`}>{resizeLongText(data.details.displayAddress)}</Link>}
        {mailoutDetailPage && resizeLongText(data.details.displayAddress)}
      </span>
      <ItemHeaderMenuLayout>
        <span>
          {mailoutDetailPage && (
            <Button basic color="teal" onClick={onClickEdit}>
              Edit
            </Button>
          )}
        </span>
        <span>{ApproveAndSendButton({ data, mailoutDetailPage, onClickApproveAndSend })}</span>
        <span>{DeleteButton({ data, mailoutDetailPage, onClickDelete })}</span>
      </ItemHeaderMenuLayout>
    </ItemHeaderLayout>
  );
};

ListHeader.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ListHeader;
