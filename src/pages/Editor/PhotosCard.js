import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import * as brandColors from '../../components/utils/brandColors';

const PhotoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
`;

const ImageOption = styled.img`
  box-shadow: 1px 1px 4px ${brandColors.grey08};
  border-radius: 4px;
  ${props => (props.current ? `border: 2px solid ${brandColors.primary};` : null)}
  ${props => (!props.current ? `cursor: pointer;` : null)}
`;

export default function PhotosCard({ handleSave }) {
  const details = useSelector(state => state.mailout?.details);
  const currentPhoto = useSelector(state => state.mailout?.mailoutEdit?.frontImgUrl);
  const photoList = details?.raw?.photos;

  const saveImage = selectedPhoto => {
    if (selectedPhoto === currentPhoto) return;
    else handleSave({ frontImgUrl: selectedPhoto });
  };

  return (
    <>
      {photoList?.length ? (
        <PhotoContainer>
          {photoList.map(photo => (
            <ImageOption
              key={photo.url}
              current={photo.url === currentPhoto}
              src={photo.url}
              alt="cover option"
              onClick={() => saveImage(photo.url)}
            />
          ))}
        </PhotoContainer>
      ) : (
        <div>Switching the cover photo is not currently supported for this campaign type.</div>
      )}
    </>
  );
}
