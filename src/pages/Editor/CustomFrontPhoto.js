import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cropper from 'react-cropper';
import { Dimmer, Icon, Loader, Modal, Header, Button } from '../../components/Base';
import DropTarget from '../../components/Base/DropTarget';
import auth from '../../services/auth';
import api from '../../services/api';
import { setAddMailoutError } from '../../store/modules/mailout/actions';
import { setSelectedTemplate } from '../../store/modules/liveEditor/actions';
import { getAspectRatio } from '../Utils/getAspectRatio';
import { CustomImage, ImageOption, ImageUpload, StyledHeading } from './StyledComponents';

const CustomPhoto = ({ handleSave, mailoutDetails }) => {
  const dispatch = useDispatch();
  const peerId = useSelector(store => store.peer.peerId);
  const currentPhoto = useSelector(state => state.mailout?.mailoutEdit?.frontResourceUrl);
  const selectedTemplate = useSelector(state => state.liveEditor?.selectedTemplate);

  const [uploadDragOver, setUploadDragOver] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [cropper, setCropper] = useState(null);

  useEffect(() => {
    if (uploadedImage) {
      setModalOpen(true);
    }
  }, [uploadedImage]);

  useEffect(() => {
    if (currentPhoto) {
      dispatch(setSelectedTemplate(false));
    }
  }, [currentPhoto, dispatch]);

  const handleFileChange = fileList => {
    setImageError(null);
    const file = fileList[0];
    if (!file) {
      setImageError('No File Found');
      return;
    }
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setImageError('Warning! File upload failed. Your design is not a supported file type.');
      return;
    }
    if (file.size > 5000000) {
      setImageError('Warning! File upload failed. Your design exceeded the 5MB size limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const getCustomImageURL = async image => {
    const formData = new FormData();
    formData.append('front', image);

    setImageUploading(true);

    try {
      let path = `/api/user/mailout/create/front`;
      if (peerId) path = `/api/user/peer/${peerId}/mailout/create/front`;
      const headers = {};
      const accessToken = await auth.getAccessToken();
      headers['authorization'] = `Bearer ${accessToken}`;
      const response = await fetch(path, {
        headers,
        method: 'post',
        body: formData,
        credentials: 'include',
      });
      const { url } = await api.handleResponse(response);
      return url;
    } catch (e) {
      dispatch(setAddMailoutError(e.message));
    }
  };

  const saveImage = () => {
    cropper.getCroppedCanvas().toBlob(async blob => {
      const imageURL = await getCustomImageURL(blob);
      if (!imageURL) {
        setImageError('There was an error uploading your file.');
        return;
      }

      setModalOpen(false);
      setImageUploading(false);
      dispatch(setSelectedTemplate(false));
      handleSave({ frontResourceUrl: imageURL });
    });
  };

  return (
    <>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Header icon="exclamation" content="Crop Image" />
        <Modal.Content>
          <Dimmer inverted active={imageUploading}>
            <Loader>Saving</Loader>
          </Dimmer>
          <Modal.Description style={{ margin: 'auto' }}>
            <StyledHeading type="secondary">
              Adjust the crop area to fit the selected postcard size
            </StyledHeading>
          </Modal.Description>

          <Cropper
            aspectRatio={getAspectRatio(mailoutDetails?.postcardSize || '4x6')}
            autoCropArea={1}
            preview=".image-preview"
            onInitialized={instance => {
              setCropper(instance);
            }}
            src={uploadedImage}
            style={{ margin: '0 1rem 1rem 1rem', maxWidth: '900px' }}
            zoomable={false}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" type="button" inverted onClick={() => setModalOpen(false)}>
            <Icon name="remove" /> Cancel
          </Button>
          <Button color="green" type="button" inverted onClick={() => saveImage()}>
            <Icon name="checkmark" /> Save
          </Button>
        </Modal.Actions>
      </Modal>
      {currentPhoto && (
        <CustomImage>
          <Dimmer inverted active={imageUploading}>
            <Loader>Saving</Loader>
          </Dimmer>
          <p className="section-title">Custom Cover Photo</p>
          <ImageOption
            src={currentPhoto}
            current={currentPhoto && !selectedTemplate}
            alt="custom upload"
            onClick={() => {
              dispatch(setSelectedTemplate(false));
              handleSave({ frontResourceUrl: currentPhoto });
            }}
          />
        </CustomImage>
      )}
      <DropTarget setDragging={setUploadDragOver} handleFileDrop={handleFileChange}>
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
    </>
  );
};

export default CustomPhoto;
