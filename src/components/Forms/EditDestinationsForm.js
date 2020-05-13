import { cloneDeep } from 'lodash'
import auth from '../../services/auth';
import api from '../../services/api';

import { useSelector } from 'react-redux';
import React, { useState, createRef, useEffect } from 'react';
import { Dropdown, Form, Header, Label, List, Checkbox } from 'semantic-ui-react';

import { ContentBottomHeaderLayout, ContentSpacerLayout, ContentTopHeaderLayout, ItemHeaderLayout, ItemHeaderMenuLayout } from '../../layouts';
import {
  changeMailoutDisplayAgentPending,
  updateMailoutEditPending,
  mailoutPolygonCoordinates,
  updateMailoutEditPolygonCoordinates,
} from '../../store/modules/mailout/actions';
import { differenceObjectDeep, isMobile, maxLength, objectIsEmpty, sleep } from '../utils';
import { Button, Icon, Image, Menu, Message, Page, Segment } from '../Base';
import { resolveLabelStatus } from '../MailoutListItem/helpers';
import PageTitleHeader from '../PageTitleHeader';
import Loading from '../Loading';
import PolygonGoogleMapsCore from './PolygonGoogleMaps/PolygonGoogleMapsCore';
import { connect } from 'formik';

const propertyTypeOptions = [
  { text: 'Single-Family', key: 'Single-Family', value: 'Single-Family'},
  { text: 'Condo', key: 'Condo', value: 'Condo'},

  { text: 'Apartment', key: 'Apartment', value: 'Apartment'},
  { text: 'Cooperative (Co-op)', key: 'Cooperative (Co-op)', value: 'Cooperative (Co-op)'},
  { text: 'Duplex', key: 'Duplex', value: 'Duplex'},
  { text: 'Multi-Family', key: 'Multi-Family', value: 'Multi-Family'},
  { text: 'Mobile/Manufactured',key: 'Mobile/Manufactured', value: 'Mobile/Manufactured'},
  { text: 'Miscellaneous', key: 'Miscellaneous', value: 'Miscellaneous'},
  { text: 'Quadruplex', key: 'Quadruplex', value: 'Quadruplex'},
  { text: 'Timeshare', key: 'Timeshare', value: 'Timeshare'},
  { text: 'Triplex', key: 'Triplex', value: 'Triplex'},
  { text: 'Vacant', key: 'Vacant', value: 'Vacant' }
]



