import auth from '../../services/auth';
import api from '../../services/api'

import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import { Dropdown, Form, Header, Label, Checkbox } from 'semantic-ui-react';

import { ContentBottomHeaderLayout, ContentSpacerLayout, ContentTopHeaderLayout, ItemHeaderLayout, ItemHeaderMenuLayout } from '../../layouts';
import { isMobile } from '../utils';
import { Button, Menu, Page, Segment } from '../Base';
import { resolveLabelStatus } from '../MailoutListItem/helpers';
import PageTitleHeader from '../PageTitleHeader';
import Loading from '../Loading';

const EditDestinationsForm = ({ mailoutDetails, mailoutDestinationsEdit, handleBackClick }) => {

  const updateMailoutDestinationsIsPending = useSelector(store => store.mailout.updateMailoutDestinationsPending);
  const currentListingStatus = mailoutDetails?.listingStatus;

  const [destinationsOptionsMode, setDestinationsOptionsMode] = useState(mailoutDetails.destinationsOptions?.mode || 'ai')
  const [csvFile, setCsvFile] = useState(0)
  const [isCsvBrivityFormat, setIsCsvBrivityFormat] = useState(1)
  const [csvHeaders, setCsvHeaders] = useState([])
  const [firstNameColumn, setFirstNameColumn] = useState(null)
  const [lastNameColumn, setLastNameColumn] = useState(null)
  const [deliveryLineColumn, setDeliveryLineColumn] = useState(null)
  const [cityColumn, setCityColumn] = useState(null)
  const [stateColumn, setStateColumn] = useState(null)
  const [zipColumn, setZipColumn] = useState(null)


  const handleEditSubmitClick = async () => {
    if (!csvFile) return handleBackClick();
    const path = `/api/user/mailout/${mailoutDetails._id}/edit/destinationOptions/csv`
    const formData = new FormData()
    formData.append('destinations', csvFile)

    if (!isCsvBrivityFormat) {
      formData.append('firstNameColumn', firstNameColumn)
      if (lastNameColumn && lastNameColumn !== null) formData.append('lastNameColumn', lastNameColumn)
      formData.append('deliveryLineColumn', deliveryLineColumn)
      formData.append('cityColumn', cityColumn)
      formData.append('stateColumn', stateColumn)
      formData.append('zipColumn', zipColumn)
    }

    const headers = {}
    const accessToken = await auth.getAccessToken()
    headers['authorization'] = `Bearer ${accessToken}`

    const response = await fetch(path, { headers, method: 'post', body: formData, credentials: 'include' });
    const details = await api.handleResponse(response)
    console.log(details)
    handleBackClick();

    // dispatch(updateMailoutDestinationsIsPending({}));
    // await sleep(500);
    // handleBackClick();
  }


  // https://stackoverflow.com/questions/41610811/react-js-how-to-send-a-multipart-form-data-to-server
  const handleFileChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setCsvFile(file)
    const reader = new FileReader()
    reader.onload = function(e) {
        let text = reader.result
        let firstLine = text.split('\n').shift()
        let headers = firstLine.split(',')

        let brivityFormat = true
        if (headers[0] !== 'First Name') brivityFormat = false
        if (headers[1] !== 'Last Name') brivityFormat = false
        if (headers[7] !== 'Home Street Address') brivityFormat = false
        if (headers[8] !== 'Home City')  brivityFormat = false
        if (headers[9] !== 'Home State/Province')  brivityFormat = false
        if (headers[10] !== 'Home Postal Code')  brivityFormat = false

        if (brivityFormat) setIsCsvBrivityFormat(1)
        else {
          setIsCsvBrivityFormat(0)
          const headerValues = []
          headers.forEach((header, i) => {
            headerValues.push({
              key: i,
              text: header,
              value: i
            })
          })
          setCsvHeaders(headerValues)
        }
    }
    reader.readAsText(file, 'UTF-8');
  }

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
                  disabled={updateMailoutDestinationsIsPending}
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
        >

        </Segment>
          <Form>
            <Header as="h4">How should destinations be selected?</Header>
            <Form.Field>
              <Checkbox
                radio
                label="Automatically"
                name='checkboxRadioGroup'
                value='this'
                checked={destinationsOptionsMode === 'ai'}
                onClick={() => {
                  setDestinationsOptionsMode('ai')
                }}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                radio
                label='Automatically with some guidance'
                name='checkboxRadioGroup'
                value='that'
                checked={destinationsOptionsMode === 'aiGuided'}
                onClick={() => {
                  setDestinationsOptionsMode('aiGuided')
                }}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                radio
                label='Manually from file'
                name='checkboxRadioGroup'
                value='that'
                checked={destinationsOptionsMode === 'userUploaded'}
                onClick={() => {
                  setDestinationsOptionsMode('userUploaded')
                }}
              />
            </Form.Field>

          {destinationsOptionsMode === 'aiGuided' && (
            <div className="ui fluid">
              <h2>guidance settings</h2>
            </div>
          )}
          {destinationsOptionsMode === 'userUploaded' && (
            <div className="ui fluid">
              {mailoutDetails.destinationsOptions?.userUploaded?.filename && (
                <div>
                  <div>Existing File: {mailoutDetails.destinationsOptions?.userUploaded?.filename}</div>
                  <div>Uploaded: {new Date(mailoutDetails.destinationsOptions?.userUploaded?.created).toString()}</div>
                </div>
              )}
              <h3>Upload CSV file</h3>
              <div>Warning: Choosing a file, and clicking save, will clear all existing destinations</div>
              <input name="destinations" type="file" onChange={handleFileChange}></input>
              {!isCsvBrivityFormat && (
                <div>
                  <div>The csv file is not in a recognized brivity format. Please match the fields</div>
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
