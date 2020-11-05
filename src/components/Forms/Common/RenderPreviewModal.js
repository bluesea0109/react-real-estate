import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Segment } from 'semantic-ui-react';

import { previewTeamCustomizationCompleted, reviewTeamCustomizationCompleted } from '../../../store/modules/teamCustomization/actions';
import { previewCustomizationCompleted, reviewCustomizationCompleted } from '../../../store/modules/customization/actions';
import { iframeTransformDesktop, iframeTransformMobile } from '../../helpers';
import { Button, Icon, Modal } from '../../Base';
import ApiService from '../../../services/api';
import FlipCard from '../../FlipCard';
import Loading from '../../Loading';
import { useIsMobile } from '../../Hooks/useIsMobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Styled from 'styled-components';

const modalHeaderStyles = {
  padding: '4px 0px 0px 0px',
  display: 'flex',
  fontSize: '29px',
  color: '#59c4c4',
  justifyContent: 'space-between',
  borderBottom: 'none',
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
  marginTop: '0px',
  marginRight: '0px',
};

const modalActionStyles = {
  borderTop: 'none',
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '0px',
  padding: '0px',
};

const modalHeaderP = {
  marginBottom: '9px',
  fontSize: '26px',
  fontWeight: '400',
};

const segmentStyle = {
  border: 'none',
  padding: '2px',
  margin: 'auto',
  boxShadow: 'none',
};

const ModalPreview = Styled(Modal)`

@media only screen and (max-width: 700px) {
  &&&{
    width:90%;
  }
}
`;

const RenderPreviewModal = ({ formType, formValues }) => {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();

  const [isFlipped, setIsFlipped] = useState(false);

  const [listedFrontLoaded, setListedFrontLoaded] = useState(false);
  const [listedBackLoaded, setListedBackLoaded] = useState(false);
  const [soldFrontLoaded, setSoldFrontLoaded] = useState(false);
  const [soldBackLoaded, setSoldBackLoaded] = useState(false);

  let customizationPending;
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

  const [customizationPreview, setCustomizationPreview] = useState(() => {
    if (formType === 'team') return teamCustomizationPreview;
    if (formType === 'agent') return agentCustomizationPreview;
  });

  let listedPostcardFrontURL;
  let listedPostcardBackURL;
  let soldPostcardFrontURL;
  let soldPostcardBackURL;

  if (formType === 'team') {
    customizationPending = teamCustomizationPending;
    customizationError = teamCustomizationError;
    listedPostcardFrontURL = ApiService.directory.team.postcard.render.listed.front({ userId }).path;
    listedPostcardBackURL = ApiService.directory.team.postcard.render.listed.back({ userId }).path;
    soldPostcardFrontURL = ApiService.directory.team.postcard.render.sold.front({ userId }).path;
    soldPostcardBackURL = ApiService.directory.team.postcard.render.sold.back({ userId }).path;
  }

  if (formType === 'agent') {
    customizationPending = agentCustomizationPending;
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
      body.style.transform = isMobile ? iframeTransformMobile : iframeTransformDesktop;

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
    [setListedFrontLoaded, setListedBackLoaded, setSoldFrontLoaded, setSoldBackLoaded, isMobile]
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

  if (customizationPending) {
    return (
      <Modal open={customizationPreview} size="tiny">
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
        <Modal open={customizationPreview} size="tiny">
          <Modal.Header style={modalHeaderStyles}>Error</Modal.Header>
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
        <ModalPreview open={customizationPreview} size="small">
          <ModalPreview.Header style={modalHeaderStyles}>
            <p style={modalHeaderP}>Preview</p>
            <Button style={cancelX} onClick={() => setCustomizationPreview(false)}>
              <FontAwesomeIcon icon="times" style={{ color: '#B1B1B1', fontSize: '16px' }} />
            </Button>
          </ModalPreview.Header>

          <ModalPreview.Content image style={{ padding: '0 45px 10px' }}>
            <FlipCard isFlipped={isFlipped}>
              <Segment textAlign="center" loading={!listedFrontLoaded} style={segmentStyle}>
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

              <Segment textAlign="center" loading={!listedBackLoaded} style={segmentStyle}>
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
          </ModalPreview.Content>

          <ModalPreview.Content image style={{ padding: '10px 45px 0' }}>
            <FlipCard isFlipped={isFlipped}>
              <Segment textAlign="center" loading={!soldFrontLoaded} style={segmentStyle}>
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

              <Segment textAlign="center" loading={!soldBackLoaded} style={segmentStyle}>
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
          </ModalPreview.Content>
          <ModalPreview.Content>
            <div style={flipButtonContainer}>
              <Button style={{ ...flipButtonStyles, ...rightMargin, ...(isFlipped ? highlightButton : {}) }} floated="right" onClick={() => setIsFlipped(true)}>
                Back
              </Button>
              <Button style={{ ...flipButtonStyles, ...(!isFlipped ? highlightButton : {}) }} floated="right" onClick={() => setIsFlipped(false)}>
                Front
              </Button>
            </div>
          </ModalPreview.Content>
          <ModalPreview.Actions style={modalActionStyles}>
            {inOnboardingMode && (
              <Button style={cancelButton} onClick={() => setCustomizationPreview(false)}>
                <Icon name="remove" /> Edit
              </Button>
            )}
            <Button primary onClick={handleReviewComplete}>
              <Icon name="checkmark" /> {inOnboardingMode ? 'Continue' : 'OK'}
            </Button>
          </ModalPreview.Actions>
        </ModalPreview>
      );
    }
  }
};

export default RenderPreviewModal;
