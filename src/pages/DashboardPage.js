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
import { Button, Grid, Header, Icon, Input, Menu, Modal, Page, Segment, Snackbar } from '../components/Base';
import IframeGroup from '../components/MailoutListItem/IframeGroup';
import ListHeader from '../components/MailoutListItem/ListHeader';
import ItemList from '../components/MailoutListItem/ItemList';
import PageTitleHeader from '../components/PageTitleHeader';
import { isMobile } from '../components/utils';
import Loading from '../components/Loading';

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
  const [showAddCampaign, setShowAddCampaign] = useState(false)
  const [useMLSNumberToAddCampaign, setUseMLSNumberToAddCampaign] = useState(true)
  const [AddCampaignType, setAddCampaignType] = useState(null)
  const [CampaignCoverUpload, setCampaignCoverUpload] = useState(null)
  const [UploadingInProgress, setUploadingInProgress] = useState(false)

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
      let {url, contentType} = await api.handleResponse(response)
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


  const addCampaign = e => setShowAddCampaign(true)

  const cancelAddCampaign = e => setShowAddCampaign(false)

  const finsihAddCampaign = async e => {
    if (useMLSNumberToAddCampaign) {
      let value = document.getElementById('addCampaignInput').value
      if (!value) return
      if (!value.length) return
      setShowAddCampaign(false)
      dispatch(addCampaignStart(value))
    } else {
      let path = `/api/user/mailout/withCover/4by6`
      if (peerId) path = `/api/user/peer/${peerId}/mailout/withCover/4by6`

      const headers = {}
      const accessToken = await auth.getAccessToken()
      headers['authorization'] = `Bearer ${accessToken}`
      const formData = new FormData()
      formData.append('createdBy', 'user')
      formData.append('skipEmailNotification', true)
      formData.append('frontResourceUrl', CampaignCoverUpload.url)
      formData.append('name', AddCampaignType)

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
        <ContentBottomHeaderLayout style={isMobile() ? { marginTop: '60px' } : {}}>
          <Progress value={currentTeamUserCompleted} total={currentTeamUserTotal} progress="ratio" inverted success size="tiny" />
        </ContentBottomHeaderLayout>
      )}

      {isInitiatingUser && (
        <ContentBottomHeaderLayout style={isMobile() ? { marginTop: '60px' } : {}}>
          <Progress value={currentUserCompleted} total={currentUserTotal} progress="ratio" inverted success size="tiny" />
        </ContentBottomHeaderLayout>
      )}

      {!isInitiatingTeam && !isInitiatingUser && !mailoutsPendingState && mailoutList && mailoutList.length === 0 && (
        <ContentBottomHeaderLayout style={isMobile() ? { marginTop: '60px' } : {}}>
          <Segment placeholder style={{ marginRight: '-1em' }}>
            <Header icon>
              <Icon name="file outline" />
              No Campaigns found.
            </Header>
          </Segment>
        </ContentBottomHeaderLayout>
      )}

      {error && <Snackbar error>{error}</Snackbar>}

      {mailoutList && mailoutList.length > 0 && (
        <Segment style={isMobile() ? { padding: '0', paddingTop: '4.5em', marginLeft: '-1em', marginRight: '-1em' } : { marginTop: '79px' }}>

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


          <Modal open={showAddCampaign} dimmer="blurring"  centered={false}>
            <Modal.Header>
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
                    <div id="uploadCardFront" onClick={triggerFileDialog}>

                      <div>
                        {CampaignCoverUpload && (<b>{CampaignCoverUpload.name}</b>)}
                        {!CampaignCoverUpload && (<b>Upload Your Own Design</b>)}
                        <br/>
                        (4.25"x6.25" PDF, PNG or JPEG - max 5MB)
                      </div>
                      <Icon name="upload" size="big" />
                      <input id="cardFrontCoverFile" name="postcardcover" type="file" onChange={handleFileChange}></input>
                    </div>
                  )}
                  {UploadingInProgress && (<p>Please wait...</p>)}

                </div>
              )}
             </div>
            </Modal.Content>
            <Modal.Actions>
              <Button inverted primary onClick={cancelAddCampaign}>Cancel</Button>
              <Button primary
                onClick={finsihAddCampaign}
                disabled={(!useMLSNumberToAddCampaign && (!CampaignCoverUpload || !AddCampaignType))}
              >
                Add Campaign
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
