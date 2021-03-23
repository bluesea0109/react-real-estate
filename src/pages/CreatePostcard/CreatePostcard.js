import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  addCampaignStart,
  addHolidayCampaignStart,
  addCampaignReset,
} from '../../store/modules/mailouts/actions';
import { setAddMailoutError } from '../../store/modules/mailout/actions';
import '../../../node_modules/cropperjs/dist/cropper.min.css';
import {
  Button,
  Dimmer,
  Header,
  Icon,
  Loader,
  Menu,
  Page,
  Segment,
  Snackbar,
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
import ListingModal from '../../components/ListingModal';
import { postcardDimensions } from '../../components/utils/utils';
import auth from '../../services/auth';
import api from '../../services/api';
import { CustomTab, TemplatesTab } from '.';

const StyledTab = styled(Tab)`
  &&&& {
    padding: 0 1rem;
    .ui.menu {
      margin-top: 0;
    }
  }
`;

export default function CreatePostcard({ location }) {
  if (localStorage.getItem('filter') || localStorage.getItem('mlsNum')) {
    location.state = {
      filter: localStorage.getItem('filter'),
      mlsNum: localStorage.getItem('mlsNum'),
    };

    localStorage.removeItem('filter');
    localStorage.removeItem('mlsNum');
  }

  const dispatch = useDispatch();
  const history = useHistory();
  const addCampaignError = useSelector(store => store.mailouts.error?.message);
  const addCampaignPending = useSelector(store => store.mailouts.addCampaignPending);
  const addCampaignResponse = useSelector(store => store.mailouts.addCampaignResponse);
  const availableTemplates = useSelector(store => store.templates.available.byIntent);
  const templatesLoading = useSelector(store => store.templates.pending);
  const peerId = useSelector(store => store.peer.peerId);
  const initialFilter = location?.state?.filter;

  const [activeIndex, setActiveIndex] = useState(initialFilter === 'custom' ? 1 : 0);
  const [availableFilters, setAvailableFilters] = useState(['All Templates']);
  const [createDisabled, setCreateDisabled] = useState(true);
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(
    initialFilter && initialFilter !== 'custom' ? initialFilter : 'All Templates'
  );
  const [currentItem, setCurrentItem] = useState(null);
  const [customName, setCustomName] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [imageError, setImageError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedListing, setSelectedListing] = useState(false);
  const [selectedSize, setSelectedSize] = useState('4x6');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageName, setUploadedImageName] = useState('');

  const [cropper, setCropper] = useState(null);

  useEffect(() => {
    const newFilters = availableTemplates.reduce(
      (filterList, template) => {
        const intents = template.intentPath.split('|');
        if (!filterList?.includes(intents[1])) filterList.push(intents[1]);
        return filterList;
      },
      ['All Templates']
    );
    setAvailableFilters(newFilters);
  }, [availableTemplates]);

  useEffect(() => {
    if (currentFilter === 'All Templates') setFilteredTemplates(availableTemplates);
    else {
      const newFiltered = availableTemplates.filter(template =>
        template.intentPath?.includes(currentFilter)
      );
      setFilteredTemplates(newFiltered);
    }
  }, [currentFilter, availableTemplates]);

  useEffect(() => {
    if (addCampaignResponse) {
      addCampaignResponse.mailoutStatus === 'calculated'
        ? history.push(`/postcards/${addCampaignResponse._id}`)
        : history.push(`/postcards/edit/${addCampaignResponse._id}/destinations`);
      dispatch(addCampaignReset());
    }
  }, [addCampaignResponse, history, dispatch]);

  useEffect(() => {
    if (activeIndex === 1 && (!uploadedImage || !cropper)) setCreateDisabled(true);
    else if (activeIndex === 0 && !selectedTemplate) setCreateDisabled(true);
    else setCreateDisabled(false);
  }, [activeIndex, createDisabled, cropper, uploadedImage, selectedTemplate]);

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

  const handleFileChange = e => {
    setImageError(null);
    const file = e.target.files[0];
    if (!file) return;
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
      cropper.getCroppedCanvas().toBlob(async blob => {
        setCreatingCampaign(true);
        const imageURL = await getCustomImageURL(blob);
        if (!imageURL) {
          setCreatingCampaign(false);
          setImageError('There was an error uploading your file.');
          return;
        }
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
        return history.push(`/postcards/edit/${doc._id}/destinations`);
      });
      return;
    }
    if (selectedTemplate?.activities.includes('listingMarketing')) {
      if (location?.state?.mlsNum) {
        try {
          const mlsNum = location?.state?.mlsNum;
          const frontTemplateUuid = selectedTemplate?.templateUuid;
          const postcardSize = size;
          const publishedTags = selectedTemplate?.intentPath?.split('|');
          if (!mlsNum) throw new Error('Missing mlsNum');
          if (!postcardSize) throw new Error('Missing postcardSize');
          if (!frontTemplateUuid) throw new Error('Missing frontTemplateUuid');
          dispatch(addCampaignStart({ mlsNum, postcardSize, frontTemplateUuid, publishedTags }));
          return;
        } catch (err) {
          console.error('Error creating listing campaign: ', err);
          return;
        }
      } else {
        setShowListingModal(true);
        return;
      }
    }
    dispatch(
      addHolidayCampaignStart({
        createdBy: 'user',
        skipEmailNotification: true,
        name: selectedTemplate.name,
        frontTemplateUuid: selectedTemplate.templateUuid,
        postcardSize: size,
        mapperName: 'sphere',
        intentPath: selectedTemplate.intentPath,
        publishedTags: selectedTemplate?.intentPath?.split('|'),
      })
    );
  };

  const panes = [
    {
      menuItem: 'Templates',
      render: () => (
        <Tab.Pane as="div">
          <TemplatesTab
            availableFilters={availableFilters}
            filteredTemplates={filteredTemplates}
            templatesLoading={templatesLoading}
            selectedSize={selectedSize}
            currentFilter={currentFilter}
            selectedTemplate={selectedTemplate}
            setCurrentItem={setCurrentItem}
            setPreviewImage={setPreviewImage}
            setSelectedSize={setSelectedSize}
            setCurrentFilter={setCurrentFilter}
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
            cropper={cropper}
            customName={customName}
            handleFileChange={handleFileChange}
            imageError={imageError}
            selectedSize={selectedSize}
            setCropper={setCropper}
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
        {addCampaignError && <Snackbar error>{addCampaignError}</Snackbar>}
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
          <PreviewImage src={previewImage} alt="preview" />
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
      <Dimmer active={creatingCampaign || addCampaignPending}>
        <Loader>Creating Campaign</Loader>
      </Dimmer>
    </>
  );
}
