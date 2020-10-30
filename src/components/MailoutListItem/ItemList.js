import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { calculateCost, formatDate, resolveMailoutStatus, resolveMailoutStatusColor, resolveMailoutStatusIcon } from './helpers';
import { ItemBodyDataLayout } from '../../layouts';
import PopupContent from './PopupContent';
import { List, Popup } from '../Base';
import { postcardDimensionsDisplayed } from '../utils';
import './styles/itemList.scss'

const ItemList = ({ data }) => {
  if (!data) return;

  return (
    <div id="listingsItems" style={{padding: '18px 30px 0px 18px'}}>
      <ItemBodyDataLayout relaxed>
        <List.Item>
          <List.Content>
            <List.Header>Recipients</List.Header>
            <List.Description>{data.recipientCount}</List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>Size</List.Header>
            <List.Description>{data.postcardSize ? `${postcardDimensionsDisplayed(data.postcardSize)}"` : '4x6"'}</List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>Cost</List.Header>
            <List.Description>{calculateCost(data.recipientCount, data.postcardSize ? data.postcardSize : '4x6')}</List.Description>
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
            <List.Description style={{ padding: '1em 0em 1em 0em', color: resolveMailoutStatusColor(data.mailoutStatus) }}>
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
    </div>
  );
};

ItemList.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ItemList;
