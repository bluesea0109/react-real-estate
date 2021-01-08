import styled from 'styled-components';
import { Modal } from '.';
import * as brandColors from '../utils/brandColors';

export const PreviewModal = styled(Modal)`
  &&&& {
    position: relative;
    padding: 2.5rem 2.5rem 0 2.5rem;
    &.pad-bottom {
      padding-bottom: 2.5rem;
    }
  }
`;

export const ModalClose = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.75rem;
  cursor: pointer;
  & i {
    margin: 0;
  }
`;

export const PreviewImage = styled.img`
  width: 800px;
`;

export const ModalActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0.5rem;
  & .arrow {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 1rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      background-color: ${brandColors.lightGreyHover};
    }
    & i {
      margin: 0;
    }
  }
`;
