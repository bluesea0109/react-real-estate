import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import Loading from '../components/Loading';
import { Header, Menu, Page, Segment, Icon } from '../components/Base';
import { Table, Loader, Popup, Grid } from 'semantic-ui-react';

import PageTitleHeader from '../components/PageTitleHeader';
import { ContentBottomHeaderLayout, ContentTopHeaderLayout } from '../layouts';
import { isMobile } from '../components/utils';
import StatusPill from '../components/StatusPill';

import auth from '../services/auth';
import api from '../services/api';

const trimText = (string, length, noDots) => {
  if(noDots) return string.substring(0, length);
  if(string.length + 3 < length) return string;
  return string.substring(0, length) + "...";
};

const AdPreview = ({ ad, viewMore, adTextLength, toggleAdTextLength }) => {
  let text = 'Wonderful opportunity to own this beautiful custom home, overlooking Oak Harbor. Master and 2nd bedroom upstairs, with 1 & 3/4 baths, living, dining, kitchen and laundry boasting beautiful Acacia flooring. Downstairs has its own entrance, 2 bedrooms, 3/4 bath, laundry hookups, large living room, with space for a future kitchen(ette)?? and storage. 2 car garage w/ workshop, RV parking, views of downtown, the bay and Baker. The updates & love poured into this home will have you planning your move!';
  
  return(
    <div>
      <Grid>
        <Grid.Column width={2}>
          <div className="adPreviewPageProfilePicContainer">
            <div className="adPreviewPageProfilePic" style={{backgroundImage: 'url(https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/cp0/c12.12.156.156a/s50x50/969250_10151662021063923_1389367264_n.jpg?_nc_cat=107&_nc_sid=dbb9e7&_nc_ohc=G8UFzFaVqogAX_IUH2g&_nc_ht=scontent-sea1-1.xx&_nc_tp=28&oh=aa6d020aa897ebc3e86fb372d486a742&oe=5FAC7858)'}} />
          </div>
        </Grid.Column>
        <Grid.Column width={14} className="adPreviewPageInfoContainer">
          <Header as='h4' className="adPreviewPage">Blueroof360 / Real Estate Provider</Header>
          <span className="adPreviewSubtitleContainer">
            <Header as='h5' className="adPreviewPageSubtitle">Sponsored •</Header>
            <Icon name="world" size="small" className="adPreviewAdIcon" />
          </span>
        </Grid.Column>
        <span className="adPreviewText">{trimText(text, adTextLength, viewMore)} <span className="adPreviewTextExpand" onClick={() => toggleAdTextLength(text)}>Read {viewMore ? 'less' : 'more'}</span></span>
      </Grid>
      <Segment className='adPreviewContainer'>
        <div className='adPreviewImageContainer'>
          <div className="adPreviewImage" style={{backgroundImage: `url(${ad && ad.details.previewUrl ? ad.details.previewUrl : 'https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png'})`}} />
        </div>
        <Grid>
          <Grid.Column width={10}>
            <Header as="h3" className='adPreviewTitle'>{ad.details.campaignName}</Header>
            <Header as="h5" className='adPreviewSubtitle'>4 beds | 2.5 baths | 3,144 sqft</Header>
          </Grid.Column>
          <Grid.Column width={6}>
            <div className="adPreviewCTA">Learn More</div>
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  );
};

