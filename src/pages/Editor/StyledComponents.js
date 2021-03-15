import styled from 'styled-components';
import * as brandColors from '../../components/utils/brandColors';

export const EditorLayout = styled.div`
  display: grid;
  grid-template-rows: [header] minmax(54px, auto) [body] minmax(10px, 1fr);
  grid-template-columns: [nav] 56px [sidebar] auto [content] minmax(10px, 1fr);
  background-color: white;
  height: calc(100% - 60px);
  min-width: 100%;
  position: fixed;
  & i {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const EditorContent = styled.div`
  background-color: ${brandColors.grey09};
  display: grid;
  grid-template-columns: minmax(auto, 100%);
  grid-template-rows: minmax(46px, auto) 1fr;
`;

export const EditorToolbar = styled.div`
  padding: 0.5rem 1rem;
  background-color: white;
  display: flex;
  align-items: center;
`;

export const EditorPreview = styled.div`
  overflow: auto;
  padding: 2rem;
  display: grid;
  gap: 2em;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  justify-items: center;
`;

export const CampaignNameDiv = styled.div`
  display: flex;
  align-items: center;
  & .input {
    width: 360px;
    flex: 1 0 0px;
    height: 32px;
  }
`;
