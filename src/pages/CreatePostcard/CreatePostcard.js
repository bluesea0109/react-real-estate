import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { startCase } from 'lodash';
import {
  Button,
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

const postcardSizes = ['4x6', '6x9', '6x11'];

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
          <GridItem>Upload</GridItem>
          <div className="label-text">Upload your own design</div>
        </GridItemContainer>
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

  const [filteredTemplates, setFilteredTemplates] = useState(allTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedSize, setSelectedSize] = useState('4x6');
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

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
                <Button primary onClick={() => console.log('TODO - Create...')}>
                  Create
                </Button>
              </div>
            </Menu.Item>
          </StyledMenu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>
      <Segment>
        <StyledTab menu={{ secondary: true, pointing: true }} panes={panes} />
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
