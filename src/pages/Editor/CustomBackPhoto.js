import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Cropper from 'react-cropper';
import styled from 'styled-components';
import { Dimmer, Icon, Loader, Modal, Header, Button } from '../../components/Base';
import DropTarget from '../../components/Base/DropTarget';
import * as brandColors from '../../components/utils/brandColors';
import auth from '../../services/auth';
import api from '../../services/api';
import { setAddMailoutError } from '../../store/modules/mailout/actions';
// import { setSelectedTemplate } from '../../store/modules/liveEditor/actions';

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

const StyledHeading = styled.div`
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

const CustomImage = styled.div`
  position: relative;
`;

const ImageOption = styled.img`
  box-shadow: 1px 1px 4px ${brandColors.grey08};
  border-radius: 4px;
  ${props => (props.current ? `border: 2px solid ${brandColors.primary}; padding: 0.25rem;` : null)}
  ${props => (!props.current ? `cursor: pointer;` : null)}
`;

const CustomPhoto = ({ handleSave, mailoutDetails }) => {
  const dispatch = useDispatch();
  const peerId = useSelector(store => store.peer.peerId);
  const currentPhoto = useSelector(state => state.mailout?.mailoutEdit?.backResourceUrl);

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
      handleSave({ backResourceUrl: imageURL });
    });
  };

  const getAspectRatio = size => {
    switch (size) {
      case '9x6':
      case '6x9':
        return 9.25 / 6.25;
      case '11x6':
      case '6x11':
        return 11.25 / 6.25;
      default:
        return 6.25 / 4.25;
    }
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
            current={currentPhoto}
            alt="custom upload"
            onClick={() => {
              handleSave({ backResourceUrl: currentPhoto });
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
