import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import auth from '../../services/auth';
import api from '../../services/api';
import React, { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { TableRow, TableCampaign } from '../../components/MailoutDetailsComponents/MailoutTable';
import ModalPreview from '../../components/MailoutDetailsComponents/ModalPreview';
import TableModal from '../../components/MailoutDetailsComponents/TableModal';
import { stopMailoutPending } from '../../store/modules/mailout/actions';
import { resolveMailoutStatus } from '../../components/MailoutListItem/utils/helpers';
import { Grid, Message, Page, Segment } from '../../components/Base';
import { getMailoutPending } from '../../store/modules/mailout/actions';
import ListHeader from '../../components/MailoutListItem/ListHeader';
import { iframeDimensions } from '../../components/utils/utils';
import GoogleMapItem from '../../components/Forms/PolygonGoogleMaps/GoogleMapItem';
import Loading from '../../components/Loading';
import {
  ContentBottomHeaderLayout,
  ContentTopHeaderLayout,
  ItemBodyIframeLayout,
  ItemBodyLayoutV2,
  ItemLayout,
} from '../../layouts';
import { useIsMobile } from '../../components/Hooks/useIsMobile';
import { useWindowSize } from '../../components/Hooks/useWindowSize';
import { BackIframe, FrontIframe, MailoutData, TopHeader } from '.';

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

  const [currentNumberOfRecipients, setCurrentNumberOfRecipients] = useState(0);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);

  const [frontLoaded, setFrontLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);
  const [isTableFlipped, setIsTableFlipped] = useState(false);
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

  const destinationsOptionsMode = details && details.destinationsOptions?.mode;

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

  const [previewUrl, setPreviewUrl] = useState([]);

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
    history.push(`/postcards`);
  };

  const handleApproveAndSendMailoutDetailsClick = () => {
    setShowConsentModal(true);
  };

  const handleDeleteMailoutDetailsClick = () => {
    dispatch(stopMailoutPending(mailoutId));
  };

  const handleEditMailoutDetailsClick = () => {
    history.push(`/postcards/edit/${details._id}`);
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
          <TableRow
            key={dest.id}
            dest={dest}
            setPreviewUrl={setPreviewUrl}
            setShowTableModal={setShowTableModal}
            status={status}
            ctaInteractions={ctaInteractions}
            ctaDate={ctaDate}
          />
        );
      })
    );
  };

  const postCardSize = {
    width: details && iframeDimensions(details.postcardSize).width,
    height: details && iframeDimensions(details.postcardSize).height,
  };

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <TopHeader handleBackClick={handleBackClick} working={working} />
        {pendingState && !error && <Loading />}
      </ContentTopHeaderLayout>
      <ModalPreview
        postCardSize={postCardSize}
        open={showConsentModal}
        setShowConsentModal={setShowConsentModal}
        details={details}
        currentNumberOfRecipients={currentNumberOfRecipients}
        mailoutId={mailoutId}
        dispatch={dispatch}
        frontCard={
          <FrontIframe
            campaignId={details?._id}
            frontLoaded={frontLoaded}
            frontResourceUrl={details?.frontResourceUrl}
            frontURL={frontURL}
            handleOnload={handleOnload}
            postcardSize={details?.postcardSize}
          />
        }
        backCard={
          <BackIframe
            campaignId={details?._id}
            backLoaded={backLoaded}
            backResourceUrl={details?.backResourceUrl}
            backURL={backURL}
            handleOnload={handleOnload}
            postcardSize={details?.postcardSize}
          />
        }
      />

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
                        />
                      }
                    </ContentBottomHeaderLayout>

                    <MailoutData currentNumberOfRecipients={currentNumberOfRecipients} />

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
                          <FrontIframe
                            campaignId={details?._id}
                            frontLoaded={frontLoaded}
                            frontResourceUrl={details?.frontResourceUrl}
                            frontURL={frontURL}
                            handleOnload={handleOnload}
                            postcardSize={details?.postcardSize}
                          />
                          <div style={{ padding: '16px' }}>
                            <BackIframe
                              campaignId={details?._id}
                              backLoaded={backLoaded}
                              backResourceUrl={details?.backResourceUrl}
                              backURL={backURL}
                              handleOnload={handleOnload}
                              postcardSize={details?.postcardSize}
                            />
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
                  (destinationsOptionsMode === 'userUploaded' ||
                    resolveMailoutStatus(details.mailoutStatus) === 'Sent') && (
                    <TableCampaign
                      renderDestinations={renderDestinations}
                      TableModal={
                        <TableModal
                          postCardSize={postCardSize}
                          open={showTableModal}
                          setShowTableModal={setShowTableModal}
                          setIsTableFlipped={setIsTableFlipped}
                          details={details}
                          isTableFlipped={isTableFlipped}
                          previewUrl={previewUrl}
                        />
                      }
                    />
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
