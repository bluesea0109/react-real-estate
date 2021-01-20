import React, { useState } from 'react';
import { Progress } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ContentBottomHeaderLayout, ContentTopHeaderLayout } from '../layouts';
import {
  Header,
  Menu,
  Page,
  Segment,
  Snackbar,
  StyledMenu,
  ButtonNoStyle,
  Icon,
  Button,
} from '../components/Base';
import PageTitleHeader from '../components/PageTitleHeader';
import Loading from '../components/Loading';
import * as brandColors from '../components/utils/brandColors';
import { Link, useHistory } from 'react-router-dom';
import ReadyMadeContentSlider from '../components/ReadyMadeContentSlider';
import { useWindowSize } from '../components/Hooks/useWindowSize';
import ReadyMadeContentItem from '../components/ReadyMadeContentItem';
import auth from '../services/auth';
import {
  ModalActions,
  ModalClose,
  PreviewImage,
  PreviewModal,
} from '../components/Base/PreviewModal';

const StyledHeading = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${brandColors.grey03};
  font-size: 1.1rem;
  padding: 0.5rem 0.5rem 1rem 0.5rem;
`;

const ViewAllButton = styled(ButtonNoStyle)`
  color: ${brandColors.primary};
`;

const SectionGrid = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(5, minmax(220px, 1fr));
  @media (max-width: 1260px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
`;

const DashboardItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  & img {
    width: 220px;
    height: 160px;
    border-radius: 6px;
    margin-bottom: 0.25rem;
    box-shadow: 0 3px 8px 0 rgba(201, 201, 201, 0.4);
  }
  & .item-name {
    color: ${brandColors.grey04};
    text-transform: capitalize;
    & .kwkly-code {
      text-transform: uppercase;
    }
  }
  &:hover {
    color: ${brandColors.grey04};
    font-weight: bold;
  }
`;

const getDashboardImg = fileName =>
  `https://stencil-alf-assets.s3.amazonaws.com/marketer/${fileName}`;

const DashboardItem = ({ className, name, linkTo, external }) => {
  let imgFileName = `${name.replaceAll(' ', '_')}.jpg`;
  let imgSrc = getDashboardImg(`${imgFileName}`);
  const linkAttributes = external
    ? {
        href: linkTo,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};
  if (external) {
    return (
      <DashboardItemContainer className={className}>
        <a {...linkAttributes}>
          <img src={imgSrc} alt={`dashboard-item-${name}`} />
          <span className="item-name">
            {name === 'kwkly sign' ? (
              <>
                <span className="kwkly-code">KWKLY </span>
                <span>Sign</span>
              </>
            ) : (
              name
            )}
          </span>
        </a>
      </DashboardItemContainer>
    );
  }
  return (
    <DashboardItemContainer className={className}>
      <Link to={linkTo}>
        <img src={imgSrc} alt={`dashboard-item-${name}`} />
        <span className="item-name">{name}</span>
      </Link>
    </DashboardItemContainer>
  );
};

