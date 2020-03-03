import React from 'react';
import PropTypes from 'prop-types';

import { isMobile } from './utils';
import { Segment } from './Base';

const PageTitleHeader = ({ children, ...rest }) => {
  const style = {
    boxShadow: 'none',
    border: 'none',
    borderBottom: '1px solid lightgrey',
    borderRadius: 0,
  };

  return (
    <Segment style={isMobile() ? { marginTop: '58px', ...style } : { ...style }} {...rest}>
      {children}
    </Segment>
  );
};

PageTitleHeader.propTypes = {
  children: PropTypes.node,
};

export default PageTitleHeader;
