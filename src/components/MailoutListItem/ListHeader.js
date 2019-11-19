import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MobileDisabledLayout, MobileEnabledLayout, ItemHeaderLayout, ItemHeaderMenuLayout } from '../../layouts';
import { canDelete, canSend, resizeLongText, resolveLabelStatus } from './helpers';
import { Button } from '../Base';
import { Label } from 'semantic-ui-react';

const ApproveAndSendButton = ({ data, edit }) => {
  if (!data) return;

  if (!edit) {
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
        <Button color="teal">
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

const DeleteButton = ({ data, edit }) => {
  if (!data) return;

  if (!edit) {
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
        <Button basic color="teal">
          <FontAwesomeIcon icon="trash-alt" />
        </Button>
      )}
    </Fragment>
  );
};

const ListHeader = ({ data, edit }) => {
  if (!data) return;

  return (
    <ItemHeaderLayout attached="top" block>
      <span style={{ gridArea: 'label' }}>
        <Label size="big" color={resolveLabelStatus(data.listingStatus)} ribbon style={{ textTransform: 'capitalize', top: '-0.7em', left: '-2.4em' }}>
          {data.listingStatus}
        </Label>
      </span>
      <span style={{ gridArea: 'address' }}>
        {!edit && <Link to={`dashboard/${data._id}`}>{resizeLongText(data.details.displayAddress)}</Link>}
        {edit && resizeLongText(data.details.displayAddress)}
      </span>
      <ItemHeaderMenuLayout>
        <span>
          {edit && (
            <Button basic color="teal">
              Edit
            </Button>
          )}
        </span>
        <span>{ApproveAndSendButton({ data, edit })}</span>
        <span>{DeleteButton({ data, edit })}</span>
      </ItemHeaderMenuLayout>
    </ItemHeaderLayout>
  );
};

ListHeader.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ListHeader;
