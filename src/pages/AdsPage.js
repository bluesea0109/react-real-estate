import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import Loading from '../components/Loading';
import { Header, Menu, Page, Segment, Icon } from '../components/Base';
import { Table, Loader, Popup, Grid, Card, Image } from 'semantic-ui-react';

import PageTitleHeader from '../components/PageTitleHeader';
import { ContentBottomHeaderLayout, ContentTopHeaderLayout } from '../layouts';
import { useIsMobile } from '../components/Hooks/useIsMobile';
import StatusPill from '../components/StatusPill';

import auth from '../services/auth';
import api from '../services/api';

export const trimText = (string, length, noDots) => {
  if (string.length <= length) return string;
  if (noDots) return string.substring(0, length);
  if (string.length + 3 < length) return string;
  return string.substring(0, length) + '...';
};

const formatWebsite = website => {
  let tempWebsite = null;
  if (website) {
    if (!website.includes('http://') || !website.includes('https://')) {
      tempWebsite = 'http://' + website;
      return tempWebsite;
    } else {
      return website;
    }
  }
};

const AdPreview = ({ ad, website, viewMore, adTextLength, toggleAdTextLength }) => {
  if (!ad) return 'Loading...';
  else {
    let beds = ad && ad.listing ? (ad.listing.bedrooms ? ad.listing.bedrooms : '-') : '-';
    let baths =
      ad && ad.listing
        ? ad.listing.fullBaths !== undefined && ad.listing.halfBaths !== undefined
          ? ad.listing.fullBaths + ad.listing.halfBaths
          : '-'
        : '-';
    let sqft = ad && ad.listing ? (ad.listing.squareFeet ? ad.listing.squareFeet : '-') : '-';
    const handleLearnMore = landingUrl => {
      if (landingUrl) {
        window.open(landingUrl, '_blank');
      } else {
        window.open(`${formatWebsite(website)}/mls/landing/${ad.details.mlsNum}`, '_blank');
      }
    };
    return (
      <div className="adPreviewWrapper">
        <Grid>
          <Grid.Column width={2}>
            <div className="adPreviewPageProfilePicContainer">
              <div
                className="adPreviewPageProfilePic"
                style={{
                  backgroundImage: ad.details.adFacebookPageImage
                    ? `url(${ad.details.adFacebookPageImage})`
                    : 'url(https://i.stack.imgur.com/l60Hf.png)',
                }}
              />
            </div>
          </Grid.Column>
          <Grid.Column width={14} className="adPreviewPageInfoContainer">
            <Header as="h4" className="adPreviewPage">
              {ad.details.adFacebookPageName
                ? ad.details.adFacebookPageName
                : 'Your Realty Company'}
            </Header>
            <span className="adPreviewSubtitleContainer">
              <Header as="h5" className="adPreviewPageSubtitle">
                Sponsored •
              </Header>
              <Icon name="world" size="small" className="adPreviewAdIcon" />
            </span>
          </Grid.Column>
          {/* <span className="adPreviewText">{trimText(text, adTextLength, viewMore)} <span className="adPreviewTextExpand" onClick={() => toggleAdTextLength(text)}>Read {viewMore ? 'less' : 'more'}</span></span> */}
          <span className="adPreviewText">{ad.details.adText && `${ad.details.adText}...`}</span>
        </Grid>
        <Segment className="adPreviewContainer">
          <div className="adPreviewImageContainer">
            <div
              className="adPreviewImage"
              style={{
                backgroundImage: `url(${
                  ad && ad.details.previewUrl
                    ? ad.details.previewUrl
                    : 'https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png'
                })`,
              }}
            />
          </div>
          <Grid>
            <Grid.Column width={10}>
              <Header as="h3" className="adPreviewTitle">
                {ad.details.campaignName}
              </Header>
              <Header
                as="h5"
                className="adPreviewSubtitle"
              >{`${beds} beds | ${baths} baths | ${sqft} sqft`}</Header>
            </Grid.Column>
            <Grid.Column width={6}>
              <div
                className={`adPreviewCTA ${ad.details.landingUrl ||
                  (website && 'listingCardTitle')}`}
                onClick={
                  ad.details.landingUrl
                    ? () => handleLearnMore(ad.details.landingUrl)
                    : website
                    ? handleLearnMore
                    : undefined
                }
              >
                Learn More
              </div>
            </Grid.Column>
          </Grid>
        </Segment>
      </div>
    );
  }
};

