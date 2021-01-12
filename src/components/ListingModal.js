import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Search } from 'semantic-ui-react';
import styled from 'styled-components';
import { Button, Icon, Modal } from './Base';
import * as brandColors from './utils/brandColors';
import { debounce } from 'lodash';
import auth from '../services/auth';
import ListingPreviewCard from './ListingPreviewCard';
import { addCampaignStart } from '../store/modules/mailouts/actions';
import { useDispatch } from 'react-redux';
import { postcardDimensions } from './utils/utils';

const StyledModal = styled(Modal)`
  &&&& {
    position: relative;
    color: ${brandColors.grey03};
    padding: 4rem;
    min-height: 450px;
    & .modal-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    & .search-container {
      width: 320px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    & .close.icon {
      position: absolute;
      margin: 0;
      padding: 0;
      width: 1rem;
      height: 1rem;
      color: ${brandColors.grey03};
      top: 2rem;
      right: 2rem;
    }
  }
`;

const Header = styled.h3`
  padding: 1rem;
`;

const SearchBar = styled(Search)`
  &&& {
    & .input {
      border-radius: 0;
      margin: 2rem 0;
      & input {
        background-color: #f4f5f5;
        border-radius: 0;
        border: none;
        width: 320px;
      }
    }
    & .results {
      top: 4.5rem;
      padding: 0.5rem 0;
      max-height: 240px;
      overflow-y: auto;
      & .result {
        border-bottom: none;
        padding: 0.5rem 1rem;
        &:hover {
          background-color: ${brandColors.lightGreyHover};
        }
        & .title {
          font-size: 14px;
          font-weight: 400;
          color: ${brandColors.grey03};
        }
      }
    }
  }
`;

const CreateButton = styled(Button)`
  &&&& {
    width: 100%;
    margin: 1rem 0;
  }
`;

const ListingModal = ({ open, setOpen, selectedListing, selectedSize, setSelectedListing }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    const newFilteredResults = results?.map(res => {
      return { title: res.fieldValues.fullAddress };
    });
    setFilteredResults(newFilteredResults);
  }, [results]);

  const getListings = async value => {
    if (!value) return [];
    const path = `/api/user/listing/autocomplete?prefix=${value}`;
    const headers = {};
    const accessToken = await auth.getAccessToken();
    headers['authorization'] = `Bearer ${accessToken}`;
    const searchRes = await fetch(path, { headers, method: 'get', credentials: 'include' });
    const data = await searchRes.json();
    return data.results;
  };

  const handleSearchChange = useCallback(
    debounce(async value => {
      const newResults = await getListings(value);
      setResults(newResults);
      setIsLoading(false);
    }, 1000),
    []
  );

  const handleListingSelect = e => {
    setSelectedListing(
      results.find(result => result.fieldValues.fullAddress === e.target.innerHTML)
    );
  };

  const createMLSCampaign = () => {
    let mlsNum = selectedListing?.listing?.mlsNum;
    let size = postcardDimensions(selectedSize);
    if (!mlsNum?.length || !size) return;
    dispatch(addCampaignStart({ mlsNum: mlsNum, postcardSize: size }));
    return history.push('/postcards');
  };

  return (
    <StyledModal open={open}>
      <div className="modal-content">
        <Icon name="close" onClick={() => setOpen(false)} />
        <Header>Import Listing Data</Header>
        <p>Search for listings to populate your template with dynamic data</p>
        <div className="search-container">
          {selectedListing ? (
            <ListingPreviewCard listing={selectedListing} setListing={setSelectedListing} />
          ) : (
            <SearchBar
              loading={isLoading}
              onSearchChange={(e, { value }) => {
                setSearchValue(value);
                setIsLoading(true);
                handleSearchChange(value);
              }}
              fluid
              placeholder="Search by address or MLS number"
              value={searchValue}
              results={filteredResults}
              noResultsMessage={isLoading ? 'Loading' : 'No results found'}
              onResultSelect={handleListingSelect}
            />
          )}
          <CreateButton primary disabled={!selectedListing} onClick={createMLSCampaign}>
            Create Postcard
          </CreateButton>
        </div>
      </div>
    </StyledModal>
  );
};

export default ListingModal;
