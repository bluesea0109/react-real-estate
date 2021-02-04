import React, { createRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Icon } from './Base';
import * as brandColors from './utils/brandColors';

const Tooltip = styled.div`
  &[data-position='top center'][data-tooltip]:after {
    border-radius: 0px;
    background: #343434;
    bottom: 55%;
    left: 50%;
  }

  &[data-inverted][data-position~='top'][data-tooltip]:before {
    background: #343434;
  }

  &[data-position='top center'][data-tooltip]:before {
    bottom: 50%;
    left: 50%;
  }
  & p {
    width: 256px;
    padding-top: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ContentItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: ${brandColors.grey04};
  font-weight: bold;
  text-transform: capitalize;
  border-radius: 6px;
  width: 256px;
  & .image-container {
    width: 100%;
    height: 176px;
    position: relative;
    border-radius: 6px;
    padding: 0.5rem;
    box-shadow: 0 3px 8px 0 rgba(201, 201, 201, 0.4);
    & .image-overlay {
      color: white;
      display: none;
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      width: calc(100% - 1rem);
      height: calc(100% - 1rem);
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      text-transform: uppercase;
      padding: 2rem 0;
      font-size: 12px;
      & div {
        cursor: pointer;
      }
      & #image-download {
        color: white;
        padding: 0.4rem 1rem;
        border-radius: 1.5rem;
        border: 2px solid white;
      }
    }
    & img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
    &:hover {
      & .image-overlay {
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
      }
    }
  }
  & .item-name {
    padding-top: 1rem;
    text-transform: capitalize;
  }
`;

const inlineWidth = {
  display: 'inline-block',
};

export default function ReadyMadeContentItem({
  contentList,
  downloadImage,
  item,
  setCurrentItem,
  setShowImageModal,
}) {
  const [titleWidth, setTitleWidth] = useState();
  const widthRef = createRef();

  useEffect(() => {
    setTitleWidth(widthRef?.current.clientWidth);
  }, [widthRef]);

  return (
    <ContentItemContainer>
      <div className="image-container">
        <img src={item.thumbnail} alt="content-list-item" />
        <div className="image-overlay">
          <div id="image-download" onClick={() => downloadImage(item)}>
            Download
          </div>
          <div
            onClick={() => {
              setCurrentItem(() => contentList.findIndex(el => el === item));
              setShowImageModal(true);
            }}
          >
            <Icon name="eye" /> view
          </div>
        </div>
      </div>

      <div style={{ height: '0px' }}>
        <p
          ref={widthRef}
          style={{ ...inlineWidth, ...{ visibility: 'hidden' } }}
          className="item-name"
        >
          {item.name}
        </p>
      </div>

      {titleWidth > 255 ? (
        <Tooltip data-tooltip={item.name} data-position="top center" data-inverted="">
          <p className="item-name tool">{item.name}</p>
        </Tooltip>
      ) : (
        <p style={inlineWidth} className="item-name">
          {item.name}
        </p>
      )}
    </ContentItemContainer>
  );
}
