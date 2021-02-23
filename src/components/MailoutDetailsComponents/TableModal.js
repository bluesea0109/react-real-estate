import React from 'react';
import { Button, Modal, Image } from '../Base';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FlipCard from '../FlipCard';
import {
  modalHeaderStyles,
  cancelX,
  postcardContainer,
  flipButtonContainer,
  flipButtonStyles,
  rightMargin,
  highlightButton,
} from './ModalStyles';

const ModalTablePreview = styled(Modal)`
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

const ModalImage = {
  border: '1px solid #dadada',
};

const TableModal = ({
  postCardSize,
  open,
  setShowTableModal,
  setIsTableFlipped,
  details,
  isTableFlipped,
  previewUrl,
}) => {
  return (
    <ModalTablePreview
      widthsize={postCardSize.width}
      open={open}
      onClose={() => {
        setShowTableModal(false);
        setIsTableFlipped(false);
      }}
      size="small"
    >
      {details && (
        <div
          style={{
            maxWidth: '100%',
            margin: 'auto',
            width: `calc(${postCardSize.width}px + 70px)`,
            height: '100%',
            paddingBottom: '30px',
          }}
        >
          <ModalTablePreview.Header style={modalHeaderStyles}>
            <p>Preview</p>
            <Button
              style={cancelX}
              onClick={() => {
                setShowTableModal(false);
                setIsTableFlipped(false);
              }}
            >
              <FontAwesomeIcon icon="times" style={{ color: '#B1B1B1', fontSize: '16px' }} />
            </Button>
          </ModalTablePreview.Header>
          <ModalTablePreview.Content style={postcardContainer}>
            <FlipCard isFlipped={isTableFlipped}>
              <Image style={ModalImage} src={previewUrl[0]} />
              <Image style={ModalImage} src={previewUrl[1]} />
            </FlipCard>
          </ModalTablePreview.Content>
          <ModalTablePreview.Content>
            <div style={flipButtonContainer}>
              <Button
                style={{
                  ...flipButtonStyles,
                  ...rightMargin,
                  ...(isTableFlipped ? highlightButton : {}),
                }}
                floated="right"
                onClick={() => setIsTableFlipped(true)}
              >
                Back
              </Button>
              <Button
                style={{ ...flipButtonStyles, ...(!isTableFlipped ? highlightButton : {}) }}
                floated="right"
                onClick={() => setIsTableFlipped(false)}
              >
                Front
              </Button>
            </div>
          </ModalTablePreview.Content>
        </div>
      )}
    </ModalTablePreview>
  );
};

export default TableModal;
