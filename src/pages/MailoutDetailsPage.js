import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useLastLocation } from 'react-router-last-location';
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns'

import { resetMailout, revertMailoutEditPending, stopMailoutPending, submitMailoutPending } from '../store/modules/mailout/actions';
import { calculateCost, formatDate, resolveMailoutStatus, resolveMailoutStatusColor, resolveMailoutStatusIcon } from '../components/MailoutListItem/helpers';
import { Button, Grid, Header, Icon, Input, List, Menu, Message, Modal, Page, Popup, Segment, Table } from '../components/Base';
import { iframeTransformMobile, iframeTransformDesktop } from '../components/helpers';
import PopupContent from '../components/MailoutListItem/PopupContent';
import { getMailoutPending } from '../store/modules/mailout/actions';
import PopupMinMax from '../components/MailoutListItem/PopupMinMax';
import ListHeader from '../components/MailoutListItem/ListHeader';
import PageTitleHeader from '../components/PageTitleHeader';
import { isMobile, min1200Width } from '../components/utils';
import GoogleMapItem from '../components/GoogleMapItem';
import FlipCard from '../components/FlipCard';
import Loading from '../components/Loading';
import ApiService from '../services/api';
import {
  ContentBottomHeaderLayout,
  ContentSpacerLayout,
  ContentTopHeaderLayout,
  ItemBodyDataLayout,
  ItemBodyIframeLayout,
  ItemBodyLayoutV2,
  ItemLayout,
} from '../layouts';

const useFetching = (getActionCreator, dispatch, mailoutId) => {
  useEffect(() => {
    dispatch(getActionCreator(mailoutId));
  }, [getActionCreator, dispatch, mailoutId]);
};

