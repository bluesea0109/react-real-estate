import React, { useCallback, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useHistory } from 'react-router';

import { Progress } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import auth from '../services/auth';
import api from '../services/api';

import {
  ContentBottomHeaderLayout,
  ContentTopHeaderLayout,
  ItemBodyLayout,
  ItemLayout,
} from '../layouts';
import {
  getMailoutsPending,
  getMoreMailoutsPending,
  addCampaignStart,
  addHolidayCampaignStart,
  clearNewHolidayId,
} from '../store/modules/mailouts/actions';
import { setCompletedDashboardModal } from '../store/modules/onboarded/actions';
import {
  Button,
  Grid,
  Header,
  Icon,
  Input,
  Menu,
  Modal,
  Message,
  Page,
  Segment,
  Snackbar,
  ModalLoader,
  Tab,
} from '../components/Base';
import {
  NewLabel,
  SliderButtons,
  StyledButtonBack,
  StyledButtonNext,
} from '../components/Forms/Base/Carousel';
import Slider from 'react-slick';
import IframeGroup from '../components/MailoutListItem/IframeGroup';
import ListHeader from '../components/MailoutListItem/ListHeader';
import ItemList from '../components/MailoutListItem/ItemList';
import PageTitleHeader from '../components/PageTitleHeader';
import { postcardDimensions } from '../components/utils/utils';
import Loading from '../components/Loading';
import { useIsMobile } from '../components/Hooks/useIsMobile';
import PostcardSizeButton from '../components/Forms/Common/PostcardSizeButton';
import { calculateCost } from '../components/MailoutListItem/utils/helpers';
import Styled from 'styled-components';
import { clearAddMailoutError, setAddMailoutError } from '../store/modules/mailout/actions';
import { useWindowSize } from '../components/Hooks/useWindowSize';
import * as brandColors from '../components/utils/brandColors';

const AddCampaignContainer = Styled.div`
@media only screen and (max-width: 1200px) {
  #&&&{
    padding: 0 35px;
  }
}
`;

const NewCampaignContainer = Styled.div`
`;

const CampaignTypeButtons = Styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  & .button {
    flex: 0 0 225px;
    margin: 0.25em;
  }
