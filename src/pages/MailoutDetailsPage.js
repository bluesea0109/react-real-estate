import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchMailoutDetailsPending } from '../store/modules/mailout/actions';
import { Button, Grid, Menu, Message, Page, Segment } from '../components/Base';
import ListHeader from '../components/MailoutListItem/ListHeader';
import ItemTable from '../components/MailoutListItem/ItemTable';
import ImageGroup from '../components/MailoutListItem/ImageGroup';
import GoogleMapItem from '../components/GoogleMapItem';
import { useHistory, useParams } from 'react-router';
import Loading from '../components/Loading';
import { approveAndSendMailoutDetailsPending, deleteMailoutDetailsPending, resetMailoutDetails } from '../store/modules/mailout/actions';

const useFetching = (fetchActionCreator, dispatch, mailoutId) => {
  useEffect(() => {
    dispatch(fetchActionCreator(mailoutId));
  }, [fetchActionCreator, dispatch, mailoutId]);
};

const MailoutDetails = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  // The <Route> that rendered this component has a
  // path of `/topics/:topicId`. The `:topicId` portion
  // of the URL indicates a placeholder that we can
  // get from `useParams()`.
  const { mailoutId } = useParams();

  const isLoading = useSelector(store => store.mailout.pending);
  const details = useSelector(store => store.mailout.details);
  const error = useSelector(store => store.mailout.error);

  const boundApproveAndSendMailoutDetails = () => dispatch(approveAndSendMailoutDetailsPending(mailoutId));
  const boundDeleteMailoutDetails = () => dispatch(deleteMailoutDetailsPending(mailoutId));
  const boundResetMailoutDetails = () => dispatch(resetMailoutDetails());

  useFetching(fetchMailoutDetailsPending, useDispatch(), mailoutId);

  const handleBackClick = () => {
    boundResetMailoutDetails();
    history.goBack();
  };

  const handleEditClick = () => {
    console.log('yay!');
    // TODO: Create Edit Modal
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

  return (
    <Page basic>
      <Segment>
        <Grid>
          <Grid.Row>
            <Menu borderless fluid secondary>
              <Menu.Item>
                <h1>Campaign Details</h1>
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
              {!isLoading &&
                !error &&
                details &&
                ListHeader({
                  data: details,
                  edit: true,
                  onClickEdit: handleEditClick,
                  onClickApproveAndSend: handleApproveAndSendMailoutDetailsClick,
                  onClickDelete: handleDeleteMailoutDetailsClick,
                })}
              <Segment basic>
                {!isLoading && !error && details && ItemTable({ data: details })}
                {!isLoading && !error && details && ImageGroup({ img1src: details.sampleBackLargeUrl, img2src: details.sampleFrontLargeUrl, size: 'big' })}
              </Segment>
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

export default MailoutDetails;
