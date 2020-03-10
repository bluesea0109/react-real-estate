import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Segment } from 'semantic-ui-react';

import { previewTeamCustomizationCompleted, reviewTeamCustomizationCompleted } from '../../../store/modules/teamCustomization/actions';
import { previewCustomizationCompleted, reviewCustomizationCompleted } from '../../../store/modules/customization/actions';
import { Button, Icon, Modal } from '../../Base';
import ApiService from '../../../services/api';
import FlipCard from '../../FlipCard';
import Loading from '../../Loading';

const RenderPreviewModal = ({ formType, formValues }) => {
  const dispatch = useDispatch();

  const [listedIsFlipped, setListedIsFlipped] = useState(false);
  const [soldIsFlipped, setSoldIsFlipped] = useState(false);

  const [listedFrontLoaded, setListedFrontLoaded] = useState(false);
  const [listedBackLoaded, setListedBackLoaded] = useState(false);
  const [soldFrontLoaded, setSoldFrontLoaded] = useState(false);
  const [soldBackLoaded, setSoldBackLoaded] = useState(false);

  let customizationPending;
  let customizationPreview;
  let customizationError;

  const peerId = useSelector(store => store.peer.peerId);
  const userId = useSelector(store => store.onLogin.user._id);
  const onboardedStatus = useSelector(store => store.onboarded.status);
  const inOnboardingMode = onboardedStatus === false;

  const teamCustomizationPending = useSelector(store => store.teamCustomization && store.teamCustomization.pending);
  const teamCustomizationPreview = useSelector(store => store.teamCustomization && store.teamCustomization.preview);
  const teamCustomizationError = useSelector(store => store.teamCustomization && store.teamCustomization.error && store.teamCustomization.error.message);

  const agentCustomizationPending = useSelector(store => store.customization && store.customization.pending);
  const agentCustomizationPreview = useSelector(store => store.customization && store.customization.preview);
  const agentCustomizationError = useSelector(store => store.customization && store.customization.error && store.customization.error.message);

  let listedPostcardFrontURL;
  let listedPostcardBackURL;
  let soldPostcardFrontURL;
  let soldPostcardBackURL;

  if (formType === 'team') {
    customizationPending = teamCustomizationPending;
    customizationPreview = teamCustomizationPreview;
    customizationError = teamCustomizationError;
    listedPostcardFrontURL = ApiService.directory.team.postcard.render.listed.front({ userId }).path;
    listedPostcardBackURL = ApiService.directory.team.postcard.render.listed.back({ userId }).path;
    soldPostcardFrontURL = ApiService.directory.team.postcard.render.sold.front({ userId }).path;
    soldPostcardBackURL = ApiService.directory.team.postcard.render.sold.back({ userId }).path;
  }

  if (formType === 'agent') {
    customizationPending = agentCustomizationPending;
    customizationPreview = agentCustomizationPreview;
    customizationError = agentCustomizationError;
    listedPostcardFrontURL = peerId
      ? ApiService.directory.peer.postcard.render.listed.front({ userId, peerId }).path
      : ApiService.directory.user.postcard.render.listed.front({ userId }).path;

    listedPostcardBackURL = peerId
      ? ApiService.directory.peer.postcard.render.listed.back({ userId, peerId }).path
      : ApiService.directory.user.postcard.render.listed.back({ userId }).path;

    soldPostcardFrontURL = peerId
      ? ApiService.directory.peer.postcard.render.sold.front({ userId, peerId }).path
      : ApiService.directory.user.postcard.render.sold.front({ userId }).path;

    soldPostcardBackURL = peerId
      ? ApiService.directory.peer.postcard.render.sold.back({ userId, peerId }).path
      : ApiService.directory.user.postcard.render.sold.back({ userId }).path;
  }

  const handleOnload = useCallback(
    event => {
      const {
        name,
        document: { body },
      } = event.target.contentWindow;

      body.style.overflow = 'hidden';
      body.style['pointer-events'] = 'none';
      // body.style.transform = 'translate(-25%,-25%) scale(0.5)';

      if (name === 'listed-front') {
        setListedFrontLoaded(true);
      }
      if (name === 'listed-back') {
        setListedBackLoaded(true);
      }

      if (name === 'sold-front') {
        setSoldFrontLoaded(true);
      }
      if (name === 'sold-back') {
        setSoldBackLoaded(true);
      }
    },
    [setListedFrontLoaded, setListedBackLoaded, setSoldFrontLoaded, setSoldBackLoaded]
  );

  useEffect(() => {
    let isInitialized = true;

    const listedIsEnabled = formValues && !!formValues.listed;
    const soldIsEnabled = formValues && !!formValues.sold;
    const skip = !listedIsEnabled && !soldIsEnabled;

    if (isInitialized && formType === 'agent' && customizationPreview && skip) {
      dispatch(reviewCustomizationCompleted());
    }

    return () => (isInitialized = false);
  }, [formType, formValues, customizationPreview, dispatch]);

  const handleReviewComplete = () => {
    if (formType === 'team') {
      dispatch(previewTeamCustomizationCompleted());
      if (inOnboardingMode) {
        dispatch(reviewTeamCustomizationCompleted());
      }
    }

    if (formType === 'agent') {
      dispatch(previewCustomizationCompleted());
      if (inOnboardingMode) {
        dispatch(reviewCustomizationCompleted());
      }
    }
  };

  const handlePreviewComplete = () => {
    if (formType === 'team') {
      dispatch(previewTeamCustomizationCompleted());
    }

    if (formType === 'agent') {
      dispatch(previewCustomizationCompleted());
    }
  };

  const listedEnabled = formValues && formValues.listed;
  const soldEnabled = formValues && formValues.sold;

  if (customizationPending) {
    return (
      <Modal open={customizationPreview} basic size="tiny">
        <Modal.Content style={{ padding: '0 45px 10px' }}>
          <Loading message="Please wait, loading an example preview..." />
        </Modal.Content>
        <Modal.Actions>
          <Button secondary onClick={handlePreviewComplete}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  } else {
    if (customizationError) {
      return (
        <Modal open={customizationPreview} basic size="tiny">
          <Modal.Header>Error</Modal.Header>
          <Modal.Content style={{ padding: '0 45px 10px' }}>{customizationError}</Modal.Content>
          <Modal.Actions>
            <Button secondary onClick={handlePreviewComplete}>
              <Icon name="remove" /> OK
            </Button>
          </Modal.Actions>
        </Modal>
      );
    } else {
      return (
        <Modal open={customizationPreview} basic size="tiny">
          <Modal.Header>
            Preview
            <Button primary inverted floated="right" onClick={() => [setListedIsFlipped(true), setSoldIsFlipped(true)]}>
              Flip Back
            </Button>
            <Button primary inverted floated="right" onClick={() => [setListedIsFlipped(false), setSoldIsFlipped(false)]}>
              Flip Forward
            </Button>
          </Modal.Header>

          {listedEnabled && (
            <Modal.Content image style={{ padding: '0 45px 10px' }}>
              <FlipCard isFlipped={listedIsFlipped}>
                <Segment textAlign="center" loading={!listedFrontLoaded} style={{ border: 'none' }}>
                  <iframe
                    id="bm-iframe-listed-front"
                    title={`bm-iframe-listed-front-${formType}`}
                    name="listed-front"
                    src={listedPostcardFrontURL}
                    width="600"
                    height="408"
                    frameBorder="0"
                    sandbox="allow-same-origin allow-scripts"
                    onLoad={handleOnload}
                    className="image-frame-border"
                  />
                </Segment>

                <Segment textAlign="center" loading={!listedBackLoaded} style={{ border: 'none' }}>
                  <iframe
                    id="bm-iframe-listed-back"
                    title={`bm-iframe-listed-back-${formType}`}
                    name="listed-back"
                    src={listedPostcardBackURL}
                    width="600"
                    height="408"
                    frameBorder="0"
                    sandbox="allow-same-origin allow-scripts"
                    onLoad={handleOnload}
                    className="image-frame-border"
                  />
                </Segment>
              </FlipCard>
            </Modal.Content>
          )}

          {soldEnabled && (
            <Modal.Content image style={{ padding: '10px 45px 0' }}>
              <FlipCard isFlipped={soldIsFlipped}>
                <Segment textAlign="center" loading={!soldFrontLoaded} style={{ border: 'none' }}>
                  <iframe
                    id="bm-iframe-sold-front"
                    title={`bm-iframe-sold-front-${formType}`}
                    name="sold-front"
                    src={soldPostcardFrontURL}
                    width="600"
                    height="408"
                    frameBorder="0"
                    sandbox="allow-same-origin allow-scripts"
                    onLoad={handleOnload}
                    className="image-frame-border"
                  />
                </Segment>

                <Segment textAlign="center" loading={!soldBackLoaded} style={{ border: 'none' }}>
                  <iframe
                    id="bm-iframe-sold-back"
                    title={`bm-iframe-sold-back-${formType}`}
                    name="sold-back"
                    src={soldPostcardBackURL}
                    width="600"
                    height="408"
                    frameBorder="0"
                    sandbox="allow-same-origin allow-scripts"
                    onLoad={handleOnload}
                    className="image-frame-border"
                  />
                </Segment>
              </FlipCard>
            </Modal.Content>
          )}

          <Modal.Actions>
            {inOnboardingMode && (
              <Button secondary inverted onClick={handlePreviewComplete}>
                <Icon name="remove" /> Edit
              </Button>
            )}
            <Button primary onClick={handleReviewComplete}>
              <Icon name="checkmark" /> {inOnboardingMode ? 'Continue' : 'OK'}
            </Button>
          </Modal.Actions>
        </Modal>
      );
    }
  }
};

export default RenderPreviewModal;
