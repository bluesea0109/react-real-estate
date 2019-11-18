import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import { Container, Grid, Segment } from '../Base';
import { MobileDisabledLayout, MobileEnabledLayout } from '../../layouts';

import ImageGroup from './ImageGroup';
import ListHeader from './ListHeader';
import ItemList from './ItemList';
import ItemTable from './ItemTable';

const renderForMobile = data => {
  return (
    <Segment attached style={{ padding: 10 }}>
      {ImageGroup({ img1src: data.sampleBackUrl, img2src: data.sampleFrontUrl, linkTo: `dashboard/${data._id}` })}
      {ItemList({ data: data })}
    </Segment>
  );
};

const renderForEverythingElse = data => {
  return (
    <Segment attached style={{ padding: 10 }}>
      <Grid columns={2}>
        <Grid.Row verticalAlign="middle">
          <Grid.Column style={{ width: '42%' }}>
            {ImageGroup({ img1src: data.sampleBackUrl, img2src: data.sampleFrontUrl, linkTo: `dashboard/${data._id}` })}
          </Grid.Column>

          <Grid.Column style={{ padding: 0 }}>{ItemTable({ data: data })}</Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

const MailoutListItem = data => {
  if (!data) return;

  return (
    <Container fluid key={data._id}>
      {ListHeader({ data: data })}
      <MobileDisabledLayout>
        <Fragment>{renderForEverythingElse(data)}</Fragment>
      </MobileDisabledLayout>
      <MobileEnabledLayout>
        <Fragment>{renderForMobile(data)}</Fragment>
      </MobileEnabledLayout>
    </Container>
  );
};

MailoutListItem.propTypes = {
  data: PropTypes.object.isRequired,
};

export default MailoutListItem;
