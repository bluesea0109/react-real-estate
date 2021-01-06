import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
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
import PageTitleHeader from '../../components/PageTitleHeader';
import { ContentTopHeaderLayout } from '../../layouts';
import GridItem from './GridItem';
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
  setSelectedSize,
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
                  <span>{tag}</span>
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
      <TemplatesGrid templates={filteredTemplates} />
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
        <GridItem>Upload</GridItem>
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
            setSelectedSize={setSelectedSize}
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
    </Page>
  );
}
