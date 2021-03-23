import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Loading from '../../components/Loading';
import { getPhotoLibraryPending } from '../../store/modules/pictures/actions';

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > img {
    width: 48%;
    border: 1px solid lightgrey;
    margin: 3px;
  }
`;

export default function PhotoLibrary({ handleSave }) {
  const dispatch = useDispatch();
  const libraryPhotos = useSelector(store => store.pictures.photoLibrary);

  useEffect(() => {
    dispatch(getPhotoLibraryPending());
  }, []);

  console.log('libraryPhotos', libraryPhotos);
  return (
    <>
      <h4>Global Picture Library</h4>
      <GridContainer>
        {libraryPhotos?.global ? (
          libraryPhotos.global.map(
            img =>
              img.formats.includes('square') && (
                <img key={img.id} src={img.thumbnail} alt={img.name} />
              )
          )
        ) : (
          <Loading message="Loading Images ..." />
        )}
      </GridContainer>
      <h4>Team Picture Library</h4>
      <GridContainer>
        {libraryPhotos?.team ? (
          libraryPhotos.team.map(img => <img key={img.id} src={img.preview} alt={img.id} />)
        ) : (
          <Loading message="Loading Images ..." />
        )}
      </GridContainer>
    </>
  );
}
