import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import auth from '../services/auth';
import api from '../services/api';
import { useLastLocation } from 'react-router-last-location';
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';

import {
  revertMailoutEditPending,
  stopMailoutPending,
  submitMailoutPending,
} from '../store/modules/mailout/actions';
import {
  calculateCost,
  formatDate,
  resolveMailoutStatus,
  resolveMailoutStatusColor,
  resolveMailoutStatusIcon,
} from '../components/MailoutListItem/utils/helpers';
import {
  Button,
  Grid,
  Header,
  Input,
  Image,
  List,
  Menu,
  Message,
  Modal,
  Page,
  Popup,
  Segment,
  Table,
} from '../components/Base';
import PopupContent from '../components/MailoutListItem/PopupContent';
import { getMailoutPending } from '../store/modules/mailout/actions';
import PopupMinMax from '../components/MailoutListItem/PopupMinMax';
import ListHeader from '../components/MailoutListItem/ListHeader';
import PageTitleHeader from '../components/PageTitleHeader';
import { postcardDimensionsDisplayed, iframeDimensions } from '../components/utils/utils';
import GoogleMapItem from '../components/Forms/PolygonGoogleMaps/GoogleMapItem';
import FlipCard from '../components/FlipCard';
import Loading from '../components/Loading';
import {
  ContentBottomHeaderLayout,
  ContentTopHeaderLayout,
  ItemBodyDataLayout,
  ItemBodyIframeLayout,
  ItemBodyLayoutV2,
  ItemLayout,
} from '../layouts';
import { useIsMobile } from '../components/Hooks/useIsMobile';
import { useWindowSize } from '../components/Hooks/useWindowSize';
import Styled, { css } from 'styled-components';

const changeButtonStyles = {
  marginLeft: '10px',
  minWidth: '5em',
  textTransform: 'none',
};

const modalHeaderStyles = {
  padding: '4px 0px 16px 0px',
  display: 'flex',
  fontSize: '29px',
  color: '#59c4c4',
  justifyContent: 'space-between',
};

const cancelButton = {
  borderRadius: '50px',
  textTransform: 'uppercase',
  color: '#666666',
  fontWeight: 'bold',
};

const flipButtonContainer = {
  height: '30px',
  display: 'flex',
  justifyContent: 'center',
  paddingTop: '8px',
};

const flipButtonStyles = {
  background: 'none',
  color: '#59c4c4',
  textTransform: 'uppercase',
  fontSize: '15px',
  borderRadius: '0px',
  padding: '7px 0px 18px 0px',
};

const rightMargin = {
  marginRight: '60px',
};

const highlightButton = {
  borderBottom: '3px solid #59c4c4',
};

const cancelX = {
  backgroundColor: '#EDEDED',
  borderRadius: '50px',
  height: '30px',
  width: '30px',
  padding: '0px',
  marginTop: '9px',
  marginRight: '0px',
};

const postcardContainer = {
  display: 'flex',
};

const ModalPreview = Styled(Modal)`
  width:${props => css`calc(${props.widthsize + 70}px)`};
  .content{
    justify-content:center;
  }
  @media (max-width: ${props => props.widthsize + 100}px) {
    &&&{
      width:90%;
    }
    .content{
      justify-content:flex-start;
    }
  }
`;

const useFetching = (getActionCreator, dispatch, mailoutId) => {
  useEffect(() => {
    dispatch(getActionCreator(mailoutId));
  }, [getActionCreator, dispatch, mailoutId]);
};

