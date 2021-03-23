import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Loading from '../../components/Loading';
import Loader from '../../components/Base/Loader';

import { getPhotoLibraryPending } from '../../store/modules/pictures/actions';
import { setSelectedPhoto } from '../../store/modules/liveEditor/actions';
import { ImageOption } from './StyledComponents';

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  h4 {
    margin-left: 6px;
    margin-bottom: 19px;
  }
  & > img {
    width: 48%;
    border: 1px solid lightgrey;
    margin: 3px;
    object-fit: cover;
  }

  span {
    font-weight: 300;
  }
`;

export default function PhotoLibrary() {
  const dispatch = useDispatch();
  const libraryPhotos = useSelector(store => store.pictures.photoLibrary);
  const selectedPhoto = useSelector(state => state.liveEditor?.selectedPhoto);
  const photoLibraryPending = useSelector(state => state.pictures.photoLibraryPending);

  useEffect(() => {
    dispatch(getPhotoLibraryPending());
  }, [dispatch]);

  const renderThumbnail = url => {
    switch (true) {
      case url.hasOwnProperty('thumbnail'):
        return url.thumbnail;
      case url.hasOwnProperty('resized'):
        return url.resized;
      case url.hasOwnProperty('preview'):
        return url.preview;
      default:
        return url.original;
    }
  };

  return (
    <>
      <GridContainer>
        <h4>
          Team Picture Library <span>| {libraryPhotos?.team.length} Photos</span>
        </h4>
        {libraryPhotos?.team ? (
          libraryPhotos.team.map((img, index) => (
            <ImageOption
              key={index}
              current={renderThumbnail(img) === selectedPhoto}
              src={renderThumbnail(img)}
              alt="cover option"
              onClick={() => dispatch(setSelectedPhoto(renderThumbnail(img)))}
              onDragStart={e => {
                e.dataTransfer.setData('text', img.original);
              }}
            />
          ))
        ) : photoLibraryPending ? (
          <Loader active inline="centered">
            Loading Team Images...
          </Loader>
        ) : null}
      </GridContainer>
      <GridContainer>
        <h4 style={{ marginTop: '30px' }}>
          Global Picture Library{' '}
          <span>
            |{' '}
            {libraryPhotos?.global &&
              Math.floor(
                libraryPhotos?.global.filter(img => img.formats.includes('square')).length
              )}{' '}
            Photos
          </span>
        </h4>
        {libraryPhotos?.global ? (
          libraryPhotos.global.map(
            img =>
              img.formats.includes('square') && (
                <ImageOption
                  key={img.id}
                  current={renderThumbnail(img) === selectedPhoto}
                  src={renderThumbnail(img)}
                  alt="cover option"
                  onClick={() => dispatch(setSelectedPhoto(renderThumbnail(img)))}
                  onDragStart={e => {
                    e.dataTransfer.setData('text', img.original);
                  }}
                />
              )
          )
        ) : photoLibraryPending ? (
          <Loader active inline="centered">
            Loading Global Images...
          </Loader>
        ) : null}
      </GridContainer>
    </>
  );
}
