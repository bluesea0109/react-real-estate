import React, { useState } from 'react';
import { Button, Modal } from '../Base';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FlipCard from '../FlipCard';
import { calculateCost } from '../MailoutListItem/utils/helpers';
import { submitMailoutPending } from '../../store/modules/mailout/actions';

const ModalPreviewStyled = styled(Modal)`
  width: ${props => css`calc(${props.widthsize + 70}px)`};
  .content {
    justify-content: center;
  }
  @media (max-width: ${props => props.widthsize + 200}px) {
    &&& {
      width: 90%;
    }
    .content {
      justify-content: flex-start;
    }
  }
`;

const modalHeaderStyles = {
  padding: '4px 0px 16px 0px',
  display: 'flex',
  fontSize: '29px',
  color: '#59c4c4',
  justifyContent: 'space-between',
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

const cancelButton = {
  borderRadius: '50px',
  textTransform: 'uppercase',
  color: '#666666',
  fontWeight: 'bold',
};

const postcardContainer = {
  display: 'flex',
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

const ModalPreview = ({
  postCardSize,
  open,
  details,
  currentNumberOfRecipients,
  setShowConsentModal,
  frontCard,
  backCard,
  mailoutId,
  dispatch,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <ModalPreviewStyled
      widthsize={postCardSize.width}
      open={open}
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
          <ModalPreviewStyled.Header style={modalHeaderStyles}>
            <p>Send Campaign</p>
            <Button style={cancelX} onClick={() => setShowConsentModal(false)}>
              <FontAwesomeIcon icon="times" style={{ color: '#B1B1B1', fontSize: '16px' }} />
            </Button>
          </ModalPreviewStyled.Header>
          <ModalPreviewStyled.Content style={postcardContainer}>
            <FlipCard isFlipped={isFlipped}>
              {frontCard}
              {backCard}
            </FlipCard>
          </ModalPreviewStyled.Content>
          <ModalPreviewStyled.Content>
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
            <ModalPreviewStyled.Description style={{ textAlign: 'center', marginTop: '40px' }}>
              <p style={{ margin: 0 }}>I agree to be immediately charged</p>
              <b style={{ fontSize: '32px', lineHeight: '50px' }}>
                {calculateCost(
                  details && details.recipientCount,
                  details && details.postcardSize ? details.postcardSize : '4x6'
                )}
              </b>
              <br />
              <p>
                {calculateCost(1, details && details.postcardSize ? details.postcardSize : '4x6')} x{' '}
                {currentNumberOfRecipients}
              </p>
            </ModalPreviewStyled.Description>
          </ModalPreviewStyled.Content>
          <ModalPreviewStyled.Actions
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
          </ModalPreviewStyled.Actions>
        </div>
      )}
    </ModalPreviewStyled>
  );
};

export default ModalPreview;
