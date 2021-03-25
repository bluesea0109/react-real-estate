import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Loader from '../../components/Base/Loader';
import { getPhotoLibraryPending } from '../../store/modules/pictures/actions';
import { setSelectedPhoto, setBigPhoto } from '../../store/modules/liveEditor/actions';
import { ImageOption } from './StyledComponents';
import { useClickOutside } from '../../components/Hooks/useClickOutside';

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  h4 {
    margin-left: 6px;
    margin-bottom: 19px;
  }
  & > img {
    width: 48%;

    margin: 3px;
    object-fit: contain;
  }
  div {
    display: flex;
  }

  span {
    font-weight: 300;
  }
  .global-header {
    margin-top: 20px;
  }
`;

export default function PhotoLibrary() {
  const dispatch = useDispatch();
  const libraryPhotos = useSelector(store => store.pictures.photoLibrary);
  const selectedPhoto = useSelector(state => state.liveEditor?.selectedPhoto);
  const photoLibraryPending = useSelector(state => state.pictures.photoLibraryPending);

  const ImageOptionsWrapper = ({ children }) => {
    const wrapperRef = useRef(null);
    useClickOutside(wrapperRef, () => {
      dispatch(setSelectedPhoto(''));
      dispatch(setBigPhoto(''));
    });
    return (
      <div className="images" ref={wrapperRef}>
        {children}
      </div>
    );
  };

  useEffect(() => {
    dispatch(getPhotoLibraryPending());
    return () => {
      dispatch(setBigPhoto(''));
    };
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
    <ImageOptionsWrapper>
      <GridContainer>
        <div>
          <h4>Team Picture Library </h4>
          {libraryPhotos?.team && <span>{` | ${libraryPhotos?.team.length} Photos`}</span>}
        </div>
        {libraryPhotos?.team ? (
          libraryPhotos.team.map((img, index) => (
            <ImageOption
              key={index}
              current={renderThumbnail(img) === selectedPhoto}
              src={renderThumbnail(img)}
              alt="cover option"
              onClick={() => {
                dispatch(setSelectedPhoto(renderThumbnail(img)));
                dispatch(setBigPhoto(img.original));
              }}
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
        <div className="global-header">
          <h4>Global Picture Library </h4>
          {libraryPhotos?.global && (
            <span>
              {` | ${
                libraryPhotos?.global.filter(img => !img.formats.includes('story')).length
              } Photos`}
            </span>
          )}
        </div>
        {libraryPhotos?.global ? (
          libraryPhotos.global.map(
            img =>
              !img.formats.includes('story') && (
                <ImageOption
                  key={img.id}
                  current={renderThumbnail(img) === selectedPhoto}
                  src={renderThumbnail(img)}
                  alt="cover option"
                  onClick={() => {
                    dispatch(setSelectedPhoto(renderThumbnail(img)));
                    dispatch(setBigPhoto(img.original));
                  }}
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
    </ImageOptionsWrapper>
  );
}
