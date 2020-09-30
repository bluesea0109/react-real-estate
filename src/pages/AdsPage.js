import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Loading from '../components/Loading';
import { Header, Menu, Page, Segment, Icon } from '../components/Base';
import { Table, Loader } from 'semantic-ui-react';

import PageTitleHeader from '../components/PageTitleHeader';
import { ContentBottomHeaderLayout, ContentSpacerLayout, ContentTopHeaderLayout } from '../layouts';
import { isMobile } from '../components/utils';
import StatusPill from '../components/StatusPill';

import auth from '../services/auth';
import api from '../services/api';

const EmptyPage = () => {
  const [adDetails, setAdDetails] = useState(null)
  const peerId = useSelector(store => store.peer.peerId)


  const fetchData =  async() => {
    if (adDetails) return
    let path = `/api/user/ads/list`
    if (peerId) path = `/api/user/peer/${peerId}/ads/list`

    const headers = {};
    const accessToken = await auth.getAccessToken();
    headers['authorization'] = `Bearer ${accessToken}`;
    const response = await fetch(path, { headers, method: 'get', credentials: 'include' });
    const results = await api.handleResponse(response);
    let orderedResults = results.reverse();
    if(orderedResults !== adDetails) setAdDetails(orderedResults);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 4000);

    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    fetchData();
  }, [adDetails, peerId]);


  const daysTimeDiff = (startDate, endDate) => {
    let epochDiff = Date.parse(endDate) - Date.parse(startDate);
    let days = Math.floor(epochDiff/8.64e7);

    if (days > 1) return String(`${days} days`);
    else return String(`${days} day`);
  }
  const getDateFromStr = (dateStr) => {
    let date = new Date(dateStr);

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let display = `${month + 1}/${day}/${year}`
    
    return String(display);
  }

  const tableBody = () => {
    return adDetails.map((item, index) => (
      item.pending ?
        <Table.Row key={index}>
        <Table.Cell className="marketerGrey adTableItemCampaignCell"><b>{item.campaignName}</b></Table.Cell>
        <Table.Cell />
        <Table.Cell textAlign='center'>
          <Loader active inline size='tiny'>Pending</Loader>
        </Table.Cell>
        <Table.Cell />
        <Table.Cell />
        <Table.Cell />
        <Table.Cell />
        <Table.Cell />
      </Table.Row>
      :
        <Table.Row key={index}>
        <Table.Cell className="marketerGrey adTableItemCampaignCell"><b>{item.campaignName}</b></Table.Cell>
        <Table.Cell>
          <div className="adTableItemPreviewContainer">
            <div className="adTableItemPreview" style={{backgroundImage: `url(${item.previewUrl ? item.previewUrl : 'https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png'})`}} />
          </div>
        </Table.Cell>
        <Table.Cell className="marketerGrey">
          {item.startDate && item.endDate ? <Header as="h5" sub className="noMarginBottom">{`${daysTimeDiff(item.startDate, item.endDate)}`
          }</Header> : '-'}
          {item.startDate && item.endDate ? <span>{`${getDateFromStr(item.startDate)} - ${getDateFromStr(item.endDate)}`}</span> : '-'}
        </Table.Cell>
        <Table.Cell className="marketerGrey">{item.budget ? `$${Math.trunc(Number(item.budget))}` : '-'}</Table.Cell>
        <Table.Cell className="marketerGrey">{item.budget ? '$0' : '-'}</Table.Cell>
        <Table.Cell><div><Icon name="facebook" size="large" className="adTableItemFacebookLogo" /><Icon name="instagram" size="large" className="adTableItemInstagramLogo" /></div></Table.Cell>
        <Table.Cell className="marketerGrey">Leads</Table.Cell>
        <Table.Cell><StatusPill type="solid" color="yellow">Paused</StatusPill></Table.Cell>
      </Table.Row>
      
    ));
  };
  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <Menu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Paid Ads</Header>
            </Menu.Item>
          </Menu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>
      <ContentSpacerLayout />
      <div style={isMobile() ? { marginTop: '80px' } : { marginTop: '95px' }}>
        <Segment>
          <ContentBottomHeaderLayout>
            {!adDetails && <Loading message="Loading Listings..." />}
          </ContentBottomHeaderLayout>
          {adDetails && (
            <Table basic='very' className="BillingTable"> 
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="marketerGrey">Campaign</Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey">Preview</Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey">Duration</Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey">Budget</Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey">Spent</Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey">Platforms</Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey">Goal</Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey alignCenter">Status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tableBody()}
              </Table.Body>
            </Table>
          )}
        </Segment>
      </div>
    </Page>
  );

}

export default EmptyPage;
