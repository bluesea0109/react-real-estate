import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import { Button, Header, Menu } from '../Base';

import { MobileDisabledLayout, MobileEnabledLayout } from '../../layouts';
import { canDelete, canSend, resizeLongText } from './helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ListHeader = ({ data, edit }) => {
  if (!data) return;

  return (
    <Header attached="top" block>
      <Menu borderless fluid secondary>
        <Menu.Item>{resizeLongText(data.details.displayAddress)}</Menu.Item>
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
