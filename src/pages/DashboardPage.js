import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchMailoutsPending } from '../store/modules/mailouts/actions';
import { Button, Grid, Menu, Page, Segment } from '../components/Base';
import { MobileDisabledLayout, MobileEnabledLayout } from '../layouts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MailoutList from '../components/MailoutList';
import Loading from '../components/Loading';

const useFetching = (someFetchActionCreator, dispatch) => {
  useEffect(() => {
    dispatch(someFetchActionCreator());
  }, [someFetchActionCreator, dispatch]);
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(store => store.mailouts.pending);
  const list = useSelector(store => store.mailouts.list);
  const error = useSelector(store => store.mailouts.error);

  useFetching(fetchMailoutsPending, useDispatch());

  const boundRefetch = () => dispatch(fetchMailoutsPending());

  return (
    <Page basic>
      <Segment>
        <Grid>
          <Grid.Row>
            <Menu borderless fluid secondary>
              <Menu.Item>
                <h1>Dashboard</h1>
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item>
                  <Button basic color="teal" onClick={() => boundRefetch()}>
                    <MobileDisabledLayout>
                      Get My Properties <FontAwesomeIcon icon="sync-alt" style={{ marginLeft: '.5em' }} />
                    </MobileDisabledLayout>
                    <MobileEnabledLayout>
                      <FontAwesomeIcon icon="sync-alt" />
                    </MobileEnabledLayout>
                  </Button>
                </Menu.Item>
              </Menu.Menu>
            </Menu>
            {isLoading && !error && Loading()}
          </Grid.Row>
          {!isLoading && !error && (
            <Grid.Row>
              <Grid.Column width={16} style={{ margin: 0, padding: 0 }}>
                {MailoutList(list)}
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </Segment>
    </Page>
  );
};

export default Dashboard;
