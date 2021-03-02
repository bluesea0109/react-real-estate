import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { getMailoutPending } from '../../store/modules/mailout/actions';

const EditorLayout = styled.div`
  display: grid;
  grid-template-rows: [header] 54px [body] 1fr;
  grid-template-columns: [nav] 54px [sidebar] 300px [content] 1fr;
`;

const EditorHeader = styled.div`
  background-color: lightcoral;
  grid-column: span 3;
`;

const EditorNav = styled.div`
  background-color: lightblue;
`;

const EditorSidebar = styled.div`
  background-color: lightcyan;
`;

const EditorContent = styled.div`
  background-color: lightgoldenrodyellow;
`;

export default function Editor() {
  const dispatch = useDispatch();
  const mailoutId = useParams().mailoutId;
  const mailoutDetails = useSelector(store => store.mailout?.details);

  useEffect(() => {
    dispatch(getMailoutPending(mailoutId));
  }, [dispatch, mailoutId]);

  return (
    <EditorLayout>
      <EditorHeader> Live Editor Page</EditorHeader>
      <EditorNav></EditorNav>
      <EditorSidebar></EditorSidebar>
      <EditorContent>
        <p>{mailoutDetails?._id}</p>
      </EditorContent>
    </EditorLayout>
  );
}
