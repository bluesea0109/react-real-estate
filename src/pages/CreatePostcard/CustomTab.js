import React from 'react';
import Cropper from 'react-cropper';
import { Button, ButtonOutline, Icon, Message } from '../../components/Base';
import {
  getAspectRatio,
  getUploadSizes,
  GridItem,
  GridItemContainer,
  GridLayout,
  NameInput,
  PostcardSizes,
  postcardSizes,
  StyledHeading,
  UploadImage,
  UploadTextContainer,
  ViewButton,
} from '.';

export default function CustomTab({
  cropper,
  customName,
  handleFileChange,
  imageError,
  selectedSize,
  setCropper,
  setCustomName,
  setImageError,
  setPreviewImage,
  setSelectedSize,
  setShowImageModal,
  uploadedImage,
  uploadedImageName,
}) {
  return (
    <>
      <StyledHeading>
        <p>Select a size</p>
      </StyledHeading>
      <PostcardSizes
        cropper={cropper}
        sizes={postcardSizes}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
      />
      <StyledHeading>
        <p>Campaign Name</p>
      </StyledHeading>
      <NameInput
        type="text"
        fluid
        placeholder="Custom Campaign"
        value={customName}
        onChange={e => setCustomName(e.target.value)}
      />
      <StyledHeading>
        <p>Card Front</p>
      </StyledHeading>
      {imageError && (
        <Message error>
          <Icon name="times circle" />
          <span>{imageError}</span>
          <Icon name="close" onClick={() => setImageError(null)} />
        </Message>
      )}
      {uploadedImage && (
        <>
          <StyledHeading type="secondary">
            Adjust the crop area to fit the selected postcard size
          </StyledHeading>
          <Cropper
            aspectRatio={getAspectRatio(selectedSize)}
            autoCropArea={1}
            preview=".image-preview"
            onInitialized={instance => {
              setCropper(instance);
            }}
            src={uploadedImage}
            style={{ margin: '0 1rem 1rem 1rem', maxWidth: '900px' }}
            zoomable={false}
          />
          <StyledHeading type="secondary">Preview</StyledHeading>
        </>
      )}
      <GridLayout>
        <GridItemContainer selected={uploadedImageName}>
          <GridItem selected={uploadedImageName} error={imageError}>
            <UploadImage uploadedImage={uploadedImage}>
              {uploadedImage ? (
                <div
                  className="image-preview"
                  style={{ width: '100%', height: '100%', overflow: 'hidden' }}
                ></div>
              ) : (
                <>
                  <div className="overlay">
                    <ButtonOutline
                      onClick={() => {
                        document.getElementById('custom-upload-input').click();
                      }}
                    >
                      UPLOAD
                    </ButtonOutline>
                  </div>
                  <Icon name="upload" />
                  <span className="upload-directions">{`(${getUploadSizes(
                    selectedSize
                  )} PNG or JPEG = max 5MB)`}</span>
                </>
              )}
              <input
                id="custom-upload-input"
                style={{ display: 'none' }}
                name="postcardcover"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              ></input>
            </UploadImage>
          </GridItem>
          <div className="label-text">
            {uploadedImageName ? `${uploadedImageName}` : 'Upload your own design'}
            {uploadedImage && (
              <ViewButton
                onClick={() => {
                  let croppedPreview = cropper.getCroppedCanvas().toDataURL();
                  setPreviewImage(croppedPreview);
                  setShowImageModal(true);
                }}
              >
                <Icon name="eye" />
                VIEW
              </ViewButton>
            )}
          </div>
        </GridItemContainer>
        <UploadTextContainer>
          <p className="upload-text-title">Include a safe zone of 1/2" inch!</p>
          <p>
            Make sure no critical elements are within 1/2" from the edge of the image. It risks
            being cropped during the postcard production.
          </p>
        </UploadTextContainer>
      </GridLayout>
      {uploadedImage && (
        <div style={{ paddingTop: '1rem' }}>
          <Button
            onClick={() => {
              document.getElementById('custom-upload-input').click();
            }}
          >
            Upload New Image
          </Button>
        </div>
      )}
    </>
  );
}
