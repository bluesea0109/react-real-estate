import React from 'react';
import PropTypes from 'prop-types';

import { Segment } from './Base';
import { useIsMobile } from './Hooks/useIsMobile';

const PageTitleHeader = ({ children, ...rest }) => {
  const isMobile = useIsMobile();

  const style = {
    border: 'none',
    borderRadius: '4px',
    boxShadow: 'rgba(34, 36, 38, 0) 0px 2px 0px 0px, rgba(34, 36, 38, 0.1) 0px 2px 5px 0px',
    padding: '0.5rem 1rem',
  };

  return (
    <Segment style={isMobile ? { marginTop: '58px', ...style } : { ...style }} {...rest}>
      {children}
    </Segment>
  );
};

PageTitleHeader.propTypes = {
  children: PropTypes.node,
};

export default PageTitleHeader;
