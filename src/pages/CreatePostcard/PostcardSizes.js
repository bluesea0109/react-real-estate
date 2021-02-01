import React from 'react';
import { GridItem, GridItemContainer } from './GridItem';
import GridLayout from './GridLayout';
import styled from 'styled-components';
import * as brandColors from '../../components/utils/brandColors';
import { calculateCost } from '../../components/MailoutListItem/utils/helpers';

const PostcardImg = styled.div`
  width: 240px;
  height: calc(240px / ${props => props.width} * ${props => props.height});
  background-color: ${brandColors.grey09};
  border: 1px solid #d3d3d3;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  & > span {
    font-size: 27px;
    font-weight: 600;
    color: ${props => (props.selected ? brandColors.primary : '#979797')};
  }
`;

const labelText = size => {
  switch (size) {
    case '6x9':
    case '9x6':
      return `Large Postcard (${calculateCost(1, size)}/each)`;
    case '6x11':
    case '11x6':
      return `Jumbo Postcard (${calculateCost(1, size)}/each)`;
    default:
      return `Standard Postcard (${calculateCost(1, size)}/each)`;
  }
};

export default function PostcardSizes({ sizes, selectedSize, setSelectedSize }) {
  return (
    <GridLayout>
      {sizes.map(size => {
        const [height, width] = size.split('x');
        return (
          <GridItemContainer key={size} type="size" selected={size === selectedSize}>
            <GridItem onClick={() => setSelectedSize(size)} selected={size === selectedSize}>
              <PostcardImg height={height} width={width} selected={size === selectedSize}>
                <span>{size}"</span>
              </PostcardImg>
            </GridItem>
            <div className="label-text">{labelText(size)}</div>
          </GridItemContainer>
        );
      })}
    </GridLayout>
  );
}
