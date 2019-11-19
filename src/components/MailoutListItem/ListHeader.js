import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MobileDisabledLayout, MobileEnabledLayout } from '../../layouts';
import { canDelete, canSend, resizeLongText, resolveLabelStatus } from './helpers';
import { Button, Header, Menu } from '../Base';
import { Label } from 'semantic-ui-react';

const ApproveAndSendButton = ({ data, edit }) => {
  if (!data) return;

  if (!edit) {
    return (
      <Fragment>
        {canSend(data.mailoutStatus) && (
          <Link to={`dashboard/${data._id}`}>
            <Button
              color="teal"
              style={{
                marginLeft: '-2em',
                marginRight: '-2em',
              }}
            >
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
        <Button
          color="teal"
          style={{
            marginLeft: '-2em',
            marginRight: '-2em',
          }}
        >
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
    <Header attached="top" block>
      <Menu borderless fluid secondary>
        <Label as="a" color={resolveLabelStatus(data.listingStatus)} ribbon style={{ textTransform: 'capitalize' }}>
          {data.listingStatus}
        </Label>
        {!edit && (
          <Link to={`dashboard/${data._id}`}>
            <Menu.Item>{resizeLongText(data.details.displayAddress)}</Menu.Item>
          </Link>
        )}
        {edit && <Menu.Item>{resizeLongText(data.details.displayAddress)}</Menu.Item>}

        <Menu.Menu position="right">
          <Menu.Item>
            {edit && (
              <Button basic color="teal">
                Edit
              </Button>
            )}
          </Menu.Item>
          <Menu.Item>{ApproveAndSendButton({ data, edit })}</Menu.Item>
          <Menu.Item>{DeleteButton({ data, edit })}</Menu.Item>
        </Menu.Menu>
      </Menu>
    </Header>
  );
};

ListHeader.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ListHeader;
