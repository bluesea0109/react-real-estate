import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Search } from 'semantic-ui-react';
import styled from 'styled-components';
import { Button, Icon, Modal } from './Base';
import * as brandColors from './utils/brandColors';
import { debounce } from 'lodash';
import auth from '../services/auth';
import { getAdsTool } from '../store/modules/ads/actions';
import { useDispatch } from 'react-redux';

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

const ListingModal = ({ open, setOpen, selectedAddress, setSelectedAddress, adType }) => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [postalsOrCities, setPostalsOrCities] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const adstoolQS = useSelector(store => store.ads?.adsTool?.adProduct.qs);
  const adsToolUrl = useSelector(store => store.ads?.adsTool?.adProduct.url);

  useEffect(() => {
    const newFilteredResults = results?.map(res => {
      return {
        title:
          postalsOrCities === 'postals'
            ? `${res.city} ${res.state} ${res.postal}`
            : postalsOrCities === 'cities'
            ? `${res.city} ${res.state}`
            : null,
      };
    });
    setFilteredResults(newFilteredResults);
  }, [results, postalsOrCities]);

  const getListings = async value => {
    if (!value) return [];
    const path = `/api/user/places?autocomplete=${value}`;
    const headers = {};
    const accessToken = await auth.getAccessToken();
    headers['authorization'] = `Bearer ${accessToken}`;
    const searchRes = await fetch(path, { headers, method: 'get', credentials: 'include' });
    const data = await searchRes.json();
    if (data.postals.length > 0) {
      setPostalsOrCities('postals');
      return data.postals;
    }
    if (data.cities.length > 0) {
      setPostalsOrCities('cities');
      return data.cities;
    }
    setPostalsOrCities('');
    return [];
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
    results.forEach(result => {
      if (
        postalsOrCities === 'postals' &&
        `${result.city} ${result.state} ${result.postal}` === e.target.innerHTML
      ) {
        setSelectedAddress(result);
        setSearchValue(`${result.city} ${result.state} ${result.postal}`);
      }
      if (postalsOrCities === 'cities' && `${result.city} ${result.state}` === e.target.innerHTML) {
        setSelectedAddress(result);
        setSearchValue(`${result.city} ${result.state}`);
      }
    });
  };

  let createQS = item => {
    return Object.keys(item)
      .map(param => `${param}=${item[param]}`)
      .join('&');
  };

  useEffect(() => {
    if (adstoolQS) {
      const adsQS = createQS(adstoolQS);
      const finalUrl = adsToolUrl.concat(`?adType=homeValue&${adsQS}&mlsAddress=${searchValue}`);

      finalUrl.replace(/ /g, '%20');
      finalUrl.replace(/#/g, '%23');
      window.location = finalUrl;
    }
  }, [adstoolQS, adsToolUrl, adType, selectedAddress, searchValue]);

  const launchAdTool = () => {
    dispatch(getAdsTool({ mlsAddress: selectedAddress }));
    setOpen(false);
  };

  return (
    <StyledModal open={open}>
      <div className="modal-content">
        <Icon name="close" onClick={() => setOpen(false)} />
        <Header>Home Value Ad Target Location</Header>
        <p>Select a City or ZIP for the home value ad's target area</p>
        <div className="search-container">
          <SearchBar
            loading={isLoading}
            onSearchChange={(e, { value }) => {
              setSearchValue(value);
              setIsLoading(true);
              handleSearchChange(value);
            }}
            fluid
            placeholder="Search by city or ZIP"
            value={searchValue}
            results={filteredResults}
            noResultsMessage={isLoading ? 'Loading' : 'No results found'}
            onResultSelect={handleListingSelect}
          />
          <CreateButton primary disabled={!selectedAddress} onClick={launchAdTool}>
            Create Ad
          </CreateButton>
        </div>
      </div>
    </StyledModal>
  );
};

export default ListingModal;
