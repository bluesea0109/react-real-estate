import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ItemBodyPicturesLayout } from '../../layouts';
import { Image } from '../Base';
import './hover.css';

const mql = window.matchMedia('(max-width: 599px)');
const resizePictures = () => (mql.matches ? { width: '100%' } : { width: '48%' });

const ImageGroup = ({ img1src, img2src, linkTo }) => {
  if (!img1src || !img2src) return;

  if (linkTo) {
    return (
      <ItemBodyPicturesLayout>
        <Link to={linkTo}>
          <Image src={img1src} style={resizePictures()} className="bm-transform-effect" />
        </Link>
        <Link to={linkTo}>
          <Image src={img2src} style={resizePictures()} className="bm-transform-effect" />
        </Link>
      </ItemBodyPicturesLayout>
    );
  }

  return (
    <ItemBodyPicturesLayout>
      <Image src={img1src} style={resizePictures()} />
      <Image src={img2src} style={resizePictures()} />
    </ItemBodyPicturesLayout>
  );
};

ImageGroup.propTypes = {
  img1src: PropTypes.string.isRequired,
  img2src: PropTypes.string.isRequired,
  size: PropTypes.string,
  linkTo: PropTypes.string,
};

export default ImageGroup;
