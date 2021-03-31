import styled from 'styled-components';
import { Modal } from '../../components/Base';
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

export const EditorPreview = styled.div`
  overflow: auto;
  padding: ${props => props.paddingTop} 2rem 2rem 2rem;
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

export const PhotoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  & .images {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  & .section-title {
    margin: 0.25rem 0;
    font-weight: bold;
  }
`;

export const CustomImage = styled.div`
  position: relative;
  & > p {
    margin: 0.5rem 0;
  }
`;

export const ImageOption = styled.img`
  box-shadow: 1px 1px 4px ${brandColors.grey08};
  border-radius: 4px;
  ${props => (props.current ? `border: 2px solid ${brandColors.primary}; padding: 0.25rem;` : null)}
  ${props => (!props.current ? `cursor: pointer;` : null)}
`;

export const ImageUpload = styled.div`
  position: relative;
  width: 100%auto;
  height: 160px;
  border-radius: 4px;
  border: 2px dashed ${brandColors.grey05};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${brandColors.grey08};
  text-align: center;
  font-weight: bold;
  padding: 0.5rem;
  & i {
    margin-bottom: 0.5rem;
  }
  & .error {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
    color: ${brandColors.error};
    & i {
      margin: 0;
      margin-right: 0.25rem;
    }
  }
`;

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

export const CropModal = styled(Modal)`
  color: ${brandColors.grey03};
  .direction {
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
  .modal-buttons {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }
`;
