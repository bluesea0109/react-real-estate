import { Icon, Label } from 'semantic-ui-react';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  approveAndSendMailoutDetailsPending,
  deleteMailoutDetailsPending,
  resetMailoutDetails,
  saveMailoutDetailsMailoutSizePending,
} from '../store/modules/mailout/actions';
import { Button, Header, Grid, Menu, Message, Page, Segment, List, Popup, Input } from '../components/Base';
import { ItemBodyDataLayout, ItemBodyLayoutV2, ItemLayout } from '../layouts';
import { getMailoutDetailsPending } from '../store/modules/mailout/actions';
import PopupContent from '../components/MailoutListItem/PopupContent';
import ListHeader from '../components/MailoutListItem/ListHeader';
import ImageGroup from '../components/MailoutListItem/ImageGroup';
import GoogleMapItem from '../components/GoogleMapItem';
import { calculateCost, formatDate, resolveMailoutStatus, resolveMailoutStatusColor, resolveMailoutStatusIcon } from '../components/MailoutListItem/helpers';
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
  const [onlyOnce, setOnlyOnce] = useState(false);
  const [editRecipients, setEditRecipients] = useState(false);
  // const [recipientsNumber, userRecipientsNumber] = useInput({ type: "text", initalState: 0 });
  const [numberOfRecipients, setNumberOfRecipients] = useState(0);

  const isLoading = useSelector(store => store.mailout.pending);
  const details = useSelector(store => store.mailout.details);
  const error = useSelector(store => store.mailout.error);

  useEffect(() => {
    if (details && details.recipientCount && !onlyOnce) {
      setNumberOfRecipients(details.recipientCount);
      setOnlyOnce(true);
    }

    // if (details && details.recipientCount === numberOfRecipients) {
    //   setOnlyOnce(false);
    // }
  }, [details, onlyOnce, setOnlyOnce, numberOfRecipients]);

  const boundApproveAndSendMailoutDetails = () => dispatch(approveAndSendMailoutDetailsPending(mailoutId));
  const boundDeleteMailoutDetails = () => dispatch(deleteMailoutDetailsPending(mailoutId));
  const boundResetMailoutDetails = () => dispatch(resetMailoutDetails());

  useFetching(getMailoutDetailsPending, useDispatch(), mailoutId);

  const handleBackClick = () => {
    boundResetMailoutDetails();
    history.goBack();
  };

  const handleApproveAndSendMailoutDetailsClick = () => {
    boundApproveAndSendMailoutDetails();
    // TODO: Google Map is acting up at this stage
    // history.goBack();
  };

  const handleDeleteMailoutDetailsClick = () => {
    boundDeleteMailoutDetails();
    history.goBack();
    // TODO: ^^^ This will probably prevent the issue with Google Map
  };

  const toggleEditState = () => {
    setEditRecipients(!editRecipients);
  };

  const submitNewValues = () => {
    if (details && details.recipientCount !== numberOfRecipients) {
      dispatch(saveMailoutDetailsMailoutSizePending(numberOfRecipients));
    }
  };

  const registerNewValues = value => {
    setNumberOfRecipients(value);
  };

  const renderRecipients = () => {
    if (editRecipients) {
      return (
        <Button as="div" labelPosition="left">
          <Input style={{ minWidth: '4em' }} value={numberOfRecipients} onChange={props => registerNewValues(props.target.value)} />
          <Button icon color="orange" onClick={() => [toggleEditState(), submitNewValues()]} style={{ minWidth: '6em' }}>
            <Icon name="save" />
            Save
          </Button>
        </Button>
      );
    } else {
      return (
        <Button as="div" labelPosition="left">
          <Label basic style={{ minWidth: '6em' }}>
            {details && details.recipientCount}
          </Label>
          <Button icon color="teal" onClick={toggleEditState} style={{ minWidth: '6em' }}>
            <Icon name="edit" />
            Edit
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
              {!isLoading && !error && details && (
                <ItemLayout fluid key={details._id}>
                  {ListHeader({
                    data: details,
                    mailoutDetailPage: true,
                    onClickEdit: () => console.log('Editing will be triggered here!'),
                    onClickApproveAndSend: handleApproveAndSendMailoutDetailsClick,
                    onClickDelete: handleDeleteMailoutDetailsClick,
                  })}
                  <ItemBodyLayoutV2 attached style={{ padding: 10 }}>
                    {ImageGroup({ img1src: details.sampleBackLargeUrl, img2src: details.sampleFrontLargeUrl })}

                    <ItemBodyDataLayout relaxed>
                      <List.Item>
                        <List.Content>
                          <List.Header>Recipients</List.Header>
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
              {!isLoading && !error && details && <GoogleMapItem data={details} />}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      {isLoading && !error && Loading()}
      {error && <Message error>Oh snap! {error}.</Message>}
    </Page>
  );
};

export default MailoutDetailsPage;
