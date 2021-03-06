import styled from 'styled-components';
import * as brandColors from '../../components/utils/brandColors';

const EditorHeader = styled.div`
  z-index: 30;
  grid-column: span 3;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${brandColors.grey08};
  padding: 4px 1em 4px 0;
  & > .header-left {
    display: flex;
    align-items: center;
    & h1 {
      font-weight: 600;
      color: ${brandColors.grey01};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    & i {
      height: 40px;
      font-size: 1.2em;
      color: ${brandColors.primary};
      margin: 0 12px;
      &.back-btn {
        margin: 0 8px 0 0;
      }
    }
  }
  & > .header-right {
    color: ${brandColors.grey03};
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    & > #save-status {
      display: flex;
      align-items: center;
      width: 140px;
      margin: 0 0.5rem;
      font-weight: 600;
    }
    & > i {
      height: 36px;
      font-size: 1.25em;
      margin: 0 0.5em;
    }
    & .overflow-menu {
      color: ${brandColors.grey03};
      background-color: ${brandColors.grey09};
      &:hover {
        background-color: ${brandColors.lightGreyHover};
      }
      width: 36px;
      height: 36px;
      border-radius: 36px;
      & i {
        width: 100%;
        height: 100%;
        transform: translateY(1px);
      }
    }
  }
`;
export default EditorHeader;
