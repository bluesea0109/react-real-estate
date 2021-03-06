import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import styled from 'styled-components';
import {
  getMailoutEditPending,
  getMailoutPending,
  updateMailoutEditPending,
} from '../../store/modules/mailout/actions';
import * as brandColors from '../../components/utils/brandColors';
import { Button, ButtonNoStyle, Icon } from '../../components/Base';
import EditorHeader from './EditorHeader';
import EditorNav, { NavButton } from './EditorNav';
import { BackIframe, FrontIframe } from '../MailoutDetailsPage';
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import jsText from 'raw-loader!./iframeScript.js';
import EditorSidebar from './EditorSidebar';

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
  const mailoutEdit = useSelector(state => state.mailout.mailoutEdit);
  const peerId = useSelector(store => store.peer.peerId);
  const updatePending = useSelector(state => state.mailout.updateMailoutEditPending);
  const [activeNavItem, setActiveNavItem] = useState(0);
  const [frontLoaded, setFrontLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);
  const [postcardSize, setPostcardSize] = useState(null);
  const [templateTheme, setTemplateTheme] = useState(null);
  const [fields, setFields] = useState(null);
  const [brandColor, setBrandColor] = useState(null);
  const [mailoutDisplayAgent, setMailoutDisplayAgent] = useState(null);
  const [frontImgUrl, setFrontImgUrl] = useState(null);
  const [ctas, setCtas] = useState(null);
  const [colorPickerVal, setColorPickerVal] = useState(brandColor);

  useEffect(() => {
    setBrandColor(colorPickerVal?.hex);
  }, [colorPickerVal]);

  useEffect(() => {
    dispatch(getMailoutPending(mailoutId));
    dispatch(getMailoutEditPending(mailoutId));
  }, [dispatch, mailoutId]);

  useEffect(() => {
    if (mailoutEdit) {
      setPostcardSize(mailoutEdit.postcardSize);
      setTemplateTheme(mailoutEdit.templateTheme);
      setFields(mailoutEdit.fields);
      setBrandColor(mailoutEdit.brandColor);
      setFrontImgUrl(mailoutEdit.frontImgUrl || '');
      setMailoutDisplayAgent(mailoutEdit.mailoutDisplayAgent);
      setCtas(mailoutEdit.ctas);
    }
  }, [mailoutEdit]);

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
          'getAllEditableFieldsAsMergeVariables',
          'http://localhost:8082/'
        );
      else if (side === 'back')
        await backIframeRef?.contentWindow?.postMessage(
          'getAllEditableFieldsAsMergeVariables',
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

  const handlePostMessage = useCallback(
    e => {
      if (e.source?.frameElement?.title?.includes('bm-iframe')) {
        const side = e.source?.name;
        console.log(side);
        console.dir(e.data);
        if (e.data.name) {
          const changedInd = fields.findIndex(el => el.name === e.data.name);
          if (changedInd === -1) {
            console.log('Cannot find field: ' + e.data.name);
            if (e.data.name === 'agentFullName') {
              fields.push({
                name: e.data.name,
                sides: [side],
                value: e.data.value,
              });
            }
            return;
          }
          fields[changedInd].value = e.data.value;
        }
      }
    },
    [fields]
  );

  useEffect(() => {
    console.log('Listening for messages');
    window.addEventListener('message', handlePostMessage);
    return () => {
      console.log('Stopped listening for messages');
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

  const handleSave = () => {
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
          <Button primary disabled={updatePending} onClick={handleSave}>
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
      />
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