`;

const ModalAddCampaign = Styled(Modal)`
&&&{
width:60%;
.content{
padding-left:0px;
padding-right:0px;
}
}
@media only screen and (max-width: 1250px) {
  &&&{
    width:90%;
  }
}
`;

const ModalWelcome = Styled(Modal)`
&&&{
  width:70%
}
@media only screen and (max-width: 800px) {
  &&&{
    width:90%;
  }
}
`;

const modalHeaderStyles = {
  padding: '4px 0px 0px 0px',
  display: 'flex',
  fontSize: '29px',
  color: '#59c4c4',
  fontWeight: '400',
  justifyContent: 'space-between',
  borderBottom: 'none',
};

const tabPane = { border: 'none', boxShadow: 'none', padding: '0px' };

const tabPainP = { marginBottom: '20px' };

const useFetching = (getActionCreator, onboarded, dispatch) => {
  useEffect(() => {
    // In order to prevent unnecessary call to the api when we are expecting a redirect,
    // we check for the existence of routerDestination used by the PrivatePath to route to a specific URL
    if (!localStorage.getItem('routerDestination') && onboarded) {
      dispatch(getActionCreator());
    }
  }, [getActionCreator, onboarded, dispatch]);
};

const Dashboard = () => {
  const isMobile = useIsMobile();
  const history = useHistory();
  const dispatch = useDispatch();
  const windowSize = useWindowSize();
  const peerId = useSelector(store => store.peer.peerId);
  const isInitiatingTeam = useSelector(store => store.teamInitialize.polling);
  const initiatingTeamState = useSelector(store => store.teamInitialize.available);
  const currentTeamUserTotal = initiatingTeamState && initiatingTeamState.currentUserTotal;
  const currentTeamUserCompleted = initiatingTeamState && initiatingTeamState.currentUserCompleted;

  const isInitiatingUser = useSelector(store => store.initialize.polling);
  const initiatingUserState = useSelector(store => store.initialize.available);
  const currentUserTotal = initiatingUserState && initiatingUserState.campaignsTotal;
  const currentUserCompleted = initiatingUserState && initiatingUserState.campaignsCompleted;

  const onboarded = useSelector(store => store.onboarded.status);
  const seenDashboardModel =
    useSelector(store => store.onboarded.seenDashboardModel) ||
    localStorage.getItem('seenDashboardModel');
  const mailoutsPendingState = useSelector(store => store.mailouts.pending);
  const addCampaignMlsNumPendingState = useSelector(
    store => store.mailouts.addCampaignMlsNumPending
  );
  const canLoadMore = useSelector(store => store.mailouts.canLoadMore);
  const page = useSelector(store => store.mailouts.page);
  const mailoutList = useSelector(store => store.mailouts.list);
  const error = useSelector(store => store.mailouts.error?.message);
  const addMailoutError = useSelector(store => store.mailout.addMailoutError);
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [showChooseSize, setShowChooseSize] = useState(false);
  const [useMLSNumberToAddCampaign, setUseMLSNumberToAddCampaign] = useState(true);
  const [useHolidayTemplate, setUseHolidayTemplate] = useState(false);
  const stencilsAvailable = useSelector(store => store.templates.available?.holiday);
  const mailoutEdit = useSelector(store => store.mailout.mailoutEdit);
  const [currentTemplateTheme, setCurrentTemplateTheme] = useState(
    stencilsAvailable[0].templateTheme
  );
  const holidayCampaignId = useSelector(store => store.mailouts?.newHolidayId);

  const [AddCampaignType, setAddCampaignType] = useState(null);
  const [AddCampaignName, setAddCampaignName] = useState('');
  const [CampaignCoverUpload, setCampaignCoverUpload] = useState(null);
  const [UploadingInProgress, setUploadingInProgress] = useState(false);
  const [campaignPostcardSize, setCampaignPostcardSize] = useState('6x4');
  const [tabIndex, setTabIndex] = useState(0);
  const sliderContainerRef = useRef(null);
  const sliderRef = useRef(null);
  const [sliderWidth, setsliderWidth] = useState(0);

  useFetching(getMailoutsPending, onboarded, useDispatch());

  const boundFetchMoreMailouts = value => dispatch(getMoreMailoutsPending(value));

  const dismissDashboardExplanation = value => dispatch(setCompletedDashboardModal(value));

  const handleClick = e => {
    boundFetchMoreMailouts(page + 1);
  };

  const triggerFileDialog = () => document.getElementById('cardFrontCoverFile').click();
  const handleFileChange = async e => {
    const file = e.target.files[0];
    // check file type
    if (file.type !== 'image/png' && file.type !== 'image/jpeg')
      return dispatch(setAddMailoutError('File needs to be a jpg or png'));

    if (addMailoutError) dispatch(clearAddMailoutError());
    setUploadingInProgress(true);

    const formData = new FormData();
    formData.append('front', file);
    formData.append('postcardSize', campaignPostcardSize);
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
      let { url, contentType } = await api.handleResponse(response);
      setUploadingInProgress(false);
      setCampaignCoverUpload({
        name: file.name,
        url,
        contentType,
      });
    } catch (e) {
      setUploadingInProgress(false);
      dispatch(setAddMailoutError(e.message));
    }
  };

  const addCampaign = e => {
    setShowAddCampaign(true);
    setShowChooseSize(true);
  };

  useEffect(() => {
    if (holidayCampaignId) {
      history.push(`/dashboard/edit/${holidayCampaignId}/destinations`);
      dispatch(clearNewHolidayId());
    }
  }, [holidayCampaignId, history, dispatch]);

  const cancelAddCampaign = e => setShowAddCampaign(false);
  const finishAddCampaign = async e => {
    if (useMLSNumberToAddCampaign) {
      let mlsNum = document.getElementById('addCampaignInput').value;
      if (!mlsNum || !campaignPostcardSize) return;
      if (!mlsNum.length) return;
      setShowAddCampaign(false);
      dispatch(addCampaignStart({ mlsNum: mlsNum, postcardSize: campaignPostcardSize }));
    } else if (useHolidayTemplate) {
      dispatch(
        addHolidayCampaignStart({
          createdBy: 'user',
          skipEmailNotification: true,
          name: AddCampaignName,
          frontTemplateUuid: currentTemplateTheme,
          postcardSize: campaignPostcardSize,
          mapperName: 'sphere',
          publishedTags: ['holiday'],
        })
      );
    } else {
      let path = `/api/user/mailout/withCover`;
      if (peerId) path = `/api/user/peer/${peerId}/mailout/withCover`;

      const headers = {};
      const accessToken = await auth.getAccessToken();
      headers['authorization'] = `Bearer ${accessToken}`;
      const formData = new FormData();
      formData.append('createdBy', 'user');
      formData.append('skipEmailNotification', true);
      formData.append('frontResourceUrl', CampaignCoverUpload.url);
      formData.append('name', AddCampaignName || AddCampaignType);
      formData.append('postcardSize', campaignPostcardSize);

      const response = await fetch(path, {
        headers,
        method: 'post',
        body: formData,
        credentials: 'include',
      });
      let doc = await api.handleResponse(response);
      return history.push(`/dashboard/edit/${doc._id}/destinations`);
    }
  };

  const handleKeyPress = e => {
    // Prevent the default action to stop scrolling when space is pressed
    e.preventDefault();
    boundFetchMoreMailouts(page + 1);
  };

  const mailoutItemElementArray = [];

  function handleIntersect(entries, observer) {
    entries.forEach((entry, index) => {
      const frontIframe = entry.target.querySelector('#bm-iframe-front');
      const backIframe = entry.target.querySelector('#bm-iframe-back');

      if (entry.isIntersecting) {
        if (frontIframe && !frontIframe.src) {
          frontIframe.src = frontIframe.title;
        }
        if (!backIframe.src) {
          backIframe.src = backIframe.title;
        }
      }
    });
  }

  const createObserver = useCallback(() => {
    if (showAddCampaign) return;
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    if (mailoutItemElementArray && mailoutItemElementArray.length > 0) {
      mailoutItemElementArray.forEach(mailoutItemElement => {
        return observer.observe(mailoutItemElement);
      });
    }
  }, [mailoutItemElementArray, showAddCampaign]);

  useEffect(() => {
    if (mailoutList && mailoutList.length > 0) {
      mailoutList.map((item, index) => {
        const mailoutItemElement = document.querySelector(`#mailout-iframe-set-${index}`);

        return mailoutItemElementArray.push(mailoutItemElement);
      });

      createObserver();
    }
  }, [mailoutList, mailoutItemElementArray, createObserver]);

  const MailoutsList = ({ list }) => {
    if (list[0].started) return null;

    return list.map((item, index) => (
      <ItemLayout fluid key={`${item.userId}-${item._id}-${item.mlsNum}`}>
        <ListHeader data={item} />
        <ItemBodyLayout attached style={{ padding: 10 }}>
          <IframeGroup index={index} item={item} linkTo={`dashboard/${item._id}`} />
          <ItemList data={item} />
          {item.cta && (
            <div className="customPostcardCTA">
              Custom CTA:{' '}
              <a href={item.cta} target="blank">
                {item.cta}
              </a>
            </div>
          )}
        </ItemBodyLayout>
      </ItemLayout>
    ));
  };

  const renderPostcardButton = size => (
    <div style={{ margin: '0 1rem 1rem 0', width: '118px', height: '84px' }}>
      <div
        onClick={e => setCampaignPostcardSize(postcardDimensions(size))}
        style={
          campaignPostcardSize === postcardDimensions(size)
            ? {
                border: '2px solid #59C4C4',
                margin: 0,
                padding: '0.5em',
                borderRadius: '5px',
                height: '100%',
              }
            : {
                border: '1px solid lightgray',
                margin: 0,
                padding: '0.5em',
                borderRadius: '5px',
                height: '100%',
              }
        }
      >
        <PostcardSizeButton postcardSize={size} />
      </div>
      <div style={{ textAlign: 'center', padding: '0.5rem' }}>{`${calculateCost(
        1,
        size
      )}/each`}</div>
    </div>
  );

  const renderTemplatePicture = (templateName, src, isNew = false) => {
    return (
      <div key={templateName}>
        <div
          style={
            currentTemplateTheme === templateName
              ? {
                  border: `2px solid ${brandColors.primary}`,
                  padding: '0.5em',
                  margin: '0.5rem',
                  borderRadius: '5px',
                  maxWidth: 500,
                }
              : { padding: '0.5em', margin: '0.5rem' }
          }
        >
          <img
            src={src}
            alt={templateName}
            style={{
              width: '100%',
              border: '1px solid lightgrey',
              boxShadow: '1px 1px 4px lightgrey',
              zIndex: 10,
            }}
          />
        </div>
        {isNew && (
          <NewLabel>
            <span className="label">New</span>
          </NewLabel>
        )}
      </div>
    );
  };

  const handleSliderBtnClick = dir => {
    dir === 'back' ? sliderRef.current.slickPrev() : sliderRef.current.slickNext();
  };

  useEffect(() => {
    setUseMLSNumberToAddCampaign(tabIndex === 0);
    setUseHolidayTemplate(tabIndex === 2);
  }, [tabIndex]);

  useLayoutEffect(
    _ => {
      setsliderWidth(sliderContainerRef.current ? sliderContainerRef.current.offsetWidth : 0);
    },
    // eslint-disable-next-line
    [windowSize, tabIndex]
  );

  let slides = [];
  if (stencilsAvailable) {
    stencilsAvailable.forEach(stencil => {
      slides.push(stencil.templateTheme);
    });
  }
  let startSlide = 0;
  if (mailoutEdit && mailoutEdit.templateTheme)
    startSlide = slides.findIndex(slide => slide === mailoutEdit.templateTheme);

  let numSlides = Math.floor(sliderWidth / 240) || 1;
  console.log('num slides', sliderWidth);
  console.log('num slides', numSlides);
  if (numSlides % 2 === 0) numSlides -= 1;

  const sliderSettings = {
    arrows: false,
    className: 'slider center',
    infinite: true,
    centerMode: true,
    slidesToShow: numSlides < stencilsAvailable?.length ? numSlides : stencilsAvailable.length,
    focusOnSelect: true,
    initialSlide: startSlide,
    swipeToSlide: true,
    afterChange: current => {
      setCurrentTemplateTheme(stencilsAvailable[current].templateTheme);
    },
  };

  const campaignTabs = () => {
    const handleTabChange = (e, data) => setTabIndex(data.activeIndex);

    const panes = [
      {
        menuItem: 'MLS Number',
        render: () => (
          <Tab.Pane style={tabPane} attached={false}>
            <div>
              <Input type="text" fluid placeholder="Property MLS Number" id="addCampaignInput" />
            </div>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Custom Campagin',
        render: () => (
          <Tab.Pane style={tabPane} attached={false}>
            <NewCampaignContainer>
              <h5>Campaign Name</h5>
              <Input
                type="text"
                fluid
                placeholder="New Custom Campaign"
                value={AddCampaignName}
                id="addCampaignName"
                onChange={e => {
                  setAddCampaignName(e.target.value);
                }}
              ></Input>
              <h5>Campaign Type</h5>
              <CampaignTypeButtons>
                <Button
                  inverted
                  primary
                  size="big"
                  toggle
                  active={AddCampaignType === 'Market Listing'}
                  onClick={() => setAddCampaignType('Market Listing')}
                  style={{ width: '226px' }}
                >
                  <Icon name="home" />
                  Market Listing
                </Button>
                <Button
                  inverted
                  primary
                  size="big"
                  toggle
                  active={AddCampaignType === 'Home Value'}
                  onClick={() => setAddCampaignType('Home Value')}
                >
                  <Icon name="dollar sign" />
                  Home Value
                </Button>
                <Button
                  inverted
                  primary
                  size="big"
                  toggle
                  active={AddCampaignType === 'Event'}
                  onClick={() => setAddCampaignType('Event')}
                >
                  <Icon name="calendar check outline" />
                  Event
                </Button>
                <Button
                  inverted
                  primary
                  size="big"
                  toggle
                  active={AddCampaignType === 'Sphere'}
                  onClick={() => setAddCampaignType('Sphere')}
                >
                  <Icon name="address book outline" />
                  Sphere
                </Button>
                <Button
                  inverted
                  primary
                  size="big"
                  toggle
                  active={AddCampaignType === 'Farm Area'}
                  onClick={() => setAddCampaignType('Farm Area')}
                >
                  <Icon name="map outline" />
                  Farm Area
                </Button>
                <Button
                  inverted
                  primary
                  size="big"
                  toggle
                  active={AddCampaignType === 'Recruiting'}
                  onClick={() => setAddCampaignType('Recruiting')}
                >
                  <Icon name="user plus" />
                  Recruiting
                </Button>
                <Button
                  inverted
                  primary
                  size="big"
                  toggle
                  active={AddCampaignType === 'Other'}
                  onClick={() => setAddCampaignType('Other')}
                >
                  <Icon name="crosshairs" />
                  Other
                </Button>
              </CampaignTypeButtons>
              <h5>Card Front</h5>
              {!UploadingInProgress && (
                <div>
                  <div id="uploadCardFront" onClick={triggerFileDialog}>
                    <div>
                      {CampaignCoverUpload && <b>{CampaignCoverUpload.name}</b>}
                      {!CampaignCoverUpload && <b>Upload Your Own Design</b>}
                      <br />
                      {campaignPostcardSize === '11x6'
                        ? '(6.25"x11.25" PNG or JPEG - max 5MB)'
                        : campaignPostcardSize === '9x6'
                        ? '(6.25"x9.25" PNG or JPEG - max 5MB)'
                        : '(4.25"x6.25" PNG or JPEG - max 5MB)'}
                    </div>
                    <Icon name="upload" size="big" />
                    <input
                      id="cardFrontCoverFile"
                      name="postcardcover"
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                    ></input>
                  </div>
                  <Message warning>
                    <Message.Header>Include a safe zone of 1/2&quot; inch!</Message.Header>
                    <p>
                      Make sure no critical elements are within 1/2&quot; from the edge of the
                      image. It risks being cropped during the postcard production.
                    </p>
                  </Message>
                </div>
              )}
              {UploadingInProgress && (
                <ModalLoader active inline="centered" inverted indeterminate>
                  Uploading...
                </ModalLoader>
              )}
            </NewCampaignContainer>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Holiday Campaign',
        render: () => (
          <Tab.Pane style={tabPane} attached={false}>
            <h5>Campaign Name</h5>
            <Input
              style={{ marginBottom: '21px' }}
              type="text"
              fluid
              placeholder="New Custom Campaign"
              value={AddCampaignName}
              id="addCampaignName"
              onChange={e => {
                setAddCampaignName(e.target.value);
              }}
            ></Input>
            <div ref={sliderContainerRef}>
              <Header as="h4">Template Theme</Header>
              <div style={{ position: 'relative', zIndex: 10, width: '93%', margin: 'auto' }}>
                <Slider {...sliderSettings} ref={sliderRef} style={{ zIndex: 10 }}>
                  {stencilsAvailable &&
                    stencilsAvailable.map((stencil, ind) =>
                      renderTemplatePicture(stencil.templateTheme, stencil.thumbnail, false)
                    )}
                </Slider>
              </div>
              <SliderButtons>
                <StyledButtonBack onClick={_ => handleSliderBtnClick('back')} editForm />
                <StyledButtonNext onClick={_ => handleSliderBtnClick('next')} editForm />
              </SliderButtons>
            </div>
          </Tab.Pane>
        ),
      },
    ];
    return (
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} onTabChange={handleTabChange} />
    );
  };

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <Menu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Dashboard</Header>
            </Menu.Item>
            <Menu.Item position="right">
              <div className="right menu">
                {addCampaignMlsNumPendingState && (
                  <Button loading primary>
                    Add Campaign
                  </Button>
                )}
                {!addCampaignMlsNumPendingState && (
                  <Button primary onClick={addCampaign}>
                    Add Campaign
                  </Button>
                )}
              </div>
            </Menu.Item>
          </Menu>
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

      {!isInitiatingTeam &&
        !isInitiatingUser &&
        !mailoutsPendingState &&
        mailoutList &&
        mailoutList.length === 0 && (
          <ContentBottomHeaderLayout>
            <Segment placeholder style={{ marginRight: '-1em' }}>
              <Header icon>
                <Icon name="file outline" />
                No Campaigns found.
              </Header>
            </Segment>
          </ContentBottomHeaderLayout>
        )}

      {error && <Snackbar error>{error}</Snackbar>}

      <ModalAddCampaign open={showAddCampaign} centered={false}>
        {showChooseSize ? (
          <>
            <ModalAddCampaign.Header style={{ textAlign: 'center' }}>
              Add Campaign: Choose Size
            </ModalAddCampaign.Header>
            <ModalAddCampaign.Content
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                justifyContent: 'center',
                justifyItems: 'center',
              }}
            >
              <p style={{ padding: '1rem 0 1rem 0', maxWidth: '400px' }}>
                Select your postcard size, from standard 4x6 inch up to 6x11 inch jumbo postcards.
                Our all inclusive pricing covers the design, targeting, printing, postage, and
                handling.
              </p>
              <h5 style={{ marginTop: '0' }}>Postcard Size</h5>
              <div style={{ display: 'flex', paddingBottom: '2rem' }}>
                {renderPostcardButton('4x6')}
                {renderPostcardButton('6x9')}
                {renderPostcardButton('6x11')}
              </div>
            </ModalAddCampaign.Content>
            <ModalAddCampaign.Actions>
              <Button inverted primary onClick={cancelAddCampaign}>
                Cancel
              </Button>
              <Button primary onClick={_ => setShowChooseSize(false)}>
                Next
              </Button>
            </ModalAddCampaign.Actions>
          </>
        ) : (
          <>
            <ModalAddCampaign.Header style={{ textAlign: 'center' }}>
              Add Campaign
            </ModalAddCampaign.Header>
            <ModalAddCampaign.Content>
              {addMailoutError && <Message error>{addMailoutError.message}</Message>}
              <AddCampaignContainer>
                <p style={tabPainP}>
                  Enter a property MLS number to import a listing, or you can create a custom
                  campaign and upload your own design.
                </p>
                {campaignTabs()}
              </AddCampaignContainer>
            </ModalAddCampaign.Content>
            <ModalAddCampaign.Actions>
              <Button inverted primary onClick={_ => setShowChooseSize(true)}>
                Back
              </Button>
              {tabIndex !== 2 ? (
                <Button
                  primary
                  onClick={finishAddCampaign}
                  disabled={
                    !useMLSNumberToAddCampaign && (!CampaignCoverUpload || !AddCampaignType)
                  }
                >
                  Add Campaign
                </Button>
              ) : (
                <Button primary onClick={finishAddCampaign} disabled={!AddCampaignName}>
                  Add Campaign
                </Button>
              )}
            </ModalAddCampaign.Actions>
          </>
        )}
      </ModalAddCampaign>

      {mailoutList && mailoutList.length > 0 && (
        <Segment
          style={
            isMobile
              ? { padding: '0', paddingTop: '4.5em', marginLeft: '-1em', marginRight: '-1em' }
              : { marginTop: '22px' }
          }
        >
          <ModalWelcome open={!seenDashboardModel} size="small">
            <ModalWelcome.Header style={modalHeaderStyles}>
              Welcome to your dashboard!
            </ModalWelcome.Header>
            <ModalWelcome.Content
              style={{ color: '#686868', fontSize: '16px', padding: '30px 0px' }}
            >
              <p>
                We have generated some initial campaigns for you! Please note, when you initially
                sign up, you may not see all listings due to:
              </p>
              <ul style={{ lineHeight: '30px' }}>
                <li>Listings older than 6 months are not included</li>
                <li>We only show a maximum of 15 previous listings from the past</li>
                <li>
                  For some boards, sold listings wont show up yet. But upcoming sold listings will
                  create new campaigns
                </li>
                <li>
                  We exclude listing types (e.g. commercial/land) and locations (e.g. rural
                  locations) that are difficult for our system to target
                </li>
                <li>
                  We find your listings based on the MLS board/agent id in the Profile section of
                  each user. Modifying agent ids will adjust this list
                </li>
              </ul>
            </ModalWelcome.Content>
            <ModalWelcome.Actions style={{ borderTop: 'none', padding: '0px' }}>
              <Button primary onClick={dismissDashboardExplanation}>
                <Icon name="checkmark" /> Ok
              </Button>
            </ModalWelcome.Actions>
          </ModalWelcome>

          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                {!showAddCampaign && <MailoutsList list={mailoutList} />}
              </Grid.Column>
            </Grid.Row>

            {(isInitiatingTeam || isInitiatingUser || mailoutsPendingState) && (
              <Grid.Row>
                <Grid.Column width={16}>
                  <Loading />
                </Grid.Column>
              </Grid.Row>
            )}

            {canLoadMore && (
              <Grid.Row>
                <Grid.Column width={16}>
                  <Grid centered columns={2}>
                    <Grid.Column>
                      <Button
                        id="loadMoreButton"
                        attached="bottom"
                        content="Load More"
                        onClick={handleClick}
                        onKeyPress={handleKeyPress}
                      />
                    </Grid.Column>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            )}
          </Grid>
        </Segment>
      )}
      {mailoutsPendingState && !error && <Loading />}
    </Page>
  );
};

export default Dashboard;
