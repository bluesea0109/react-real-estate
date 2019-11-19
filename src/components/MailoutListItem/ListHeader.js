import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MobileDisabledLayout, MobileEnabledLayout } from '../../layouts';
import { canDelete, canSend, resizeLongText, resolveLabelStatus } from './helpers';
import { Button, Header, Menu } from '../Base';
import { Label } from 'semantic-ui-react';

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
          <Menu.Item>
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
          </Menu.Item>
          <Menu.Item>
            {canDelete(data.mailoutStatus) && (
              <Button basic color="teal">
                <FontAwesomeIcon icon="trash-alt" />
              </Button>
            )}
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </Header>
  );
};

ListHeader.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ListHeader;
