import React from 'react';
import { Image, Table } from '../Base';
import styled from 'styled-components';

const Tooltip = styled.div`
  &[data-position='top right'][data-tooltip]:after {
    border-radius: 0px;
    background: #343434;
    bottom: 100%;
    right: 30%;
  }

  &[data-inverted][data-position~='top'][data-tooltip]:before {
    background: #343434;
  }

  &[data-position='top right'][data-tooltip]:before {
    bottom: 100%;
    right: 50%;
  }
  & p {
    width: 256px;
    padding-top: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ImageStyles = {
  width: '100%',
  maxWidth: '60px',
  cursor: 'pointer',
};

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
      {/* {TableModal()} */}
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
          <Tooltip data-tooltip="Click to expand" data-position="top right" data-inverted="">
            <Image
              onClick={() => {
                setPreviewUrl([dest?.frontResourceUrl, dest?.backResourceUrl]);
                setShowTableModal(true);
              }}
              style={ImageStyles}
              src={dest?.frontResourceUrl}
            />
          </Tooltip>
        )}
      </Table.Cell>
    </Table.Row>
  );
};