const EmptyPage = () => {
  const [adDetails, setAdDetails] = useState(null);
  const [viewMore, setViewMore] = useState(false);
  const [adTextLength, setAdTextLength] = useState(280);

  const peerId = useSelector(store => store.peer.peerId);

  const fetchData =  useCallback(async() => {
    let path = `/api/user/ads/list`
    if (peerId) path = `/api/user/peer/${peerId}/ads/list`

    const headers = {};
    const accessToken = await auth.getAccessToken();
    headers['authorization'] = `Bearer ${accessToken}`;
    const response = await fetch(path, { headers, method: 'get', credentials: 'include' });
    const results = await api.handleResponse(response);
    let orderedResults = results.reverse();
    if(orderedResults !== adDetails) setAdDetails(orderedResults);
  }, [adDetails, peerId]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 4000);

    return () => clearInterval(interval);
  }, [fetchData])

  useEffect(() => {
    fetchData();
  }, [adDetails, peerId, fetchData]);

  const toggleAdTextLength = (adText) => {
    if(viewMore){
      setAdTextLength(280);
      setViewMore(false);
    } else{
      setAdTextLength(adText.length);
      setViewMore(true);
    }
  }

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

  const tableBody = (viewMore, adTextLength, toggleAdTextLength) => {
    return adDetails.map((item, index) => (
      item.pending ?
        <Table.Row key={index}>
        <Table.Cell className="marketerGrey adTableItemCampaignCell"><b>{item.details.campaignName}</b></Table.Cell>
        <Table.Cell />
        <Table.Cell />
        <Table.Cell />
        <Table.Cell textAlign='center'>
          <Loader active inline size='tiny'>Pending</Loader>
        </Table.Cell>
        <Table.Cell />
        <Table.Cell />
        <Table.Cell />
        <Table.Cell />
        <Table.Cell />
        <Table.Cell />
        <Table.Cell />
      </Table.Row>
      :
        <Table.Row key={index}>
        <Table.Cell className="marketerGrey adTableItemCampaignCell"><b>{item.details.campaignName}</b></Table.Cell>
        <Table.Cell>
          <Popup
            content={<AdPreview ad={item} viewMore={viewMore} adTextLength={adTextLength} toggleAdTextLength={toggleAdTextLength} />}
            trigger={<div className="adTableItemPreviewContainer">
            <div className="adTableItemPreview" style={{backgroundImage: `url(${item.details.previewUrl ? item.details.previewUrl : 'https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png'})`}} />
          </div>}
            on='click'
            position="right center"
          />
        </Table.Cell>
        <Table.Cell className="marketerGrey">
          {item.details.startDate && item.details.endDate ? <Header as="h5" sub className="noMarginBottom">{`${daysTimeDiff(item.details.startDate, item.details.endDate)}`
          }</Header> : '-'}
          {item.details.startDate && item.details.endDate ? <span>{`${getDateFromStr(item.details.startDate)} - ${getDateFromStr(item.details.endDate)}`}</span> : '-'}
        </Table.Cell>
        <Table.Cell className="marketerGrey">{item.details.budget ? `$${Math.trunc(Number(item.details.budget))}` : '-'}</Table.Cell>
        <Table.Cell className="marketerGrey">{item.details.budget ? '$0' : '-'}</Table.Cell>
        <Table.Cell><div><Icon name="facebook" size="large" className="adTableItemFacebookLogo" /><Icon name="instagram" size="large" className="adTableItemInstagramLogo" /></div></Table.Cell>
        <Table.Cell>{item.details.cpp ? `$${Math.floor(item.details.cpp)}` : '-'}</Table.Cell>
        <Table.Cell>{item.details.ctr ? `${Math.floor(item.details.ctr)}%` : '-'}</Table.Cell>
        <Table.Cell>{item.details.clicks ? Math.floor(item.details.clicks) : '-'}</Table.Cell>
        <Table.Cell>{item.details.cpc ? `$${item.details.cpc.toFixed(2)}` : '-'}</Table.Cell>
        <Table.Cell className="marketerGrey">Leads</Table.Cell>
        <Table.Cell>
          {
            item.details.status === 'ACTIVE' ? <StatusPill type="solid" color="green">Active</StatusPill> :
            item.details.status === 'PAUSED' || item.details.status === 'CAMPAIGN_PAUSED' || item.details.status === 'ADSET_PAUSED' ? <StatusPill type="solid" color="yellow">Paused</StatusPill> :
            item.details.status === 'DELETED' ? <StatusPill type="solid" color="grey">Deleted</StatusPill> :
            item.details.status === 'PENDING_REVIEW' || item.details.status === 'PENDING_BILLING_INFO' || item.details.status === 'IN_PROCESS' || item.details.status === 'PREAPPROVED' ?  <StatusPill type="solid" color="lightBlue">Pending</StatusPill> :
            item.details.status === 'ARCHIVED' ? <StatusPill type="solid" color="grey">Archived</StatusPill> :
            item.details.status === 'WITH_ISSUES' || item.details.status === 'DISSAPROVED' ? <StatusPill type="solid" color="red">Error</StatusPill> :
            item.details.status === 'DELETED' ? <StatusPill type="solid" color="grey">Deleted</StatusPill> : <StatusPill type="solid" color="blue">Other</StatusPill>
          }
          </Table.Cell>
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
      <div style={isMobile() ? { marginTop: '80px' } : { marginTop: '21px' }}>
        <Segment>
          {!adDetails && <ContentBottomHeaderLayout><Loading message="Loading Listings..." /></ContentBottomHeaderLayout>}
          {adDetails && (
            <Table basic='very' className="BillingTable">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="marketerGrey">CAMPAIGN</Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey">PREVIEW</Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey">DURATION</Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey">BUDGET</Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey">SPENT</Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey">PLATFORMS</Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey">
                    <Popup
                      content='The average cost to reach 1,000 people. This metric is estimated'
                      trigger={<span>CPP</span>}
                      on='hover'
                    />
                  </Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey">
                    <Popup
                      content='The percentage of times people saw your ad and performed a click (all)'
                      trigger={<span>CTR</span>}
                      on='hover'
                    />
                  </Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey">
                    <Popup
                      content='The number of clicks on your ads'
                      trigger={<span>CLICKS</span>}
                      on='hover'
                    />
                  </Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey">
                    <Popup
                      content='The average cost for each click (all)'
                      trigger={<span>CPC</span>}
                      on='hover'
                    />
                  </Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey">GOAL</Table.HeaderCell>
                  <Table.HeaderCell className="marketerGrey alignCenter">STATUS</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tableBody(viewMore, adTextLength, toggleAdTextLength)}
              </Table.Body>
            </Table>
          )}
        </Segment>
      </div>
    </Page>
  );

}

export default EmptyPage;
