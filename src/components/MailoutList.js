import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import MailoutListItem from './MailoutListItem';
import EmptyItem from './EmptyItem';

const MailoutList = data => {
  if (!data) return <EmptyItem />;

  return <Fragment>{data && data.map(item => MailoutListItem(item))}</Fragment>;
};

MailoutList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MailoutList;
