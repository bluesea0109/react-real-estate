import PropTypes from 'prop-types';
import React from 'react';

import { ItemLayout, ItemBodyLayout } from '../../layouts';

import ImageGroup from './ImageGroup';
import ListHeader from './ListHeader';

import ItemList from './ItemList';

const MailoutListItem = data => {
  if (!data) return;

  return (
    <ItemLayout fluid key={data._id}>
      {ListHeader({ data: data })}
      <ItemBodyLayout attached style={{ padding: 10 }}>
        {ImageGroup({ img1src: data.sampleBackLargeUrl, img2src: data.sampleFrontLargeUrl, linkTo: `dashboard/${data._id}` })}

        {ItemList({ data: data })}
      </ItemBodyLayout>
    </ItemLayout>
  );
};

MailoutListItem.propTypes = {
  data: PropTypes.object.isRequired,
};

export default MailoutListItem;
