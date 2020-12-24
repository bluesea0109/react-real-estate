import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { ContentTopHeaderLayout } from '../layouts';
import {
  Button,
  Header,
  Menu,
  Page,
  Segment,
  Snackbar,
  SectionHeader,
  StyledMenu,
  Dropdown,
  Icon,
  Label,
  Input,
} from '../components/Base';
import PageTitleHeader from '../components/PageTitleHeader';
import Loading from '../components/Loading';
import * as brandColors from '../components/utils/brandColors';
import { Link } from 'react-router-dom';

const SectionGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  padding: 0.5rem;
`;

const ContentItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: ${brandColors.grey03};
  font-weight: bold;
  & img {
    width: 240px;
    height: 160px;
    padding: 0.5rem;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    box-shadow: 0 3px 8px 0 rgba(201, 201, 201, 0.4);
  }
  & .item-name {
    text-transform: capitalize;
  }
`;

const StyledDropdown = styled(Dropdown)`
  padding: 2px;
`;

const ItemContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TagsContainer = styled.div`
  padding-left: 1rem;
`;

const SearchContainer = styled(Menu.Item)`
  &&& {
    flex: 1 0 250px;
    max-width: 400px;
  }
`;

const ContentItem = ({ item }) => {
  return (
    <ContentItemContainer>
      <img src={item.thumbnail} alt="content-list-item" />
      <span className="item-name">{item.name}</span>
    </ContentItemContainer>
  );
};

export default function ReadyMadeDesignPage() {
  const error = false;
  const content = useSelector(store => store.content);
  const tagList = content.list.reduce((list, design) => {
    design.tags.forEach(tag => {
      if (!list.includes(tag)) {
        list.push(tag);
      }
    });
    return list;
  }, []);

  const [tags] = useState(tagList);
  const [contentList] = useState(content.list);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchValue, setSearchValue] = useState('');

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

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <StyledMenu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Ready Made Designs</Header>
            </Menu.Item>
            <SearchContainer>
              <Input
                fluid
                icon="search"
                placeholder="Search by design name or type"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
            </SearchContainer>
            <Menu.Item position="right">
              <Link to="/dashboard">
                <Button primary inverted>
                  Back
                </Button>
              </Link>
            </Menu.Item>
          </StyledMenu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>

      <Segment>
        <SectionHeader>
          <StyledDropdown text="All Designs">
            <Dropdown.Menu>
              <Dropdown.Header icon="tags" content="Filter by tag" />
              {tags.map(tag => (
                <Dropdown.Item key={tag} onClick={() => addTag(tag)}>
                  <ItemContent>
                    <span>{tag}</span>
                    {selectedTags.includes(tag) && <Icon name="check" />}
                  </ItemContent>
                </Dropdown.Item>
              ))}
              <Dropdown.Header />
            </Dropdown.Menu>
          </StyledDropdown>
          {selectedTags.length > 0 && (
            <TagsContainer>
              {selectedTags.map(tag => (
                <Label key={tag}>
                  <Icon name="tag" /> {tag} <Icon name="delete" onClick={() => removeTag(tag)} />
                </Label>
              ))}
            </TagsContainer>
          )}
        </SectionHeader>
        <SectionGrid>
          {selectedTags.length > 0
            ? contentList
                .filter(item => item.tags.some(tag => selectedTags.includes(tag)))
                .filter(
                  item =>
                    item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                    item.tags.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase()))
                )
                .map(item => <ContentItem key={item.id} item={item} />)
            : contentList
                .filter(
                  item =>
                    item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                    item.tags.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase()))
                )
                .map(item => <ContentItem key={item.id} item={item} />)}
          {selectedTags.length > 0
            ? searchValue &&
              contentList
                .filter(item => item.tags.some(tag => selectedTags.includes(tag)))
                .filter(
                  item =>
                    item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                    item.tags.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase()))
                ).length === 0 && <div>No Matches...</div>
            : searchValue &&
              contentList.filter(
                item =>
                  item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                  item.tags.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase()))
              ).length === 0 && <div>No Matches...</div>}
        </SectionGrid>
      </Segment>

      {error && <Snackbar error>{error}</Snackbar>}
      {content.pending && <Loading />}
    </Page>
  );
}
