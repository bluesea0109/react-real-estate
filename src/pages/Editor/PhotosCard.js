import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Dimmer, Icon, Loader } from '../../components/Base';
import DropTarget from '../../components/Base/DropTarget';
import * as brandColors from '../../components/utils/brandColors';
import api from '../../services/api';
import auth from '../../services/auth';

const PhotoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
`;

const ImageOption = styled.img`
  box-shadow: 1px 1px 4px ${brandColors.grey08};
  border-radius: 4px;
  ${props => (props.current ? `border: 2px solid ${brandColors.primary}; padding: 0.25rem;` : null)}
  ${props => (!props.current ? `cursor: pointer;` : null)}
`;

const ImageUpload = styled.div`
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
  /* ${props => (props.dragging ? 'opacity: 0.6;' : null)} */
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

export default function PhotosCard({ handleSave }) {
  const details = useSelector(state => state.mailout?.details);
  const peerId = useSelector(state => state.peerId);
  const currentPhoto = useSelector(state => state.mailout?.mailoutEdit?.frontImgUrl);
  const [uploadDragOver, setUploadDragOver] = useState(false);
  const [imageError, setImageError] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const photoList = details?.raw?.photos;

  const saveImage = selectedPhoto => {
    if (selectedPhoto === currentPhoto) return;
    else handleSave({ frontImgUrl: selectedPhoto });
  };

  const handleFileDrop = async fileList => {
    console.dir(fileList);
    const file = fileList[0];
    // do some checking
    if (!file) {
      setImageError('No File Found');
      return;
    }
    let ok = false;
    if (file.type === 'image/png') ok = true;
    if (file.type === 'image/jpeg') ok = true;
    if (!ok) return setImageError('File needs to be a jpg or png');

    const formData = new FormData();
    formData.append('listingPhoto', file);
    try {
      setImageUploading(true);
      let path = `/api/user/mailout/${details._id}/edit/listingPhoto/resize`;
      if (peerId) path = `/api/user/peer/${peerId}/mailout/${details._id}/edit/listingPhoto/resize`;

      const headers = {};
      const accessToken = await auth.getAccessToken();
      headers['authorization'] = `Bearer ${accessToken}`;
      const response = await fetch(path, {
        headers,
        method: 'post',
        body: formData,
        credentials: 'include',
      });
      let { imageUrl } = await api.handleResponse(response);
      setTimeout(() => {
        console.log(imageUrl);
        setImageUploading(false);
      }, 1000);
    } catch (e) {
      setImageUploading(false);
      setImageError('There was a problem uploading your image');
      console.error(e.message);
    }
  };

  return (
    <>
      {photoList?.length ? (
        <PhotoContainer>
          <DropTarget setDragging={setUploadDragOver} handleFileDrop={handleFileDrop}>
            <ImageUpload dragging={uploadDragOver}>
              <>
                <Dimmer inverted active={uploadDragOver || imageUploading}>
                  {imageUploading && <Loader />}
                </Dimmer>
                <Icon name="cloud upload" size="big" />
                <p>Drag a file or click here to upload a custom image</p>
                {imageError && (
                  <div className="error">
                    <Icon name="exclamation circle" />
                    <p>{imageError}</p>
                  </div>
                )}
              </>
            </ImageUpload>
          </DropTarget>
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
