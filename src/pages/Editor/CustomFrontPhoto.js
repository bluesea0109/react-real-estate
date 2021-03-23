import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cropper from 'react-cropper';
import { Dimmer, Icon, Loader, Button } from '../../components/Base';
import DropTarget from '../../components/Base/DropTarget';
import auth from '../../services/auth';
import api from '../../services/api';
import { setAddMailoutError } from '../../store/modules/mailout/actions';
import { setSelectedTemplate } from '../../store/modules/liveEditor/actions';
import { getAspectRatio } from '../Utils/getAspectRatio';
import { CropModal, CustomImage, ImageOption, ImageUpload } from './StyledComponents';
import { getMinImageSize, validateFile, verifyImageSize } from './utils/utils';

const CustomPhoto = ({ handleSave, mailoutDetails }) => {
  const dispatch = useDispatch();
  const peerId = useSelector(store => store.peer.peerId);
  const currentPhoto = useSelector(state => state.mailout?.mailoutEdit?.frontResourceUrl);
  const selectedTemplate = useSelector(state => state.liveEditor?.selectedTemplate);

  const [uploadDragOver, setUploadDragOver] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageSize, setUploadedImageSize] = useState(null);
  const [minImageSize, setMinImageSize] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const cropperRef = useRef(null);

  useEffect(() => {
    setMinImageSize(getMinImageSize(mailoutDetails.postcardSize));
  }, [mailoutDetails]);

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
    const fileError = validateFile(file);
    if (fileError) {
      setImageError(fileError);
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      let image = new Image();
      image.src = e.target.result;
      image.onload = () => {
        const isValidSize = verifyImageSize(image, mailoutDetails.postcardSize);
        if (isValidSize) {
          setUploadedImage(e.target.result);
          setUploadedImageSize({ width: image.width, height: image.height });
        } else {
          const minSize = getMinImageSize(mailoutDetails.postcardSize);
          setImageError(
            `Minimum image size is: Width - ${minSize?.width}, Height - ${minSize.height}`
          );
        }
      };
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
    if (!cropperRef.current?.cropper) {
      setImageError('There was an error saving your file');
      return;
    }
    cropperRef.current.cropper.getCroppedCanvas().toBlob(async blob => {
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

  const onCropMove = function(e) {
    // Stop cropper from making image too small
    const cropper = cropperRef?.current?.cropper;
    const minPercentageWidth = minImageSize?.width / uploadedImageSize?.width;
    const minPercentageHeight = minImageSize?.height / uploadedImageSize?.height;
    const minCropBoxWidth = Math.ceil(cropper?.containerData?.width * minPercentageWidth);
    const minCropBoxHeight = Math.ceil(cropper?.containerData?.height * minPercentageHeight);
    console.log(cropper?.cropBoxData);
    console.log({ minCropBoxWidth });
    console.log(cropper?.containerData);
    console.log({ minCropBoxHeight });
    if (cropper.cropBoxData?.width < minCropBoxWidth)
      cropper.setCropBoxData({ width: minCropBoxWidth });
    if (cropper.cropBoxData?.height < minCropBoxHeight)
      cropper.setCropBoxData({ height: minCropBoxHeight });
  };

  return (
    <>
      <CropModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Dimmer inverted active={imageUploading}>
          <Loader>Saving</Loader>
        </Dimmer>
        <p className="direction">
          Adjust the crop area to fit the selected postcard size. The minimum crop area is limited
          to maintain print quality.
        </p>
        <Cropper
          aspectRatio={getAspectRatio(mailoutDetails?.postcardSize || '4x6')}
          autoCropArea={1}
          ref={cropperRef}
          src={uploadedImage}
          style={{ maxWidth: '900px' }}
          zoomable={false}
          cropmove={onCropMove}
          responsive
        />
        <div className="modal-buttons">
          <Button onClick={() => setModalOpen(false)}>
            <Icon name="remove" /> Cancel
          </Button>
          <Button primary onClick={() => saveImage()}>
            <Icon name="checkmark" /> Save
          </Button>
        </div>
      </CropModal>
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
