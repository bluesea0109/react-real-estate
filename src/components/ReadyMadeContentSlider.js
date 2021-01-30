import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import styled from 'styled-components';
import { Icon } from './Base';
import { DashboardItemContainer } from './DashboardItemContainer';
import * as brandColors from './utils/brandColors';

const StyledSlider = styled(Slider)`
  position: relative;
  & .slick-arrow {
    background-color: ${brandColors.grey08};
    height: 3rem;
    width: 3rem;
    border-radius: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${brandColors.grey05};
    font-size: 1.25rem;
    position: absolute;
    z-index: 10;
    top: 70px;
    cursor: pointer;
    &.slick-left {
      ${props => (props.showArrow !== 'left' ? 'display: none;' : null)}
    }
    &.slick-right {
      ${props => (props.showArrow !== 'right' ? 'display: none;' : null)}
      right: 0;
    }
  }
  & .slick-track {
    & > div > div {
      max-width: 220px;
      margin: 0.5rem;
    }
  }
`;

function ArrowLeft(props) {
  const { onClick } = props;
  return <Icon className="slick-arrow slick-left" onClick={onClick} name="chevron left" />;
}
function ArrowRight(props) {
  const { onClick } = props;
  return <Icon className="slick-arrow slick-right" onClick={onClick} name="chevron right" />;
}

export default function ReadyMadeContentSlider({ className, contentList }) {
  const [showArrow, setShowArrow] = useState('right');

  const sliderSettings = {
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 5,
    touchMove: false,
    prevArrow: <ArrowLeft />,
    nextArrow: <ArrowRight />,
    afterChange: ind => setShowArrow(ind === 0 ? 'right' : 'left'),
  };

  return (
    <StyledSlider {...sliderSettings} showArrow={showArrow}>
      {contentList.slice(0, 10).map(contentItem => (
        <DashboardItemContainer key={contentItem.id} className={className}>
          <Link to={{ pathname: '/ready-made-designs', state: { item: contentItem } }}>
            <img src={contentItem.thumbnail} alt="content item" />
            <span className="item-name">{contentItem.name.split(':')[0]}</span>
          </Link>
        </DashboardItemContainer>
      ))}
    </StyledSlider>
  );
}
