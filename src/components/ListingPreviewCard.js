import React from 'react';
import styled from 'styled-components';
import { Icon } from './Base';
import * as brandColors from './utils/brandColors';
import Dinero from 'dinero.js';

const PreviewCard = styled.div`
  width: 100%;
  padding: 1rem;
  margin-top: 2rem;
  box-shadow: 0 2px 8px rgba(213, 213, 213, 0.5);
  border-radius: 8px;
  font-size: 12px;
  text-align: left;
  & > .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  & > .content {
    display: grid;
    grid-template-columns: 100px 1fr;
    grid-template-rows: minmax(75px, auto) auto;
    gap: 0.5rem 1rem;
    & .listing-img > img {
      height: 75px;
      width: 100%;
      object-fit: contain;
      object-position: center top;
    }
    & .details {
      & p:first-child {
        font-size: 14px;
        font-weight: 600;
      }
    }
    & .mls-credit {
      grid-column: span 2;
      color: #b8b8b8;
      font-size: 10px;
    }
  }
`;

const DeleteIcon = styled.div`
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  & > i {
    margin: 0;
  }
  &:hover {
    background-color: ${brandColors.lightGreyHover};
  }
`;

export default function ListingPreviewCard({ listing, setListing }) {
  const listingData = listing.listing;
  return (
    <PreviewCard>
      <div className="header">
        <span>{`Listed by ${listingData.listAgentName}`}</span>
        <DeleteIcon>
          <Icon name="trash alternate outline" onClick={() => setListing(null)} />
        </DeleteIcon>
      </div>
      <div className="content">
        <div className="listing-img">
          <img src={listingData.photos[0].url} alt="listing" />
        </div>
        <div className="details">
          <p>{listingData.streetAddress}</p>
          <p>{`${listingData.city}, ${listingData.state} ${listingData.postalCode}`}</p>
          <p>{Dinero({ amount: listingData.price * 100 }).toFormat('$0,0')}</p>
          <p>{`${listingData.bedrooms} beds | ${listingData.fullBaths} baths | ${listingData.squareFeet} sqft`}</p>
        </div>
        <span className="mls-credit">{`Courtesy of ${listingData.originatingSystemName}`}</span>
      </div>
    </PreviewCard>
  );
}