const EmptyPage = () => {
  const [adDetails, setAdDetails] = useState(null);
  const [listingDetails, setListingDetails] = useState(null);
  const [viewMore, setViewMore] = useState(false);
  const [adTextLength, setAdTextLength] = useState(280);

  const peerId = useSelector(store => store.peer.peerId);
  const isMobile = useIsMobile();

  const fetchData = useCallback(async () => {
    let path = `/api/user/ads/list`;
    if (peerId) path = `/api/user/peer/${peerId}/ads/list`;

    const headers = {};
    const accessToken = await auth.getAccessToken();
    headers['authorization'] = `Bearer ${accessToken}`;
    const response = await fetch(path, { headers, method: 'get', credentials: 'include' });
    const results = await api.handleResponse(response);
    let orderedResults = results.reverse();
    if (orderedResults !== adDetails) setAdDetails(orderedResults);

    if (listingDetails) return;
    let pathListing = `/api/user/listings?forgeBlueroofToken=true`;
    if (peerId) pathListing = `/api/user/peer/${peerId}/listings?forgeBlueroofToken=true`;
    const responseListing = await fetch(pathListing, {
      headers,
      method: 'get',
      credentials: 'include',
    });
    const resultsListing = await api.handleResponse(responseListing);
    setListingDetails(resultsListing);
  }, [adDetails, peerId, listingDetails]);

  useEffect(() => {
    let interval;

    if (adDetails === null) {
      fetchData();
    } else {
      interval = setInterval(() => {
        fetchData();
      }, 15000);
    }

    return () => clearInterval(interval);
  }, [adDetails, peerId, fetchData]);

  const toggleAdTextLength = adText => {
    if (viewMore) {
      setAdTextLength(280);
      setViewMore(false);
    } else {
      setAdTextLength(adText.length);
      setViewMore(true);
    }
  };

  const daysTimeDiff = (startDate, endDate) => {
    let epochDiff = Date.parse(endDate) - Date.parse(startDate);
    let days = Math.floor(epochDiff / 8.64e7);

    if (days > 1) return String(`${days} days`);
    else return String(`${days} day`);
  };
  const getDateFromStr = dateStr => {
    let date = new Date(dateStr);

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let display = `${month + 1}/${day}/${year}`;

    return String(display);
  };

  const tableBody = (viewMore, adTextLength, toggleAdTextLength) => {
    return adDetails.map((item, index) =>
      item.pending ? (
        <Table.Row key={index}>
          <Table.Cell className="marketerGrey adTableItemCampaignCell">
            <b>{item.details.campaignName}</b>
          </Table.Cell>
          <Table.Cell />
          <Table.Cell />
          <Table.Cell />
          <Table.Cell textAlign="center">
            <Loader active inline size="tiny" className="adTableInlineLoader">
              Pending
            </Loader>
          </Table.Cell>
          {/* <Table.Cell /> */}
          <Table.Cell />
          <Table.Cell />
          <Table.Cell />
          <Table.Cell />
          <Table.Cell />
          <Table.Cell />
          <Table.Cell />
        </Table.Row>
      ) : (
        <Table.Row key={index}>
          <Table.Cell className="marketerGrey adTableItemCampaignCell defaultCursor">
            <span className="adTableCampaignName">{item.details.campaignName}</span>
            <span hidden>{item._id}</span>
          </Table.Cell>
          <Table.Cell>
            {item.details.status === 'WITH_ISSUES' ? (
              <div className="adTableItemPreviewContainer">
                <div
                  className="adTableItemPreview"
                  style={{
                    backgroundImage: `url(${
                      item.details.previewUrl
                        ? item.details.previewUrl
                        : 'https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png'
                    })`,
                  }}
                />
              </div>
            ) : (
              <Popup
                content={
                  <AdPreview
                    ad={item}
                    website={
                      listingDetails?.adProduct?.qs?.website
                        ? listingDetails.adProduct.qs.website
                        : false
                    }
                    viewMore={viewMore}
                    adTextLength={adTextLength}
                    toggleAdTextLength={toggleAdTextLength}
                  />
                }
                trigger={
                  <div className="adTableItemPreviewContainer">
                    <div
                      className="adTableItemPreview"
                      style={{
                        backgroundImage: `url(${
                          item.details.previewUrl
                            ? item.details.previewUrl
                            : 'https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png'
                        })`,
                      }}
                    />
                  </div>
                }
                on={['hover', 'focus']}
                position="right center"
                hideOnScroll={false}
                hoverable
              />
            )}
          </Table.Cell>
          <Table.Cell className="adTableDurationContentColumn marketerGrey defaultCursor">
            {item.details.startDate && item.details.endDate ? (
              <Header as="h5" sub className="noMarginBottom">{`${daysTimeDiff(
                item.details.startDate,
                item.details.endDate
              )}`}</Header>
            ) : (
              '-'
            )}
            {item.details.startDate && item.details.endDate && (
              <span>{`${getDateFromStr(item.details.startDate)} - ${getDateFromStr(
                item.details.endDate
              )}`}</span>
            )}
          </Table.Cell>
          <Table.Cell className="marketerGrey alignCenter defaultCursor">
            {item.details.budget ? `$${Math.trunc(Number(item.details.budget))}` : '-'}
          </Table.Cell>
          {/* <Table.Cell className="marketerGrey alignCenter defaultCursor">
            {item.details.spend && item.details.budget
              ? `${Math.floor(
                  (item.details.spend / (item.details.budget - item.details.budget * 0.2)) * 100
                )}%`
              : '-'}
          </Table.Cell> */}
          <Table.Cell className="marketerGrey alignCenter defaultCursor">
            <div>
              <Icon name="facebook" size="large" className="adTableItemFacebookLogo" />
              <Icon name="instagram" size="large" className="adTableItemInstagramLogo" />
            </div>
          </Table.Cell>
          <Table.Cell className="marketerGrey alignCenter defaultCursor">
            {item.details.impressions ? item.details.impressions : 0}
          </Table.Cell>
          <Table.Cell className="marketerGrey alignCenter defaultCursor">
            {item.details.leads ? item.details.leads : 0}
          </Table.Cell>
          <Table.Cell className="marketerGrey alignCenter defaultCursor">
            {item.details.ctr ? `${Math.floor(item.details.ctr)}%` : '-'}
          </Table.Cell>
          <Table.Cell className="marketerGrey alignCenter defaultCursor">
            {item.details.clicks ? Math.floor(item.details.clicks) : '-'}
          </Table.Cell>
          <Table.Cell className="marketerGrey alignCenter defaultCursor">
            {item.details.cpc ? `$${Number(item.details.cpc).toFixed(2)}` : '-'}
          </Table.Cell>
          <Table.Cell className="marketerGrey alignCenter defaultCursor">Leads</Table.Cell>
          <Table.Cell className="marketerGrey alignCenter defaultCursor" collapsing>
            {item.details.status === 'ACTIVE' ? (
              <StatusPill type="solid" color="green">
                Active
              </StatusPill>
            ) : item.details.status === 'PAUSED' ||
              item.details.status === 'CAMPAIGN_PAUSED' ||
              item.details.status === 'ADSET_PAUSED' ? (
              <StatusPill type="solid" color="yellow">
                Paused
              </StatusPill>
            ) : item.details.status === 'DELETED' ? (
              <StatusPill type="solid" color="grey">
                Deleted
              </StatusPill>
            ) : item.details.status === 'PENDING_REVIEW' ||
              item.details.status === 'PENDING_BILLING_INFO' ||
              item.details.status === 'IN_PROCESS' ||
              item.details.status === 'PREAPPROVED' ? (
              <StatusPill type="solid" color="lightBlue">
                Pending
              </StatusPill>
            ) : item.details.status === 'ARCHIVED' ? (
              <StatusPill type="solid" color="grey">
                Archived
              </StatusPill>
            ) : item.details.status === 'DISAPPROVED' ? (
              <StatusPill type="solid" color="astral">
                Disapproved
              </StatusPill>
            ) : item.details.status === 'WITH_ISSUES' ? (
              <Popup
                trigger={
                  <div>
                    <StatusPill type="solid" color="red">
                      Error
                    </StatusPill>
                  </div>
                }
                content={item.details.error_message ? item.details.error_message : 'Facebook Error'}
                position="top right"
              />
            ) : item.details.status === 'DELETED' ? (
              <StatusPill type="solid" color="grey">
                Deleted
              </StatusPill>
            ) : (
              <StatusPill type="solid" color="astral">
                Other
              </StatusPill>
            )}
          </Table.Cell>
        </Table.Row>
      )
    );
  };
  console.log(listingDetails);
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
      <div style={isMobile ? { marginTop: '80px' } : { marginTop: '21px' }}>
        <Segment>
          {!adDetails ? (
            <ContentBottomHeaderLayout>
              <Loading message="Loading ads..." whiteBg />
            </ContentBottomHeaderLayout>
          ) : adDetails.length > 0 ? (
            <Table basic="very" className="BillingTable">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="adTableHeaderText marketerGrey defaultCursor">
                    CAMPAIGN
                  </Table.HeaderCell>
                  <Table.HeaderCell className="adTableHeaderText marketerGrey defaultCursor">
                    PREVIEW
                  </Table.HeaderCell>
                  <Table.HeaderCell className="adTableHeaderText marketerGrey defaultCursor">
                    DURATION
                  </Table.HeaderCell>
                  <Table.HeaderCell className="adTableHeaderText marketerGrey alignCenter defaultCursor">
                    BUDGET
                  </Table.HeaderCell>
                  {/* <Table.HeaderCell className="adTableHeaderText marketerGrey alignCenter defaultCursor">
                    SPENT
                  </Table.HeaderCell> */}
                  <Table.HeaderCell className="adTableHeaderText marketerGrey alignCenter defaultCursor">
                    PLATFORMS
                  </Table.HeaderCell>
                  <Table.HeaderCell className="adTableHeaderText marketerGrey alignCenter defaultCursor">
                    <Popup
                      content="The number of times your ads were displayed on a screen"
                      trigger={<span>IMPRESSIONS</span>}
                      on="hover"
                    />
                  </Table.HeaderCell>
                  <Table.HeaderCell className="adTableHeaderText marketerGrey alignCenter defaultCursor">
                    <Popup
                      content="The number of people who filled out your ad’s lead form"
                      trigger={<span>LEADS</span>}
                      on="hover"
                    />
                  </Table.HeaderCell>
                  <Table.HeaderCell className="adTableHeaderText marketerGrey alignCenter defaultCursor">
                    <Popup
                      content="The percentage of times people saw your ad and performed a click (all)"
                      trigger={<span>CTR</span>}
                      on="hover"
                    />
                  </Table.HeaderCell>
                  <Table.HeaderCell className="adTableHeaderText marketerGrey alignCenter defaultCursor">
                    <Popup
                      content="The number of clicks on your ads"
                      trigger={<span>CLICKS</span>}
                      on="hover"
                    />
                  </Table.HeaderCell>
                  <Table.HeaderCell className="adTableHeaderText marketerGrey alignCenter defaultCursor">
                    <Popup
                      content="The average cost for each click (all)"
                      trigger={<span>CPC</span>}
                      on="hover"
                    />
                  </Table.HeaderCell>
                  <Table.HeaderCell className="adTableHeaderText marketerGrey alignCenter defaultCursor">
                    GOAL
                  </Table.HeaderCell>
                  <Table.HeaderCell className="adTableHeaderText marketerGrey alignCenter defaultCursor">
                    STATUS
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {adDetails && tableBody(viewMore, adTextLength, toggleAdTextLength)}
              </Table.Body>
            </Table>
          ) : (
            <Card centered style={{ minWidth: '380px', boxShadow: 'none' }}>
              <Image
                centered
                size="large"
                src={require('../assets/paid-ads-empty-state.svg')}
                style={{ background: 'unset', marginTop: '2em', marginBottom: '1em' }}
              />
              <Card.Content style={{ borderTop: 'none' }}>
                <Header as="h5" textAlign="center">
                  <Header.Content
                    style={{ width: '380px', textAlign: 'center', cursor: 'default' }}
                  >
                    Your ad campaigns will appear here
                  </Header.Content>
                </Header>
              </Card.Content>
            </Card>
          )}
        </Segment>
      </div>
    </Page>
  );
};

export default EmptyPage;
