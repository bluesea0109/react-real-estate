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
// eslint-disable-next-line
import cssText from '!!raw-loader!./iframeStyles.css';
import EditorSidebar from './EditorSidebar';
import {
  setCustomCtaOpen,
  setLiveEditBrandColor,
  setLiveEditFields,
  setReloadIframes,
  setReloadIframesPending,
  setReplaceFieldData,
  setSelectedPhoto,
  setSidebarOpen,
  setBigPhoto,
  setEditingElement,
  setEditingPage,
  setStencilEdits,
  setCurrentStyles,
  resetLiveEdit,
} from '../../store/modules/liveEditor/actions';
import { CampaignNameDiv, EditorContent, EditorLayout, EditorPreview } from './StyledComponents';
import EditorToolbar from './EditorToolbar';
import { calcMargin } from './utils/utils';
import { sleep } from '../../components/utils/utils';

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
  const replaceFieldData = useSelector(state => state.liveEditor?.replaceFieldData);
  const liveEditorChanges = useSelector(state => state.liveEditor?.edits);
  const sidebarOpen = useSelector(state => state.liveEditor?.sidebarOpen);
  const selectedPhoto = useSelector(state => state.liveEditor?.selectedPhoto);
  const bigPhoto = useSelector(state => state.liveEditor?.bigPhoto);
  const zoomValue = useSelector(state => state.liveEditor?.zoomValue);
  const editingPage = useSelector(state => state.liveEditor?.editingPage);
  const stencilEdits = useSelector(state => state.liveEditor?.edits?.stencilEdits);
  const rotation = useSelector(state => state.liveEditor?.rotation);
  const [activeNavItem, setActiveNavItem] = useState(1);
  const [frontLoaded, setFrontLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);
  const [colorPickerVal, setColorPickerVal] = useState(mailoutEdit?.brandColor);
  const [frontIframeRef, setFrontIframeRef] = useState(null);
  const [backIframeRef, setBackIframeRef] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const customCTA = useSelector(state => state.mailout?.details?.cta);
  const isCTAHidden = useSelector(state => state.mailout?.mailoutEdit?.ctas?.hideCTA);
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

  let rotateStyle = `${rotation}deg`;

  // set the stencilEdits on load
  useEffect(() => {
    if (mailoutEdit?.stencilEdits?.elements?.length)
      dispatch(setStencilEdits(mailoutEdit.stencilEdits.elements));
  }, [dispatch, mailoutEdit]);

  useEffect(() => {
    const deselectPhoto = e => {
      if (e.key === 'Escape') {
        dispatch(setSelectedPhoto(''));
        dispatch(setBigPhoto(''));
      }
    };
    document.addEventListener('keyup', deselectPhoto);
    return () => {
      document.removeEventListener('keyup', deselectPhoto);
      dispatch(resetLiveEdit());
    };
  }, [dispatch]);

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
    if (isCTAHidden) {
      setHideCTA(true);
    }
  }, [isCTAHidden]);

  // reload the iframes when true in redux store
  useEffect(() => {
    if (!reloadIframes) return;
    let frontIframe = frontIframeRef || document.getElementById('bm-iframe-front');
    let backIframe = backIframeRef || document.getElementById('bm-iframe-back');
    if (
      (reloadIframes === 'front' || reloadIframes === true) &&
      frontIframe?.contentWindow?.location
    ) {
      setFrontLoaded(false);
      frontIframe.contentWindow.location.reload();
    }
    if (
      (reloadIframes === 'back' || reloadIframes === true) &&
      backIframe?.contentWindow?.location
    ) {
      setBackLoaded(false);
      backIframe.contentWindow.location.reload();
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

  // replace the field data without reload when true in redux store
  useEffect(() => {
    if (replaceFieldData) {
      sendPostMessage('front', { type: 'updateAllFields', replaceFieldData });
      sendPostMessage('back', { type: 'updateAllFields', replaceFieldData });
      dispatch(setReplaceFieldData(false));
      dispatch(setReloadIframesPending(false));
    }
  }, [dispatch, replaceFieldData, mailoutEdit, sendPostMessage]);

  // send a postMessage to the iframe when the selected photo changes
  useEffect(() => {
    let photo = '';
    bigPhoto ? (photo = bigPhoto) : (photo = selectedPhoto);
    sendPostMessage('front', { type: 'imageSelected', imgSrc: photo });
    sendPostMessage('back', { type: 'imageSelected', imgSrc: photo });
  }, [selectedPhoto, sendPostMessage, bigPhoto]);

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

  const showCTA = () => {
    sendPostMessage('front', { type: 'cta', CTA: 'briv.it/123' });
    sendPostMessage('back', { type: 'cta', CTA: 'briv.it/123' });
  };

  const handlePostMessage = useCallback(
    e => {
      if (e.data?.resetSelectedPhoto) dispatch(setSelectedPhoto(''));
      if (e.data?.type === 'setEditing') {
        dispatch(setEditingElement(e.data.id));
        dispatch(setCurrentStyles(e.data.currentStyles));
        dispatch(setEditingPage(e.source?.frameElement?.name));
      }
      if (e.source?.frameElement?.title?.includes('bm-iframe')) {
        let newFields = [];
        if (!liveEditorChanges.fields && Array.isArray(mailoutEdit?.fields)) {
          newFields = [...mailoutEdit?.fields];
        } else if (Array.isArray(liveEditorChanges?.fields))
          newFields = [...liveEditorChanges?.fields];
        if (!newFields) return;
        const side = e.source?.name;
        if (e.data.name) {
          const changedInd = newFields.findIndex(el => el.name === e.data.name);
          if (changedInd === -1) {
            console.log('Adding new field: ' + e.data.name);
            newFields.push({
              name: e.data.name,
              sides: [side],
              value: e.data.value,
            });
          } else newFields[changedInd].value = e.data.value;
          dispatch(setLiveEditFields(newFields));
        }
      }
    },
    [dispatch, mailoutEdit, liveEditorChanges]
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
      let styleElement = document.createElement('style');
      styleElement.innerHTML = cssText;
      await frame.document.head.append(styleElement);
      if (name === 'front') {
        setFrontLoaded(true);
      }

      if (name === 'back') {
        setBackLoaded(true);
      }
    },
    [setFrontLoaded, setBackLoaded]
  );

  useEffect(() => {
    sendPostMessage(editingPage === 'front' ? 'back' : 'front', { type: 'resetSelected' });
    if (stencilEdits.length && editingPage) {
      const fullCssString = stencilEdits.reduce((acc, el) => {
        if (el.cssPartial) {
          return (acc += el.cssPartial);
        } else return '';
      }, '');
      sendPostMessage(editingPage, { type: 'customStyles', fullCssString });
    }
  }, [editingPage, stencilEdits, sendPostMessage]);

  const handleSave = async ({
    postcardSize,
    mailoutDisplayAgent,
    templateTheme,
    frontImgUrl,
    frontResourceUrl,
    backResourceUrl,
  }) => {
    if (customizeCTA && invalidCTA) {
      setActiveNavItem(1);
      dispatch(setCustomCtaOpen(true));
      return;
    }
    if (postcardSize || mailoutDisplayAgent || templateTheme || frontResourceUrl || backResourceUrl)
      dispatch(setReloadIframesPending(true));
    const newData = {};
    if (postcardSize) newData.postcardSize = postcardSize;
    if (templateTheme) newData.templateTheme = templateTheme;
    if (frontImgUrl) {
      sendPostMessage('front', {
        type: 'switchImageUrl',
        imageTitle: 'frontImgUrl',
        newUrl: frontImgUrl,
      });
      newData.frontImgUrl = frontImgUrl;
    }
    if (frontResourceUrl) newData.frontResourceUrl = frontResourceUrl;
    if (backResourceUrl) newData.backResourceUrl = backResourceUrl;
    if (newCampaignName) newData.name = newCampaignName;
    const { fields, brandColor } = liveEditorChanges;
    if (fields) newData.fields = fields;
    if (brandColor) newData.brandColor = brandColor;
    if (customizeCTA) newData.ctas = { cta: newCTA, shortenCTA: true, hideCTA: false };
    else if (hideCTA) newData.ctas = { cta: newCTA, hideCTA: true };
    else newData.ctas = { dontOverride: true };
    if (stencilEdits.length) newData.stencilEdits = { elements: stencilEdits };
    dispatch(updateMailoutEditPending({ newData, mailoutDisplayAgent }));
    setEditingName(false);
  };

  const navItems = [
    { name: 'Templates', iconName: 'layers' },
    { name: 'Editor', iconName: 'edit outline' },
    { name: 'Uploads', iconName: 'cloud upload' },
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
              {/* <Icon name="undo" />
              <ButtonNoStyle>
                <div className="overflow-menu">
                  <Icon name="ellipsis horizontal" />
                </div>
              </ButtonNoStyle> */}
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
                tooltip={item.name}
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
            showCTA={showCTA}
          />
          <EditorContent>
            <EditorToolbar />
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
                  scale={zoomValue}
                  rotate={rotateStyle}
                  margin={calcMargin(details?.postcardSize, rotation, zoomValue)}
                />
                <BackIframe
                  campaignId={details?._id}
                  backLoaded={backLoaded}
                  backResourceUrl={details?.backResourceUrl || null}
                  backURL={backURL}
                  handleOnload={handleOnload}
                  postcardSize={details?.postcardSize}
                  ref={onBackChange}
                  reloadPending={reloadIframesPending}
                  scale={zoomValue}
                  rotate={rotateStyle}
                  margin={calcMargin(details?.postcardSize, rotation, zoomValue)}
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
