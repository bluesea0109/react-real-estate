import styled from 'styled-components';
import * as brandColors from './utils/brandColors';

export const DashboardItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: bold;
  cursor: pointer;
  ${props => (props.soon ? 'cursor: default;' : null)}
  & img {
    width: 220px;
    height: 160px;
    object-fit: ${props => (props.type === 'content' ? 'contain' : 'cover')};
    border-radius: 6px;
    margin-bottom: 0.25rem;
    box-shadow: 0 3px 8px 0 rgba(201, 201, 201, 0.4);
    ${props => (props.type === 'content' ? 'padding: 0.5rem;' : null)}
  }
  & .item-name {
    color: ${brandColors.grey04};
    text-transform: capitalize;
    & .kwkly-code {
      text-transform: uppercase;
    }
  }
  &:hover {
    color: ${brandColors.grey04};
    font-weight: bold;
  }
`;
