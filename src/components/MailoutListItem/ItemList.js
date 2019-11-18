import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Grid, List, Popup } from '../Base';

import { calculateCost, formatDate, resolveMailoutStatus, resolveMailoutStatusColor, resolveMailoutStatusIcon } from './helpers';
import PopupContent from './PopupContent';

const ItemList = ({ data }) => {
  if (!data) return;

  return (
    <Grid columns={2}>
      <Grid.Row>
        <Grid.Column>
          <List>
            <List.Item>
              <List.Header>Trigger</List.Header>
              <List.Content style={{ textTransform: 'capitalize' }}>{data.listingStatus}</List.Content>
            </List.Item>
            <List.Item>
              <List.Header>Recipients</List.Header>
              <List.Content>{data.recipientCount}</List.Content>
            </List.Item>
            <List.Item>
              <List.Header>Cost</List.Header>
              <List.Content>{calculateCost(data.recipientCount)}</List.Content>
            </List.Item>
          </List>
        </Grid.Column>
        <Grid.Column>
          <List>
            <List.Item>
              <List.Header>
                Status
                <Popup
                  flowing
                  trigger={<FontAwesomeIcon icon="info-circle" style={{ marginLeft: '.5em', color: '#2DB5AD' }} />}
                  content={PopupContent()}
                  position="top right"
                />
              </List.Header>
              <List.Content style={{ color: resolveMailoutStatusColor(data.mailoutStatus) }}>
                <FontAwesomeIcon icon={resolveMailoutStatusIcon(data.mailoutStatus)} style={{ marginRight: '.5em' }} />
                {resolveMailoutStatus(data.mailoutStatus)}
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Header>Created</List.Header>
              <List.Content>{formatDate(data.created)}</List.Content>
            </List.Item>
          </List>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

ItemList.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ItemList;