const MailoutDetailsPage = () => {
  const isMobile = useIsMobile();
  const windowSize = useWindowSize();
  const history = useHistory();
  const dispatch = useDispatch();
  const { mailoutId } = useParams();
  const lastLocation = useLastLocation();

  const [currentNumberOfRecipients, setCurrentNumberOfRecipients] = useState(0);
  const [showConsentModal, setShowConsentModal] = useState(false);

  const [frontLoaded, setFrontLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [working, setWorking] = useState(false);
  const [DestinationCalculation, setDestinationCalculation] = useState(false);

  const pendingState = useSelector(store => store.mailout.pending);
  const updateMailoutEditPendingState = useSelector(
    store => store.mailout.updateMailoutEditPending
  );
  const submitPendingState = useSelector(store => store.mailout.submitPending);
  const stopPendingState = useSelector(store => store.mailout.stopPending);
  const updateMailoutSizePendingState = useSelector(
    store => store.mailout.updateMailoutSizePending
  );

  const details = useSelector(store => store.mailout.details);
  const error = useSelector(store => store.mailout.error?.message);

  const teamCustomization = useSelector(store => store.teamCustomization.available);
  const onLoginMode = useSelector(store => store.onLogin?.mode);
  const multiUser = onLoginMode === 'multiuser';
  const listingType = details && details.listingStatus;
  const destinationsOptionsMode = details && details.destinationsOptions?.mode;
  const listingDefaults = teamCustomization && teamCustomization[listingType];
  const mailoutSizeMin = listingDefaults && listingDefaults.mailoutSizeMin;
  const mailoutSizeMax = listingDefaults && listingDefaults.mailoutSizeMax;

  const peerId = useSelector(store => store.peer.peerId);

  const frontURL = peerId
    ? `/api/user/${details?.userId}/peer/${peerId}/mailout/${details?._id}/render/preview/html/front?showBleed=true`
    : `/api/user/${details?.userId}/mailout/${details?._id}/render/preview/html/front?showBleed=true`;

  const backURL = peerId
    ? `/api/user/${details?.userId}/peer/${peerId}/mailout/${details?._id}/render/preview/html/back?showBleed=true`
    : `/api/user/${details?.userId}/mailout/${details?._id}/render/preview/html/back?showBleed=true`;

  const csvURL = peerId
    ? `/api/user/${details?.userId}/peer/${peerId}/mailout/${details?._id}/csv`
    : `/api/user/${details?.userId}/mailout/${details?._id}/csv`;

  const handleOnload = useCallback(
    event => {
      const {
        name,
        document: { body },
      } = event.target.contentWindow;

      body.style.overflow = 'hidden';
      body.style['pointer-events'] = 'none';

      if (name === 'front') {
        setFrontLoaded(true);
      }

      if (name === 'back') {
        setBackLoaded(true);
      }
    },
    [setFrontLoaded, setBackLoaded]
  );

  useEffect(() => {
    if (!pendingState && !!error) {
      history.push(`/dashboard`);
    }
  }, [pendingState, error, history]);

  useEffect(() => {
    if (details && details.recipientCount) {
      setCurrentNumberOfRecipients(details.recipientCount);
    }
  }, [details, currentNumberOfRecipients]);

  useFetching(getMailoutPending, useDispatch(), mailoutId);

  useEffect(() => {
    async function calculateDestinations() {
      setDestinationCalculation(true);
      let path = `/api/user/mailout/${details._id}/edit/mailoutSize`;
      if (peerId) path = `/api/user/peer/${peerId}/mailout/${details._id}/edit/mailoutSize`;
      let mailoutSize = details.mailoutSize;
      const body = JSON.stringify({ mailoutSize });
      const headers = {};
      const accessToken = await auth.getAccessToken();
      headers['authorization'] = `Bearer ${accessToken}`;
      const response = await fetch(path, { headers, method: 'put', body, credentials: 'include' });
      await api.handleResponse(response);
      setDestinationCalculation(false);
      dispatch(getMailoutPending(mailoutId));
    }
    if (details?.mailoutStatus === 'calculation-deferred') calculateDestinations();
  }, [details, peerId, dispatch, mailoutId]);

  useEffect(() => {
    const busyState =
      pendingState ||
      updateMailoutEditPendingState ||
      submitPendingState ||
      stopPendingState ||
      updateMailoutSizePendingState;
    setWorking(busyState);
  }, [
    pendingState,
    updateMailoutEditPendingState,
    submitPendingState,
    stopPendingState,
    updateMailoutSizePendingState,
  ]);

  const handleBackClick = () => {
    if (
      lastLocation.pathname === `/dashboard/edit/${mailoutId}` ||
      lastLocation.pathname === `/dashboard/${mailoutId}`
    ) {
      history.push(`/dashboard`);
    }
    //commented out, but i think will be used when archive is inside dashboard page
    //currently causing dashboard to navigate back to campaign when leaving
    //campaign edit and campaign for dashboard
    // if (lastLocation.pathname === `/dashboard` || `/dashboard/archived`) {
    //   history.goBack();
    // }
  };

  const handleApproveAndSendMailoutDetailsClick = () => {
    setShowConsentModal(true);
  };

  const handleDeleteMailoutDetailsClick = () => {
    dispatch(stopMailoutPending(mailoutId));
  };

  const handleRevertEditedMailoutClick = () => {
    dispatch(revertMailoutEditPending());
  };

  const handleEditMailoutDetailsClick = () => {
    history.push(`/dashboard/edit/${details._id}`);
  };

  const handleEditDestinationsClick = () => {
    history.push(`/dashboard/edit/${details._id}/destinations`);
  };

  const RenderRecipients = () => {
    const enableEditRecipients =
      resolveMailoutStatus(details.mailoutStatus) !== 'Sent' &&
      resolveMailoutStatus(details.mailoutStatus) !== 'Processing';
    return (
      <Button as="div" labelPosition="left">
        <Input
          className="display-only"
          style={{ maxWidth: '4.5em', maxHeight: '2em' }}
          value={currentNumberOfRecipients}
        />
        {enableEditRecipients && (
          <Button
            icon
            primary
            onClick={handleEditDestinationsClick}
            style={changeButtonStyles}
            disabled={updateMailoutSizePendingState}
            loading={updateMailoutSizePendingState}
          >
            Change
          </Button>
        )}
      </Button>
    );
  };

  const renderDestinations = () => {
    return (
      details.destinations &&
      details.destinations.map((dest, index) => {
        let ctaDate = '';
        if (dest.first_cta_interaction) ctaDate = format(dest.first_cta_interaction, 'MM/dd/yyyy');
        let ctaInteractions = '';
        if (dest.cta_interactions) ctaInteractions = dest.cta_interactions;
        let status = '-';
        if (dest.status && dest.status !== 'unknown') status = dest.status;
        return (
          <Table.Row key={dest.id}>
            <Table.Cell>{dest?.deliveryLine}</Table.Cell>
            <Table.Cell>{dest?.expected_delivery_date}</Table.Cell>
            <Table.Cell>{status}</Table.Cell>
            <Table.Cell>{ctaInteractions}</Table.Cell>
            <Table.Cell>{ctaDate}</Table.Cell>
          </Table.Row>
        );
      })
    );
  };

  const IFrameSegStyle = {
    border: 'none',
    boxShadow: 'none',
    padding: '0',
    margin: 'auto',
  };

  const FrontIframe = () => (
    <div
      style={{
        position: 'relative',
        height: iframeDimensions(details.postcardSize).height,
        width: iframeDimensions(details.postcardSize).width,
        boxSizing: 'border-box',
      }}
    >
      {details.frontResourceUrl && (
        <>
          <div
            className="bleed"
            style={{
              position: 'absolute',
              height: iframeDimensions(details.postcardSize).height,
              width: iframeDimensions(details.postcardSize).width,
              border: '0.125in solid white',
              zIndex: 99,
              opacity: '75%',
            }}
          ></div>
          <div
            className="safe-zone"
            style={{
              position: 'absolute',
              border: '2px dashed red',
              zIndex: 100,
              top: 'calc((0.325in / 2) - 1px)',
              left: 'calc((0.325in / 2) - 1px)',
              width: `calc(${iframeDimensions(details.postcardSize).width}px - 0.325in)`,
              height: `calc(${iframeDimensions(details.postcardSize).height}px - 0.325in)`,
            }}
          ></div>
          <div
            className="cut-text"
            style={{
              position: 'absolute',
              color: 'red',
              zIndex: 100,
              left: 'calc(50% - 100px)',
              top: 0,
              fontSize: '10px',
              fontWeight: 'bold',
              lineHeight: '1em',
            }}
          >
            Safe Zone - All text should be inside this area
          </div>
          <Image
            src={details.frontResourceUrl}
            className="image-frame-border"
            style={{
              height: '100%',
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
        </>
      )}
      {!details.frontResourceUrl && (
        <Segment
          compact
          textAlign="center"
          loading={!details?._id || !frontLoaded}
          style={IFrameSegStyle}
        >
          <iframe
            id="bm-iframe-front"
            title={`bm-iframe-front-${details._id}`}
            name="front"
            src={frontURL}
            width={`${iframeDimensions(details.postcardSize).width}`}
            height={`${iframeDimensions(details.postcardSize).height}`}
            frameBorder="0"
            sandbox="allow-same-origin allow-scripts"
            onLoad={handleOnload}
            className="image-frame-border"
            style={{ visibility: !details?._id || !frontLoaded ? 'hidden' : 'visible' }}
          />
        </Segment>
      )}
    </div>
  );

  const BackIframe = () => (
    <Segment
      compact
      textAlign="center"
      loading={!details?._id || !backLoaded}
      style={IFrameSegStyle}
    >
      <iframe
        id="bm-iframe-back"
        title={`bm-iframe-back-${details._id}`}
        name="back"
        src={backURL}
        width={`${iframeDimensions(details.postcardSize).width}`}
        height={`${iframeDimensions(details.postcardSize).height}`}
        frameBorder="0"
        sandbox="allow-same-origin allow-scripts"
        onLoad={handleOnload}
        className="image-frame-border"
        style={{ visibility: !details?._id || !backLoaded ? 'hidden' : 'visible' }}
      />
    </Segment>
  );

  // width: details && `calc(${iframeDimensions(details.postcardSize).width}px + 70px)`,
  // height: details && `calc(${iframeDimensions(details.postcardSize).height}px + 300px)`,

  const postCardSize = {
    width: details && iframeDimensions(details.postcardSize).width,
    height: details && iframeDimensions(details.postcardSize).height,
  };

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <Menu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Campaign Details</Header>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <Button
                  primary
                  inverted
                  onClick={() => handleBackClick()}
                  disabled={working}
                  loading={working}
                >
                  Back
                </Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </PageTitleHeader>
        {pendingState && !error && <Loading />}
      </ContentTopHeaderLayout>

      <ModalPreview
        widthsize={postCardSize.width}
        open={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        size="small"
      >
        {details && (
          <div
            style={{
              maxWidth: '100%',
              margin: 'auto',
              width: `calc(${postCardSize.width}px + 70px)`,
              height: `calc(${postCardSize.height}px + 300px)`,
            }}
          >
            <ModalPreview.Header style={modalHeaderStyles}>
              <p>Send Campaign</p>
              <Button style={cancelX} onClick={() => setShowConsentModal(false)}>
                <FontAwesomeIcon icon="times" style={{ color: '#B1B1B1', fontSize: '16px' }} />
              </Button>
            </ModalPreview.Header>
            <ModalPreview.Content style={postcardContainer}>
              <FlipCard isFlipped={isFlipped}>
                <FrontIframe />
                <BackIframe />
              </FlipCard>
            </ModalPreview.Content>
            <ModalPreview.Content>
              <div style={flipButtonContainer}>
                <Button
                  style={{
                    ...flipButtonStyles,
                    ...rightMargin,
                    ...(isFlipped ? highlightButton : {}),
                  }}
                  floated="right"
                  onClick={() => setIsFlipped(true)}
                >
                  Back
                </Button>
                <Button
                  style={{ ...flipButtonStyles, ...(!isFlipped ? highlightButton : {}) }}
                  floated="right"
                  onClick={() => setIsFlipped(false)}
                >
                  Front
                </Button>
              </div>
              <ModalPreview.Description style={{ textAlign: 'center', marginTop: '40px' }}>
                <p style={{ margin: 0 }}>I agree to be immediately charged</p>
                <b style={{ fontSize: '32px', lineHeight: '50px' }}>
                  {calculateCost(
                    details && details.recipientCount,
                    details && details.postcardSize ? details.postcardSize : '4x6'
                  )}
                </b>
                <br />
                <p>
                  {calculateCost(1, details && details.postcardSize ? details.postcardSize : '4x6')}{' '}
                  x {currentNumberOfRecipients}
                </p>
              </ModalPreview.Description>
            </ModalPreview.Content>
            <ModalPreview.Actions
              style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}
            >
              <Button style={cancelButton} onClick={() => setShowConsentModal(false)}>
                Cancel
              </Button>
              <Button
                primary
                onClick={() => [
                  dispatch(submitMailoutPending(mailoutId)),
                  setShowConsentModal(false),
                ]}
              >
                Agree
              </Button>
            </ModalPreview.Actions>
          </div>
        )}
      </ModalPreview>

      {!DestinationCalculation && (
        <Segment style={{ margin: '20px 0' }}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                {!pendingState && !error && details && (
                  <ItemLayout
                    fluid
                    key={details._id}
                    className={isMobile ? 'remove-margins' : undefined}
                  >
                    <ContentBottomHeaderLayout>
                      {
                        <ListHeader
                          data={details}
                          mailoutDetailPage={true}
                          onClickEdit={handleEditMailoutDetailsClick}
                          onClickApproveAndSend={handleApproveAndSendMailoutDetailsClick}
                          onClickDelete={handleDeleteMailoutDetailsClick}
                          lockControls={working}
                          onClickRevertEdit={handleRevertEditedMailoutClick}
                        />
                      }
                    </ContentBottomHeaderLayout>

                    <ItemBodyDataLayout relaxed>
                      <List.Item>
                        <List.Content>
                          <List.Header>
                            Recipients
                            {multiUser && (
                              <Popup
                                flowing
                                trigger={
                                  <FontAwesomeIcon
                                    icon="info-circle"
                                    style={{ marginLeft: '.5em', color: '#59C4C4' }}
                                  />
                                }
                                content={PopupMinMax({ mailoutSizeMin, mailoutSizeMax })}
                                position="top right"
                              />
                            )}
                          </List.Header>
                          <List.Description>
                            <RenderRecipients />
                          </List.Description>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          <List.Header>Size</List.Header>
                          <List.Description>{`${
                            details.postcardSize
                              ? postcardDimensionsDisplayed(details.postcardSize)
                              : '4x6'
                          }" / ${calculateCost(
                            1,
                            details.postcardSize ? details.postcardSize : '4x6'
                          )}`}</List.Description>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          <List.Header>Cost</List.Header>
                          <List.Description>
                            {calculateCost(
                              details.recipientCount,
                              details.postcardSize ? details.postcardSize : '4x6'
                            )}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          <List.Header>
                            Status
                            <Popup
                              flowing
                              trigger={
                                <FontAwesomeIcon
                                  icon="info-circle"
                                  style={{ marginLeft: '.5em', color: '#2DB5AD' }}
                                />
                              }
                              content={PopupContent()}
                              position="top right"
                            />
                          </List.Header>
                          <List.Description
                            style={{ color: resolveMailoutStatusColor(details.mailoutStatus) }}
                          >
                            <FontAwesomeIcon
                              icon={resolveMailoutStatusIcon(details.mailoutStatus)}
                              style={{ marginRight: '.5em' }}
                            />
                            {resolveMailoutStatus(details.mailoutStatus)}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          <List.Header>Created</List.Header>
                          <List.Description>{formatDate(details.created)}</List.Description>
                        </List.Content>
                      </List.Item>
                    </ItemBodyDataLayout>

                    <ItemBodyLayoutV2 attached style={{ padding: 8, overflow: 'auto' }}>
                      <ItemBodyIframeLayout
                        horizontal={windowSize.width > 1199}
                        style={{ border: 'none', boxShadow: 'none' }}
                      >
                        <div
                          style={{
                            margin: 'auto',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <FrontIframe />
                          <div style={{ padding: '16px' }}>
                            <BackIframe />
                          </div>
                        </div>
                      </ItemBodyIframeLayout>

                      {details.cta && (
                        <div className="details-customPostcardCTA">
                          Custom CTA:{' '}
                          <a href={details.cta} target="blank">
                            {details.cta}
                          </a>
                        </div>
                      )}
                    </ItemBodyLayoutV2>
                  </ItemLayout>
                )}
                {!pendingState &&
                  !error &&
                  details &&
                  details.mailoutStatus !== 'created' &&
                  destinationsOptionsMode !== 'userUploaded' && <GoogleMapItem data={details} />}

                {!pendingState && destinationsOptionsMode === 'userUploaded' && (
                  <div>Upload: {details.destinationsOptions?.userUploaded?.filename}</div>
                )}
                {!pendingState &&
                  !error &&
                  details &&
                  resolveMailoutStatus(details.mailoutStatus) === 'Sent' && (
                    <div id="top-download" style={{ margin: '5px', fontSize: '17px' }}>
                      <a className="ui secondary button" href={csvURL}>
                        Download All Recipients as CSV
                      </a>
                    </div>
                  )}
                {!pendingState &&
                  !error &&
                  details &&
                  (destinationsOptionsMode === 'userUploaded' ||
                    resolveMailoutStatus(details.mailoutStatus) === 'Sent') && (
                    <Table singleLine>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>Address</Table.HeaderCell>
                          <Table.HeaderCell>Delivery Date</Table.HeaderCell>
                          <Table.HeaderCell>Status</Table.HeaderCell>
                          <Table.HeaderCell>CTA count</Table.HeaderCell>
                          <Table.HeaderCell>CTA date</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>

                      <Table.Body>{renderDestinations()}</Table.Body>
                    </Table>
                  )}
                {!pendingState &&
                  !error &&
                  details &&
                  resolveMailoutStatus(details.mailoutStatus) === 'Sent' && (
                    <div id="bottom-download" style={{ margin: '5px', fontSize: '17px' }}>
                      <a className="ui secondary button" href={csvURL}>
                        Download All Recipients as CSV
                      </a>
                    </div>
                  )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      )}
      {DestinationCalculation && <Loading message="Calculating destinations, please wait..." />}
      {error && <Message error>Oh snap! {error}.</Message>}
    </Page>
  );
};

export default MailoutDetailsPage;