const Dashboard = () => {
  const history = useHistory();
  const windowSize = useWindowSize();
  const isInitiatingTeam = useSelector(store => store.teamInitialize.polling);
  const initiatingTeamState = useSelector(store => store.teamInitialize.available);
  const readyMadeContent = useSelector(store => store.content.list);
  const currentTeamUserTotal = initiatingTeamState && initiatingTeamState.currentUserTotal;
  const currentTeamUserCompleted = initiatingTeamState && initiatingTeamState.currentUserCompleted;
  const isInitiatingUser = useSelector(store => store.initialize.polling);
  const initiatingUserState = useSelector(store => store.initialize.available);
  const currentUserTotal = initiatingUserState && initiatingUserState.campaignsTotal;
  const currentUserCompleted = initiatingUserState && initiatingUserState.campaignsCompleted;

  const error = useSelector(store => store.mailouts.error?.message);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(0);

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
    if (newImgIndex < 0) newImgIndex = readyMadeContent.length - 1;
    setCurrentItem(newImgIndex);
  };

  const nextImg = () => {
    let newImgIndex = currentItem + 1;
    if (newImgIndex > readyMadeContent.length - 1) newImgIndex = 0;
    setCurrentItem(newImgIndex);
  };

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <StyledMenu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Dashboard</Header>
            </Menu.Item>
          </StyledMenu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>

      {isInitiatingTeam && (
        <ContentBottomHeaderLayout>
          <Progress
            value={currentTeamUserCompleted}
            total={currentTeamUserTotal}
            progress="ratio"
            inverted
            success
            size="tiny"
          />
        </ContentBottomHeaderLayout>
      )}

      {isInitiatingUser && (
        <ContentBottomHeaderLayout>
          <Progress
            value={currentUserCompleted}
            total={currentUserTotal}
            progress="ratio"
            inverted
            success
            size="tiny"
          />
        </ContentBottomHeaderLayout>
      )}

      <Segment>
        <StyledHeading>
          <h3>What do you want to create?</h3>
        </StyledHeading>
        <SectionGrid>
          <DashboardItem
            name="just listed postcard"
            linkTo={{
              pathname: 'create-postcard',
              state: { filter: 'Just Listed' },
            }}
          ></DashboardItem>
          <DashboardItem
            name="just sold postcard"
            linkTo={{
              pathname: 'create-postcard',
              state: { filter: 'Just Sold' },
            }}
          ></DashboardItem>
          <DashboardItem
            name="handwritten postcard"
            linkTo={{ pathname: 'create-postcard', state: { filter: 'Handwritten' } }}
          ></DashboardItem>
          <DashboardItem
            name="holiday postcard"
            linkTo={{ pathname: 'create-postcard', state: { filter: 'Holiday' } }}
          ></DashboardItem>
          <DashboardItem
            name="custom postcard"
            linkTo={{ pathname: 'create-postcard', state: { filter: 'custom' } }}
          ></DashboardItem>
          <DashboardItem name="just listed ad" linkTo="listings"></DashboardItem>
          <DashboardItem name="just sold ad" linkTo="listings"></DashboardItem>
          <DashboardItem name="open house ad" linkTo="listings"></DashboardItem>
          <DashboardItem name="home value ad" linkTo="listings"></DashboardItem>
          <DashboardItem name="buyer search ad" linkTo="listings"></DashboardItem>
          <DashboardItem
            name="business card"
            linkTo="https://agentstore.com/product-category/business-cards/"
            external
          ></DashboardItem>
          <DashboardItem
            name="kwkly sign"
            linkTo="https://agentstore.com/kwkly"
            external
          ></DashboardItem>
          <DashboardItem
            name="listing sign"
            linkTo="https://agentstore.com/product-category/signs/"
            external
          ></DashboardItem>
          <DashboardItem
            name="sign rider"
            linkTo="https://agentstore.com/product/3mm-pvc-sign-riders-18-x-6-3-pack/"
            external
          ></DashboardItem>
          <DashboardItem
            name="name tag"
            linkTo="https://agentstore.com/product-category/name-tags/"
            external
          ></DashboardItem>
        </SectionGrid>
      </Segment>

      <Segment>
        <StyledHeading>
          <h3>Ready Made Designs</h3>
          <ViewAllButton onClick={() => history.push('/ready-made-designs')}>
            View All
          </ViewAllButton>
        </StyledHeading>
        {readyMadeContent.length > 5 ? (
          windowSize.width < 1258 ? (
            <SectionGrid>
              {readyMadeContent.slice(0, 8).map(contentItem => (
                <ReadyMadeContentItem
                  key={contentItem.id}
                  contentList={readyMadeContent}
                  downloadImage={downloadImage}
                  item={contentItem}
                  setCurrentItem={setCurrentItem}
                  setShowImageModal={setShowImageModal}
                />
              ))}
            </SectionGrid>
          ) : (
            <ReadyMadeContentSlider
              contentList={readyMadeContent}
              downloadImage={downloadImage}
              setCurrentItem={setCurrentItem}
              setShowImageModal={setShowImageModal}
            />
          )
        ) : (
          <div>
            {readyMadeContent.map(contentItem => (
              <ReadyMadeContentItem
                key={contentItem.id}
                contentList={readyMadeContent}
                downloadImage={downloadImage}
                item={contentItem}
                setCurrentItem={setCurrentItem}
                setShowImageModal={setShowImageModal}
              />
            ))}
          </div>
        )}
      </Segment>
      <PreviewModal open={showImageModal}>
        <ModalClose onClick={() => setShowImageModal(false)}>
          <Icon name="close" color="grey" size="large" />
        </ModalClose>
        <PreviewImage src={readyMadeContent[currentItem]?.preview} alt="download preview" />
        <ModalActions>
          <div className="arrow" onClick={prevImg}>
            <Icon name="chevron left" size="big" color="grey" />
          </div>
          <Button primary onClick={() => downloadImage(readyMadeContent[currentItem])}>
            Download
          </Button>
          <div className="arrow" onClick={nextImg}>
            <Icon name="chevron right" size="big" color="grey" />
          </div>
        </ModalActions>
      </PreviewModal>

      {error && <Snackbar error>{error}</Snackbar>}
      {/* show the loading state */}
      {false && <Loading />}
    </Page>
  );
};

export default Dashboard;
