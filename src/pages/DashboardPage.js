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
} from '../components/Base';
import PageTitleHeader from '../components/PageTitleHeader';
import Loading from '../components/Loading';
import * as brandColors from '../components/utils/brandColors';
import { Link, useHistory } from 'react-router-dom';
import ReadyMadeContentSlider from '../components/ReadyMadeContentSlider';
import CreateHomeValueAdModal from '../components/CreateHomeValueAdModal';
import { useWindowSize } from '../components/Hooks/useWindowSize';
import { DashboardItemContainer } from '../components/DashboardItemContainer';

const StyledHeading = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${brandColors.grey03};
  font-size: 1.1rem;
  padding: 0.5rem;
`;

const ViewAllButton = styled(ButtonNoStyle)`
  color: ${brandColors.primary};
`;

const SectionHeader = styled.h3`
  padding: 2rem 0 0 0.5rem;
  color: ${brandColors.grey02};
`;

const SectionGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(5, minmax(230px, 1fr));
  padding-top: 0.5rem;
  & > div {
    padding: 0.25rem;
  }
  & .image-container {
    width: 220px;
  }
  @media (max-width: 1320px) {
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  }
`;

const getDashboardImg = fileName =>
  `https://stencil-alf-assets.s3.amazonaws.com/marketer/${fileName}`;

const DashboardItem = ({ className, name, linkTo, external, soon, ...otherProps }) => {
  let imgFileName = `${name.replaceAll(' ', '_')}.jpg`;
  let imgSrc = getDashboardImg(`${imgFileName}`);
  const linkAttributes = external
    ? {
        href: linkTo,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};
  if (external || soon) {
    return (
      <DashboardItemContainer className={className} soon={soon}>
        <a {...linkAttributes}>
          <img src={imgSrc} alt={`dashboard-item-${name}`} />
          <span className="item-name">
            {name === 'kwkly sign' ? (
              <>
                <span className="kwkly-code">KWKLY </span>
                <span>Sign</span>
              </>
            ) : (
              `${name}${soon ? ' - Coming Soon' : ''}`
            )}
          </span>
        </a>
      </DashboardItemContainer>
    );
  }
  return (
    <DashboardItemContainer className={className}>
      <Link to={linkTo} {...otherProps}>
        <img src={imgSrc} alt={`dashboard-item-${name}`} />
        <span className="item-name">{name}</span>
      </Link>
    </DashboardItemContainer>
  );
};

