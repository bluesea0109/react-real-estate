import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchMailoutDetailsPending } from '../store/modules/mailout/actions';
import { Button, Grid, Menu, Page, Segment } from '../components/Base';
import ListHeader from '../components/MailoutListItem/ListHeader';
import ItemTable from '../components/MailoutListItem/ItemTable';
import ImageGroup from '../components/MailoutListItem/ImageGroup';
import GoogleMapItem from '../components/GoogleMapItem';
import { useHistory, useParams } from 'react-router';

const useFetching = (fetchActionCreator, dispatch, mailoutId) => {
  useEffect(() => {
    dispatch(fetchActionCreator(mailoutId));
  }, [fetchActionCreator, dispatch]);
};

const MailoutDetails = () => {
  let history = useHistory();
  const dispatch = useDispatch();

  const isLoading = useSelector(store => store.mailout.pending);
  const details = useSelector(store => store.mailout.details);
  const error = useSelector(store => store.mailout.error);

  // The <Route> that rendered this component has a
  // path of `/topics/:topicId`. The `:topicId` portion
  // of the URL indicates a placeholder that we can
  // get from `useParams()`.
  let { mailoutId } = useParams();
  useFetching(fetchMailoutDetailsPending, useDispatch(), mailoutId);

  function handleClick() {
    history.goBack();
  }

  console.log('mailoutId', mailoutId);

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
                  <Button basic color="teal" onClick={() => handleClick()}>
                    Back
                  </Button>
                </Menu.Item>
              </Menu.Menu>
            </Menu>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16} style={{ margin: 0, padding: 0 }}>
              {!isLoading && !error && details && ListHeader({ data: details, edit: true })}
              <Segment basic>
                {!isLoading && !error && details && ItemTable({ data: details })}
                {!isLoading && !error && details && ImageGroup({ img1src: details.sampleBackLargeUrl, img2src: details.sampleFrontLargeUrl, size: 'big' })}
              </Segment>
              <GoogleMapItem />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Page>
  );
};

export default MailoutDetails;
