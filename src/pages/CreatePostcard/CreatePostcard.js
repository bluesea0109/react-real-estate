import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { startCase } from 'lodash';
import {
  Button,
  ButtonNoStyle,
  ButtonOutline,
  Dimmer,
  Dropdown,
  Header,
  Icon,
  Input,
  Loader,
  Menu,
  Message,
  Page,
  SectionHeader,
  Segment,
  StyledMenu,
  Tab,
} from '../../components/Base';
import {
  ModalActions,
  ModalClose,
  PreviewImage,
  PreviewModal,
} from '../../components/Base/PreviewModal';
import PageTitleHeader from '../../components/PageTitleHeader';
import { ContentTopHeaderLayout } from '../../layouts';
import { GridItem, GridItemContainer } from './GridItem';
import GridLayout from './GridLayout';
import PostcardSizes from './PostcardSizes';
import TemplatesGrid from './TemplatesGrid';
import * as brandColors from '../../components/utils/brandColors';
import { useHistory } from 'react-router-dom';
import ListingModal from '../../components/ListingModal';
import { addHolidayCampaignStart } from '../../store/modules/mailouts/actions';
import { postcardDimensions } from '../../components/utils/utils';
import auth from '../../services/auth';
import api from '../../services/api';
import { setAddMailoutError } from '../../store/modules/mailout/actions';

const ItemContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledSectionHeader = styled(SectionHeader)`
  padding: 0.5rem 0;
  font-size: 17px;
  font-weight: 600;
  & .ui.dropdown > .text {
    padding: 4px 0;
  }
  &&& .loader {
    margin-left: 1rem;
  }
`;

const UploadImage = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border: 1px dashed #d3d3d3;
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-rows: 1fr minmax(0, 1.25rem);
  & img {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
    grid-row: span 2;
  }
  &:hover {
    & .overlay {
      opacity: 1;
    }
    color: white;
  }
  & .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: grid;
    display: grid;
    justify-items: center;
    align-items: center;
    grid-template-rows: 1fr 1.25rem;
    opacity: 0;
  }
  & i {
    color: ${brandColors.grey05};
    font-size: 40px;
    line-height: 50px;
    vertical-align: bottom;
    margin: 0;
    width: 50px;
    height: 50px;
  }
  & .upload-directions {
    font-size: 12px;
    z-index: 10;
    padding-bottom: 4px;
  }
`;

const UploadTextContainer = styled.div`
  grid-column: span 2;
  align-self: center;
  margin: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 5px;
  background-color: ${brandColors.grey02};
  color: white;
  position: relative;
  & .upload-text-title {
    font-weight: 600;
  }
  @media (min-width: 1094px) {
    &:after {
      position: absolute;
      content: '';
      width: 0;
      height: 0;
      border-top: 20px solid transparent;
      border-bottom: 20px solid transparent;
      border-right: 20px solid ${brandColors.grey02};
      left: -20px;
    }
  }
`;

const ViewButton = styled(ButtonNoStyle)`
  color: ${brandColors.grey04};
`;

const NameInput = styled(Input)`
  margin: 1rem 1.5rem;
`;

const postcardSizes = ['4x6', '6x9', '6x11'];

const getUploadSizes = size => {
  switch (size) {
    case '6x9':
    case '9x6':
      return '6.25"x9.25"';
    case '6x11':
    case '11x6':
      return '6.25"x11.25"';
    default:
      return '4.25"x6.25"';
  }
};

const TemplatesTab = ({
  availableTags,
  filteredTemplates,
  templatesLoading,
  selectedSize,
  selectedTag,
  selectedTemplate,
  setCurrentItem,
  setPreviewImage,
  setSelectedSize,
  setSelectedTag,
  setSelectedTemplate,
  setShowImageModal,
}) => {
  return (
    <>
      <StyledSectionHeader>
        <p>Select a size</p>
      </StyledSectionHeader>
      <PostcardSizes
        sizes={postcardSizes}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
      />
      <StyledSectionHeader>
        <Dropdown text={startCase(selectedTag.tag)}>
          <Dropdown.Menu>
            {availableTags.map(tag => (
              <Dropdown.Item key={tag.tag} onClick={() => setSelectedTag(tag)}>
                <ItemContent>
                  <span>{startCase(tag.tag)}</span>
                </ItemContent>
              </Dropdown.Item>
            ))}
            <Dropdown.Header />
          </Dropdown.Menu>
        </Dropdown>
        <Loader active={templatesLoading} inline size="small" />
      </StyledSectionHeader>
      <TemplatesGrid
        templates={filteredTemplates}
        selectedSize={selectedSize}
        selectedTemplate={selectedTemplate}
        setCurrentItem={setCurrentItem}
        setPreviewImage={setPreviewImage}
        setSelectedTemplate={setSelectedTemplate}
        setShowImageModal={setShowImageModal}
      />
    </>
  );
};

const CustomTab = ({
  customName,
  handleFileChange,
  imageError,
  selectedSize,
  setCustomName,
  setImageError,
  setPreviewImage,
  setSelectedSize,
  setShowImageModal,
  uploadedImage,
  uploadedImageName,
}) => {
  return (
    <>
      <StyledSectionHeader>
        <p>Select a size</p>
      </StyledSectionHeader>
      <PostcardSizes
        sizes={postcardSizes}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
      />
      <StyledSectionHeader>
        <p>Campaign Name</p>
      </StyledSectionHeader>
      <NameInput
        type="text"
        fluid
        placeholder="Custom Campaign"
        value={customName}
        onChange={e => setCustomName(e.target.value)}
      />
      <StyledSectionHeader>
        <p>Card Front</p>
      </StyledSectionHeader>
      {imageError && (
        <Message error>
          <Icon name="times circle" />
          <span>{imageError}</span>
          <Icon name="close" onClick={() => setImageError(null)} />
        </Message>
      )}
      <GridLayout>
        <GridItemContainer selected={uploadedImageName}>
          <GridItem selected={uploadedImageName} error={imageError}>
            <UploadImage>
              <div className="overlay">
                <ButtonOutline
                  onClick={() => {
                    document.getElementById('custom-upload-input').click();
                  }}
                >
                  UPLOAD
                </ButtonOutline>
              </div>
              {uploadedImage ? (
                <img src={uploadedImage} alt="custom-front"></img>
              ) : (
                <>
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
                  setPreviewImage(uploadedImage);
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
    </>
  );
};

const StyledTab = styled(Tab)`
  &&&& {
    padding: 0 1rem;
    .ui.menu {
      margin-top: 0;
    }
  }
