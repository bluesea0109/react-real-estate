import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const PhotoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
`;

const ImageOption = styled.img`
  ${props => (props.current ? `border: 2px solid red;` : null)}
`;

export default function PhotosCard() {
  const details = useSelector(state => state.mailout?.details);
  const currentPhoto = useSelector(state => state.mailout?.mailoutEdit?.frontImgUrl);
  const photoList = details?.raw?.photos;

  // const saveImage = selectedPhoto => {
  //   if (selectedPhoto === currentPhoto) return;
  //   else handleSave({ frontImgUrl: selectedPhoto });
  // };

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
            />
          ))}
        </PhotoContainer>
      ) : (
        <div>Switching the cover photo is not currently supported for this campaign type.</div>
      )}
    </>
  );
}
