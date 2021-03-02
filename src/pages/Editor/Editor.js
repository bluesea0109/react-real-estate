import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import styled from 'styled-components';
import { getMailoutPending } from '../../store/modules/mailout/actions';
import * as brandColors from '../../components/utils/brandColors';
import { Button, ButtonNoStyle, Icon } from '../../components/Base';

const EditorLayout = styled.div`
  display: grid;
  grid-template-rows: [header] 54px [body] 1fr;
  grid-template-columns: [nav] 56px [sidebar] 300px [content] 1fr;
  background-color: white;
`;

const EditorHeader = styled.div`
  z-index: 30;
  grid-column: span 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${brandColors.grey08};
  padding: 4px 1em 4px 0;
  & i {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & > .header-left {
    display: flex;
    align-items: center;
    & h1 {
      font-weight: 600;
      color: ${brandColors.grey01};
    }
    & i {
      height: 40px;
      font-size: 1.2em;
      color: ${brandColors.primary};
      margin: 0 12px;
      &.back-btn {
        margin: 0 8px 0 0;
      }
    }
  }
  & > .header-right {
    color: ${brandColors.grey03};
    display: flex;
    align-items: center;
    & > i {
      height: 36px;
      font-size: 1.25em;
      margin-right: 1em;
    }
    & .overflow-menu {
      color: ${brandColors.grey03};
      background-color: ${brandColors.grey09};
      &:hover {
        background-color: ${brandColors.lightGreyHover};
      }
      width: 36px;
      height: 36px;
      border-radius: 36px;
      & i {
        width: 100%;
        height: 100%;
        transform: translateY(1px);
      }
    }
  }
`;

const EditorNav = styled.nav`
  z-index: 20;
  border-right: 1px solid ${brandColors.grey08};
  box-shadow: ${brandColors.navBoxShadow};
`;

const EditorSidebar = styled.div`
  z-index: 10;
  box-shadow: 2px 0 6px -2px rgba(128, 128, 128, 0.5);
`;

const EditorContent = styled.div`
  background-color: ${brandColors.grey09};
`;

export default function Editor() {
  const dispatch = useDispatch();
  const history = useHistory();
  const mailoutId = useParams().mailoutId;
  const mailoutDetails = useSelector(store => store.mailout?.details);

  useEffect(() => {
    dispatch(getMailoutPending(mailoutId));
  }, [dispatch, mailoutId]);

  return (
    <EditorLayout>
      <EditorHeader>
        <div className="header-left">
          <ButtonNoStyle onClick={() => history.push(`/postcards/${mailoutDetails?._id}`)}>
            <Icon className="back-btn" name="chevron left" />
          </ButtonNoStyle>
          <h1>{mailoutDetails?.name}</h1>
          <Icon name="pencil" />
        </div>
        <div className="header-right">
          <Icon name="undo" />
          <span>all changed saved</span>
          <ButtonNoStyle>
            <div className="overflow-menu">
              <Icon name="ellipsis horizontal" />
            </div>
          </ButtonNoStyle>
          <Button primary>Next</Button>
        </div>
      </EditorHeader>
      <EditorNav></EditorNav>
      <EditorSidebar></EditorSidebar>
      <EditorContent>
        <p>{mailoutDetails?._id}</p>
      </EditorContent>
    </EditorLayout>
  );
}
