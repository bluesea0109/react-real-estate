import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import styled from 'styled-components';
import { getMailoutPending } from '../../store/modules/mailout/actions';
import * as brandColors from '../../components/utils/brandColors';
import { Button, ButtonNoStyle, Icon } from '../../components/Base';
import EditorHeader from './EditorHeader';
import EditorNav, { NavButton } from './EditorNav';
import { BackIframe, FrontIframe } from '../MailoutDetailsPage';

const EditorLayout = styled.div`
  display: grid;
  grid-template-rows: [header] minmax(54px, auto) [body] minmax(10px, 1fr);
  grid-template-columns: [nav] 56px [sidebar] 300px [content] minmax(10px, 1fr);
  background-color: white;
  max-height: calc(100% - 60px);
  min-width: 100%;
  position: fixed;
  & i {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const EditorSidebar = styled.div`
  padding: 1rem;
  z-index: 10;
  box-shadow: 2px 0 6px -2px rgba(128, 128, 128, 0.5);
`;

const EditorContent = styled.div`
  background-color: ${brandColors.grey09};
  display: grid;
  grid-template-columns: minmax(auto, 100%);
  grid-template-rows: minmax(46px, auto) 1fr;
`;

const EditorToolbar = styled.div`
  padding: 0.5rem 1rem;
  background-color: white;
  display: flex;
  align-items: center;
`;

const EditorPreview = styled.div`
  overflow: auto;
  padding: 2rem;
  display: grid;
  gap: 2em;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  justify-items: center;
`;

export default function Editor() {
  const dispatch = useDispatch();
  const history = useHistory();
  const mailoutId = useParams().mailoutId;
  const details = useSelector(store => store.mailout?.details);
  const peerId = useSelector(store => store.peer.peerId);
  const [activeNavItem, setActiveNavItem] = useState(0);
  const [frontLoaded, setFrontLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);

  useEffect(() => {
    dispatch(getMailoutPending(mailoutId));
  }, [dispatch, mailoutId]);

  const [frontIframeRef, setFrontIframeRef] = useState(null);
  const [backIframeRef, setBackIframeRef] = useState(null);

  const onFrontChange = useCallback(node => {
    setFrontIframeRef(node);
  }, []);
  const onBackChange = useCallback(node => {
    setBackIframeRef(node);
  }, []);

  const sendInitMessage = useCallback(
    async side => {
      if (side === 'front')
        await frontIframeRef?.contentWindow?.postMessage(
          'getAllEditiableFieldsAsMergeVariables',
          'http://localhost:8082/'
        );
      else if (side === 'back')
        await backIframeRef?.contentWindow?.postMessage(
          'getAllEditiableFieldsAsMergeVariables',
          'http://localhost:8082/'
        );
    },
    [frontIframeRef, backIframeRef]
  );

  useEffect(() => {
    if (frontLoaded) sendInitMessage('front');
  }, [frontLoaded, sendInitMessage]);

  useEffect(() => {
    if (backLoaded) sendInitMessage('back');
  }, [backLoaded, sendInitMessage]);

  useEffect(() => {
    const logEvent = e => {
      if (e.source?.frameElement?.title?.includes('bm-iframe')) console.dir(e.data);
    };
    console.log('Listening for messages');
    window.addEventListener('message', logEvent);
    return () => {
      console.log('Stopped listening for messages');
      window.removeEventListener('message', logEvent);
    };
  }, []);

  const handleOnload = useCallback(
    event => {
      const {
        name,
        document: { body },
      } = event.target.contentWindow;

      body.style.overflow = 'hidden';
      body.style['pointer-events'] = 'none';

      if (name === 'front') {
        setFrontLoaded(true);
      }

      if (name === 'back') {
        setBackLoaded(true);
      }
    },
    [setFrontLoaded, setBackLoaded]
  );

  const navItems = [
    { name: 'Templates', iconName: 'picture' },
    { name: 'Editor', iconName: 'edit outline' },
    { name: 'Uploads', iconName: 'cloud upload' },
    { name: 'Import', iconName: 'bolt' },
  ];

  const frontURL = peerId
    ? `/api/user/${details?.userId}/peer/${peerId}/mailout/${details?._id}/render/preview/html/front/edit?edit=true&showBleed=true`
    : `/api/user/${details?.userId}/mailout/${details?._id}/render/preview/html/front/edit?edit=true&showBleed=true`;

  const backURL = peerId
    ? `/api/user/${details?.userId}/peer/${peerId}/mailout/${details?._id}/render/preview/html/back/edit?edit=true&showBleed=true`
    : `/api/user/${details?.userId}/mailout/${details?._id}/render/preview/html/back/edit?edit=true&showBleed=true`;

  return (
    <EditorLayout>
      <EditorHeader>
        <div className="header-left">
          <ButtonNoStyle onClick={() => history.push(`/postcards/${details?._id}`)}>
            <Icon className="back-btn" name="chevron left" />
          </ButtonNoStyle>
          <h1>{details?.name}</h1>
          <ButtonNoStyle onClick={() => console.log('TODO Edit Name')}>
            <Icon name="pencil" />
          </ButtonNoStyle>
        </div>
        <div className="header-right">
          <Icon name="undo" />
          <span>all changes saved</span>
          <ButtonNoStyle>
            <div className="overflow-menu">
              <Icon name="ellipsis horizontal" />
            </div>
          </ButtonNoStyle>
          <Button primary>Next</Button>
        </div>
      </EditorHeader>
      <EditorNav>
        {navItems.map((item, ind) => (
          <NavButton
            key={item.name}
            className={`${ind === activeNavItem ? 'active' : null}`}
            iconName={item.iconName}
            onClick={() => setActiveNavItem(ind)}
          />
        ))}
      </EditorNav>
      <EditorSidebar>
        <h3>{navItems[activeNavItem].name}</h3>
      </EditorSidebar>
      <EditorContent>
        <EditorToolbar>
          <p>Toolbar Content</p>
        </EditorToolbar>
        {details && (
          <EditorPreview>
            <FrontIframe
              details={details}
              frontLoaded={frontLoaded}
              frontURL={frontURL}
              handleOnload={handleOnload}
              ref={onFrontChange}
            />
            <BackIframe
              backLoaded={backLoaded}
              backURL={backURL}
              details={details}
              handleOnload={handleOnload}
              ref={onBackChange}
            />
          </EditorPreview>
        )}
      </EditorContent>
    </EditorLayout>
  );
}
