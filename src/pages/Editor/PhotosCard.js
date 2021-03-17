import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dimmer, Icon, Loader } from '../../components/Base';
import DropTarget from '../../components/Base/DropTarget';
import { useClickOutside } from '../../components/Hooks/useClickOutside';
import api from '../../services/api';
import auth from '../../services/auth';
import { setCustomUploadURL, setSelectedPhoto } from '../../store/modules/liveEditor/actions';
import { CustomImage, ImageOption, ImageUpload, PhotoContainer } from './StyledComponents';

export default function PhotosCard() {
  const dispatch = useDispatch();
  const details = useSelector(state => state.mailout?.details);
  const peerId = useSelector(state => state.peerId);
  const customUploadURL = useSelector(state => state.liveEditor?.customUploadURL);
  const selectedPhoto = useSelector(state => state.liveEditor?.selectedPhoto);
  const [uploadDragOver, setUploadDragOver] = useState(false);
  const [imageError, setImageError] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [localImageURL, setLocalImageURL] = useState('');
  const photoList = details?.raw?.photos;

  const ImageOptionsWrapper = ({ children }) => {
    const wrapperRef = useRef(null);
    useClickOutside(wrapperRef, () => {
      dispatch(setSelectedPhoto(''));
    });
    return (
      <div className="images" ref={wrapperRef}>
        {children}
      </div>
    );
  };

  useEffect(() => {
    if (!customUploadURL) dispatch(setCustomUploadURL(localImageURL));
  }, [customUploadURL, dispatch, localImageURL]);

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
          <ImageOptionsWrapper>
            {(customUploadURL || localImageURL) && (
              <CustomImage>
                <Dimmer inverted active={imageUploading}>
                  <Loader>Saving</Loader>
                </Dimmer>
                <p className="section-title">Custom Cover Photo</p>
                <ImageOption
                  src={localImageURL || customUploadURL}
                  current={customUploadURL === selectedPhoto}
                  alt="custom upload"
                  onClick={e => dispatch(setSelectedPhoto(e.target.src))}
                  onDragStart={e => {
                    e.dataTransfer.setData('text', e.target.src);
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
                onClick={() => dispatch(setSelectedPhoto(photo.url))}
                onDragStart={e => {
                  e.dataTransfer.setData('text', e.target.src);
                }}
              />
            ))}
          </ImageOptionsWrapper>
        </PhotoContainer>
      ) : (
        <div>Switching the cover photo is not currently supported for this campaign type.</div>
      )}
    </>
  );
}
