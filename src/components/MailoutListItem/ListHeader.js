import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MobileDisabledLayout, MobileEnabledLayout, ItemHeaderLayout, ItemHeaderMenuLayout } from '../../layouts';
import { canDelete, canSend, resolveLabelStatus, resolveMailoutStatus } from './helpers';
import { Button, Header } from '../Base';
import { Label } from 'semantic-ui-react';
import './hover.css';

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
  const enableEdit = resolveMailoutStatus(data.mailoutStatus) !== 'Sent';

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
              {data.details.displayAddress}
            </Header>
          </Link>
        )}
        {mailoutDetailPage && <Header as="h3">{data.details.displayAddress}</Header>}
      </span>
      <ItemHeaderMenuLayout>
        <span>
          {mailoutDetailPage && enableEdit && (
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
