import React from 'react';
import { Image, Table } from '../Base';

export const TableCampaign = ({ renderDestinations, TableModal }) => (
  <Table className="six wide tablet six wide computer column">
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Address</Table.HeaderCell>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Delivery Date</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell>CTA count</Table.HeaderCell>
        <Table.HeaderCell>CTA date</Table.HeaderCell>
        <Table.HeaderCell>Preview</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {renderDestinations()}
      {TableModal()}
    </Table.Body>
  </Table>
);

export const TableRow = ({
  dest,
  setPreviewUrl,
  setShowTableModal,
  status,
  ctaInteractions,
  ctaDate,
}) => {
  return (
    <Table.Row>
      <Table.Cell>{dest?.deliveryLine}</Table.Cell>
      <Table.Cell>{dest?.name}</Table.Cell>
      <Table.Cell>{dest?.expected_delivery_date}</Table.Cell>
      <Table.Cell>{status}</Table.Cell>
      <Table.Cell>{ctaInteractions}</Table.Cell>
      <Table.Cell>{ctaDate}</Table.Cell>
      <Table.Cell>
        {dest?.frontResourceUrl && (
          <Image
            onClick={() => {
              setPreviewUrl([dest?.frontResourceUrl, dest?.backResourceUrl]);
              setShowTableModal(true);
            }}
            style={{ width: '100%', maxWidth: '60px' }}
            src={dest?.frontResourceUrl}
          />
        )}
      </Table.Cell>
    </Table.Row>
  );
};