const EditDestinationsForm = ({ mailoutDetails, mailoutDestinationsEdit, handleBackClick }) => {

  const updateMailoutDestinationsIsPending = useSelector(store => store.mailout.updateMailoutDestinationsPending);
  const currentListingStatus = mailoutDetails?.listingStatus;

  const [destinationsOptionsMode, setDestinationsOptionsMode] = useState(mailoutDetails.destinationsOptions?.mode || 'ai');
  const [saveDetails, setSaveDetails] = useState({
    destinationsOptionsMode: mailoutDetails.destinationsOptions?.mode || 'ai',
    ready: false
  })


  const [csvFile, setCsvFile] = useState(0);
  const [isCsvBrivityFormat, setIsCsvBrivityFormat] = useState(1);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [firstNameColumn, setFirstNameColumn] = useState(null);
  const [lastNameColumn, setLastNameColumn] = useState(null);
  const [deliveryLineColumn, setDeliveryLineColumn] = useState(null);
  const [cityColumn, setCityColumn] = useState(null);
  const [stateColumn, setStateColumn] = useState(null);
  const [zipColumn, setZipColumn] = useState(null);

  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [searchPropertyTypes, setSearchPropertyTypes] = useState([])
  const [searchBedsMin, setSearchBedsMin] = useState('')
  const [searchBedsMax, setSearchBedsMax] = useState('')
  const [searchBathsMin, setSearchBathsMin] = useState('')
  const [searchBathsMax, setSearchBathsMax] = useState('')
  const [searchSizeMin, setSearchSizeMin] = useState('')
  const [searchSizeMax, setSearchSizeMax] = useState('')
  const [searchSaleDateMin, setSearchSaleDateMin] = useState('')
  const [searchSaleDateMax, setSearchSaleDateMax] = useState('')
  const [searchSalePriceMin, setSearchSalePriceMin] = useState('')
  const [searchSalePriceMax, setSearchSalePriceMax] = useState('')
  const [runningSearch, setRunningSearch] = useState(false)
  const [searchResults, setSearchResults] = useState(null)

  useEffect(() => {
    console.log(polygonCoordinates);
    // *Uncomment for redux action
    // dispatch.updateMailoutEditPolygonCoordinates(polygonCoordinates);
  }, [polygonCoordinates]);


  useEffect(() => {
    let ready = true
    console.log(firstNameColumn, deliveryLineColumn)
    if (firstNameColumn === null) ready = false
    if (deliveryLineColumn === null) ready = false
    if (cityColumn === null) ready = false
    if (stateColumn === null) ready = false
    if (zipColumn === null) ready = false
    if (!ready) setSaveDetails({destinationsOptionsMode: 'userUploaded', ready: false})
    else setSaveDetails({destinationsOptionsMode: 'userUploaded', ready: true})
  }, [firstNameColumn, lastNameColumn, deliveryLineColumn, cityColumn, stateColumn, zipColumn])


  const handleDestinationSearch = async () => {
    const path = `/api/user/mailout/${mailoutDetails._id}/edit/destinationOptions/search/byPolygon`

    if (!polygonCoordinates) return

    setRunningSearch(true)
    let coordinates = cloneDeep(polygonCoordinates)
    let first = cloneDeep(coordinates[0])
    coordinates.push(first)
    let polygon = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates]
      }
    }

    let criteria = {}
    if (searchPropertyTypes && searchPropertyTypes.length) criteria.propertyTypes = searchPropertyTypes
    if (searchBedsMin !== '') criteria.bedsMin = Number(searchBedsMin)
    if (searchBedsMax !== '') criteria.bedsMax = Number(searchBedsMax)
    if (searchBathsMin !== '') criteria.bathsMin = Number(searchBathsMin)
    if (searchBathsMax !== '') criteria.bathsMax = Number(searchBathsMax)
    if (searchSizeMin !== '') criteria.sizeMin = Number(searchSizeMin)
    if (searchSizeMax !== '') criteria.sizeMax = Number(searchSizeMax)
    if (searchSalePriceMin !== '') criteria.salePriceMin = Number(searchSalePriceMin)
    if (searchSalePriceMax !== '') criteria.salePriceMax = Number(searchSalePriceMax)

    let body = JSON.stringify({polygon, criteria})

    const headers = {};
    const accessToken = await auth.getAccessToken();
    headers['authorization'] = `Bearer ${accessToken}`;

    const response = await fetch(path, { headers, method: 'post', body, credentials: 'include' });
    const results = await api.handleResponse(response)
    setRunningSearch(false)

    if (results.resultCount >= results.userMailoutSize.mailoutSizeMin && results.resultCount <= results.userMailoutSize.mailoutSizeMin) {
      results.withinBounds = true
    }
    if (results.resultCount < results.userMailoutSize.mailoutSizeMin) {
      results.withinBounds = false
      results.underfilled = true
      results.underfilledBy = results.userMailoutSize.mailoutSizeMin - results.resultCount
      results.overfilled = false
    }
    if (results.resultCount > results.userMailoutSize.mailoutSizeMax) {
      results.withinBounds = false
      results.underfilled = false
      results.overfilled = true
      results.overfilledBy = results.resultCount - results.userMailoutSize.mailoutSizeMax
    }
    setSearchResults(results)
  }


  const handleEditSubmitClick = async () => {
    if (!csvFile) return handleBackClick();
    const path = `/api/user/mailout/${mailoutDetails._id}/edit/destinationOptions/csv`;
    const formData = new FormData();
    formData.append('destinations', csvFile);

    if (!isCsvBrivityFormat) {
      formData.append('firstNameColumn', firstNameColumn);
      if (lastNameColumn && lastNameColumn !== null) formData.append('lastNameColumn', lastNameColumn);
      formData.append('deliveryLineColumn', deliveryLineColumn);
      formData.append('cityColumn', cityColumn);
      formData.append('stateColumn', stateColumn);
      formData.append('zipColumn', zipColumn);
    }

    const headers = {};
    const accessToken = await auth.getAccessToken();
    headers['authorization'] = `Bearer ${accessToken}`;

    const response = await fetch(path, { headers, method: 'post', body: formData, credentials: 'include' });
    const details = await api.handleResponse(response);
    handleBackClick();

    // dispatch(updateMailoutDestinationsIsPending({}));
    // await sleep(500);
    // handleBackClick();
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

      let brivityFormat = true;
      if (headers[0] !== 'First Name') brivityFormat = false;
      if (headers[1] !== 'Last Name') brivityFormat = false;
      if (headers[7] !== 'Home Street Address') brivityFormat = false;
      if (headers[8] !== 'Home City') brivityFormat = false;
      if (headers[9] !== 'Home State/Province') brivityFormat = false;
      if (headers[10] !== 'Home Postal Code') brivityFormat = false;

      if (brivityFormat) {
        setIsCsvBrivityFormat(1);
        setSaveDetails({destinationsOptionsMode: 'userUploaded', ready: true})
      }
      else {
        setIsCsvBrivityFormat(0);
        setSaveDetails({destinationsOptionsMode: 'userUploaded', ready: false})
        const headerValues = [];
        headers.forEach((header, i) => {
          const contextRef = createRef();
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
                  loading={updateMailoutDestinationsIsPending}
                  disabled={updateMailoutDestinationsIsPending}
                >
                  Back
                </Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>

      <ContentSpacerLayout />

      <Segment>
        <ContentBottomHeaderLayout>
          <ItemHeaderLayout attached="top" block style={isMobile() ? { marginTop: '56px' } : {}}>
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
              <Header as="h3">{mailoutDetails?.details?.displayAddress}</Header>
            </span>

            <ItemHeaderMenuLayout>
              <span>
                <Button
                  primary
                  type="submit"
                  onClick={handleEditSubmitClick}
                  loading={updateMailoutDestinationsIsPending}
                  disabled={!(saveDetails.ready && saveDetails.destinationsOptionsMode === destinationsOptionsMode) }
                >
                  Save
                </Button>
              </span>
            </ItemHeaderMenuLayout>
          </ItemHeaderLayout>

          {updateMailoutDestinationsIsPending && <Loading message="Saving ..." />}
        </ContentBottomHeaderLayout>

        <Segment
          basic
          padded
          className={isMobile() ? null : 'primary-grid-container'}
          style={isMobile() ? { marginTop: '140px' } : { padding: 10, marginTop: '120px' }}
        ></Segment>
        <Form>
          <Header as="h4">How should destinations be selected?</Header>
          <List horizontal id="chooseDestinationsMethod">
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
            <List.Item>
              <Checkbox
                radio
                label="Search"
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
          </List>
          {destinationsOptionsMode === 'manual' && (
            <div className="ui fluid">
              <div>Use the map to draw the outline of the area to choose destinations from.</div>
              <PolygonGoogleMapsCore polygonCoordinates={polygonCoordinates} setPolygonCoordinates={setPolygonCoordinates} data={mailoutDetails} />
              {polygonCoordinates && polygonCoordinates.length && (
                <div>
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
                  <Form.Group widths='equal'>
                    <Form.Field
                      label="Min Beds"
                      control="input"
                      min={0}
                      value={searchBedsMin}
                      onChange={(e, input) => {
                        if (e.target.value.match(/[^0-9]/g)) return
                        setSearchBedsMin(e.target.value)
                      }}
                    />
                    <Form.Field
                      label="Max Beds"
                      control="input"
                      min={0}
                      value={searchBedsMax}
                      onChange={(e, input) => {
                        if (e.target.value.match(/[^0-9]/g)) return
                        setSearchBedsMax(e.target.value)
                      }}
                    />
                    <Form.Field
                      label="Min Baths"
                      control="input"
                      min={0}
                      value={searchBathsMin}
                      onChange={(e, input) => {
                        if (e.target.value.match(/[^0-9]/g)) return
                        setSearchBathsMin(e.target.value)
                      }}
                    />
                    <Form.Field
                      label="Max Baths"
                      control="input"
                      min={0}
                      value={searchBathsMax}
                      onChange={(e, input) => {
                        if (e.target.value.match(/[^0-9]/g)) return
                        setSearchBathsMax(e.target.value)
                      }}
                    />
                    <Form.Field
                      label="Min Sqft"
                      control="input"
                      min={0}
                      value={searchSizeMin}
                      onChange={(e, input) => {
                        if (e.target.value.match(/[^0-9]/g)) return
                        setSearchSizeMin(e.target.value)
                      }}
                    />
                    <Form.Field
                      label="Max Sqft"
                      control="input"
                      min={0}
                      value={searchSizeMax}
                      onChange={(e, input) => {
                        if (e.target.value.match(/[^0-9]/g)) return
                        setSearchSizeMax(e.target.value)
                      }}
                    />
                  </Form.Group>
                  <Form.Group widths='equal'>
                    <Form.Field
                      label="Min Last Sale Price"
                      control="input"
                      min={0}
                      value={searchSalePriceMin}
                      onChange={(e, input) => {
                        if (e.target.value.match(/[^0-9]/g)) return
                        setSearchSalePriceMin(e.target.value)
                      }}
                    />
                    <Form.Field
                      label="Max Last Sale Price"
                      control="input"
                      min={0}
                      value={searchSalePriceMax}
                      onChange={(e, input) => {
                        if (e.target.value.match(/[^0-9]/g)) return
                        setSearchSalePriceMax(e.target.value)
                      }}
                    />
                  </Form.Group>
                  {!searchResults && (
                    <Button
                      secondary
                      onClick={() => handleDestinationSearch()}
                      loading={runningSearch}
                    >
                      Search
                    </Button>
                  )}
                  {searchResults && (
                    <div>
                      <h2>Results!</h2>
                      <div>{searchResults.resultCount} Destinations Found</div>
                      {searchResults.withinBounds && (
                        <div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {destinationsOptionsMode === 'userUploaded' && (
            <div className="ui fluid">
              {mailoutDetails.destinationsOptions?.userUploaded?.filename && (
                <div>
                  <div><b>Existing File</b>: {mailoutDetails.destinationsOptions?.userUploaded?.filename}</div>
                  <div><b>Uploaded</b>: {new Date(mailoutDetails.destinationsOptions?.userUploaded?.created).toString()}</div>
                </div>
              )}

              <input id="destinationCSVFile" name="destinations" type="file" onChange={handleFileChange}></input>
              <div>Warning: Choosing a file, and clicking save, will clear all existing destinations</div>
              {!isCsvBrivityFormat && (
                <div>
                  <div id="csvUnrecognized">The csv file is not in a recognized brivity format. Please match the fields</div>
                  <Form.Field>
                    <label>First Name</label>
                    <Dropdown
                      placeholder="Select First Name Column"
                      options={csvHeaders}
                      selection
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
                    <label>Delivery Line</label>
                    <Dropdown
                      placeholder="Select Delivery Line Column"
                      options={csvHeaders}
                      selection
                      value={deliveryLineColumn}
                      onChange={(e, input) => setDeliveryLineColumn(input.value)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>City</label>
                    <Dropdown
                      placeholder="Select City Column"
                      options={csvHeaders}
                      selection
                      value={cityColumn}
                      onChange={(e, input) => setCityColumn(input.value)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>State</label>
                    <Dropdown
                      placeholder="Select State Column"
                      options={csvHeaders}
                      selection
                      value={stateColumn}
                      onChange={(e, input) => setStateColumn(input.value)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Zip</label>
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
        </Form>
      </Segment>
    </Page>
  );
};

export default EditDestinationsForm;
