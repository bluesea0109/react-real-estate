import { cloneDeep } from 'lodash';
import auth from '../../services/auth';
import api from '../../services/api';
import { subMonths } from 'date-fns';

import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, Fragment } from 'react';
import { Checkbox, Dropdown, Form, Header, Label, List, Message, Select } from 'semantic-ui-react';

import {
  ContentBottomHeaderLayout,
  ContentTopHeaderLayout,
  ItemHeaderLayout,
  ItemHeaderMenuLayout,
} from '../../layouts';
import { tag } from '../utils/utils';
import { Button, Icon, Menu, Page, Segment, Snackbar } from '../Base';
import { resolveLabelStatus } from '../MailoutListItem/utils/helpers';
import PageTitleHeader from '../PageTitleHeader';
import Loading from '../Loading';
import PolygonGoogleMapsCore from './PolygonGoogleMaps/PolygonGoogleMapsCore';
import { useIsMobile } from '../Hooks/useIsMobile';
import styled from 'styled-components';
import * as brandColors from '../utils/brandColors';
import { getFilteredMailoutsPending } from '../../store/modules/mailouts/actions';
import { getMailoutSuccess } from '../../store/modules/mailout/actions';

const CopyDestContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  padding-top: 0.5rem;
  & > p {
    color: ${brandColors.grey02};
    padding: 0.5rem 0;
    font-weight: 600;
  }
`;

const CopyDestDropdown = styled(Dropdown)`
  &&& {
    min-width: 300px;
  }
  && .visible.menu.transition {
    min-width: 100% !important;
    max-height: 50vh;
  }
`;

const SendToSourceAddress = styled.div`
  padding-bottom: 10px;