`;

export default function CreatePostcard({ location }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const peerId = useSelector(store => store.peer.peerId);
  const initialFilter = location?.state?.filter;

  const availableTags = [
    { tag: 'Just Listed', intentPath: 'listingMarketing|listed' },
    { tag: 'Just Sold', intentPath: 'listingMarketing|sold' },
    { tag: 'Open House', intentPath: 'listingMarketing|openHouse' },
    { tag: 'Holiday', intentPath: 'holiday|christmas' },
    { tag: 'New Year', intentPath: 'holiday|new-year' },
    { tag: 'Handwritten', intentPath: 'handwritten' },
  ];

  const [activeIndex, setActiveIndex] = useState(initialFilter === 'custom' ? 1 : 0);
  const [createDisabled, setCreateDisabled] = useState(true);
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [customImageFile, setCustomImageFile] = useState(null);
  const [customName, setCustomName] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [imageError, setImageError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedListing, setSelectedListing] = useState(false);
  const [selectedSize, setSelectedSize] = useState('4x6');
  const [selectedTag, setSelectedTag] = useState(
    initialFilter && initialFilter !== 'custom'
      ? availableTags.find(tag => tag.tag === initialFilter)
      : availableTags[0]
  );
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageName, setUploadedImageName] = useState('');

  useEffect(() => {
    if (activeIndex === 1 && !uploadedImage) setCreateDisabled(true);
    else if (activeIndex === 0 && !selectedTemplate) setCreateDisabled(true);
    else setCreateDisabled(false);
  }, [activeIndex, createDisabled, uploadedImage, selectedTemplate]);

  const prevImg = () => {
    let newImgIndex = currentItem - 1;
    if (newImgIndex < 0) newImgIndex = filteredTemplates.length - 1;
    setCurrentItem(newImgIndex);
    setPreviewImage(filteredTemplates[newImgIndex].thumbnail);
  };

  const nextImg = () => {
    let newImgIndex = currentItem + 1;
    if (newImgIndex > filteredTemplates.length - 1) newImgIndex = 0;
    setCurrentItem(newImgIndex);
    setPreviewImage(filteredTemplates[newImgIndex].thumbnail);
  };

  const getStencilsByIntent = useCallback(
    async intentPath => {
      setTemplatesLoading(true);
      try {
        let path = `/api/user/stencils/byIntent/${intentPath}`;
        if (peerId) path = `/api/user/peer/${peerId}/stencils/byIntent/${intentPath}`;
        const headers = {};
        const accessToken = await auth.getAccessToken();
        headers['authorization'] = `Bearer ${accessToken}`;
        const response = await fetch(path, {
          headers,
          method: 'get',
          credentials: 'include',
        });
        const { stencils } = await api.handleResponse(response);
        setFilteredTemplates(stencils);
      } catch (e) {
        console.log('Error getting stencils', e);
      } finally {
        setTemplatesLoading(false);
      }
    },
    [peerId]
  );

  useEffect(() => {
    if (selectedTag) {
      getStencilsByIntent(selectedTag.intentPath);
    }
    // eslint-disable-next-line
  }, [selectedTag]);

  const handleFileChange = e => {
    setImageError(null);
    const file = e.target.files[0];
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
      setUploadedImageName(file.name);
      setCustomImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const getCustomImageURL = async image => {
    const formData = new FormData();
    const size = postcardDimensions(selectedSize);
    formData.append('front', image);
    formData.append('postcardSize', size);
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

  const createCampaign = async () => {
    setShowListingModal(false);
    if (activeIndex === 1 && !uploadedImage) {
      setImageError(
        'Warning! A card front must be uploaded in order to create a Custom Design Postcard Campaign'
      );
      return;
    }
    if (createDisabled) return;
    const size = postcardDimensions(selectedSize);
    if (activeIndex === 1) {
      if (!customImageFile) {
        setImageError('There was an error uploading your file.');
        return;
      }
      setCreatingCampaign(true);
      const imageURL = await getCustomImageURL(customImageFile);
      let path = `/api/user/mailout/withCover`;
      if (peerId) path = `/api/user/peer/${peerId}/mailout/withCover`;

      const headers = {};
      const accessToken = await auth.getAccessToken();
      headers['authorization'] = `Bearer ${accessToken}`;
      const formData = new FormData();
      formData.append('createdBy', 'user');
      formData.append('skipEmailNotification', true);
      formData.append('frontResourceUrl', imageURL);
      formData.append('name', customName || 'Custom Campaign');
      formData.append('postcardSize', size);
      const response = await fetch(path, {
        headers,
        method: 'post',
        body: formData,
        credentials: 'include',
      });
      let doc = await api.handleResponse(response);
      return history.push(`/dashboard/edit/${doc._id}/destinations`);
    }
    if (selectedTemplate?.activities.includes('listingMarketing')) {
      setShowListingModal(true);
      return;
    }
    dispatch(
      addHolidayCampaignStart({
        createdBy: 'user',
        skipEmailNotification: true,
        name: selectedTemplate.name,
        frontTemplateUuid: selectedTemplate.templateUuid,
        postcardSize: size,
        mapperName: 'sphere',
        publishedTags: selectedTemplate.intentPath.split('|'),
      })
    );
    return history.push('/postcards');
  };

  const panes = [
    {
      menuItem: 'Templates',
      render: () => (
        <Tab.Pane as="div">
          <TemplatesTab
            availableTags={availableTags}
            filteredTemplates={filteredTemplates}
            templatesLoading={templatesLoading}
            selectedSize={selectedSize}
            selectedTag={selectedTag}
            selectedTemplate={selectedTemplate}
            setCurrentItem={setCurrentItem}
            setPreviewImage={setPreviewImage}
            setSelectedSize={setSelectedSize}
            setSelectedTag={setSelectedTag}
            setSelectedTemplate={setSelectedTemplate}
            setShowImageModal={setShowImageModal}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Custom Design',
      render: () => (
        <Tab.Pane as="div">
          <CustomTab
            customName={customName}
            handleFileChange={handleFileChange}
            imageError={imageError}
            selectedSize={selectedSize}
            setCustomName={setCustomName}
            setImageError={setImageError}
            setPreviewImage={setPreviewImage}
            setSelectedSize={setSelectedSize}
            setShowImageModal={setShowImageModal}
            templatesLoading={templatesLoading}
            uploadedImage={uploadedImage}
            uploadedImageName={uploadedImageName}
          />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <>
      <Page basic>
        <ContentTopHeaderLayout>
          <PageTitleHeader>
            <StyledMenu borderless fluid secondary>
              <Menu.Item>
                <Header as="h1">Create Postcard Campaign</Header>
              </Menu.Item>
              <Menu.Item position="right">
                <div className="right menu">
                  <Button
                    onClick={() =>
                      location?.state?.from === 'postcards'
                        ? history.push('postcards')
                        : history.push('dashboard')
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    primary
                    className={createDisabled ? 'btn-disabled' : ''}
                    onClick={createCampaign}
                  >
                    Create
                  </Button>
                </div>
              </Menu.Item>
            </StyledMenu>
          </PageTitleHeader>
        </ContentTopHeaderLayout>
        <Segment>
          <StyledTab
            activeIndex={activeIndex}
            onTabChange={(e, { activeIndex }) => setActiveIndex(activeIndex)}
            menu={{ secondary: true, pointing: true }}
            panes={panes}
          />
        </Segment>
        <PreviewModal open={showImageModal} className={activeIndex === 1 ? 'pad-bottom' : ''}>
          <ModalClose onClick={() => setShowImageModal(false)}>
            <Icon name="close" color="grey" size="large" />
          </ModalClose>
          <PreviewImage src={previewImage} alt="download preview" />
          {activeIndex === 0 && (
            <ModalActions>
              <div className="arrow" onClick={prevImg}>
                <Icon name="chevron left" size="big" color="grey" />
              </div>
              <Button
                primary
                onClick={() => {
                  setSelectedTemplate(filteredTemplates[currentItem]);
                  setShowImageModal(false);
                }}
              >
                SELECT
              </Button>
              <div className="arrow" onClick={nextImg}>
                <Icon name="chevron right" size="big" color="grey" />
              </div>
            </ModalActions>
          )}
        </PreviewModal>
        <ListingModal
          createCampaign={createCampaign}
          open={showListingModal}
          setOpen={setShowListingModal}
          selectedListing={selectedListing}
          selectedSize={selectedSize}
          selectedTemplate={selectedTemplate}
          setSelectedListing={setSelectedListing}
        />
      </Page>
      <Dimmer active={creatingCampaign}>
        <Loader>Creating Campaign</Loader>
      </Dimmer>
    </>
  );
}
