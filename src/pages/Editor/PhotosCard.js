import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Dimmer, Icon, Loader } from '../../components/Base';
import DropTarget from '../../components/Base/DropTarget';
import * as brandColors from '../../components/utils/brandColors';
import api from '../../services/api';
import auth from '../../services/auth';
import { setCustomUploadURL } from '../../store/modules/liveEditor/actions';

const PhotoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  & .section-title {
    margin: 0.25rem 0;
    font-weight: bold;
  }
`;

const CustomImage = styled.div`
  position: relative;
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
  const dispatch = useDispatch();
  const details = useSelector(state => state.mailout?.details);
  const peerId = useSelector(state => state.peerId);
  const currentPhoto = useSelector(state => state.mailout?.mailoutEdit?.frontImgUrl);
  const customUploadURL = useSelector(state => state.liveEditor?.customUploadURL);
  const [selectedPhoto, setSelectedPhoto] = useState(currentPhoto);
  const [uploadDragOver, setUploadDragOver] = useState(false);
  const [imageError, setImageError] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [localImageURL, setLocalImageURL] = useState('');
  const photoList = details?.raw?.photos;
  const isCustomPhoto = photoList.length && !photoList.find(image => image.url === currentPhoto);

  useEffect(() => {
    setSelectedPhoto(currentPhoto);
  }, [currentPhoto]);

  useEffect(() => {
    if (isCustomPhoto && !customUploadURL) dispatch(setCustomUploadURL(currentPhoto));
  }, [isCustomPhoto, customUploadURL, dispatch, currentPhoto]);

  const saveImage = newPhoto => {
    if (newPhoto === currentPhoto) return;
    else {
      setSelectedPhoto(newPhoto);
      handleSave({ frontImgUrl: newPhoto });
    }
  };

  const handleFileDrop = async fileList => {
    const file = fileList[0];
    if (!file) {
      setImageError('No File Found');
      return;
    }
    let ok = false;
    if (file.type === 'image/png') ok = true;
    if (file.type === 'image/jpeg') ok = true;
    if (!ok) return setImageError('File needs to be a jpeg or png');
    if (file.size > 5000000) {
      setImageError('Your upload exceeded the 5MB size limit');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      setLocalImageURL(e.target.result);
    };
    reader.readAsDataURL(file);

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
      dispatch(setCustomUploadURL(imageUrl));
      saveImage(imageUrl);
      setLocalImageURL('');
      setImageUploading(false);
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
            <ImageUpload>
              <>
                <Dimmer inverted active={uploadDragOver} />
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
          {(customUploadURL || localImageURL || isCustomPhoto) && (
            <CustomImage>
              <Dimmer inverted active={imageUploading}>
                <Loader>Saving</Loader>
              </Dimmer>
              <p className="section-title">Custom Cover Photo</p>
              <ImageOption
                src={isCustomPhoto ? currentPhoto : localImageURL || customUploadURL}
                current={isCustomPhoto || customUploadURL === selectedPhoto}
                alt="custom upload"
                onClick={() => {
                  if (isCustomPhoto || imageUploading || localImageURL) return;
                  saveImage(customUploadURL);
                }}
              />
            </CustomImage>
          )}
          {photoList.length > 0 && <p className="section-title">MLS Photos</p>}
          {photoList.map(photo => (
            <ImageOption
              key={photo.url}
              current={photo.url === selectedPhoto}
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
