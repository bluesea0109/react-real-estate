import { Header, Label } from 'semantic-ui-react';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useLastLocation } from 'react-router-last-location';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { calculateCost, formatDate, resolveMailoutStatus, resolveMailoutStatusColor, resolveMailoutStatusIcon } from '../components/MailoutListItem/helpers';
import { submitMailoutPending, stopMailoutPending, resetMailout, updateMailoutSizePending } from '../store/modules/mailout/actions';
import { Button, Grid, Menu, Message, Page, Segment, List, Popup, Input } from '../components/Base';
import { ItemBodyDataLayout, ItemBodyLayoutV2, ItemLayout } from '../layouts';
import PopupContent from '../components/MailoutListItem/PopupContent';
import { getMailoutPending } from '../store/modules/mailout/actions';
import PopupMinMax from '../components/MailoutListItem/PopupMinMax';
import ListHeader from '../components/MailoutListItem/ListHeader';
import ImageGroup from '../components/MailoutListItem/ImageGroup';
import LoadingWithMessage from '../components/LoadingWithMessage';
import GoogleMapItem from '../components/GoogleMapItem';
import Loading from '../components/Loading';

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

  const isLoading = useSelector(store => store.mailout.pending);
  const isUpdating = useSelector(store => store.mailout.updatePending);
  const isUpdateMailoutSizePending = useSelector(store => store.mailout.updateMailoutSizePending);
  const isUpdateMailoutSizeError = useSelector(store => store.mailout.updateMailoutSizeError);
  const details = useSelector(store => store.mailout.details);
  const error = useSelector(store => store.mailout.error);
  const updateError = useSelector(store => store.mailout.updateError);

  const teamCustomization = useSelector(store => store.teamCustomization.available);
  const onLoginMode = useSelector(store => store.onLogin.mode);
  const multiUser = onLoginMode === 'multiuser';
  const listingType = details && details.listingStatus;
  const listingDefaults = teamCustomization && teamCustomization[listingType];
  const mailoutSizeMin = listingDefaults && listingDefaults.mailoutSizeMin;
  const mailoutSizeMax = listingDefaults && listingDefaults.mailoutSizeMax;

  useEffect(() => {
    if (!isLoading && !!error) {
      history.push(`/dashboard`);
    }
  }, [isLoading, error, history]);

  useEffect(() => {
    if (details && details.recipientCount) {
      setCurrentNumberOfRecipients(details.recipientCount);
    }
  }, [details, currentNumberOfRecipients]);

  useFetching(getMailoutPending, useDispatch(), mailoutId);

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
    // TODO: Google Map is acting up at this stage
    // history.goBack();
  };

  const handleDeleteMailoutDetailsClick = () => {
    dispatch(stopMailoutPending(mailoutId));
    handleBackClick();
  };

  const handleEditMailoutDetailsClick = () => {
    history.push(`/dashboard/edit/${details._id}`);
  };

  const toggleRecipientsEditState = () => {
    if (newNumberOfRecipients === 0) setNewNumberOfRecipients(currentNumberOfRecipients);

    setEditRecipients(!editRecipients);
  };

  const submitNewValues = () => {
    if (multiUser) {
      let chosenNumber = newNumberOfRecipients;
      if (chosenNumber < mailoutSizeMin) chosenNumber = mailoutSizeMin;
      if (chosenNumber > mailoutSizeMax) chosenNumber = mailoutSizeMax;

      setCurrentNumberOfRecipients(chosenNumber);

      if (currentNumberOfRecipients !== chosenNumber) {
        dispatch(updateMailoutSizePending(chosenNumber));
      }
    } else {
      if (currentNumberOfRecipients !== newNumberOfRecipients) {
        dispatch(updateMailoutSizePending(newNumberOfRecipients));
      }
    }
  };

  const renderRecipients = () => {
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
          <Button
            icon
            color="teal"
            onClick={toggleRecipientsEditState}
            style={{ marginLeft: '10px', minWidth: '5em' }}
            disabled={isUpdateMailoutSizePending}
            loading={isUpdateMailoutSizePending}
          >
            Change
          </Button>
        </Button>
      );
    }
  };

  return (
    <Page basic>
      <Segment>
        <Grid>
          <Grid.Row>
            <Menu borderless fluid secondary>
              <Menu.Item>
                <Header as="h3">Campaign Details</Header>
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item>
                  <Button basic color="teal" onClick={() => handleBackClick()}>
                    Back
                  </Button>
                </Menu.Item>
              </Menu.Menu>
            </Menu>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              {!isLoading && !error && !isUpdating && !updateError && details && (
                <ItemLayout fluid key={details._id}>
                  {ListHeader({
                    data: details,
                    mailoutDetailPage: true,
                    onClickEdit: handleEditMailoutDetailsClick,
                    onClickApproveAndSend: handleApproveAndSendMailoutDetailsClick,
                    onClickDelete: handleDeleteMailoutDetailsClick,
                  })}
                  <ItemBodyLayoutV2 attached style={{ padding: 10 }}>
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
                          <List.Description>{renderRecipients()}</List.Description>
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
              {!isLoading && !error && !isUpdating && !updateError && details && <GoogleMapItem data={details} />}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      {(isLoading && !error && Loading()) || (isUpdating && !updateError && LoadingWithMessage({ message: 'Updating listing, please wait...' }))}
      {error && <Message error>Oh snap! {error}.</Message>}
      {updateError && <Message error>Oh snap! {updateError}.</Message>}
    </Page>
  );
};

export default MailoutDetailsPage;