const MailoutDetailsPage = () => {
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

  const pendingState = useSelector(store => store.mailout.pending);
  const updateMailoutEditPendingState = useSelector(store => store.mailout.updateMailoutEditPending);
  const submitPendingState = useSelector(store => store.mailout.submitPending);
  const stopPendingState = useSelector(store => store.mailout.stopPending);
  const updateMailoutSizePendingState = useSelector(store => store.mailout.updateMailoutSizePending);

  const details = useSelector(store => store.mailout.details);
  const error = useSelector(store => store.mailout.error?.message);

  const teamCustomization = useSelector(store => store.teamCustomization.available);
  const onLoginMode = useSelector(store => store.onLogin?.mode);
  const multiUser = onLoginMode === 'multiuser';
  const listingType = details && details.listingStatus;
  const destinationsOptionsMode = details && details.destinationsOptions?.mode
  const listingDefaults = teamCustomization && teamCustomization[listingType];
  const mailoutSizeMin = listingDefaults && listingDefaults.mailoutSizeMin;
  const mailoutSizeMax = listingDefaults && listingDefaults.mailoutSizeMax;

  const peerId = useSelector(store => store.peer.peerId);

  const frontURL = peerId
    ? ApiService.directory.peer.mailout.render.front({ userId: details?.userId, peerId, mailoutId: details?._id }).path
    : ApiService.directory.user.mailout.render.front({ userId: details?.userId, mailoutId: details?._id }).path;

  const backURL = peerId
    ? ApiService.directory.peer.mailout.render.back({ userId: details?.userId, peerId, mailoutId: details?._id }).path
    : ApiService.directory.user.mailout.render.back({ userId: details?.userId, mailoutId: details?._id }).path;

  const csvURL = peerId
  ? ApiService.directory.peer.mailout.csv({ userId: details?.userId, peerId, mailoutId: details?._id }).path
  : ApiService.directory.user.mailout.csv({ userId: details?.userId, mailoutId: details?._id }).path;

  const handleOnload = useCallback(
    event => {
      const {
        name,
        document: { body },
      } = event.target.contentWindow;

      body.style.overflow = 'hidden';
      body.style['pointer-events'] = 'none';
      body.style.transform = isMobile() ? iframeTransformMobile : iframeTransformDesktop;

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
    const busyState = pendingState || updateMailoutEditPendingState || submitPendingState || stopPendingState || updateMailoutSizePendingState;
    setWorking(busyState);
  }, [pendingState, updateMailoutEditPendingState, submitPendingState, stopPendingState, updateMailoutSizePendingState]);

  const handleBackClick = () => {
    dispatch(resetMailout());
    if (lastLocation.pathname === `/dashboard/edit/${mailoutId}` || lastLocation.pathname === `/dashboard/${mailoutId}`) {
      history.push(`/dashboard`);
    }
    if (lastLocation.pathname === `/dashboard` || `/dashboard/archived`) {
      history.goBack();
    }
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
  }

  const RenderRecipients = () => {
    const enableEditRecipients = resolveMailoutStatus(details.mailoutStatus) !== 'Sent' && resolveMailoutStatus(details.mailoutStatus) !== 'Processing';
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
            style={{ marginLeft: '10px', minWidth: '5em' }}
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
        let ctaDate = ''
        if (dest.first_cta_interaction) ctaDate = format(dest.first_cta_interaction, 'MM/dd/yyyy')
        let ctaInteractions = ''
        if (dest.cta_interactions) ctaInteractions = dest.cta_interactions
        let status = '-'
        if (dest.status && dest.status !== 'unknown') status = dest.status
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
  }

  const FrontIframe = () => (
    <Segment compact textAlign="center" loading={!details?._id || !frontLoaded} style={{ border: 'none', padding: '1px', margin: 'auto' }}>
      <iframe
        id="bm-iframe-front"
        title={`bm-iframe-front-${details?._id}`}
        name="front"
        src={frontURL}
        width={isMobile() ? '300' : '588'}
        height={isMobile() ? '204' : '400'}
        frameBorder="0"
        sandbox="allow-same-origin allow-scripts"
        onLoad={handleOnload}
        className="image-frame-border"
        style={{ visibility: !details?._id || !frontLoaded ? 'hidden' : 'visible' }}
      />
    </Segment>
  );

  const BackIframe = () => (
    <Segment compact textAlign="center" loading={!details?._id || !backLoaded} style={{ border: 'none', padding: '1px', margin: 'auto' }}>
      <iframe
        id="bm-iframe-back"
        title={`bm-iframe-back-${details?._id}`}
        name="back"
        src={backURL}
        width={isMobile() ? '300' : '588'}
        height={isMobile() ? '204' : '400'}
        frameBorder="0"
        sandbox="allow-same-origin allow-scripts"
        onLoad={handleOnload}
        className="image-frame-border"
        style={{ visibility: !details?._id || !backLoaded ? 'hidden' : 'visible' }}
      />
    </Segment>
  );

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
                <Button primary inverted onClick={() => handleBackClick()} disabled={working} loading={working}>
                  Back
                </Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </PageTitleHeader>
        {pendingState && !error && <Loading />}
      </ContentTopHeaderLayout>

      <ContentSpacerLayout />

      <Modal open={showConsentModal} onClose={() => setShowConsentModal(false)} basic size="small">
        <Modal.Header>
          Preview
          <Button primary inverted floated="right" onClick={() => setIsFlipped(true)} disabled={isFlipped}>
            Flip Back
          </Button>
          <Button primary inverted floated="right" onClick={() => setIsFlipped(false)} disabled={!isFlipped}>
            Flip Forward
          </Button>
        </Modal.Header>
        <Modal.Content>
          <FlipCard isFlipped={isFlipped}>
            <FrontIframe />
            <BackIframe />
          </FlipCard>
        </Modal.Content>
        <Modal.Content>
          <Modal.Description style={{ textAlign: 'center' }}>
            <p style={{ margin: 0 }}>I agree to be immediately charged</p>
            <b style={{ fontSize: '32px' }}>{calculateCost(details && details.recipientCount)}</b>
            <br />
            <p>$0.59 x {currentNumberOfRecipients}</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button secondary inverted onClick={() => setShowConsentModal(false)}>
            <Icon name="remove" /> Cancel
          </Button>
          <Button primary onClick={() => [dispatch(submitMailoutPending(mailoutId)), setShowConsentModal(false)]}>
            <Icon name="checkmark" /> Agree
          </Button>
        </Modal.Actions>
      </Modal>

      <Segment style={isMobile() ? { marginTop: '-1rem', marginLeft: '-1rem', marginRight: '-1rem' } : { marginTop: '34px' }}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              {!pendingState && !error && details && (
                <ItemLayout fluid key={details._id} className={isMobile() ? 'remove-margins' : undefined}>
                  <ContentBottomHeaderLayout style={isMobile() ? { marginTop: '60px' } : {}}>
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

                  <ItemBodyLayoutV2 attached style={isMobile() ? { padding: 0, marginTop: '173px' } : { padding: 0, marginTop: '89px' }}>
                    <ItemBodyIframeLayout horizontal={min1200Width()} style={{ border: 'none', boxShadow: 'none' }}>
                      <FrontIframe />
                      <BackIframe />
                    </ItemBodyIframeLayout>

                    <ItemBodyDataLayout relaxed>
                      <List.Item>
                        <List.Content>
                          <List.Header>
                            Recipients
                            {multiUser && (
                              <Popup
                                flowing
                                trigger={<FontAwesomeIcon icon="info-circle" style={{ marginLeft: '.5em', color: '#2DB5AD' }} />}
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
                          <List.Header>Cost</List.Header>
                          <List.Description>{calculateCost(details.recipientCount)}</List.Description>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          <List.Header>
                            Status
                            <Popup
                              flowing
                              trigger={<FontAwesomeIcon icon="info-circle" style={{ marginLeft: '.5em', color: '#2DB5AD' }} />}
                              content={PopupContent()}
                              position="top right"
                            />
                          </List.Header>
                          <List.Description style={{ color: resolveMailoutStatusColor(details.mailoutStatus) }}>
                            <FontAwesomeIcon icon={resolveMailoutStatusIcon(details.mailoutStatus)} style={{ marginRight: '.5em' }} />
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
                    {details.cta && (<div className="details-customPostcardCTA">
                      Custom CTA: <a href={details.cta} target="blank">{details.cta}</a>
                    </div>)}
                  </ItemBodyLayoutV2>
                </ItemLayout>
              )}
              {!pendingState && !error && details && destinationsOptionsMode !== 'userUploaded' && <GoogleMapItem data={details} />}

              {!pendingState && destinationsOptionsMode === 'userUploaded' && (
                <div>
                  Upload: {details.destinationsOptions?.userUploaded?.filename}
                </div>
              )}
              {!pendingState && !error && details && resolveMailoutStatus(details.mailoutStatus) === 'Sent' && (
              <div
                  id="top-download"
                  style={{margin: "5px", fontSize: "17px"}}
              >
                <a className="ui secondary button" href={csvURL}>Download All Recipients as CSV</a>
              </div>
              )}
              {!pendingState && !error && details &&  (
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

                  <Table.Body>
                    {renderDestinations()}
                  </Table.Body>
                </Table>
              )}
              {!pendingState && !error && details && resolveMailoutStatus(details.mailoutStatus) === 'Sent' && (
                <div
                    id="bottom-download"
                    style={{margin: "5px", fontSize: "17px"}}
                >
                  <a className="ui secondary button" href={csvURL}>Download All Recipients as CSV</a>
                </div>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      {error && <Message error>Oh snap! {error}.</Message>}
    </Page>
  );
};

export default MailoutDetailsPage;
