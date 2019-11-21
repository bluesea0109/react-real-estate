import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Image } from '../Base';

const ImageGroup = ({ img1src, img2src, linkTo }) => {
  if (!img1src || !img2src) return;

  if (linkTo) {
    return (
      <Image.Group style={{ minWidth: '200px' }}>
        <Link to={linkTo}>
          <Image src={img1src} />
        </Link>
        <Link to={linkTo}>
          <Image src={img2src} />
        </Link>
      </Image.Group>
    );
  }

  return (
    <Image.Group size="big">
      <Image src={img1src} />
      <Image src={img2src} />
    </Image.Group>
  );
};

ImageGroup.propTypes = {
  img1src: PropTypes.string.isRequired,
  img2src: PropTypes.string.isRequired,
  size: PropTypes.string,
  linkTo: PropTypes.string,
};

export default ImageGroup;
