import styled from 'styled-components';
import { ButtonNoStyle, Input } from '../../components/Base';
import * as brandColors from '../../components/utils/brandColors';

export { default as CreatePostcard } from './CreatePostcard';
export { default as CustomTab } from './CustomTab';
export { default as GridLayout } from './GridLayout';
export { GridItem, GridItemContainer } from './GridItem';
export { default as PostcardSizes } from './PostcardSizes';
export { default as TemplatesGrid } from './TemplatesGrid';
export { default as TemplatesTab } from './TemplatesTab';

export const getUploadSizes = size => {
  switch (size) {
    case '6x9':
    case '9x6':
      return '6.25"x9.25"';
    case '6x11':
    case '11x6':
      return '6.25"x11.25"';
    default:
      return '4.25"x6.25"';
  }
};

export const ItemContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const NameInput = styled(Input)`
  margin: 1rem;
  max-width: 900px;
`;

export const postcardSizes = ['4x6', '6x9', '6x11'];

export const StyledHeading = styled.div`
  margin: 0.5rem 0;
  font-size: ${props => (props.type === 'secondary' ? '16px' : '17px')};
  font-weight: ${props => (props.type === 'secondary' ? '400' : '600')};
  & .ui.dropdown > .text {
    padding: 4px 0;
  }
  &&& .loader {
    margin-left: 1rem;
  }
`;

export const UploadImage = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border: 1px dashed #d3d3d3;
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-rows: 1fr ${props => (props.uploadedImage ? ';' : 'minmax(0, 1.25rem);')};
  & img {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
    grid-row: span 2;
  }
  &:hover {
    & .overlay {
      opacity: 1;
    }
    color: white;
  }
  & .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: grid;
    display: grid;
    justify-items: center;
    align-items: center;
    grid-template-rows: 1fr 1.25rem;
    opacity: 0;
  }
  & i {
    color: ${brandColors.grey05};
    font-size: 40px;
    line-height: 50px;
    vertical-align: bottom;
    margin: 0;
    width: 50px;
    height: 50px;
  }
  & .upload-directions {
    font-size: 12px;
    z-index: 10;
    padding-bottom: 4px;
  }
`;

export const UploadTextContainer = styled.div`
  grid-column: span 2;
  align-self: center;
  margin: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 5px;
  background-color: ${brandColors.grey02};
  color: white;
  position: relative;
  & .upload-text-title {
    font-weight: 600;
  }
  @media (min-width: 1094px) {
    &:after {
      position: absolute;
      content: '';
      width: 0;
      height: 0;
      border-top: 20px solid transparent;
      border-bottom: 20px solid transparent;
      border-right: 20px solid ${brandColors.grey02};
      left: -20px;
    }
  }
`;

export const ViewButton = styled(ButtonNoStyle)`
  color: ${brandColors.grey04};
`;
