import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { calculateCost, formatDate, resolveMailoutStatus, resolveMailoutStatusColor, resolveMailoutStatusIcon } from './helpers';
import { ItemBodyDataLayout } from '../../layouts';
import PopupContent from './PopupContent';
import { List, Popup } from '../Base';

const ItemList = ({ data }) => {
  if (!data) return;

  return (
    <ItemBodyDataLayout relaxed>
      <List.Item>
        <List.Content>
          <List.Header>Recipients</List.Header>
          <List.Description>{data.recipientCount}</List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>Cost</List.Header>
          <List.Description>{calculateCost(data.recipientCount)}</List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>
            Status
            <Popup
              flowing
              trigger={<FontAwesomeIcon icon="info-circle" style={{ marginLeft: '.5em', color: '#2DB5AD' }} />}
              content={PopupContent()}
              position="top right"
            />
          </List.Header>
          <List.Description style={{ color: resolveMailoutStatusColor(data.mailoutStatus) }}>
            <FontAwesomeIcon icon={resolveMailoutStatusIcon(data.mailoutStatus)} style={{ marginRight: '.5em' }} />
            {resolveMailoutStatus(data.mailoutStatus)}
          </List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>Created</List.Header>
          <List.Description>{formatDate(data.created)}</List.Description>
        </List.Content>
      </List.Item>
    </ItemBodyDataLayout>
  );
};

ItemList.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ItemList;
