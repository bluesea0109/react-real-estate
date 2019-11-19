import React from 'react';
import PropTypes from 'prop-types';
import { Popup, Table } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { calculateCost, formatDate, resolveMailoutStatus, resolveMailoutStatusColor, resolveMailoutStatusIcon } from './helpers';
import PopupContent from './PopupContent';

const ItemTable = ({ data }) => {
  if (!data) return;

  return (
    <Table basic="very">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Recipients</Table.HeaderCell>
          <Table.HeaderCell>Cost</Table.HeaderCell>
          <Table.HeaderCell>
            Status
            <Popup
              flowing
              trigger={<FontAwesomeIcon icon="info-circle" style={{ marginLeft: '.5em', color: '#2DB5AD' }} />}
              content={PopupContent()}
              position="top right"
            />
          </Table.HeaderCell>
          <Table.HeaderCell>Created</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
          <Table.Cell>{data.recipientCount}</Table.Cell>
          <Table.Cell>{calculateCost(data.recipientCount)}</Table.Cell>
          <Table.Cell style={{ color: resolveMailoutStatusColor(data.mailoutStatus) }}>
            <FontAwesomeIcon icon={resolveMailoutStatusIcon(data.mailoutStatus)} style={{ marginRight: '.5em' }} />
            {resolveMailoutStatus(data.mailoutStatus)}
          </Table.Cell>
          <Table.Cell>{formatDate(data.created)}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

ItemTable.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ItemTable;
