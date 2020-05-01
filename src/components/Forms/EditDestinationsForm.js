import auth from '../../services/auth';

import startCase from 'lodash/startCase';
import { BlockPicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import React, { createRef, useEffect, useState } from 'react';
import { Dropdown, Form, Header, Label, Popup, Checkbox } from 'semantic-ui-react';

import { ContentBottomHeaderLayout, ContentSpacerLayout, ContentTopHeaderLayout, ItemHeaderLayout, ItemHeaderMenuLayout } from '../../layouts';
import { changeMailoutDisplayAgentPending, updateMailoutEditPending } from '../../store/modules/mailout/actions';
import { differenceObjectDeep, isMobile, maxLength, objectIsEmpty, sleep } from '../utils';
import { Button, Icon, Image, Menu, Message, Page, Segment } from '../Base';
import { resolveLabelStatus } from '../MailoutListItem/helpers';
import { StyledHeader, colors } from '../helpers';
import PageTitleHeader from '../PageTitleHeader';
import Loading from '../Loading';

const EditDestinationsForm = ({ mailoutDetails, mailoutDestinationsEdit, handleBackClick }) => {
  const dispatch = useDispatch();

  const updateMailoutDestinationsIsPending = useSelector(store => store.mailout.updateMailoutDestinationsPending);
  const updateMailoutDestinationsError = useSelector(store => store.mailout.updateMailoutDestinationsError?.message);
  const currentListingStatus = mailoutDetails?.listingStatus;

  const [destinationsOptionsMode, setDestinationsOptionsMode] = useState(mailoutDetails.destinationOptions?.mode || 'ai')
  const [csvFile, setCsvFile] = useState(0)


  const handleEditSubmitClick = async () => {
    console.log('submit clicked')

    const path = `/api/user/mailout/${mailoutDetails._id}/edit/destinationOptions/csv`
    const formData = new FormData()
    formData.append('destinations', csvFile)

    const headers = {
    };
    const accessToken = await auth.getAccessToken();
    headers['authorization'] = `Bearer ${accessToken}`;


    const response = await fetch(path, { headers, method: 'post', body: formData, credentials: 'include' });
    console.log('response')

    // dispatch(updateMailoutDestinationsIsPending({}));
    // await sleep(500);
    // handleBackClick();
  };

  // https://stackoverflow.com/questions/41610811/react-js-how-to-send-a-multipart-form-data-to-server
  const handleFileChange = e => {
    console.log(e.target.name, e.target.files[0])
      // [e.target.name]: e.target.files[0]
    setCsvFile(e.target.files[0])
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
          <div>
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
                label='Upload CSV file'
                name='checkboxRadioGroup'
                value='that'
                checked={destinationsOptionsMode === 'userUploaded'}
                onClick={() => {
                  setDestinationsOptionsMode('userUploaded')
                }}
              />
            </Form.Field>
          </div>

          {destinationsOptionsMode === 'aiGuided' && (
            <div className="ui fluid">
              <h2>guidance settings</h2>
            </div>
          )}
          {destinationsOptionsMode === 'userUploaded' && (
            <div className="ui fluid">
              <h2>Upload CSV File</h2>
              <input name="destinations" type="file" onChange={handleFileChange}></input>
            </div>
          )}
      </Segment>
    </Page>
  );
};

export default EditDestinationsForm;
