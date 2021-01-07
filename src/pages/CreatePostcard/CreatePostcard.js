import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { startCase } from 'lodash';
import {
  Button,
  ButtonOutline,
  Dropdown,
  Header,
  Icon,
  Label,
  Menu,
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

const ItemContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TagsContainer = styled.div`
  padding-left: 1rem;
`;

const StyledSectionHeader = styled(SectionHeader)`
  padding: 0.5rem 0;
  font-size: 17px;
  font-weight: 600;
  & .ui.dropdown > .text {
    padding: 4px 0;
  }
`;

const UploadImage = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  padding: 6px;
  border: 1px dashed #d3d3d3;
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-rows: 1fr 1.25rem;
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
  addTag,
  filteredTemplates,
  removeTag,
  selectedTags,
  tagList,
  selectedSize,
  selectedTemplate,
  setCurrentItem,
  setSelectedSize,
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
        <Dropdown text="All Templates">
          <Dropdown.Menu>
            <Dropdown.Header icon="tags" content="Filter by tag" />
            {tagList.map(tag => (
              <Dropdown.Item key={tag} onClick={() => addTag(tag)}>
                <ItemContent>
                  <span>{startCase(tag)}</span>
                  {selectedTags.includes(tag) && <Icon name="check" />}
                </ItemContent>
              </Dropdown.Item>
            ))}
            <Dropdown.Header />
          </Dropdown.Menu>
        </Dropdown>
        {selectedTags.length > 0 && (
          <TagsContainer>
            {selectedTags.map(tag => (
              <Label key={tag}>
                <Icon name="tag" /> {tag} <Icon name="delete" onClick={() => removeTag(tag)} />
              </Label>
            ))}
          </TagsContainer>
        )}
      </StyledSectionHeader>
      <TemplatesGrid
        templates={filteredTemplates}
        selectedTemplate={selectedTemplate}
        setCurrentItem={setCurrentItem}
        setSelectedTemplate={setSelectedTemplate}
        setShowImageModal={setShowImageModal}
      />
    </>
  );
};

const CustomTab = ({ selectedSize, setSelectedSize }) => {
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
        <p>Card Front</p>
      </StyledSectionHeader>
      <GridLayout>
        <GridItemContainer>
          <GridItem>
            <UploadImage>
              <div className="overlay">
                <ButtonOutline>UPLOAD</ButtonOutline>
              </div>
              <Icon name="upload" />
              <span className="upload-directions">{`(${getUploadSizes(
                selectedSize
              )} PNG or JPEG = max 5MB)`}</span>
            </UploadImage>
          </GridItem>
          <div className="label-text">Upload your own design</div>
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

export default function CreatePostcard(props) {
  const storeTemplates = useSelector(state => state.templates.available);
  const allTemplates = Object.values(storeTemplates).reduce((acc, cur) => [...acc, ...cur], []);

  const tagList = allTemplates.reduce((list, stencil) => {
    stencil.publishedTags.forEach(tag => {
      if (!list.includes(tag)) list.push(tag);
    });
    return list;
  }, []);

  const [activeIndex, setActiveIndex] = useState(1);
  const [createDisabled, setCreateDisabled] = useState(true);
  const [currentItem, setCurrentItem] = useState(null);
  const [filteredTemplates, setFilteredTemplates] = useState(allTemplates);
  const [selectedSize, setSelectedSize] = useState('4x6');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  useEffect(() => {
    if (activeIndex === 1 && !uploadedPhoto) setCreateDisabled(true);
    else if (activeIndex === 0 && !selectedTemplate) setCreateDisabled(true);
    else setCreateDisabled(false);
  }, [activeIndex, createDisabled, uploadedPhoto, selectedTemplate]);

  const prevImg = () => {
    let newImgIndex = currentItem - 1;
    if (newImgIndex < 0) newImgIndex = filteredTemplates.length - 1;
    setCurrentItem(newImgIndex);
  };

  const nextImg = () => {
    let newImgIndex = currentItem + 1;
    if (newImgIndex > filteredTemplates.length - 1) newImgIndex = 0;
    setCurrentItem(newImgIndex);
  };

  const addTag = tag => {
    if (selectedTags.includes(tag)) return;
    let newTags = [...selectedTags];
    newTags.unshift(tag);
    setSelectedTags(newTags);
  };

  const removeTag = tagToRemove => {
    let newTags = [...selectedTags];
    newTags.splice(
      newTags.findIndex(tag => tag === tagToRemove),
      1
    );
    setSelectedTags(newTags);
  };

  useEffect(() => {
    let newFilteredTemplates = allTemplates;
    if (selectedTags.length)
      newFilteredTemplates = newFilteredTemplates.filter(stencil =>
        stencil.publishedTags.some(tag => selectedTags.includes(tag))
      );
    setFilteredTemplates(newFilteredTemplates);
    // eslint-disable-next-line
  }, [selectedTags]);

  const panes = [
    {
      menuItem: 'Templates',
      render: () => (
        <Tab.Pane as="div">
          <TemplatesTab
            addTag={addTag}
            filteredTemplates={filteredTemplates}
            removeTag={removeTag}
            selectedSize={selectedSize}
            selectedTags={selectedTags}
            selectedTemplate={selectedTemplate}
            setCurrentItem={setCurrentItem}
            setSelectedSize={setSelectedSize}
            setSelectedTemplate={setSelectedTemplate}
            setShowImageModal={setShowImageModal}
            tagList={tagList}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Custom Design',
      render: () => (
        <Tab.Pane as="div">
          <CustomTab setSelectedSize={setSelectedSize} selectedSize={selectedSize} />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <StyledMenu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Create Postcard Campaign</Header>
            </Menu.Item>
            <Menu.Item position="right">
              <div className="right menu">
                <Button onClick={() => console.log('TODO - Back to dashboard?')}>Cancel</Button>
                <Button
                  primary
                  className={createDisabled ? 'btn-disabled' : ''}
                  onClick={() => console.log('TODO - Create...')}
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
      <PreviewModal open={showImageModal}>
        <ModalClose onClick={() => setShowImageModal(false)}>
          <Icon name="close" color="grey" size="large" />
        </ModalClose>
        <PreviewImage src={filteredTemplates[currentItem]?.thumbnail} alt="download preview" />
        <ModalActions>
          <div className="arrow" onClick={prevImg}>
            <Icon name="chevron left" size="big" color="grey" />
          </div>
          <Button
            primary
            onClick={() => {
              setSelectedTemplate(filteredTemplates[currentItem].templateTheme);
              setShowImageModal(false);
            }}
          >
            SELECT
          </Button>
          <div className="arrow" onClick={nextImg}>
            <Icon name="chevron right" size="big" color="grey" />
          </div>
        </ModalActions>
      </PreviewModal>
    </Page>
  );
}
