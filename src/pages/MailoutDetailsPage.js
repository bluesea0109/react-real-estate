import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { approveAndSendMailoutDetailsPending, deleteMailoutDetailsPending, resetMailoutDetails } from '../store/modules/mailout/actions';
import { Button, Header, Grid, Menu, Message, Page, Segment } from '../components/Base';
import { fetchMailoutDetailsPending } from '../store/modules/mailout/actions';
import ListHeader from '../components/MailoutListItem/ListHeader';
import ImageGroup from '../components/MailoutListItem/ImageGroup';
import MailoutEditModal from '../components/MailoutEditModal';
import ItemList from '../components/MailoutListItem/ItemList';
import GoogleMapItem from '../components/GoogleMapItem';
import { ItemBodyLayoutV2, ItemLayout } from '../layouts';
import { useHistory, useParams } from 'react-router';
import Loading from '../components/Loading';

const useFetching = (fetchActionCreator, dispatch, mailoutId) => {
  useEffect(() => {
    dispatch(fetchActionCreator(mailoutId));
  }, [fetchActionCreator, dispatch, mailoutId]);
};

const MailoutDetails = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { mailoutId } = useParams();
  const [modalOpen, setModalOpen] = useState(false);

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

  const toggleModalState = () => {
    setModalOpen(!modalOpen);
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
                    onClickEdit: toggleModalState,
                    onClickApproveAndSend: handleApproveAndSendMailoutDetailsClick,
                    onClickDelete: handleDeleteMailoutDetailsClick,
                  })}
                  <ItemBodyLayoutV2 attached style={{ padding: 10 }}>
                    {ImageGroup({ img1src: details.sampleBackLargeUrl, img2src: details.sampleFrontLargeUrl })}

                    {ItemList({ data: details })}
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
      <MailoutEditModal modalOpen={modalOpen} handleClose={toggleModalState} />
    </Page>
  );
};

export default MailoutDetails;
