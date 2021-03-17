import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import {
  getMailoutEditPending,
  getMailoutPending,
  resetMailoutEditSuccess,
  updateMailoutEditPending,
} from '../../store/modules/mailout/actions';
import { Button, ButtonNoStyle, Icon, Loader, Input } from '../../components/Base';
import EditorHeader from './EditorHeader';
import EditorNav, { NavButton } from './EditorNav';
import { BackIframe, FrontIframe } from '../MailoutDetailsPage';
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import jsText from 'raw-loader!./iframeScript.js';
import EditorSidebar from './EditorSidebar';
import {
  setCustomCtaOpen,
  setLiveEditBrandColor,
  setLiveEditFields,
  setReloadIframes,
  setReloadIframesPending,
  setSidebarOpen,
} from '../../store/modules/liveEditor/actions';
import { sleep } from '../../components/utils/utils';
import {
  CampaignNameDiv,
  EditorContent,
  EditorLayout,
  EditorPreview,
  EditorToolbar,
} from './StyledComponents';

export default function Editor() {
  const dispatch = useDispatch();
  const mailoutId = useParams().mailoutId;
  const details = useSelector(store => store.mailout?.details);
  const mailoutEdit = useSelector(state => state.mailout?.mailoutEdit);
  const peerId = useSelector(store => store.peer?.peerId);
  const savePending = useSelector(state => state.mailout?.updateMailoutEditPending);
  const saveSuccess = useSelector(state => state.mailout?.updateMailoutEditSuccess);
  const reloadIframes = useSelector(state => state.liveEditor?.reloadIframes);
  const reloadIframesPending = useSelector(state => state.liveEditor?.reloadIframesPending);
  const liveEditorChanges = useSelector(state => state.liveEditor?.edits);
  const sidebarOpen = useSelector(state => state.liveEditor?.sidebarOpen);
  const [activeNavItem, setActiveNavItem] = useState(1); // 0 default - 1 for testing
  const [frontLoaded, setFrontLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);
  const [colorPickerVal, setColorPickerVal] = useState(mailoutEdit?.brandColor);
  const [frontIframeRef, setFrontIframeRef] = useState(null);
  const [backIframeRef, setBackIframeRef] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const customCTA = useSelector(state => state.mailout?.details?.cta);
  const currentListingStatus = details?.listingStatus;
  const defaultCTA = useSelector(store => {
    let bestCta = details?.cta;
    if (!bestCta) bestCta = store.onLogin?.userBranding?.[currentListingStatus]?.cta;
    if (!bestCta) bestCta = store.onLogin?.teamBranding?.[currentListingStatus]?.cta;
    if (!bestCta) bestCta = store.onLogin?.teamProfile?.website;
    if (!bestCta) return 'https://www.google.com';
    return bestCta;
  });
  const [customizeCTA, setCustomizeCTA] = useState(false);
  const [newCTA, setNewCTA] = useState(defaultCTA);
  const [invalidCTA, setInvalidCTA] = useState(false);
  const [hideCTA, setHideCTA] = useState(false);

  useEffect(() => {
    setNewCTA(customCTA || defaultCTA);
    setCustomizeCTA(customCTA?.length > 0);
  }, [customCTA, defaultCTA]);

  useEffect(() => {
    setNewCampaignName(details?.name || details?.details?.displayAddress);
  }, [details]);

  useEffect(() => {
    const showSaveStatus = async () => {
      await sleep(2500);
      dispatch(resetMailoutEditSuccess());
    };
    if (saveSuccess) {
      showSaveStatus();
    }
  }, [dispatch, saveSuccess]);

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
      if (side === 'front') {
        if (!frontIframeRef) {
          return document
            .getElementById('bm-iframe-front')
            ?.contentWindow?.postMessage(data, window.location.origin);
        }
        return frontIframeRef?.contentWindow?.postMessage(data, window.location.origin);
      } else if (side === 'back') {
        if (!backIframeRef) {
          return document
            .getElementById('bm-iframe-back')
            ?.contentWindow?.postMessage(data, window.location.origin);
        }
        return backIframeRef?.contentWindow?.postMessage(data, window.location.origin);
      }
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
    dispatch(setLiveEditBrandColor(colorPickerVal?.hex || ''));
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

  useEffect(() => {
    sendPostMessage('front', { type: 'hideCTA', hideCTA: hideCTA });
    sendPostMessage('back', { type: 'hideCTA', hideCTA: hideCTA });
  }, [hideCTA, sendPostMessage]);

  const handlePostMessage = useCallback(
    e => {
      if (e.source?.frameElement?.title?.includes('bm-iframe')) {
        if (!Array.isArray(mailoutEdit?.fields)) return;
        const side = e.source?.name;
        let newFields = [];
        newFields = [...mailoutEdit?.fields];
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
          dispatch(setLiveEditFields(newFields));
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

  const handleSave = async ({ postcardSize, mailoutDisplayAgent, templateTheme, frontImgUrl }) => {
    if (customizeCTA && invalidCTA) {
      setActiveNavItem(1);
      dispatch(setCustomCtaOpen(true));
      return;
    }
    if (postcardSize || mailoutDisplayAgent || templateTheme)
      dispatch(setReloadIframesPending(true));
    const newData = {};
    if (postcardSize) newData.postcardSize = postcardSize;
    if (mailoutDisplayAgent) newData.mailoutDisplayAgent = mailoutDisplayAgent;
    if (templateTheme) newData.templateTheme = templateTheme;
    if (frontImgUrl) {
      sendPostMessage('front', {
        type: 'switchImageUrl',
        imageTitle: 'frontImgUrl',
        newUrl: frontImgUrl,
      });
      newData.frontImgUrl = frontImgUrl;
    }
    if (newCampaignName) newData.name = newCampaignName;
    const { fields, brandColor } = liveEditorChanges;
    if (fields) newData.fields = fields;
    if (brandColor) newData.brandColor = brandColor;
    if (customizeCTA) newData.ctas = { cta: newCTA, shortenCTA: true, hideCTA: false };
    if (hideCTA) newData.ctas = { cta: newCTA, hideCTA: true };
    else newData.ctas = { cta: newCTA, hideCTA: false };
    console.log('newData', newData);
    dispatch(updateMailoutEditPending(newData));
    setEditingName(false);
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
    ? `/api/user/${details?.userId}/peer/${peerId}/mailout/${details?._id}/render/preview/html/back/edit?edit=true&showBleed=true&postagePlaceholder=true`
    : `/api/user/${details?.userId}/mailout/${details?._id}/render/preview/html/back/edit?edit=true&showBleed=true&postagePlaceholder=true`;

  return (
    <>
      {details ? (
        <EditorLayout sidebarOpen={sidebarOpen}>
          <EditorHeader>
            <div className="header-left">
              <ButtonNoStyle as={Link} to={`/postcards/${details?._id}`}>
                <Icon className="back-btn" name="chevron left" />
              </ButtonNoStyle>
              <CampaignNameDiv>
                {editingName ? (
                  <>
                    <Input
                      value={newCampaignName}
                      onChange={e => setNewCampaignName(e.target.value)}
                    ></Input>
                  </>
                ) : (
                  <>
                    <h1>{newCampaignName}</h1>
                    <ButtonNoStyle onClick={_ => setEditingName(true)}>
                      <Icon name="pencil" />
                    </ButtonNoStyle>
                  </>
                )}
              </CampaignNameDiv>
            </div>
            <div className="header-right">
              <div id="save-status">
                {savePending ? (
                  <>
                    <Icon name="cloud upload" />
                    <span>Saving changes</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <Icon name="checkmark" />
                    <span>Changes Saved</span>
                  </>
                ) : null}
              </div>
              <Icon name="undo" />
              <ButtonNoStyle>
                <div className="overflow-menu">
                  <Icon name="ellipsis horizontal" />
                </div>
              </ButtonNoStyle>
              <Button primary disabled={savePending} onClick={() => handleSave({})}>
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
                onClick={() => {
                  setActiveNavItem(ind);
                  dispatch(setSidebarOpen(true));
                }}
              />
            ))}
          </EditorNav>
          <EditorSidebar
            activeTab={navItems[activeNavItem].name}
            colorPickerVal={colorPickerVal}
            customCTA={customCTA}
            customizeCTA={customizeCTA}
            hideCTA={hideCTA}
            invalidCTA={invalidCTA}
            newCTA={newCTA}
            setCustomizeCTA={setCustomizeCTA}
            setHideCTA={setHideCTA}
            setInvalidCTA={setInvalidCTA}
            setNewCTA={setNewCTA}
            setColorPickerVal={setColorPickerVal}
            handleSave={handleSave}
            mailoutDetails={details}
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
