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
  StyledMenu,
  Dropdown,
  Icon,
  Input,
} from '../components/Base';
import {
  ModalActions,
  ModalClose,
  PreviewImage,
  PreviewModal,
} from '../components/Base/PreviewModal';
import PageTitleHeader from '../components/PageTitleHeader';
import Loading from '../components/Loading';
import { Link, useLocation } from 'react-router-dom';
import auth from '../services/auth';
import ReadyMadeContentItem from '../components/ReadyMadeContentItem';
import { startCase, lowerCase } from 'lodash';

const SectionGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  padding: 0.5rem;
`;

const StyledHeading = styled.div`
  padding: 0.5rem 0;
  font-size: 17px;
  font-weight: 600;
  & .ui.dropdown {
    margin-right: 2rem;
    & > .text {
      padding: 4px 0;
    }
  }
`;

const StyledDropdown = styled(Dropdown)`
  padding: 2px;
`;

const ItemContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SearchContainer = styled(Menu.Item)`
  &&& {
    flex: 1 0 250px;
    max-width: 400px;
  }
`;

export default function ReadyMadeDesignPage() {
  const location = useLocation();
  const clickedItem = location?.state?.item;
  const error = false;
  const content = useSelector(store => store.content);
  const filterList = content.list
    .reduce(
      (list, design) => {
        design.tags.forEach(tag => {
          if (!list.includes(tag)) {
            list.push(tag);
          }
        });
        return list;
      },
      ['All Designs']
    )
    .sort((a, b) => {
      if (b === 'other') return -1;
      else return 0;
    });
  const typeFilterList = content.list.reduce(
    (list, design) => {
      design.formats.forEach(format => {
        if (!list.includes(format)) {
          list.push(format);
        }
      });
      return list;
    },
    ['All Formats']
  );

  const [filteredContentList, setFilteredContentList] = useState(content.list);
  const [currentFilter, setCurrentFilter] = useState(filterList[0]);
  const [currentTypeFilter, setCurrentTypeFilter] = useState(typeFilterList[0]);
  const [searchValue, setSearchValue] = useState('');
  const [showImageModal, setShowImageModal] = useState(clickedItem ? true : false);
  const [currentItem, setCurrentItem] = useState(
    clickedItem ? filteredContentList.findIndex(item => item.id === clickedItem.id) : 0
  );

  useEffect(() => {
    let newContentList = content.list;
    if (currentFilter !== 'All Designs') {
      newContentList = newContentList.filter(item => item.tags.some(tag => currentFilter === tag));
    }
    if (currentTypeFilter !== 'All Formats') {
      newContentList = newContentList.filter(item =>
        item.formats.some(format => currentTypeFilter === format)
      );
    }
    newContentList = newContentList.filter(
      item =>
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.tags.some(tag => lowerCase(tag).includes(searchValue.toLowerCase())) ||
        item.formats.some(format => lowerCase(format).includes(searchValue.toLowerCase()))
    );
    setFilteredContentList(newContentList);
  }, [currentFilter, currentTypeFilter, searchValue, content.list]);

  async function downloadImage(item) {
    setShowImageModal(false);
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
                  <Icon name="left arrow" />
                  <span>Dashboard</span>
                </Button>
              </Link>
            </Menu.Item>
          </StyledMenu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>

      <Segment>
        <StyledHeading>
          <StyledDropdown text={startCase(currentFilter)}>
            <Dropdown.Menu>
              {filterList.map(filter => (
                <Dropdown.Item key={filter} onClick={() => setCurrentFilter(filter)}>
                  <ItemContent>
                    <span>{startCase(filter)}</span>
                  </ItemContent>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </StyledDropdown>
          <StyledDropdown text={startCase(currentTypeFilter)}>
            <Dropdown.Menu>
              {typeFilterList.map(filter => (
                <Dropdown.Item key={filter} onClick={() => setCurrentTypeFilter(filter)}>
                  <ItemContent>
                    <span>{startCase(filter)}</span>
                  </ItemContent>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </StyledDropdown>
        </StyledHeading>
        <SectionGrid>
          {filteredContentList.map(item => (
            <ReadyMadeContentItem
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
