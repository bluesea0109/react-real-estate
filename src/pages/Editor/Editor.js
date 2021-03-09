import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import styled from 'styled-components';
import {
  getMailoutEditPending,
  getMailoutPending,
  setEditBrandColor,
  setEditFields,
  updateMailoutEditPending,
} from '../../store/modules/mailout/actions';
import * as brandColors from '../../components/utils/brandColors';
import { Button, ButtonNoStyle, Icon, Loader } from '../../components/Base';
import EditorHeader from './EditorHeader';
import EditorNav, { NavButton } from './EditorNav';
import { BackIframe, FrontIframe } from '../MailoutDetailsPage';
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import jsText from 'raw-loader!./iframeScript.js';
import EditorSidebar from './EditorSidebar';
import { setReloadIframes, setReloadIframesPending } from '../../store/modules/liveEditor/actions';

const EditorLayout = styled.div`
  display: grid;
  grid-template-rows: [header] minmax(54px, auto) [body] minmax(10px, 1fr);
  grid-template-columns: [nav] 56px [sidebar] 330px [content] minmax(10px, 1fr);
  background-color: white;
  height: calc(100% - 60px);
  min-width: 100%;
  position: fixed;
  & i {
    display: flex;
    align-items: center;
    justify-content: center;
  }
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
  const mailoutId = useParams().mailoutId;
  const details = useSelector(store => store.mailout?.details);
  const mailoutEdit = useSelector(state => state.mailout?.mailoutEdit);
  const peerId = useSelector(store => store.peer?.peerId);
  const updatePending = useSelector(state => state.mailout?.updateMailoutEditPending);
  const reloadIframes = useSelector(state => state.liveEditor?.reloadIframes);
  const reloadIframesPending = useSelector(state => state.liveEditor?.reloadIframesPending);
  const [activeNavItem, setActiveNavItem] = useState(1); // 0 default - 1 for testing
  const [frontLoaded, setFrontLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);
  const [colorPickerVal, setColorPickerVal] = useState(mailoutEdit?.brandColor);
  const [frontIframeRef, setFrontIframeRef] = useState(null);
  const [backIframeRef, setBackIframeRef] = useState(null);

  useEffect(() => {
    if (!reloadIframes) return;
    if (
      (reloadIframes === 'front' || reloadIframes === true) &&
      frontIframeRef?.contentWindow?.location
    ) {
      setFrontLoaded(false);
      frontIframeRef.contentWindow.location.reload();
    }
    if (
      (reloadIframes === 'back' || reloadIframes === true) &&
      backIframeRef?.contentWindow?.location
    ) {
      setBackLoaded(false);
      backIframeRef.contentWindow.location.reload();
    }
    dispatch(setReloadIframes(false));
    dispatch(setReloadIframesPending(false));
  }, [backIframeRef, dispatch, frontIframeRef, reloadIframes]);

  const sendPostMessage = useCallback(
    async (side, data) => {
      if (side === 'front')
        return frontIframeRef?.contentWindow?.postMessage(data, 'http://localhost:8082/');
      else if (side === 'back')
        return backIframeRef?.contentWindow?.postMessage(data, 'http://localhost:8082/');
    },
    [frontIframeRef, backIframeRef]
  );

  const updateIframeColor = useCallback(
    (side, colorHex) => {
      sendPostMessage(side, {
        type: 'updateBrandColor',
        value: colorHex,
      });
    },
    [sendPostMessage]
  );

  useEffect(() => {
    dispatch(setEditBrandColor(colorPickerVal?.hex));
    if (frontIframeRef) {
      updateIframeColor('front', colorPickerVal?.hex);
    }
    if (backIframeRef) {
      updateIframeColor('back', colorPickerVal?.hex);
    }
  }, [colorPickerVal, dispatch, frontIframeRef, backIframeRef, updateIframeColor]);

  useEffect(() => {
    dispatch(getMailoutPending(mailoutId));
    dispatch(getMailoutEditPending(mailoutId));
  }, [dispatch, mailoutId]);

  const onFrontChange = useCallback(node => {
    setFrontIframeRef(node);
  }, []);
  const onBackChange = useCallback(node => {
    setBackIframeRef(node);
  }, []);

  const sendInitMessage = useCallback(
    async side => {
      await sendPostMessage(side, 'getAllEditableFieldsAsMergeVariables');
    },
    [sendPostMessage]
  );

  useEffect(() => {
    if (frontLoaded) sendInitMessage('front');
  }, [frontLoaded, sendInitMessage]);

  useEffect(() => {
    if (backLoaded) sendInitMessage('back');
  }, [backLoaded, sendInitMessage]);

  const handlePostMessage = useCallback(
    e => {
      if (e.source?.frameElement?.title?.includes('bm-iframe')) {
        const side = e.source?.name;
        let newFields = [];
        if (mailoutEdit.fields === Array) {
          newFields = [...mailoutEdit?.fields];
        }
        if (e.data.name) {
          const changedInd = newFields.findIndex(el => el.name === e.data.name);
          if (changedInd === -1) {
            console.log('Cannot find field: ' + e.data.name);
            if (e.data.name === 'agentFullName') {
              newFields.push({
                name: e.data.name,
                sides: [side],
                value: e.data.value,
              });
            }
          } else newFields[changedInd].value = e.data.value;
          dispatch(setEditFields(newFields));
        }
      }
    },
    [dispatch, mailoutEdit]
  );

  useEffect(() => {
    window.addEventListener('message', handlePostMessage);
    return () => {
      window.removeEventListener('message', handlePostMessage);
    };
  }, [handlePostMessage]);

  const handleOnload = useCallback(
    async event => {
      const frame = event.target.contentWindow;
      const {
        name,
        document: { body },
      } = frame;
      body.style.overflow = 'hidden';
      let scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.innerHTML = jsText;
      await frame.document.head.append(scriptElement);
      if (name === 'front') {
        setFrontLoaded(true);
      }

      if (name === 'back') {
        setBackLoaded(true);
      }
    },
    [setFrontLoaded, setBackLoaded]
  );

  const handleSave = async postcardSize => {
    if (!postcardSize) postcardSize = mailoutEdit?.postcardSize;
    else dispatch(setReloadIframesPending(true));
    const {
      templateTheme,
      fields,
      brandColor,
      mailoutDisplayAgent,
      frontImgUrl,
      ctas,
    } = mailoutEdit;
    let newData = Object.assign(
      {},
      { postcardSize },
      { templateTheme },
      { fields },
      { brandColor },
      { mailoutDisplayAgent }
    );
    if (frontImgUrl) newData.frontImgUrl = frontImgUrl;
    if (ctas) newData.ctas = ctas;
    dispatch(updateMailoutEditPending(newData));
  };

  const navItems = [
    { name: 'Select Templates', iconName: 'picture' },
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
    <>
      {details ? (
        <EditorLayout>
          <EditorHeader>
            <div className="header-left">
              <ButtonNoStyle as={Link} to={`/postcards/${details?._id}`}>
                <Icon className="back-btn" name="chevron left" />
              </ButtonNoStyle>
              <h1>{details?.name || details?.details?.displayAddress}</h1>
              <ButtonNoStyle onClick={() => console.log('TODO Edit Name')}>
                <Icon name="pencil" />
              </ButtonNoStyle>
            </div>
            <div className="header-right">
              <Icon name="undo" />
              {/* Save status when ready */}
              {/* <span>all changes saved</span> */}
              <ButtonNoStyle>
                <div className="overflow-menu">
                  <Icon name="ellipsis horizontal" />
                </div>
              </ButtonNoStyle>
              <Button primary disabled={updatePending} onClick={() => handleSave()}>
                Save
              </Button>
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
          <EditorSidebar
            activeTab={navItems[activeNavItem].name}
            colorPickerVal={colorPickerVal}
            setColorPickerVal={setColorPickerVal}
            handleSave={handleSave}
          />
          <EditorContent>
            <EditorToolbar>
              <p>Toolbar Content</p>
            </EditorToolbar>
            {details && (
              <EditorPreview>
                <FrontIframe
                  campaignId={details?._id}
                  frontLoaded={frontLoaded}
                  frontResourceUrl={details?.frontResourceUrl || null}
                  frontURL={frontURL}
                  handleOnload={handleOnload}
                  postcardSize={details?.postcardSize}
                  ref={onFrontChange}
                  reloadPending={reloadIframesPending}
                />
                <BackIframe
                  campaignId={details?._id}
                  backLoaded={backLoaded}
                  backURL={backURL}
                  handleOnload={handleOnload}
                  postcardSize={details?.postcardSize}
                  ref={onBackChange}
                  reloadPending={reloadIframesPending}
                />
              </EditorPreview>
            )}
          </EditorContent>
        </EditorLayout>
      ) : (
        <Loader active />
      )}
    </>
  );
}
