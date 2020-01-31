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
      <List.Item style={{ paddingTop: '.42857143em' }}>
        <List.Content>
          <List.Header style={{ padding: '1em' }}>Recipients</List.Header>
          <List.Description style={{ padding: '1em' }}>{data.recipientCount}</List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header style={{ padding: '1em' }}>Cost</List.Header>
          <List.Description style={{ padding: '1em' }}>{calculateCost(data.recipientCount)}</List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header style={{ padding: '1em' }}>
            Status
            <Popup
              flowing
              trigger={<FontAwesomeIcon icon="info-circle" style={{ marginLeft: '.5em', color: '#2DB5AD' }} />}
              content={PopupContent()}
              position="top right"
            />
          </List.Header>
          <List.Description style={{ padding: '1em', color: resolveMailoutStatusColor(data.mailoutStatus) }}>
            <FontAwesomeIcon icon={resolveMailoutStatusIcon(data.mailoutStatus)} style={{ marginRight: '.5em' }} />
            {resolveMailoutStatus(data.mailoutStatus)}
          </List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header style={{ padding: '1em' }}>Created</List.Header>
          <List.Description style={{ padding: '1em' }}>{formatDate(data.created)}</List.Description>
        </List.Content>
      </List.Item>
    </ItemBodyDataLayout>
  );
};

ItemList.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ItemList;