const Dashboard = ({ className }) => {
  const history = useHistory();
  const windowSize = useWindowSize();
  const isInitiatingTeam = useSelector(store => store.teamInitialize.polling);
  const initiatingTeamState = useSelector(store => store.teamInitialize.available);
  const contentList = useSelector(store => store.content.list);
  const readyMadeContent = contentList.filter(item => item.formats.includes('rectangle'));
  const currentTeamUserTotal = initiatingTeamState && initiatingTeamState.currentUserTotal;
  const currentTeamUserCompleted = initiatingTeamState && initiatingTeamState.currentUserCompleted;
  const isInitiatingUser = useSelector(store => store.initialize.polling);
  const initiatingUserState = useSelector(store => store.initialize.available);
  const currentUserTotal = initiatingUserState && initiatingUserState.campaignsTotal;
  const currentUserCompleted = initiatingUserState && initiatingUserState.campaignsCompleted;

  const [showAdsModal, setShowAdsModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(false);
  const [selectedAdType, setSelectedAdType] = useState('');

  const error = useSelector(store => store.mailouts.error?.message);

  const handleShowModal = () => {
    setShowAdsModal(true);
    setSelectedAdType('homeValue');
  };

  const handleCloseModal = () => {
    setShowAdsModal(false);
    setSelectedAdType('');
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
        <SectionHeader>Postcards</SectionHeader>
        <SectionGrid>
          <DashboardItem
            name="just listed postcard"
            linkTo={{
              pathname: 'create-postcard',
              state: { filter: 'listed' },
            }}
          ></DashboardItem>
          <DashboardItem
            name="just sold postcard"
            linkTo={{
              pathname: 'create-postcard',
              state: { filter: 'sold' },
            }}
          ></DashboardItem>
          <DashboardItem
            name="handwritten postcard"
            linkTo={{ pathname: 'create-postcard', state: { filter: 'handwritten' } }}
          ></DashboardItem>
          <DashboardItem
            name="holiday postcard"
            linkTo={{ pathname: 'create-postcard', state: { filter: 'holiday' } }}
          ></DashboardItem>
          <DashboardItem
            name="custom postcard"
            linkTo={{ pathname: 'create-postcard', state: { filter: 'custom' } }}
          ></DashboardItem>
        </SectionGrid>
        <SectionHeader>Ads</SectionHeader>
        <SectionGrid>
          <DashboardItem
            name="just listed ad"
            linkTo={{
              pathname: 'listings',
              state: { filters: ['Active'], adsModal: true, adType: 'listed' },
            }}
          ></DashboardItem>
          <DashboardItem
            name="just sold ad"
            linkTo={{
              pathname: 'listings',
              state: { filters: ['Sold'], adsModal: true, adType: 'sold' },
            }}
          ></DashboardItem>
          <DashboardItem
            name="open house ad"
            linkTo={{
              pathname: 'listings',
              state: { filters: ['Active', 'Pending'], adsModal: true, adType: 'openHouse' },
            }}
          ></DashboardItem>
          <DashboardItem
            name="home value ad"
            linkTo={{ pathname: 'dashboard' }}
            onClick={() => handleShowModal()}
          ></DashboardItem>
          <DashboardItem
            name="buyer search ad"
            soon
            // linkTo={{
            //   pathname: 'listings',
            //   state: { filters: ['Active', 'Pending'], adsModal: true, adType: 'buyerSearch' },
            // }}
          ></DashboardItem>
        </SectionGrid>
        <SectionHeader>Marketing Materials</SectionHeader>
        <SectionGrid>
          <DashboardItem
            name="business card"
            linkTo="https://agentstore.com/product-category/business-cards/?utm_source=brivity?utm_medium=Dashobard?utm_campaign=Brivity_Marketer?utm_term=addproductnamehere"
            external
          ></DashboardItem>
          <DashboardItem
            name="kwkly sign"
            linkTo="https://agentstore.com/kwkly/?utm_source=brivity?utm_medium=Dashobard?utm_campaign=Brivity_Marketer?utm_term=addproductnamehere"
            external
          ></DashboardItem>
          <DashboardItem
            name="listing sign"
            linkTo="https://agentstore.com/product-category/signs/?utm_source=brivity?utm_medium=Dashobard?utm_campaign=Brivity_Marketer?utm_term=addproductnamehere"
            external
          ></DashboardItem>
          <DashboardItem
            name="sign rider"
            linkTo="https://agentstore.com/product/3mm-pvc-sign-riders-18-x-6-3-pack/?utm_source=brivity?utm_medium=Dashobard?utm_campaign=Brivity_Marketer?utm_term=addproductnamehere"
            external
          ></DashboardItem>
          <DashboardItem
            name="name tag"
            linkTo="https://agentstore.com/product-category/name-tags/?utm_source=brivity?utm_medium=Dashobard?utm_campaign=Brivity_Marketer?utm_term=addproductnamehere"
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
          windowSize.width <= 1320 ? (
            <SectionGrid>
              {readyMadeContent.slice(0, 8).map(contentItem => (
                <DashboardItemContainer key={contentItem.id} className={className} type={'content'}>
                  <Link to={{ pathname: '/ready-made-designs', state: { item: contentItem } }}>
                    <img src={contentItem.thumbnail} alt="content item" />
                    <span className="item-name">{contentItem.name.split(':')[0]}</span>
                  </Link>
                </DashboardItemContainer>
              ))}
            </SectionGrid>
          ) : (
            <ReadyMadeContentSlider contentList={readyMadeContent} />
          )
        ) : (
          <div>
            <SectionGrid>
              {readyMadeContent.map(contentItem => (
                <DashboardItemContainer key={contentItem.id} className={className} type={'content'}>
                  <Link to={{ pathname: '/ready-made-designs', state: { item: contentItem } }}>
                    <img src={contentItem.thumbnail} alt="content item" />
                    <span className="item-name">{contentItem.name.split(':')[0]}</span>
                  </Link>
                </DashboardItemContainer>
              ))}
            </SectionGrid>
          </div>
        )}
      </Segment>

      {error && <Snackbar error>{error}</Snackbar>}
      {/* show the loading state */}
      {false && <Loading />}

      <CreateHomeValueAdModal
        open={showAdsModal}
        setOpen={handleCloseModal}
        selectedAddress={selectedAddress}
        adType={selectedAdType}
        setSelectedAddress={setSelectedAddress}
      />
    </Page>
  );
};

export default Dashboard;
