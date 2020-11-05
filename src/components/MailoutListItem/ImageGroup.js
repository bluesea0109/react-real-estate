import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ItemBodyPicturesLayout } from '../../layouts';
import { Image } from '../Base';
import { useIsMobile } from '../Hooks/useIsMobile';

const ImageGroup = ({ img1src, img2src, linkTo, status }) => {
  const isMobile = useIsMobile();
  const resizePictures = () => (isMobile ? { width: '100%' } : { width: '48%' });

  if (!img1src || !img2src) return;

  if (status === 'archived' || status === 'hide') {
    return (
      <ItemBodyPicturesLayout>
        <Image src={img1src} style={resizePictures()} className="bm-transform-effect image-frame-border" />
        <Image src={img2src} style={resizePictures()} className="bm-transform-effect image-frame-border" />
      </ItemBodyPicturesLayout>
    );
  }

  if (linkTo) {
    return (
      <ItemBodyPicturesLayout>
        <Link to={linkTo}>
          <Image src={img1src} style={resizePictures()} className="bm-transform-effect image-frame-border" />
        </Link>
        <Link to={linkTo}>
          <Image src={img2src} style={resizePictures()} className="bm-transform-effect image-frame-border" />
        </Link>
      </ItemBodyPicturesLayout>
    );
  }

  return (
    <ItemBodyPicturesLayout>
      <Image src={img1src} style={resizePictures()} className="image-frame-border" />
      <Image src={img2src} style={resizePictures()} className="image-frame-border" />
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
