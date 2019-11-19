import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchMailoutsPending, changeFetchMailoutsLimit, changeFetchMailoutsPage } from '../store/modules/mailouts/actions';
import { Button, Grid, Label, Menu, Page, Pagination, Segment, Select } from '../components/Base';
import { MobileDisabledLayout, MobileEnabledLayout } from '../layouts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MailoutListItem from '../components/MailoutListItem';
import Loading from '../components/Loading';
import EmptyItem from '../components/EmptyItem';

const useFetching = (fetchActionCreator, dispatch) => {
  useEffect(() => {
    dispatch(fetchActionCreator());
  }, [fetchActionCreator, dispatch]);
};

const countryOptions = [
  { key: 1, value: 1, text: 1 },
  { key: 5, value: 5, text: 5 },
  { key: 10, value: 10, text: 10 },
  { key: 25, value: 25, text: 25 },
  { key: 50, value: 50, text: 50 },
];

const Dashboard = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector(store => store.mailouts.pending);
  const page = useSelector(store => store.mailouts.page);
  const limit = useSelector(store => store.mailouts.limit);
  const list = useSelector(store => store.mailouts.list);
  const error = useSelector(store => store.mailouts.error);

  const [activePage, setActivePage] = useState(page);
  const [itemsPerPage, setItemsPerPage] = useState(limit);

  useFetching(fetchMailoutsPending, useDispatch());

  const boundRefetch = () => dispatch(fetchMailoutsPending());

  const boundChangePage = activePage => dispatch(changeFetchMailoutsPage(activePage));
  const boundChangeLimit = value => dispatch(changeFetchMailoutsLimit(value));

  const handlePaginationChange = (e, { activePage }) => {
    boundChangePage(activePage);
    return setActivePage(activePage);
  };

  const handlePerPageInputChange = (e, { value }) => {
    boundChangeLimit(value);
    return setItemsPerPage(value);
  };

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
          {!isLoading && !error && list.length > 0 && (
            <Grid.Row>
              <Grid.Column width={16} style={{ margin: 0, padding: 0 }}>
                {list.map(item => MailoutListItem(item))}
              </Grid.Column>
            </Grid.Row>
          )}
          {!isLoading && !error && list.length > 0 && (
            <Grid.Row>
              <Grid.Column width={16} style={{ margin: 0, padding: 0 }}>
                <Grid centered columns={2}>
                  <Grid.Column>
                    <Pagination activePage={activePage} onPageChange={handlePaginationChange} totalPages={3} disabled={list.length < itemsPerPage} />
                    <Label>
                      Items per page:
                      <Select options={countryOptions} value={itemsPerPage} onChange={handlePerPageInputChange} style={{ minWidth: '2rem' }} />
                      <datalist id="itemsPerPage">
                        <option value={1} />
                        <option value={5} />
                        <option value={10} />
                        <option value={25} />
                        <option value={50} />
                      </datalist>
                    </Label>
                  </Grid.Column>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          )}
          {!isLoading && !error && list.length === 0 && (
            <Grid.Row>
              <Grid.Column width={16} style={{ margin: 0, padding: 0 }}>
                <EmptyItem />
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </Segment>
    </Page>
  );
};

export default Dashboard;
