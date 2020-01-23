import { Header } from 'semantic-ui-react';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useLastLocation } from 'react-router-last-location';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ContentTopHeaderLayout, ContentSpacerLayout, ContentBottomHeaderLayout, ItemBodyDataLayout, ItemBodyLayoutV2, ItemLayout } from '../layouts';

import { calculateCost, formatDate, resolveMailoutStatus, resolveMailoutStatusColor, resolveMailoutStatusIcon } from '../components/MailoutListItem/helpers';
import { submitMailoutPending, stopMailoutPending, resetMailout, updateMailoutSizePending } from '../store/modules/mailout/actions';
import { Button, Grid, Menu, Message, Page, Segment, List, Popup, Input } from '../components/Base';
import PopupContent from '../components/MailoutListItem/PopupContent';
import { getMailoutPending } from '../store/modules/mailout/actions';
import PopupMinMax from '../components/MailoutListItem/PopupMinMax';
import ListHeader from '../components/MailoutListItem/ListHeader';
import ImageGroup from '../components/MailoutListItem/ImageGroup';
import GoogleMapItem from '../components/GoogleMapItem';
import Loading from '../components/Loading';
import { isMobile } from '../components/Forms/helpers';

const useFetching = (getActionCreator, dispatch, mailoutId) => {
  useEffect(() => {
    dispatch(getActionCreator(mailoutId));
  }, [getActionCreator, dispatch, mailoutId]);
};

// function useInput({ type, initalState }) {
//   const [value, setValue] = useState(initalState);
//   const input = <Input value={value} onChange={e => setValue(e.target.value)} type={type} />;
//   return [value, input];
// }

const MailoutDetailsPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { mailoutId } = useParams();
  const lastLocation = useLastLocation();
  const [editRecipients, setEditRecipients] = useState(false);
  // const [recipientsNumber, userRecipientsNumber] = useInput({ type: "text", initalState: 0 });
  const [currentNumberOfRecipients, setCurrentNumberOfRecipients] = useState(0);
  const [newNumberOfRecipients, setNewNumberOfRecipients] = useState(0);
  const [working, setWorking] = useState(false);

  const pendingState = useSelector(store => store.mailout.pending);
  const modifyPendingState = useSelector(store => store.mailout.modifyPending);
  const submitPendingState = useSelector(store => store.mailout.submitPending);
  const stopPendingState = useSelector(store => store.mailout.stopPending);
  const updateMailoutSizePendingState = useSelector(store => store.mailout.updateMailoutSizePending);
  const updatePendingState = useSelector(store => store.mailout.updatePending);

  const isUpdateMailoutSizeError = useSelector(store => store.mailout.updateMailoutSizeError && store.mailout.updateMailoutSizeError.message);
  const details = useSelector(store => store.mailout.details);
  const error = useSelector(store => store.mailout.error && store.mailout.error.message);
  const updateError = useSelector(store => store.mailout.updateError && store.mailout.updateError.message);

  const teamCustomization = useSelector(store => store.teamCustomization.available);
  const onLoginMode = useSelector(store => store.onLogin.mode);
  const multiUser = onLoginMode === 'multiuser';
  const listingType = details && details.listingStatus;
  const listingDefaults = teamCustomization && teamCustomization[listingType];
  const mailoutSizeMin = listingDefaults && listingDefaults.mailoutSizeMin;
  const mailoutSizeMax = listingDefaults && listingDefaults.mailoutSizeMax;

  useEffect(() => {
    if (!pendingState && !!error) {
      history.push(`/dashboard`);
    }
  }, [pendingState, error, history]);

  useEffect(() => {
    if (details && details.recipientCount) {
      setCurrentNumberOfRecipients(details.recipientCount);
    }
  }, [details, currentNumberOfRecipients]);

  useFetching(getMailoutPending, useDispatch(), mailoutId);

  useEffect(() => {
    const busyState = pendingState || modifyPendingState || submitPendingState || stopPendingState || updateMailoutSizePendingState || updatePendingState;
    setWorking(busyState);
  }, [pendingState, modifyPendingState, submitPendingState, stopPendingState, updateMailoutSizePendingState, updatePendingState]);

  const handleBackClick = () => {
    dispatch(resetMailout());
    if (lastLocation.pathname === `/dashboard/edit/${mailoutId}` || lastLocation.pathname === `/dashboard/${mailoutId}`) {
      history.push(`/dashboard`);
    }
    if (lastLocation.pathname === `/dashboard`) {
      history.goBack();
    }
  };

  const handleApproveAndSendMailoutDetailsClick = () => {
    dispatch(submitMailoutPending(mailoutId));
  };

  const handleDeleteMailoutDetailsClick = () => {
    dispatch(stopMailoutPending(mailoutId));
  };

  const handleEditMailoutDetailsClick = () => {
    history.push(`/dashboard/edit/${details._id}`);
  };

  const toggleRecipientsEditState = () => {
    if (!newNumberOfRecipients || newNumberOfRecipients === 0) setNewNumberOfRecipients(currentNumberOfRecipients);

    setEditRecipients(!editRecipients);
  };

  const submitNewValues = () => {
    let parsedNewNumberOfRecipients = parseInt(newNumberOfRecipients, 10);
    if (isNaN(parsedNewNumberOfRecipients)) {
      parsedNewNumberOfRecipients = currentNumberOfRecipients;
    }

    if (multiUser) {
      let chosenNumber = parsedNewNumberOfRecipients;
      if (chosenNumber < mailoutSizeMin) chosenNumber = mailoutSizeMin;
      if (chosenNumber > mailoutSizeMax) chosenNumber = mailoutSizeMax;

      setCurrentNumberOfRecipients(chosenNumber);

      if (currentNumberOfRecipients !== chosenNumber) {
        dispatch(updateMailoutSizePending(chosenNumber));
      }
    } else {
      if (currentNumberOfRecipients !== parsedNewNumberOfRecipients) {
        dispatch(updateMailoutSizePending(parsedNewNumberOfRecipients));
      }
    }
  };

  const RenderRecipients = () => {
    const enableEditRecipients = resolveMailoutStatus(details.mailoutStatus) !== 'Sent' && resolveMailoutStatus(details.mailoutStatus) !== 'Processing';

    if (editRecipients) {
      return (
        <Button as="div" labelPosition="left">
          <Input
            style={{ maxWidth: '4.5em', maxHeight: '2em' }}
            value={newNumberOfRecipients}
            onChange={props => setNewNumberOfRecipients(props.target.value)}
          />
          <Button icon color="orange" onClick={() => [toggleRecipientsEditState(), submitNewValues()]} style={{ marginLeft: '10px', minWidth: '5em' }}>
            Save
          </Button>
        </Button>
      );
    } else {
      return (
        <Button as="div" labelPosition="left">
          <label style={{ minWidth: '5em', minHeight: '2em', textAlign: 'center' }}>
            {(!isUpdateMailoutSizeError && newNumberOfRecipients) || currentNumberOfRecipients}
          </label>
          {enableEditRecipients && (
            <Button
              icon
              color="teal"
              onClick={toggleRecipientsEditState}
              style={{ marginLeft: '10px', minWidth: '5em' }}
              disabled={updateMailoutSizePendingState}
              loading={updateMailoutSizePendingState}
            >
              Change
            </Button>
          )}
        </Button>
      );
    }
  };

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <Segment style={isMobile() ? { marginTop: '58px' } : {}}>
          <Menu borderless fluid secondary>
            <Menu.Item>
              <Header as="h3">Campaign Details</Header>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <Button basic color="teal" onClick={() => handleBackClick()} disabled={working} loading={working}>
                  Back
                </Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Segment>
      </ContentTopHeaderLayout>

      <ContentSpacerLayout />

      <Segment style={isMobile() ? { marginTop: '129px' } : { marginTop: '34px' }}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              {!pendingState && !error && !updatePendingState && !updateError && details && (
                <ItemLayout fluid key={details._id}>
                  <ContentBottomHeaderLayout style={isMobile() ? { marginTop: '60px' } : {}}>
                    {
                      <ListHeader
                        data={details}
                        mailoutDetailPage={true}
                        onClickEdit={handleEditMailoutDetailsClick}
                        onClickApproveAndSend={handleApproveAndSendMailoutDetailsClick}
                        onClickDelete={handleDeleteMailoutDetailsClick}
                        lockControls={working}
                      />
                    }
                  </ContentBottomHeaderLayout>

                  <ItemBodyLayoutV2 attached style={isMobile() ? { padding: 10, marginTop: '129px' } : { padding: 10, marginTop: '89px' }}>
                    {ImageGroup({ img1src: details.sampleBackLargeUrl, img2src: details.sampleFrontLargeUrl })}

                    <ItemBodyDataLayout relaxed>
                      <List.Item>
                        <List.Content>
                          <List.Header>
                            Recipients
                            {multiUser && (
                              <Popup
                                flowing
                                trigger={<FontAwesomeIcon icon="info-circle" style={{ marginLeft: '.5em', color: '#2DB5AD' }} />}
                                content={PopupMinMax({ mailoutSizeMin, mailoutSizeMax })}
                                position="top right"
                              />
                            )}
                          </List.Header>
                          <List.Description>
                            <RenderRecipients />
                          </List.Description>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          <List.Header>Cost</List.Header>
                          <List.Description>{calculateCost(details.recipientCount)}</List.Description>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          <List.Header>
                            Status
                            <Popup
                              flowing
                              trigger={<FontAwesomeIcon icon="info-circle" style={{ marginLeft: '.5em', color: '#2DB5AD' }} />}
                              content={PopupContent()}
                              position="top right"
                            />
                          </List.Header>
                          <List.Description style={{ color: resolveMailoutStatusColor(details.mailoutStatus) }}>
                            <FontAwesomeIcon icon={resolveMailoutStatusIcon(details.mailoutStatus)} style={{ marginRight: '.5em' }} />
                            {resolveMailoutStatus(details.mailoutStatus)}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          <List.Header>Created</List.Header>
                          <List.Description>{formatDate(details.created)}</List.Description>
                        </List.Content>
                      </List.Item>
                    </ItemBodyDataLayout>
                  </ItemBodyLayoutV2>
                </ItemLayout>
              )}

              {!pendingState && !error && !updatePendingState && !updateError && details && <GoogleMapItem data={details} />}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      {(pendingState && !error && <Loading />) || (updatePendingState && !updateError && <Loading message="Updating listing, please wait..." />)}
      {error && <Message error>Oh snap! {error}.</Message>}
      {updateError && <Message error>Oh snap! {updateError}.</Message>}
    </Page>
  );
};

export default MailoutDetailsPage;
