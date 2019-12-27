import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useLastLocation } from 'react-router-last-location';

import { Button, Header, Grid, Menu, Message, Page, Segment } from '../components/Base';
import { getMailoutDetailsPending } from '../store/modules/mailout/actions';
import Loading from '../components/Loading';

const MailoutDetailsPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { mailoutId } = useParams();
  const lastLocation = useLastLocation();

  const isLoading = useSelector(store => store.mailout.pending);
  const details = useSelector(store => store.mailout.details);
  const error = useSelector(store => store.mailout.error);

  useEffect(() => {
    if (!details) dispatch(getMailoutDetailsPending(mailoutId));
  }, [details, dispatch, mailoutId, history, lastLocation]);

  const handleBackClick = () => {
    if (lastLocation.pathname === `/dashboard/edit/${mailoutId}`) {
      history.push(`/dashboard/${details._id}`);
    }
    if (lastLocation.pathname === `/dashboard/${mailoutId}`) {
      history.goBack();
    }
  };

  return (
    <Page basic>
      <Segment>
        <Grid>
          <Grid.Row>
            <Menu borderless fluid secondary>
              <Menu.Item>
                <Header as="h3">Edit Campaign Details</Header>
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
          <Grid.Row></Grid.Row>
        </Grid>
      </Segment>
      {isLoading && !error && Loading()}
      {error && <Message error>Oh snap! {error}.</Message>}
    </Page>
  );
};

export default MailoutDetailsPage;
