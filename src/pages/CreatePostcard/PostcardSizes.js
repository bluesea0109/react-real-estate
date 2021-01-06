import React from 'react';
import GridItem from './GridItem';
import GridLayout from './GridLayout';
import styled from 'styled-components';
import * as brandColors from '../../components/utils/brandColors';

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

export default function PostcardSizes({ sizes, selectedSize, setSelectedSize }) {
  return (
    <GridLayout>
      {sizes.map(size => {
        const [height, width] = size.split('x');
        return (
          <GridItem
            key={size}
            onClick={() => setSelectedSize(size)}
            selected={size === selectedSize}
          >
            <PostcardImg height={height} width={width} selected={size === selectedSize}>
              <span>{size}"</span>
            </PostcardImg>
          </GridItem>
        );
      })}
    </GridLayout>
  );
}
