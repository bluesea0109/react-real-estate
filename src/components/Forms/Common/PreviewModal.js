import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { reviewTeamCustomizationCompleted } from '../../../store/modules/teamCustomization/actions';
import { reviewCustomizationCompleted } from '../../../store/modules/customization/actions';
import { Button, Icon, Image, Modal } from '../../Base';
import FlipCard from '../../FlipCard';
import Loading from '../../Loading';

const PreviewModal = ({ formType, formValues }) => {
  const dispatch = useDispatch();

  const [displayReview, setDisplayReview] = useState(false);
  const [listedIsFlipped, setListedIsFlipped] = useState(false);
  const [soldIsFlipped, setSoldIsFlipped] = useState(false);

  let customizationPending;
  let customizationError;
  let postcardsPreviewIsPending;
  let postcardsPreviewError;
  let postcardsPreview;

  const onboardedStatus = useSelector(store => store.onboarded.status);
  const inOnboardingMode = onboardedStatus === false;

  const teamCustomizationPending = useSelector(store => store.teamCustomization && store.teamCustomization.pending);
  const teamCustomizationError = useSelector(store => store.teamCustomization && store.teamCustomization.error && store.teamCustomization.error.message);
  const teamPostcardsPreviewIsPending = useSelector(store => store.teamPostcards && store.teamPostcards.pending);
  const teamPostcardsPreviewError = useSelector(store => store.teamPostcards && store.teamPostcards.error && store.teamPostcards.error.message);
  const teamPostcardsPreview = useSelector(store => store.teamPostcards && store.teamPostcards.available);

  const agentCustomizationPending = useSelector(store => store.customization && store.customization.pending);
  const agentCustomizationError = useSelector(store => store.customization && store.customization.error && store.customization.error.message);
  const agentPostcardsPreviewIsPending = useSelector(store => store.postcards && store.postcards.pending);
  const agentPostcardsPreviewError = useSelector(store => store.postcards && store.postcards.error && store.postcards.error.message);
  const agentPostcardsPreview = useSelector(store => store.postcards && store.postcards.available);

  if (formType === 'team') {
    customizationPending = teamCustomizationPending;
    customizationError = teamCustomizationError;
    postcardsPreviewIsPending = teamPostcardsPreviewIsPending;
    postcardsPreviewError = teamPostcardsPreviewError;
    postcardsPreview = teamPostcardsPreview;
  }

  if (formType === 'agent') {
    customizationPending = agentCustomizationPending;
    customizationError = agentCustomizationError;
    postcardsPreviewIsPending = agentPostcardsPreviewIsPending;
    postcardsPreviewError = agentPostcardsPreviewError;
    postcardsPreview = agentPostcardsPreview;
  }

  useEffect(() => {
    let isInitialized = true;

    const listedIsEnabled = formValues && !!formValues.listed;
    const soldIsEnabled = formValues && !!formValues.sold;
    const skip = !listedIsEnabled && !soldIsEnabled;

    if (isInitialized && formType === 'agent' && (customizationPending || postcardsPreviewIsPending) && skip) {
      dispatch(reviewCustomizationCompleted());
    }

    if (isInitialized && !displayReview && postcardsPreviewIsPending && !skip) {
      setDisplayReview(true);
    }

    return () => (isInitialized = false);
  }, [displayReview, setDisplayReview, postcardsPreviewIsPending, formType, formValues, customizationPending, dispatch]);

  const handleReviewComplete = () => {
    setDisplayReview(false);

    if (formType === 'team' && inOnboardingMode) {
      dispatch(reviewTeamCustomizationCompleted());
    }

    if (formType === 'agent' && inOnboardingMode) {
      dispatch(reviewCustomizationCompleted());
    }
  };

  const listedEnabled = formValues && formValues.listed;
  const soldEnabled = formValues && formValues.sold;

  return (
    <Modal open={displayReview} basic size="tiny">
      {!postcardsPreviewIsPending && (
        <Modal.Header>
          Preview
          <Button primary inverted floated="right" onClick={() => [setListedIsFlipped(true), setSoldIsFlipped(true)]}>
            Flip Back
          </Button>
          <Button primary inverted floated="right" onClick={() => [setListedIsFlipped(false), setSoldIsFlipped(false)]}>
            Flip Forward
          </Button>
        </Modal.Header>
      )}

      {!customizationPending && (postcardsPreviewError || customizationError) && <Modal.Header>Error</Modal.Header>}

      {postcardsPreviewIsPending && <Loading message="Please wait, loading an example preview..." />}

      {!customizationPending && (postcardsPreviewError || customizationError) && (
        <Modal.Content style={{ padding: '0 45px 10px' }}>{postcardsPreviewError || customizationError}</Modal.Content>
      )}

      {listedEnabled &&
        postcardsPreview &&
        postcardsPreview.listed &&
        postcardsPreview.listed.sampleBackLargeUrl &&
        postcardsPreview.listed.sampleFrontLargeUrl && (
          <Modal.Content image style={{ padding: '0 45px 10px' }}>
            <FlipCard isFlipped={listedIsFlipped}>
              <Image
                wrapped
                size="large"
                src={postcardsPreview.listed.sampleFrontLargeUrl}
                label={{ as: 'a', corner: 'right', icon: 'undo', onClick: () => setListedIsFlipped(!listedIsFlipped) }}
              />

              <Image
                wrapped
                size="large"
                src={postcardsPreview.listed.sampleBackLargeUrl}
                label={{ as: 'a', corner: 'right', icon: 'redo', onClick: () => setListedIsFlipped(!listedIsFlipped) }}
              />
            </FlipCard>
          </Modal.Content>
        )}

      {soldEnabled && postcardsPreview && postcardsPreview.sold && postcardsPreview.sold.sampleBackLargeUrl && postcardsPreview.sold.sampleFrontLargeUrl && (
        <Modal.Content image style={{ padding: '10px 45px 0' }}>
          <FlipCard isFlipped={soldIsFlipped}>
            <Image
              wrapped
              size="large"
              src={postcardsPreview.sold.sampleFrontLargeUrl}
              label={{ as: 'a', corner: 'right', icon: 'undo', onClick: () => setSoldIsFlipped(!soldIsFlipped) }}
            />

            <Image
              wrapped
              size="large"
              src={postcardsPreview.sold.sampleBackLargeUrl}
              label={{ as: 'a', corner: 'right', icon: 'redo', onClick: () => setSoldIsFlipped(!soldIsFlipped) }}
            />
          </FlipCard>
        </Modal.Content>
      )}

      {!postcardsPreviewIsPending && (
        <Modal.Actions>
          {inOnboardingMode && (
            <Button secondary inverted onClick={() => setDisplayReview(false)}>
              <Icon name="remove" /> Edit
            </Button>
          )}
          <Button primary onClick={handleReviewComplete}>
            <Icon name="checkmark" /> {inOnboardingMode ? 'Continue' : 'OK'}
          </Button>
        </Modal.Actions>
      )}

      {!customizationPending && (postcardsPreviewError || customizationError) && (
        <Modal.Actions>
          <Button secondary onClick={() => setDisplayReview(false)}>
            <Icon name="remove" /> OK
          </Button>
        </Modal.Actions>
      )}
    </Modal>
  );
};

export default PreviewModal;
