import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { Progress } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import auth from '../services/auth';
import api from '../services/api';

import { ContentBottomHeaderLayout, ContentTopHeaderLayout, ItemBodyLayout, ItemLayout } from '../layouts';
import { getMailoutsPending, getMoreMailoutsPending, addCampaignStart } from '../store/modules/mailouts/actions';
import { setCompletedDashboardModal } from '../store/modules/onboarded/actions'
import { Checkbox, List } from 'semantic-ui-react';
import { Button, Grid, Header, Icon, Input, Menu, Modal, Message, Page, Segment, Snackbar } from '../components/Base';
import IframeGroup from '../components/MailoutListItem/IframeGroup';
import ListHeader from '../components/MailoutListItem/ListHeader';
import ItemList from '../components/MailoutListItem/ItemList';
import PageTitleHeader from '../components/PageTitleHeader';
import { postcardDimensions } from '../components/utils';
import Loading from '../components/Loading';
import { useIsMobile } from '../components/Hooks/useIsMobile';
import PostcardSizeButton from '../components/Forms/Common/PostcardSizeButton';
import { calculateCost } from '../components/MailoutListItem/helpers';

const useFetching = (getActionCreator, onboarded, dispatch) => {
  useEffect(() => {
    // In order to prevent unnecessary call to the api when we are expecting an redirect,
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
  const peerId = useSelector(store => store.peer.peerId)
  const isInitiatingTeam = useSelector(store => store.teamInitialize.polling);
  const initiatingTeamState = useSelector(store => store.teamInitialize.available);
  const currentTeamUserTotal = initiatingTeamState && initiatingTeamState.currentUserTotal;
  const currentTeamUserCompleted = initiatingTeamState && initiatingTeamState.currentUserCompleted;

  const isInitiatingUser = useSelector(store => store.initialize.polling);
  const initiatingUserState = useSelector(store => store.initialize.available);
  const currentUserTotal = initiatingUserState && initiatingUserState.campaignsTotal;
  const currentUserCompleted = initiatingUserState && initiatingUserState.campaignsCompleted;

  const onboarded = useSelector(store => store.onboarded.status);
  const seenDashboardModel = useSelector(store => store.onboarded.seenDashboardModel) || localStorage.getItem('seenDashboardModel');
  const mailoutsPendingState = useSelector(store => store.mailouts.pending);
  const addCampaignMlsNumPendingState = useSelector(store => store.mailouts.addCampaignMlsNumPending)
  const canLoadMore = useSelector(store => store.mailouts.canLoadMore);
  const page = useSelector(store => store.mailouts.page);
  const mailoutList = useSelector(store => store.mailouts.list);
  const error = useSelector(store => store.mailouts.error?.message);
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [showChooseSize, setShowChooseSize] = useState(false);
  const [useMLSNumberToAddCampaign, setUseMLSNumberToAddCampaign] = useState(true)
  const [AddCampaignType, setAddCampaignType] = useState(null)
  const [CampaignCoverUpload, setCampaignCoverUpload] = useState(null)
  const [UploadingInProgress, setUploadingInProgress] = useState(false)
  const [campaignPostcardSize, setCampaignPostcardSize] = useState('4x6');

  useFetching(getMailoutsPending, onboarded, useDispatch());

  const boundFetchMoreMailouts = value => dispatch(getMoreMailoutsPending(value));

  const dismissDashboardExplanation = value => dispatch(setCompletedDashboardModal(value))

  const handleClick = e => {
    boundFetchMoreMailouts(page + 1);
  };

  const triggerFileDialog = () => document.getElementById('cardFrontCoverFile').click()
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    // do some checking
    // let ok = false
    // if (file.type === 'image/png') ok = true
    // if (file.type === 'image/jpeg') ok = true
    // if (!ok) return setError('File needs to be a jpg or png')

    setUploadingInProgress(true)

    const formData = new FormData();
    formData.append('front', file);
    try {
      let path = `/api/user/mailout/create/front`
      if (peerId) path = `/api/user/peer/${peerId}/mailout/create/front`

      const headers = {};
      const accessToken = await auth.getAccessToken();
      headers['authorization'] = `Bearer ${accessToken}`;
      const response = await fetch(path, { headers, method: 'post', body: formData, credentials: 'include' });
      let { url, contentType } = await api.handleResponse(response)
      setTimeout(() => {
        console.log(url, contentType)
        setUploadingInProgress(false)
        setCampaignCoverUpload({
          name: file.name,
          url,
          contentType
        })
      }, 1000)
    } catch (e) {
      setUploadingInProgress(false)
      //setError(e.message)
    }
  }


  const addCampaign = e => {
    setShowAddCampaign(true)
    setShowChooseSize(true)
  }

  const cancelAddCampaign = e => setShowAddCampaign(false)

  const finsihAddCampaign = async e => {
    if (useMLSNumberToAddCampaign) {
      let value = document.getElementById('addCampaignInput').value
      if (!value) return
      if (!value.length) return
      setShowAddCampaign(false)
      dispatch(addCampaignStart(value))
    } else {
      let path = `/api/user/mailout/withCover`
      if (peerId) path = `/api/user/peer/${peerId}/mailout/withCover`

      const headers = {}
      const accessToken = await auth.getAccessToken()
      headers['authorization'] = `Bearer ${accessToken}`
      const formData = new FormData()
      formData.append('createdBy', 'user')
      formData.append('skipEmailNotification', true)
      formData.append('frontResourceUrl', CampaignCoverUpload.url)
      formData.append('name', AddCampaignType)
      formData.append('postcardSize', campaignPostcardSize)

      const response = await fetch(path, { headers, method: 'post', body: formData, credentials: 'include' });
      let doc = await api.handleResponse(response)
      return history.push(`/dashboard/edit/${doc._id}/destinations`);

    }
  }

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
    if (showAddCampaign) return
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
          {item.cta && (<div className="customPostcardCTA">
            Custom CTA: <a href={item.cta} target="blank">{item.cta}</a>
          </div>)}
        </ItemBodyLayout>
      </ItemLayout>
    ));
  };

  const renderPostcardButton = (size) => (
    <div style={{ margin: '0 1rem 1rem 0', width: '118px', height: '84px' }}>
      <div
        onClick={e => setCampaignPostcardSize(postcardDimensions(size))}
        style={
          campaignPostcardSize === postcardDimensions(size)
            ? { border: '2px solid #59C4C4', margin: 0, padding: '0.5em', borderRadius: '5px', height: '100%' }
            : { border: '1px solid lightgray', margin: 0, padding: '0.5em', borderRadius: '5px', height: '100%' }
        }
      >
        <PostcardSizeButton postcardSize={size} />
      </div>
      <div style={{ textAlign: 'center', padding: '0.5rem' }}>{`${calculateCost(1, size)}/each`}</div>
    </div>
    )
  

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
                  <Button loading primary>Add Campaign</Button>
                )}
                {!addCampaignMlsNumPendingState && (
                  <Button primary onClick={addCampaign}>Add Campaign</Button>
                )}
              </div>
            </Menu.Item>
          </Menu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>

      {isInitiatingTeam && (
        <ContentBottomHeaderLayout>
          <Progress value={currentTeamUserCompleted} total={currentTeamUserTotal} progress="ratio" inverted success size="tiny" />
        </ContentBottomHeaderLayout>
      )}

      {isInitiatingUser && (
        <ContentBottomHeaderLayout>
          <Progress value={currentUserCompleted} total={currentUserTotal} progress="ratio" inverted success size="tiny" />
        </ContentBottomHeaderLayout>
      )}

      {!isInitiatingTeam && !isInitiatingUser && !mailoutsPendingState && mailoutList && mailoutList.length === 0 && (
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


      <Modal open={showAddCampaign} dimmer="blurring" centered={false}>
        {showChooseSize ?
          <>
            <Modal.Header style={{textAlign: 'center'}}>
              Add Campaign: Choose Size
            </Modal.Header>
            <Modal.Content style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              justifyContent: 'center',
              justifyItems: 'center'
              }}>
              <p style={{padding: '1rem 0 1rem 0', maxWidth: '400px'}}>
                Select your postcard size, from standard 4x6 inch up to 6x11 inch jumbo postcards. Our all inclusive
                pricing covers the design, targeting, printing, postage, and handling.
              </p>
              <h5 style={{marginTop: '0'}}>Postcard Size</h5>
              <div style={{ display: 'flex', paddingBottom: '2rem' }}>
                {renderPostcardButton('4x6')}
                {renderPostcardButton('6x9')}
                {renderPostcardButton('6x11')}
              </div>
            </Modal.Content>
            <Modal.Actions>
              <Button inverted primary onClick={cancelAddCampaign}>Cancel</Button>
              <Button primary
                onClick={_ => setShowChooseSize(false)}
              >
                Next
              </Button>
            </Modal.Actions>
          </>
          :
          <>
            <Modal.Header style={{textAlign: 'center'}}>
              Add Campaign
            </Modal.Header>
            <Modal.Content>
              <div id="addCampaignHolder">
                <p>Enter a property MLS number to import a listing, or you can create a custom campaign and upload your own design.</p>

                <List horizontal id="selectAddCampaignType">
                  <List.Item>
                    <Checkbox
                      radio
                      label="MLS Number"
                      name='checkboxRadioGroup'
                      value='this'
                      checked={useMLSNumberToAddCampaign}
                      onClick={() => {
                        setUseMLSNumberToAddCampaign(true)
                      }}
                    />
                  </List.Item>
                  <List.Item>
                    <Checkbox
                      radio
                      label='Custom Campaign'
                      name='checkboxRadioGroup'
                      value='that'
                      checked={!useMLSNumberToAddCampaign}
                      onClick={() => {
                        setUseMLSNumberToAddCampaign(false)
                      }}
                    />
                  </List.Item>
                </List>

                {useMLSNumberToAddCampaign && (
                  <div>
                    <Input type="text" fluid placeholder="Property MLS Number" id="addCampaignInput" />
                  </div>
                )}
                {!useMLSNumberToAddCampaign && (
                  <div id="newCampaignType">
                    <h5>Campaign Type</h5>
                    <Grid>
                      <Grid.Row columns={3}>
                        <Grid.Column>
                          <Button inverted primary size='big' toggle
                            active={AddCampaignType === 'Market Listing'}
                            onClick={() => setAddCampaignType('Market Listing')}
                          >
                            <Icon name='home' />
                          Market Listing
                        </Button>
                        </Grid.Column>
                        <Grid.Column>
                          <Button inverted primary size='big' toggle
                            active={AddCampaignType === 'Home Value'}
                            onClick={() => setAddCampaignType('Home Value')}
                          >
                            <Icon name='dollar sign' />
                          Home Value
                        </Button>
                        </Grid.Column>
                        <Grid.Column>
                          <Button inverted primary size='big' toggle
                            active={AddCampaignType === 'Event'}
                            onClick={() => setAddCampaignType('Event')}
                          >
                            <Icon name='calendar check outline' />
                          Event
                        </Button>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row columns={3}>
                        <Grid.Column>
                          <Button inverted primary size='big' toggle
                            active={AddCampaignType === 'Sphere'}
                            onClick={() => setAddCampaignType('Sphere')}
                          >
                            <Icon name='address book outline' />
                          Sphere
                        </Button>
                        </Grid.Column>
                        <Grid.Column>
                          <Button inverted primary size='big' toggle
                            active={AddCampaignType === 'Farm Area'}
                            onClick={() => setAddCampaignType('Farm Area')}
                          >
                            <Icon name='map outline' />
                          Farm Area
                        </Button>
                        </Grid.Column>
                        <Grid.Column>
                          <Button inverted primary size='big' toggle
                            active={AddCampaignType === 'Recruiting'}
                            onClick={() => setAddCampaignType('Recruiting')}
                          >
                            <Icon name='user plus' />
                          Recruiting
                        </Button>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row columns={1}>
                        <Grid.Column>
                          <Button inverted primary size='big' toggle
                            active={AddCampaignType === 'Other'}
                            onClick={() => setAddCampaignType('Other')}
                          >
                            <Icon name='crosshairs' />
                          Other
                        </Button>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                    <h5>Card Front</h5>
                    {!UploadingInProgress && (
                      <div>
                        <div id="uploadCardFront" onClick={triggerFileDialog}>
                          <div>
                            {CampaignCoverUpload && (<b>{CampaignCoverUpload.name}</b>)}
                            {!CampaignCoverUpload && (<b>Upload Your Own Design</b>)}
                            <br />
                        {campaignPostcardSize === '11x6' ? '(6.25"x11.25" PNG or JPEG - max 5MB)' 
                          : campaignPostcardSize === '9x6' ? '(6.25"x9.25" PNG or JPEG - max 5MB)' 
                          : '(4.25"x6.25" PNG or JPEG - max 5MB)'}
                      </div>
                          <Icon name="upload" size="big" />
                          <input id="cardFrontCoverFile" name="postcardcover" type="file" onChange={handleFileChange}></input>
                        </div>
                        <Message warning>
                          <Message.Header>Include a safe zone of 1/2&quot; inch!</Message.Header>
                          <p>Make sure no critical elements are within 1/2&quot; from the edge of the image. <br />It risks being cropped during the postcard production.</p>
                        </Message>
                      </div>
                    )}
                    {UploadingInProgress && (<p>Please wait...</p>)}

                  </div>
                )}
              </div>
            </Modal.Content>
            <Modal.Actions>
              <Button inverted primary onClick={_ => setShowChooseSize(true)}>Back</Button>
              <Button primary
                onClick={finsihAddCampaign}
                disabled={(!useMLSNumberToAddCampaign && (!CampaignCoverUpload || !AddCampaignType))}
              >
                Add Campaign
              </Button>
            </Modal.Actions>
          </>
        }
      </Modal>


      {mailoutList && mailoutList.length > 0 && (
        <Segment style={isMobile ? { padding: '0', paddingTop: '4.5em', marginLeft: '-1em', marginRight: '-1em' } : { marginTop: '22px' }}>

          <Modal open={!seenDashboardModel} basic size='small'>
            <Modal.Header>
              Welcome to your dashboard!
            </Modal.Header>
            <Modal.Content>
              <p>We have generated some initial campaigns for you! Please note, when you initially sign up, you may not see all listings due to:</p>
              <ul>
                <li>Listings older than 6 months are not included</li>
                <li>We only show a maximum of 15 previous listings from the past</li>
                <li>For some boards, sold listings wont show up yet. But upcoming sold listings will create new campaigns</li>
                <li>We exclude listing types (e.g. commercial/land) and locations (e.g. rural locations) that are difficult for our system to target</li>
                <li>We find your listings based on the MLS board/agent id in the Profile section of each user. Modifying agent ids will adjust this list</li>
              </ul>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={dismissDashboardExplanation} color='green' inverted>
                <Icon name='checkmark' /> Ok
              </Button>
            </Modal.Actions>
          </Modal>

          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                {!showAddCampaign && (<MailoutsList list={mailoutList} />)}
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
                      <Button id="loadMoreButton" attached="bottom" content="Load More" onClick={handleClick} onKeyPress={handleKeyPress} />
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
