import React, { useEffect, useState } from 'react';
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
  Modal,
} from '../components/Base';
import PageTitleHeader from '../components/PageTitleHeader';
import Loading from '../components/Loading';
import * as brandColors from '../components/utils/brandColors';
import { Link } from 'react-router-dom';
import auth from '../services/auth';

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
  border-radius: 6px;
  & .image-container {
    width: 248px;
    height: 168px;
    position: relative;
    border-radius: 6px;
    padding: 0.5rem;
    box-shadow: 0 3px 8px 0 rgba(201, 201, 201, 0.4);
    & .image-overlay {
      color: white;
      display: none;
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      width: calc(100% - 1rem);
      height: calc(100% - 1rem);
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      text-transform: uppercase;
      padding: 2rem 0;
      font-size: 12px;
      & div {
        cursor: pointer;
      }
      & #image-download {
        color: white;
        padding: 0.4rem 1rem;
        border-radius: 1.5rem;
        border: 2px solid white;
      }
    }
    & img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
    &:hover {
      & .image-overlay {
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
      }
    }
  }
  & .item-name {
    padding-top: 1rem;
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

const PreviewModal = styled(Modal)`
  &&&& {
    position: relative;
    padding: 2.5rem 2.5rem 0 2.5rem;
  }
`;

const ModalClose = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.75rem;
  cursor: pointer;
  & i {
    margin: 0;
  }
`;

const PreviewImage = styled.img`
  width: 800px;
`;

const ModalActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0.5rem;
  & .arrow {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 1rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      background-color: ${brandColors.lightGreyHover};
    }
    & i {
      margin: 0;
    }
  }
`;

const ContentItem = ({ contentList, downloadImage, item, setCurrentItem, setShowImageModal }) => {
  return (
    <ContentItemContainer>
      <div className="image-container">
        <img src={item.thumbnail} alt="content-list-item" />
        <div className="image-overlay">
          <div id="image-download" onClick={() => downloadImage(item)}>
            Download
          </div>
          <div
            onClick={() => {
              setCurrentItem(() => contentList.findIndex(el => el === item));
              setShowImageModal(true);
            }}
          >
            <Icon name="eye" /> view
          </div>
        </div>
      </div>
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
  const [filteredContentList, setFilteredContentList] = useState(content.list);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(0);

  useEffect(() => {
    let newContentList = content.list;
    if (selectedTags.length > 0)
      newContentList = newContentList.filter(item =>
        item.tags.some(tag => selectedTags.includes(tag))
      );
    newContentList = newContentList.filter(
      item =>
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase()))
    );
    setFilteredContentList(newContentList);
  }, [selectedTags, searchValue, content.list]);

  async function downloadImage(item) {
    const path = `/api/user/content/download/${item.id}`;
    const headers = {};
    const accessToken = await auth.getAccessToken();
    headers['authorization'] = `Bearer ${accessToken}`;
    const imageRes = await fetch(path, { headers, method: 'get', credentials: 'include' });
    let anchor = document.createElement('a');
    document.body.appendChild(anchor);
    imageRes.blob().then(imgBlob => {
      let imgURL = window.URL.createObjectURL(imgBlob);
      anchor.href = imgURL;
      anchor.download = item.name;
      anchor.click();
      window.URL.revokeObjectURL(imgURL);
    });
  }

  const prevImg = () => {
    let newImgIndex = currentItem - 1;
    if (newImgIndex < 0) newImgIndex = filteredContentList.length - 1;
    setCurrentItem(newImgIndex);
  };

  const nextImg = () => {
    let newImgIndex = currentItem + 1;
    if (newImgIndex > filteredContentList.length - 1) newImgIndex = 0;
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
          {filteredContentList.map(item => (
            <ContentItem
              key={item.id}
              contentList={filteredContentList}
              downloadImage={downloadImage}
              item={item}
              setCurrentItem={setCurrentItem}
              setShowImageModal={setShowImageModal}
            />
          ))}
          {filteredContentList.length === 0 && <div>No Matches...</div>}
        </SectionGrid>
      </Segment>

      {error && <Snackbar error>{error}</Snackbar>}
      {content.pending && <Loading />}
      <PreviewModal open={showImageModal}>
        <ModalClose onClick={() => setShowImageModal(false)}>
          <Icon name="close" color="grey" size="large" />
        </ModalClose>
        <PreviewImage src={filteredContentList[currentItem]?.preview} alt="download preview" />
        <ModalActions>
          <div className="arrow" onClick={prevImg}>
            <Icon name="chevron left" size="big" color="grey" />
          </div>
          <Button primary onClick={() => downloadImage(filteredContentList[currentItem])}>
            Download
          </Button>
          <div className="arrow" onClick={nextImg}>
            <Icon name="chevron right" size="big" color="grey" />
          </div>
        </ModalActions>
      </PreviewModal>
    </Page>
  );
}
