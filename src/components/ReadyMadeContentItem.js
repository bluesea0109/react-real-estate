import { isAbsolute } from 'path';
import React, { createRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Icon } from './Base';
import * as brandColors from './utils/brandColors';

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

//get p tag ref width value
//if p tag width > = 256px then pass '256px' else pass null (to width value)

const ellipse = {
  width: '256px',
  paddingTop: '1rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

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
  const [hover, setHover] = useState(false);
  const widthRef = createRef();

  const handleHoverIn = () => {
    setHover(true);
  };

  const handleHoverOut = () => {
    setHover(false);
  };

  const tooltip = {
    position: 'relative',
    overflow: 'visible',
  };

  const toolTipShow = {
    visibility: 'visible',
    backgroundColor: '#343434',
    padding: '10px',
    color: '#fff',
    textAlign: 'center',
    position: 'absolute',
    top: '-50px',
    //maxWidth: '400px',
    width: 'auto',
  };

  const toolTipNone = {
    visibility: 'hidden',
  };

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

      {/* needs div wrapper for ref inline width, visiblity hidden for conditional rendering reference based on width */}
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
        <div onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut} style={tooltip}>
          <p style={ellipse} className="item-name">
            {item.name}
          </p>
          <div style={hover ? toolTipShow : toolTipNone}>{item.name}</div>
        </div>
      ) : (
        <p style={inlineWidth} className="item-name">
          {item.name}
        </p>
      )}
    </ContentItemContainer>
  );
}