`;

const propertyTypeOptions = [
  { text: 'Single-Family', key: 'Single-Family', value: 'Single-Family' },
  { text: 'Condo', key: 'Condo', value: 'Condo' },
  { text: 'Apartment', key: 'Apartment', value: 'Apartment' },
  { text: 'Cooperative (Co-op)', key: 'Cooperative (Co-op)', value: 'Cooperative (Co-op)' },
  { text: 'Duplex', key: 'Duplex', value: 'Duplex' },
  { text: 'Multi-Family', key: 'Multi-Family', value: 'Multi-Family' },
  { text: 'Mobile/Manufactured', key: 'Mobile/Manufactured', value: 'Mobile/Manufactured' },
  { text: 'Miscellaneous', key: 'Miscellaneous', value: 'Miscellaneous' },
  { text: 'Quadruplex', key: 'Quadruplex', value: 'Quadruplex' },
  { text: 'Timeshare', key: 'Timeshare', value: 'Timeshare' },
  { text: 'Triplex', key: 'Triplex', value: 'Triplex' },
  { text: 'Vacant', key: 'Vacant', value: 'Vacant' },
];

const saleDateOptions = [
  { text: '1 month ago', value: 1 },
  { text: '3 months ago', value: 3 },
  { text: '6 months ago', value: 6 },
  { text: '9 months ago', value: 9 },
  { text: '1 year ago', value: 12 },
  { text: '1.5 years ago', value: 18 },
  { text: '2 years ago', value: 24 },
  { text: '3 years ago', value: 36 },
  { text: '4 years ago', value: 48 },
  { text: '5 years ago', value: 60 },
  { text: '6 years ago', value: 72 },
  { text: '7 years ago', value: 84 },
  { text: '8 years ago', value: 96 },
  { text: '9 years ago', value: 108 },
  { text: '10 years ago', value: 120 },

  { text: '15 years ago', value: 180 },
  { text: '20 years ago', value: 240 },
  { text: '25 years ago', value: 300 },
  { text: '30 years ago', value: 360 },
  { text: '35 years ago', value: 420 },
];

const EditDestinationsForm = ({ mailoutDetails, handleBackClick }) => {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();

  const campaignList = useSelector(store => store.mailouts?.filteredList);
  const [campaignOptions, setCampaignOptions] = useState(null);
  const [copyCampaign, setCopyCampaign] = useState(null);
  const [prevCopyCampaign, setPrevCopyCampaign] = useState(null);
  const campaignsPending = useSelector(store => store.mailouts?.filteredPending);
  const peerId = useSelector(store => store.peer.peerId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const currentListingStatus = mailoutDetails?.listingStatus;
  const isCampaign = mailoutDetails?.subtype === 'campaign';
  const isGeneralCampaign =
    mailoutDetails?.publishedTags?.includes('general') ||
    mailoutDetails?.publishedTags?.includes('sphere') ||
    mailoutDetails?.intentPath?.includes('sphere');
  const isCalculationDeferred = mailoutDetails?.mailoutStatus === 'calculation-deferred';

  const [destinationsOptionsMode, setDestinationsOptionsMode] = useState(
    mailoutDetails?.destinationsOptions?.copy?.mailoutId
      ? 'copy'
      : (mailoutDetails.destinationsOptions?.mode || isCampaign) && !isGeneralCampaign
      ? 'manual'
      : isGeneralCampaign
      ? 'userUploaded'
      : 'ai'
  );

  const [saveDetails, setSaveDetails] = useState(
    mailoutDetails.destinationsOptions?.mode || isCampaign
      ? { destinationsOptionsMode: 'manual', ready: false }
      : { destinationsOptionsMode: 'ai', ready: true }
  );

  const [numberOfDestinations, setNumberOfDestinations] = useState(mailoutDetails.mailoutSize);

  const [csvFile, setCsvFile] = useState(0);
  const [isCsvBrivityFormat, setIsCsvBrivityFormat] = useState(1);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [firstNameColumn, setFirstNameColumn] = useState(null);
  const [lastNameColumn, setLastNameColumn] = useState(null);
  const [deliveryLineColumn, setDeliveryLineColumn] = useState(null);
  const [cityColumn, setCityColumn] = useState(null);
  const [stateColumn, setStateColumn] = useState(null);
  const [zipColumn, setZipColumn] = useState(null);
  const [currentResident, setCurrentResident] = useState(true);

  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [searchPropertyTypes, setSearchPropertyTypes] = useState([]);
  const [searchBedsMin, setSearchBedsMin] = useState('');
  const [searchBedsMax, setSearchBedsMax] = useState('');
  const [searchBathsMin, setSearchBathsMin] = useState('');
  const [searchBathsMax, setSearchBathsMax] = useState('');
  const [searchSizeMin, setSearchSizeMin] = useState('');
  const [searchSizeMax, setSearchSizeMax] = useState('');
  const [searchSaleDateMin, setSearchSaleDateMin] = useState('');
  const [searchSaleDateMax, setSearchSaleDateMax] = useState('');
  const [searchSalePriceMin, setSearchSalePriceMin] = useState('');
  const [searchSalePriceMax, setSearchSalePriceMax] = useState('');
  const [runningSearch, setRunningSearch] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [sendToSourceAddresses, setSendToSourceAddresses] = useState(false);

  useEffect(() => {
    setSendToSourceAddresses(mailoutDetails?.destinationsOptions?.sendToSourceAddresses || false);
  }, [mailoutDetails, destinationsOptionsMode]);

  useEffect(() => {
    if (destinationsOptionsMode === 'copy') {
      setSaveDetails({ destinationsOptionsMode: 'copy', ready: !!copyCampaign });
      return;
    }
    let existingModeAi = true;
    if (mailoutDetails.destinationsOptions?.mode !== 'ai') existingModeAi = false;
    if (!existingModeAi && destinationsOptionsMode === 'ai') {
      return setSaveDetails({
        destinationsOptionsMode: 'ai',
        ready: true,
      });
    }
    if (existingModeAi && numberOfDestinations !== mailoutDetails.mailoutSize) {
      return setSaveDetails({
        destinationsOptionsMode: 'ai',
        ready: true,
      });
    }
  }, [destinationsOptionsMode, numberOfDestinations, copyCampaign]); // eslint-disable-line

  // ** clear the search results when an existing search is edited
  useEffect(() => {
    if (searchResults) setSearchResults(null);
    // eslint-disable-next-line
  }, [
    polygonCoordinates,
    searchPropertyTypes,
    searchBedsMin,
    searchBedsMax,
    searchBathsMin,
    searchBathsMax,
    searchSizeMin,
    searchSizeMax,
    searchSalePriceMin,
    searchSalePriceMax,
  ]);

  // ** only set saveDetails to ready when all the required columns are filled out
  useEffect(() => {
    if (destinationsOptionsMode !== 'userUploaded') return;
    let ready = true;
    if (deliveryLineColumn === null) ready = false;
    if (cityColumn === null) ready = false;
    if (stateColumn === null) ready = false;
    if (zipColumn === null) ready = false;
    if (!ready) setSaveDetails({ destinationsOptionsMode: 'userUploaded', ready: false });
    else setSaveDetails({ destinationsOptionsMode: 'userUploaded', ready: true });
  }, [destinationsOptionsMode, deliveryLineColumn, cityColumn, stateColumn, zipColumn]);

  useEffect(() => {
    if (typeof firstNameColumn === 'number' || typeof lastNameColumn === 'number') {
      setCurrentResident(false);
    } else {
      setCurrentResident(true);
    }
  }, [firstNameColumn, lastNameColumn]);

  // Load the campaign list on page load
  useEffect(() => {
    dispatch(getFilteredMailoutsPending({ sortValue: 'createdDateDesc' }));
    // eslint-disable-next-line
  }, []);

  // Set the dropdown options
  useEffect(() => {
    const newOptions = [];
    campaignList.forEach(campaign => {
      newOptions.push({
        key: campaign._id,
        value: campaign._id,
        text:
          campaign.name ||
          `${campaign.details?.displayAddress}${campaign.mlsNum ? ` (${campaign.mlsNum})` : ''}`,
      });
    });
    setCampaignOptions(newOptions);
    setPrevCopyCampaign(
      newOptions.find(option => option.key === mailoutDetails?.destinationsOptions?.copy?.mailoutId)
    );
  }, [campaignList, mailoutDetails]);

  const handleDestinationSearch = async () => {
    if (!polygonCoordinates) return;
    setRunningSearch(true);
    setSearchResults(null);
    setSaveDetails({ destinationsOptionsMode: 'manual', ready: false });

    let coordinates = cloneDeep(polygonCoordinates);
    let first = cloneDeep(coordinates[0]);
    coordinates.push(first);
    let polygon = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates],
      },
    };

    let criteria = {};
    if (searchPropertyTypes && searchPropertyTypes.length)
      criteria.propertyTypes = searchPropertyTypes;
    if (searchBedsMin !== '') criteria.bedsMin = Number(searchBedsMin);
    if (searchBedsMax !== '') criteria.bedsMax = Number(searchBedsMax);
    if (searchBathsMin !== '') criteria.bathsMin = Number(searchBathsMin);
    if (searchBathsMax !== '') criteria.bathsMax = Number(searchBathsMax);
    if (searchSizeMin !== '') criteria.sizeMin = Number(searchSizeMin);
    if (searchSizeMax !== '') criteria.sizeMax = Number(searchSizeMax);
    if (searchSalePriceMin !== '') criteria.salePriceMin = Number(searchSalePriceMin);
    if (searchSalePriceMax !== '') criteria.salePriceMax = Number(searchSalePriceMax);
    if (searchSaleDateMin) {
      let minDate = subMonths(Date.now(), Number(searchSaleDateMin));
      criteria.saleDateMin = minDate.getTime();
    }
    if (searchSaleDateMax) {
      let maxDate = subMonths(Date.now(), Number(searchSaleDateMax));
      criteria.saleDateMax = maxDate.getTime();
    }

    let path = `/api/user/mailout/${mailoutDetails._id}/edit/destinationOptions/search/byPolygon`;
    if (peerId)
      path = `/api/user/peer/${peerId}/mailout/${mailoutDetails._id}/edit/destinationOptions/search/byPolygon`;
    let body = JSON.stringify({ polygon, criteria });
    const headers = {};
    const accessToken = await auth.getAccessToken();
    headers['authorization'] = `Bearer ${accessToken}`;
    const response = await fetch(path, { headers, method: 'post', body, credentials: 'include' });
    const results = await api.handleResponse(response);
    setRunningSearch(false);

    if (
      results.resultCount >= results.userMailoutSize.mailoutSizeMin &&
      results.resultCount <= results.userMailoutSize.mailoutSizeMax
    ) {
      results.withinBounds = true;
    }
    if (results.resultCount < results.userMailoutSize.mailoutSizeMin) {
      results.withinBounds = false;
      results.underfilled = true;
      results.underfilledBy = results.userMailoutSize.mailoutSizeMin - results.resultCount;
      results.overfilled = false;
    }
    if (results.resultCount > results.userMailoutSize.mailoutSizeMax) {
      results.withinBounds = false;
      results.underfilled = false;
      results.overfilled = true;
      results.overfilledBy = results.resultCount - results.userMailoutSize.mailoutSizeMax;
    }
    setSearchResults(results);
    setSaveDetails({ destinationsOptionsMode: 'manual', ready: true });
  };

  const handleSubmitClick = async () => {
    setSaving(true);
    if (!saveDetails || !saveDetails.ready) {
      // somehow got here, but not ready
      setSaving(false);
      return;
    }
    try {
      if (saveDetails.destinationsOptionsMode === 'copy') {
        if (!copyCampaign) throw new Error({ message: 'No campaign selected' });
        let path = `/api/user/mailout/${mailoutDetails._id}/edit/destinationOptions/copy`;
        if (peerId)
          path = `/api/user/peer/${peerId}/mailout/${mailoutDetails._id}/edit/destinationOptions/copy`;
        path += `?sendToSourceAddresses=${sendToSourceAddresses}`;
        const body = JSON.stringify({ mailoutId: copyCampaign });
        const headers = {};
        const accessToken = await auth.getAccessToken();
        headers['authorization'] = `Bearer ${accessToken}`;
        const response = await fetch(path, {
          headers,
          method: 'post',
          body,
          credentials: 'include',
        });
        await api.handleResponse(response);
      }
      if (saveDetails.destinationsOptionsMode === 'ai') {
        let path = `/api/user/mailout/${mailoutDetails._id}/edit/mailoutSize`;
        if (peerId)
          path = `/api/user/peer/${peerId}/mailout/${mailoutDetails._id}/edit/mailoutSize`;
        path += `?sendToSourceAddresses=${sendToSourceAddresses}`;
        const body = JSON.stringify({ mailoutSize: numberOfDestinations });
        const headers = {};
        const accessToken = await auth.getAccessToken();
        headers['authorization'] = `Bearer ${accessToken}`;
        const response = await fetch(path, {
          headers,
          method: 'put',
          body,
          credentials: 'include',
        });
        await api.handleResponse(response);
      }
      if (saveDetails.destinationsOptionsMode === 'manual') {
        let searchTimestampId = searchResults.searchTimestampId;
        if (!searchTimestampId) return;
        let path = `/api/user/mailout/${mailoutDetails._id}/edit/destinationOptions/search/${searchTimestampId}/use`;
        if (peerId)
          path = `/api/user/peer/${peerId}/mailout/${mailoutDetails._id}/edit/destinationOptions/search/${searchTimestampId}/use`;
        path += `?sendToSourceAddresses=${sendToSourceAddresses}`;
        const headers = {};
        const accessToken = await auth.getAccessToken();
        headers['authorization'] = `Bearer ${accessToken}`;
        const response = await fetch(path, { headers, method: 'post', credentials: 'include' });
        await api.handleResponse(response);
      }
      if (saveDetails.destinationsOptionsMode === 'userUploaded') {
        if (!csvFile) return handleBackClick();
        let path = `/api/user/mailout/${mailoutDetails._id}/edit/destinationOptions/csv`;
        if (peerId)
          path = `/api/user/peer/${peerId}/mailout/${mailoutDetails._id}/edit/destinationOptions/csv`;
        path += `?sendToSourceAddresses=${sendToSourceAddresses}`;
        const formData = new FormData();
        formData.append('destinations', csvFile);
        if (!isCsvBrivityFormat) {
          if (typeof firstNameColumn === 'number')
            formData.append('firstNameColumn', firstNameColumn);
          if (typeof lastNameColumn === 'number') formData.append('lastNameColumn', lastNameColumn);
          formData.append('deliveryLineColumn', deliveryLineColumn);
          formData.append('cityColumn', cityColumn);
          formData.append('stateColumn', stateColumn);
          formData.append('zipColumn', zipColumn);
        } else {
          formData.append('brivityFormat', true);
        }

        const headers = {};
        const accessToken = await auth.getAccessToken();
        headers['authorization'] = `Bearer ${accessToken}`;
        const response = await fetch(path, {
          headers,
          method: 'post',
          body: formData,
          credentials: 'include',
        });
        const data = await api.handleResponse(response);
        dispatch(getMailoutSuccess(data?.mailout));
      }
      handleBackClick();
    } catch (e) {
      console.error(e);
      setSaving(false);
      setError(e.message);
    }
  };

  // https://stackoverflow.com/questions/41610811/react-js-how-to-send-a-multipart-form-data-to-server
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = function(e) {
      let text = reader.result;
      let firstLine = text.split('\n').shift();
      let headers = firstLine.split(',');

      let brivityFormat = false;
      let found = {
        envelopeSalutation: false,
        firstNameColumn: false,
        lastNameColumn: false,
        deliveryLineColumn: false,
        cityColumn: false,
        stateColumn: false,
        zipColumn: false,
      };
      headers.forEach((h, i) => {
        if (h === 'First Name') found.firstNameColumn = true;
        if (h === 'Last Name') found.lastNameColumn = true;
        if (h === 'Envelope Salutation') found.envelopeSalutation = true;
        if (h === 'Home Street Address') found.deliveryLineColumn = true;
        if (h === 'Home City') found.cityColumn = true;
        if (h === 'Home State/Province') found.stateColumn = true;
        if (h === 'Home Postal Code') found.zipColumn = true;
        if (h === 'Mailing Street Address') found.deliveryLineColumn = true;
        if (h === 'Mailing City') found.cityColumn = true;
        if (h === 'Mailing State/Province') found.stateColumn = true;
        if (h === 'Mailing Postal Code') found.zipColumn = true;
      });
      if (found.deliveryLineColumn && found.cityColumn && found.stateColumn && found.zipColumn)
        brivityFormat = true;

      if (brivityFormat) {
        setIsCsvBrivityFormat(1);
        setSaveDetails({ destinationsOptionsMode: 'userUploaded', ready: true });
      } else {
        setIsCsvBrivityFormat(0);
        setSaveDetails({ destinationsOptionsMode: 'userUploaded', ready: false });
        const headerValues = [];
        headers.forEach((header, i) => {
          headerValues.push({
            key: i,
            text: header,
            value: i,
          });
        });
        setCsvHeaders(headerValues);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <Menu borderless fluid secondary>
            <Menu.Item>
              <Header as="h3">Edit Destinations</Header>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <Button
                  primary
                  inverted
                  onClick={() => handleBackClick()}
                  loading={saving}
                  disabled={saving}
                >
                  <Icon name="left arrow" />
                  <span>Campaign Details</span>
                </Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>

      {error && <Snackbar error>{error}</Snackbar>}

      <Segment>
        <ContentBottomHeaderLayout>
          <ItemHeaderLayout attached="top" block>
            <span style={{ gridArea: 'label' }}>
              <Label
                size="large"
                color={resolveLabelStatus(currentListingStatus)}
                ribbon
                style={{ textTransform: 'capitalize', top: '-0.9em', left: '-2.7em' }}
              >
                {currentListingStatus}
              </Label>
            </span>
            <span style={{ gridArea: 'address', alignSelf: 'center' }}>
              <Header as="h3">
                {mailoutDetails.name || mailoutDetails?.details?.displayAddress}
              </Header>
            </span>

            <ItemHeaderMenuLayout>
              <span>
                <Button
                  primary
                  type="submit"
                  onClick={handleSubmitClick}
                  loading={saving}
                  disabled={
                    !isCalculationDeferred &&
                    !(
                      saveDetails.ready &&
                      saveDetails.destinationsOptionsMode === destinationsOptionsMode
                    )
                  }
                >
                  Save
                </Button>
              </span>
            </ItemHeaderMenuLayout>
          </ItemHeaderLayout>

          {saving && <Loading message="Saving ..." />}
        </ContentBottomHeaderLayout>

        <Segment
          basic
          padded
          className={isMobile ? null : 'primary-grid-container'}
          style={isMobile ? {} : { padding: 10 }}
        ></Segment>
        <Form>
          <Header as="h4">How should destinations be selected?</Header>
          <List horizontal id="chooseDestinationsMethod">
            {!isCampaign && (
              <List.Item>
                <Checkbox
                  radio
                  label="Automatically"
                  name="checkboxRadioGroup"
                  value="this"
                  checked={destinationsOptionsMode === 'ai'}
                  onClick={() => {
                    setDestinationsOptionsMode('ai');
                  }}
                />
              </List.Item>
            )}
            <List.Item>
              <Checkbox
                radio
                label="Via map search"
                name="checkboxRadioGroup"
                value="that"
                checked={destinationsOptionsMode === 'manual'}
                onClick={() => {
                  setDestinationsOptionsMode('manual');
                }}
              />
            </List.Item>
            <List.Item>
              <Checkbox
                radio
                label="From a CSV file"
                name="checkboxRadioGroup"
                value="that"
                checked={destinationsOptionsMode === 'userUploaded'}
                onClick={() => {
                  setDestinationsOptionsMode('userUploaded');
                }}
              />
            </List.Item>
            <List.Item>
              <Checkbox
                radio
                label="Copy a previous campaign"
                name="checkboxRadioGroup"
                value="that"
                checked={destinationsOptionsMode === 'copy'}
                onClick={() => {
                  setDestinationsOptionsMode('copy');
                }}
              />
            </List.Item>
          </List>
          <SendToSourceAddress>
            <Checkbox
              label="Send to source address(es)"
              name="sendToSourceAddresses"
              checked={sendToSourceAddresses}
              onClick={() => {
                setSendToSourceAddresses(!sendToSourceAddresses);
              }}
            />
          </SendToSourceAddress>
          {destinationsOptionsMode === 'ai' && (
            <Form.Field
              label="Number of destinations"
              control="input"
              width={3}
              min={0}
              value={numberOfDestinations}
              onChange={(e, input) => {
                if (e.target.value.match(/[^0-9]/g)) return;
                setNumberOfDestinations(e.target.value);
              }}
            />
          )}
          {destinationsOptionsMode === 'manual' && (
            <div className="ui fluid">
              <div>Click "Draw" to draw a custom destination area on the map.</div>
              <PolygonGoogleMapsCore
                polygonCoordinates={polygonCoordinates}
                setPolygonCoordinates={setPolygonCoordinates}
                data={mailoutDetails}
              />
              {!!polygonCoordinates.length && (
                <div id="mapSearchFields">
                  <Form.Field>
                    <label>Property Types</label>
                    <Dropdown
                      options={propertyTypeOptions}
                      selection
                      clearable
                      multiple
                      value={searchPropertyTypes}
                      onChange={(e, input) => setSearchPropertyTypes(input.value)}
                    />
                  </Form.Field>
                  <Form.Group widths="equal">
                    <Form.Field
                      label="Min Beds"
                      control="input"
                      min={0}
                      value={searchBedsMin}
                      onChange={(e, input) => {
                        if (e.target.value.match(/[^0-9]/g)) return;
                        setSearchBedsMin(e.target.value);
                      }}
                    />
                    <Form.Field
                      label="Max Beds"
                      control="input"
                      min={0}
                      value={searchBedsMax}
                      onChange={(e, input) => {
                        if (e.target.value.match(/[^0-9]/g)) return;
                        setSearchBedsMax(e.target.value);
                      }}
                    />
                    <Form.Field
                      label="Min Baths"
                      control="input"
                      min={0}
                      value={searchBathsMin}
                      onChange={(e, input) => {
                        if (e.target.value.match(/[^0-9]/g)) return;
                        setSearchBathsMin(e.target.value);
                      }}
                    />
                    <Form.Field
                      label="Max Baths"
                      control="input"
                      min={0}
                      value={searchBathsMax}
                      onChange={(e, input) => {
                        if (e.target.value.match(/[^0-9]/g)) return;
                        setSearchBathsMax(e.target.value);
                      }}
                    />
                    <Form.Field
                      label="Min Sqft"
                      control="input"
                      min={0}
                      value={searchSizeMin}
                      onChange={(e, input) => {
                        if (e.target.value.match(/[^0-9]/g)) return;
                        setSearchSizeMin(e.target.value);
                      }}
                    />
                    <Form.Field
                      label="Max Sqft"
                      control="input"
                      min={0}
                      value={searchSizeMax}
                      onChange={(e, input) => {
                        if (e.target.value.match(/[^0-9]/g)) return;
                        setSearchSizeMax(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Field
                      label="Min Last Sale Price"
                      control="input"
                      min={0}
                      value={searchSalePriceMin}
                      onChange={(e, input) => {
                        if (e.target.value.match(/[^0-9]/g)) return;
                        setSearchSalePriceMin(e.target.value);
                      }}
                    />
                    <Form.Field
                      label="Max Last Sale Price"
                      control="input"
                      min={0}
                      value={searchSalePriceMax}
                      onChange={(e, input) => {
                        if (e.target.value.match(/[^0-9]/g)) return;
                        setSearchSalePriceMax(e.target.value);
                      }}
                    />
                    <Form.Field
                      control={Select}
                      clearable={true}
                      label="Sale Date Is Newer Than"
                      options={saleDateOptions}
                      placeholder="Choose when..."
                      onChange={(e, input) => {
                        setSearchSaleDateMin(input.value);
                      }}
                    />
                    <Form.Field
                      control={Select}
                      clearable={true}
                      label="Sale Date Is Older Than"
                      options={saleDateOptions}
                      placeholder="Choose when..."
                      onChange={(e, input) => {
                        setSearchSaleDateMax(input.value);
                      }}
                    />
                  </Form.Group>

                  <div id="searchBoxGrid">
                    <div id="seachButtonHolder">
                      <Button
                        primary
                        onClick={() => handleDestinationSearch()}
                        loading={runningSearch}
                      >
                        Search
                      </Button>
                    </div>

                    {searchResults && (
                      <div id="searchResultMessages">
                        <h3 id="searchResultsCount">
                          {searchResults.resultCount} Destinations Found
                        </h3>
                        {searchResults.withinBounds && (
                          <Message success visible={true}>
                            <Message.Header>Ready to Save</Message.Header>
                            <p>Click 'Save' to accept these destinations.</p>
                          </Message>
                        )}
                        {searchResults.underfilled && (
                          <Message warning visible={true}>
                            <Message.Header>Under campaign budget</Message.Header>
                            <p>
                              You are {searchResults.underfilledBy} short of your minimum budget of{' '}
                              {searchResults.userMailoutSize.mailoutSizeMin}. Choose an action:
                            </p>
                            <Message.List>
                              <Message.Item>
                                Widen your search parameters to find more,
                              </Message.Item>
                              <Message.Item>
                                Click 'Save' to accept this limited amount
                              </Message.Item>
                            </Message.List>
                          </Message>
                        )}
                        {searchResults.overfilled && (
                          <Message warning visible={true}>
                            <Message.Header>Over your campaign budget</Message.Header>
                            <p>
                              You are {searchResults.overfilledBy} over of your maxiumn budget of{' '}
                              {searchResults.userMailoutSize.mailoutSizeMax}. Choose an action:
                            </p>
                            <Message.List>
                              <Message.Item>Limit your search parameters to find less</Message.Item>
                              <Message.Item>
                                Click 'Save' to accept this larger amount.
                              </Message.Item>
                            </Message.List>
                          </Message>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {destinationsOptionsMode === 'userUploaded' && (
            <div className="ui fluid">
              {mailoutDetails.destinationsOptions?.userUploaded?.filename && (
                <div>
                  <div>
                    <b>Existing File</b>:{' '}
                    {mailoutDetails.destinationsOptions?.userUploaded?.filename}
                  </div>
                  <div>
                    <b>Uploaded</b>:{' '}
                    {new Date(mailoutDetails.destinationsOptions?.userUploaded?.created).toString()}
                  </div>
                </div>
              )}

              <input
                id="destinationCSVFile"
                name="destinations"
                type="file"
                onChange={handleFileChange}
              ></input>
              <div id="csvUnrecognized">
                Upload your own CSV to use for targeting (max. 50 MB). NOTE: Choosing a file and
                clicking save will clear all existing destinations.
              </div>
              {!isCsvBrivityFormat && (
                <div>
                  <Message negative visible={true}>
                    <Message.Header>
                      The CSV file is not in a recognized Brivity format
                    </Message.Header>
                    <p>
                      Please match the CSV columns to the destination fields, using the selections
                      below.
                    </p>
                    {currentResident && (
                      <Fragment>
                        <Message.Header>
                          * Please Note - "Current Resident" will be used on Name Line
                        </Message.Header>
                        <p>First and Last name choices will be used if available and selected.</p>
                      </Fragment>
                    )}
                  </Message>
                  <Form.Field>
                    <label>First Name</label>
                    <Dropdown
                      placeholder="Select First Name Column"
                      options={csvHeaders}
                      selection
                      clearable
                      value={firstNameColumn}
                      onChange={(e, input) => setFirstNameColumn(input.value)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Last Name</label>
                    <Dropdown
                      placeholder="Select Last Name Column"
                      options={csvHeaders}
                      selection
                      clearable
                      value={lastNameColumn}
                      onChange={(e, input) => setLastNameColumn(input.value)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Address {tag('Required')}</label>
                    <Dropdown
                      placeholder="Select Address Column"
                      options={csvHeaders}
                      selection
                      value={deliveryLineColumn}
                      onChange={(e, input) => setDeliveryLineColumn(input.value)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>City {tag('Required')}</label>
                    <Dropdown
                      placeholder="Select City Column"
                      options={csvHeaders}
                      selection
                      value={cityColumn}
                      onChange={(e, input) => setCityColumn(input.value)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>State {tag('Required')}</label>
                    <Dropdown
                      placeholder="Select State Column"
                      options={csvHeaders}
                      selection
                      value={stateColumn}
                      onChange={(e, input) => setStateColumn(input.value)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Zip {tag('Required')}</label>
                    <Dropdown
                      placeholder="Select Zip Column"
                      options={csvHeaders}
                      selection
                      value={zipColumn}
                      onChange={(e, input) => setZipColumn(input.value)}
                    />
                  </Form.Field>
                </div>
              )}
            </div>
          )}
          {destinationsOptionsMode === 'copy' && (
            <CopyDestContainer>
              {prevCopyCampaign && (
                <p>{`Destinations last copied from: ${prevCopyCampaign.text}`}</p>
              )}
              <p>{`Choose a ${
                prevCopyCampaign ? 'different' : ''
              } campaign to copy destinations from:`}</p>
              <CopyDestDropdown
                onChange={(e, { value }) => setCopyCampaign(value)}
                options={campaignOptions || [{ key: 0, text: 'Loading...' }]}
                loading={campaignsPending}
                search
                selection
                clearable
                placeholder="Search by Name, Address or Mls Number"
              />
            </CopyDestContainer>
          )}
        </Form>
      </Segment>
    </Page>
  );
};

export default EditDestinationsForm;
