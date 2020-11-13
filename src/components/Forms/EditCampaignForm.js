import _ from 'lodash';
import startCase from 'lodash/startCase';
import { BlockPicker, ChromePicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import React, { createRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Dropdown, Form, Header, Label, Popup, Checkbox } from 'semantic-ui-react';

import auth from '../../services/auth';
import api from '../../services/api';
import {
  ContentBottomHeaderLayout,
  ContentTopHeaderLayout,
  ItemHeaderLayout,
  ItemHeaderMenuLayout,
} from '../../layouts';
import {
  changeMailoutDisplayAgentPending,
  updateMailoutEditPending,
} from '../../store/modules/mailout/actions';
import {
  differenceObjectDeep,
  maxLength,
  objectIsEmpty,
  sleep,
  postcardDimensions,
} from '../utils/utils';
import { Button, Icon, Image, Menu, Message, Page, Segment, Snackbar } from '../Base';
import { StyledHeader, colors } from '../utils/helpers';
import PageTitleHeader from '../PageTitleHeader';
import Loading from '../Loading';
import { useIsMobile } from '../Hooks/useIsMobile';
import { useWindowSize } from '../Hooks/useWindowSize';
import { calculateCost, resolveLabelStatus } from '../MailoutListItem/utils/helpers';
import PostcardSizeButton from './Common/PostcardSizeButton';
import styled from 'styled-components';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import * as brandColors from '../utils/brandColors';

const blacklistNames = [
  'brandColor',
  'frontImgUrl',
  'agentPicture',
  'brokerageLogo',
  'teamLogo',
  'backUrl',
  'frontAgentUrl',
];

const CoverButtonGroup = styled(Button.Group)`
  height: 40px;
  &&& .button {
    min-width: 0px;
    width: 50px;
    flex-grow: 0;
    &:hover,
    &:active,
    &:focus {
      background-color: #cacbcd;
    }
  }
`;

const CustomSlide = styled(Slide)`
  && {
    padding-bottom: 225px !important;
  }
`;

const SliderButtons = styled.div`
  position: relative;
  & .back-button,
  & .next-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  & .back-button {
    left: -0.5em;
  }
  & .next-button {
    right: -0.5em;
  }
`;

const sliderButtonStyles = {
  color: 'grey',
  border: 'none',
  padding: 0,
  font: 'inherit',
  cursor: 'pointer',
  outline: 'inherit',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const StyledButtonBack = styled(ButtonBack)`
  width: 3em;
  height: 3em;
  border-radius: 3em;
  background-color: transparent;
  & i {
    margin: 0;
    transform: translateX(-1px);
  }
  &:hover {
    background-color: ${brandColors.lightGreyHover};
  }
`;

const StyledButtonNext = styled(ButtonNext)`
  width: 3em;
  height: 3em;
  border-radius: 3em;
  background-color: transparent;
  & i {
    margin: 0;
    transform: translateX(1px);
  }
  &:hover {
    background-color: ${brandColors.lightGreyHover};
  }
`;

const NewLabel = styled.div`
  max-width: 260px;
  margin: auto;
  padding-top: 0.5em;
  & .label {
    background-color: ${brandColors.secondary};
    border-radius: 500px;
    padding: 2px 12px;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
  }
`;

const optionsContainerStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
};

const customCampaignContainer = {
  display: 'flex',
  flexWrap: 'wrap',
};

const postcardContainer = {
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1rem',
};

const mobilePostcardContainer = {
  margin: 'auto',
  marginTop: '0px',
};


const EditCampaignForm = ({ mailoutDetails, mailoutEdit, handleBackClick }) => {
  const isMobile = useIsMobile();
  const windowSize = useWindowSize();
  const [sliderWidth, setsliderWidth] = useState(0);
  const sliderRef = useRef(null);
  useLayoutEffect(
    _ => {
      setsliderWidth(sliderRef.current ? sliderRef.current.offsetWidth : 0);
    },
    // eslint-disable-next-line
    [windowSize]
  );
  const peerId = useSelector(store => store.peer.peerId);
  const dispatch = useDispatch();
  const bookmarkTemplate = useSelector(store => store.templates.available?.bookmark);
  const ribbonTemplate = useSelector(store => store.templates.available?.ribbon);
  const stackTemplate = useSelector(store => store.templates.available?.stack);
  const stencilsAvailable = useSelector(store => store.templates.available?.stencils);
  const onLoginMode = useSelector(store => store.onLogin?.mode);
  const multiUser = onLoginMode === 'multiuser';

  const updateMailoutEditIsPending = useSelector(store => store.mailout.updateMailoutEditPending);
  const updateMailoutEditError = useSelector(
    store => store.mailout.updateMailoutEditError?.message
  );
  const changeDisplayAgentPending = useSelector(store => store.mailout.changeDisplayAgentPending);
  const changeDisplayAgentError = useSelector(
    store => store.mailout.changeDisplayAgentError?.message
  );

  const teammates = useSelector(store => store.team.profiles);

  const currentListingStatus = mailoutDetails?.listingStatus;
  let renderFrontDetails = true;
  let renderBackDetails = true;
  if (mailoutDetails.frontResourceUrl) renderFrontDetails = false;
  if (mailoutDetails.backResourceUrl) renderBackDetails = false;

  const currentPostcardSize = mailoutDetails?.postcardSize;
  const currentTemplateTheme = mailoutDetails?.templateTheme;
  const currentMailoutDisplayAgentUserID = mailoutDetails.mailoutDisplayAgent
    ? mailoutDetails.mailoutDisplayAgent?.userId
    : mailoutDetails.userId;
  const currentMailoutDisplayAgent = mailoutDetails.mailoutDisplayAgent || {
    userId: mailoutDetails.userId,
  };

  const [error, setError] = useState(null);

  const [postcardSize, setPostcardSize] = useState(currentPostcardSize);
  const [templateTheme, setTemplateTheme] = useState(currentTemplateTheme);
  const [selectedBrandColor, setSelectedBrandColor] = useState(
    mailoutEdit?.mergeVariables?.brandColor
  );
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [tempColor, setTempColor] = useState(mailoutEdit?.mergeVariables?.brandColor);
  const [mailoutDisplayAgent, setMailoutDisplayAgent] = useState(currentMailoutDisplayAgent);
  const [formValues, setFormValues] = useState(mailoutEdit?.mergeVariables);

  let _coverPhotoMv = _.get(mailoutDetails, 'mergeVariables', []).find(
    mv => mv.name === 'frontImgUrl'
  );
  let _coverPhoto = _.get(_coverPhotoMv, 'value', _.get(mailoutDetails, 'details.coverPhoto'));

  const [coverPhoto, setCoverPhoto] = useState(_coverPhoto);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState(0);
  const [photoUpdating, setPhotoUpdating] = useState(false);

  //const defaultCTAUrl = useSelector(store => store.)
  const [ctaUrl, setCtaUrl] = useState(mailoutDetails.cta);
  const [shortenCTA, setShortenCTA] = useState(mailoutDetails.shortenCTA);
  const defaultCTAUrl = useSelector(store => {
    let bestCta = mailoutDetails.cta;
    if (!bestCta) bestCta = store.onLogin.userBranding[currentListingStatus]?.cta;
    if (!bestCta) bestCta = store.onLogin.teamBranding[currentListingStatus]?.cta;
    if (!bestCta) bestCta = store.onLogin.teamProfile.website;
    if (!bestCta) return 'https://www.google.com';
    return bestCta;
  });

  const popover = {
    position: 'absolute',
    zIndex: '11',
    top: '125px',
  };
  const cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  };
  const handleColorPickerClick = () => setDisplayColorPicker(!displayColorPicker);
  const handleColorPickerClose = () => {
    setDisplayColorPicker(false);
    setSelectedBrandColor(tempColor);
  };

  /* This is a hack to enable fields to updated while enabling use to edit them as well
   * TODO: find a more permanents (correct) solution to this problem */
  const [formValuesHaveChanged, setFormValuesHaveChanged] = useState(false);
  useEffect(() => {
    let isInitialized = true;

    async function delaySwitchOn() {
      await sleep(1000);
      if (isInitialized) {
        setFormValuesHaveChanged(true);
      }
    }

    async function delaySwitchOff() {
      await sleep(1000);
      if (isInitialized) {
        setFormValuesHaveChanged(false);
      }
    }

    if (updateMailoutEditIsPending || changeDisplayAgentPending) {
      delaySwitchOn();
    } else {
      delaySwitchOff();
    }

    return () => (isInitialized = false);
  }, [updateMailoutEditIsPending, changeDisplayAgentPending, setFormValuesHaveChanged]);

  useEffect(() => {
    const diff = differenceObjectDeep(formValues, mailoutEdit.mergeVariables);

    if (!objectIsEmpty(diff) && formValuesHaveChanged) {
      setFormValues(mailoutEdit.mergeVariables);
    }
  }, [mailoutEdit.mergeVariables, formValues, setFormValues, formValuesHaveChanged]);

  const triggerFileDialog = () => document.getElementById('postcardCoverFile').click();

  const handleFileChange = async e => {
    const file = e.target.files[0];
    // do some checking
    if (!file) return;
    let ok = false;
    if (file.type === 'image/png') ok = true;
    if (file.type === 'image/jpeg') ok = true;
    if (!ok) return setError('File needs to be a jpg or png');

    const formData = new FormData();
    formData.append('listingPhoto', file);
    try {
      setPhotoUpdating(true);
      let path = `/api/user/mailout/${mailoutDetails._id}/edit/listingPhoto/resize`;
      if (peerId)
        path = `/api/user/peer/${peerId}/mailout/${mailoutDetails._id}/edit/listingPhoto/resize`;

      const headers = {};
      const accessToken = await auth.getAccessToken();
      headers['authorization'] = `Bearer ${accessToken}`;
      const response = await fetch(path, {
        headers,
        method: 'post',
        body: formData,
        credentials: 'include',
      });
      let { imageUrl } = await api.handleResponse(response);
      setTimeout(() => {
        setCoverPhoto(imageUrl);
        setPhotoUpdating(false);
      }, 1000);
    } catch (e) {
      setPhotoUpdating(false);
      setError(e.message);
    }
  };

  const changeCoverPhotoInc = () => {
    let length = _.get(mailoutDetails, 'raw.photos.length');
    let currentPhoto = _.get(mailoutDetails, 'details.coverPhoto');
    let daIndex = coverPhotoIndex + 1;
    if (daIndex >= length) daIndex = 0;
    setCoverPhotoIndex(daIndex);
    let imageUrl = currentPhoto.replace(/\/\d+\.jpg/, `/${daIndex}.jpg`);
    setCoverPhoto(imageUrl);
  };

  const changeCoverPhotoDec = () => {
    let length = _.get(mailoutDetails, 'raw.photos.length');
    let currentPhoto = _.get(mailoutDetails, 'details.coverPhoto');
    let daIndex = coverPhotoIndex - 1;
    if (daIndex < 0) daIndex = length - 1;
    setCoverPhotoIndex(daIndex);
    let imageUrl = currentPhoto.replace(/\/\d+\.jpg/, `/${daIndex}.jpg`);
    setCoverPhoto(imageUrl);
  };

  const handleEditSubmitClick = async () => {
    const newMergeVariables = [];
    newMergeVariables.push({
      name: 'brandColor',
      value: selectedBrandColor.hex || selectedBrandColor,
    });
    newMergeVariables.push({ name: 'frontImgUrl', value: coverPhoto });

    Object.keys(formValues)
      .filter(key => key !== 'brandColor' && key !== 'frontImgUrl')
      .forEach(key => newMergeVariables.push({ name: key, value: formValues[key] }));

    const newData = Object.assign(
      {},
      { postcardSize },
      { templateTheme },
      { mergeVariables: mailoutEdit?.mergeVariables },
      { mergeVariables: newMergeVariables },
      { mailoutDisplayAgent } // add the   "ctas" object here
    );
    if (ctaUrl) {
      newData.ctas = {
        cta: ctaUrl,
        shortenCTA: shortenCTA,
      };
    } else {
      newData.ctas = { dontOverride: true };
    }

    dispatch(updateMailoutEditPending(newData));
    await sleep(500);
    handleBackClick();
  };

  const profiles = [];

  if (teammates.length > 0) {
    teammates.map((profile, index) => {
      const setupComplete = profile.doc.setupComplete;
      const currentUser = profile.userId === currentMailoutDisplayAgentUserID;
      const fullName = `${profile.first} ${profile.last}`;

      const contextRef = createRef();
      const currentUserIconWithPopup = (
        <Popup
          context={contextRef}
          content="Currently selected agent"
          trigger={<Icon name="user" />}
        />
      );
      const setupCompletedIconWithPopup = (
        <Popup
          context={contextRef}
          content="Setup Completed"
          trigger={<Icon name="check circle" color="teal" />}
        />
      );

      return profiles.push({
        key: index,
        first: profile.first,
        last: profile.last,
        text: fullName,
        value: profile.userId,
        content: (
          <StyledHeader as="h4" ref={contextRef}>
            <Image
              size="mini"
              inline
              circular
              src="https://react.semantic-ui.com/images/avatar/large/patrick.png"
            />
            &nbsp;
            {profile.first}&nbsp;
            {profile.last}&nbsp;
            {currentUser ? currentUserIconWithPopup : null}
            {setupComplete ? setupCompletedIconWithPopup : null}
          </StyledHeader>
        ),
      });
    });
  }

  const renderPostcardSize = (size = '4x6', place) => {
    let margins = '';
    switch (place) {
      case 'left':
        margins = '1em 1em 1em 0em';
        break;
      case 'right':
        margins = '1em 0em 1em 1em';
        break;
      default:
        margins = '1em 1em 1em 1em';
    }

    if (windowSize.width < 620) {
      margins = '1em';
    }

    return (
      <div style={{ margin: margins, width: '118px', height: '84px' }}>
        <input
          type="radio"
          checked={postcardSize === size}
          value={size}
          onChange={(e, { value }) => setPostcardSize(postcardDimensions(value))}
          style={{ visibility: 'hidden', display: 'none' }}
        />
        <div
          onClick={e => setPostcardSize(postcardDimensions(size))}
          style={
            postcardSize === postcardDimensions(size)
              ? {
                  border: '2px solid #59C4C4',
                  margin: 0,
                  padding: '0.5em',
                  borderRadius: '5px',
                  height: '100%',
                }
              : {
                  border: '1px solid lightgray',
                  margin: 0,
                  padding: '0.5em',
                  borderRadius: '5px',
                  height: '100%',
                }
          }
        >
          <PostcardSizeButton postcardSize={size} />
        </div>
        <div style={{ textAlign: 'center', padding: '0.5rem' }}>{`${calculateCost(
          1,
          size
        )}/each`}</div>
      </div>
    );
  };

  const renderTemplatePicture = (templateName, src, isNew = false) => {
    const resolveSource = type => {
      const types = {
        ribbon: require('../../assets/ribbon-preview.png'),
        bookmark: require('../../assets/bookmark-preview.png'),
        stack: require('../../assets/stack-preview.png'),
        undefined: null,
      };
      return type ? types[type] : types['undefined'];
    };

    return (
      <div style={{ margin: '1em', position: 'relative' }}>
        <input
          type="radio"
          checked={templateTheme === templateName}
          value={templateName}
          onChange={(e, { value }) => setTemplateTheme(value)}
          style={{ visibility: 'hidden', display: 'none' }}
        />
        <div
          style={
            templateTheme === templateName
              ? {
                  border: `2px solid ${brandColors.primary}`,
                  margin: 'auto',
                  padding: '0.5em',
                  borderRadius: '5px',
                  maxWidth: '260px',
                }
              : {
                  border: '1px solid lightgray',
                  margin: 'auto',
                  padding: '0.5em',
                  borderRadius: '5px',
                  maxWidth: '260px',
                }
          }
        >
          <img
            onClick={e => setTemplateTheme(templateName)}
            src={src ? src : resolveSource(templateName)}
            alt={templateName}
          />
        </div>
        {isNew && (
          <NewLabel>
            <span className="label">New</span>
          </NewLabel>
        )}
      </div>
    );
  };

  const handleAgentChange = (e, input) => {
    const selectedAgent = input.options.filter(o => o.value === input.value)[0];
    const { first, last, value } = selectedAgent;

    setMailoutDisplayAgent({ userId: value, first, last });
    dispatch(changeMailoutDisplayAgentPending(value));
  };

  const handleInputChange = (value, name) => {
    const newValues = Object.assign({}, formValues, { [name]: value });
    setFormValues(newValues);
  };

  const renderThemeSpecificData = side => {
    switch (templateTheme) {
      case 'ribbon':
        const ribbonFields = ribbonTemplate[currentListingStatus].fields
          .filter(field => {
            let passes = true;
            if (blacklistNames.includes(field.name)) passes = false;
            if (side && field.sides && !_.includes(field.sides, side)) passes = false;
            return passes;
          })
          .map(field => {
            let fieldName = startCase(field.name);
            const error = maxLength(field.max)(formValues[field.name]);
            // console.log(field);

            if (fieldName.includes('Url')) fieldName = fieldName.replace(/Url/g, 'URL');
            if (fieldName.includes('Cta')) fieldName = fieldName.replace(/Cta/g, 'CTA');

            return (
              <Form.Field
                key={formValuesHaveChanged ? formValues[field.name] || fieldName : fieldName}
              >
                <Form.Input
                  fluid
                  error={error && { content: error }}
                  label={fieldName}
                  placeholder={field.default}
                  type={field.type}
                  onChange={(e, input) => handleInputChange(input.value, field.name)}
                  defaultValue={formValues[field.name]}
                />
              </Form.Field>
            );
          });

        return (
          <Form color="green">
            <Segment basic padded className={isMobile ? null : 'secondary-grid-container'}>
              {ribbonFields}
            </Segment>
          </Form>
        );

      case 'bookmark':
        const bookmarkFields = bookmarkTemplate[currentListingStatus].fields
          .filter(field => {
            let passes = true;
            if (blacklistNames.includes(field.name)) passes = false;
            if (side && field.sides && !_.includes(field.sides, side)) passes = false;
            return passes;
          })
          .map(field => {
            let fieldName = startCase(field.name);
            const error = maxLength(field.max)(formValues[field.name]);

            if (fieldName.includes('Url')) fieldName = fieldName.replace(/Url/g, 'URL');
            if (fieldName.includes('Cta')) fieldName = fieldName.replace(/Cta/g, 'CTA');

            return (
              <Form.Field
                key={formValuesHaveChanged ? formValues[field.name] || fieldName : fieldName}
              >
                <Form.Input
                  fluid
                  error={error && { content: error }}
                  label={fieldName}
                  placeholder={field.default}
                  type={field.type}
                  onChange={(e, input) => handleInputChange(input.value, field.name)}
                  defaultValue={formValues[field.name]}
                />
              </Form.Field>
            );
          });

        return (
          <Form color="green">
            <Segment basic padded className={isMobile ? null : 'secondary-grid-container'}>
              {bookmarkFields}
            </Segment>
          </Form>
        );

      case 'stack':
        const stackFields = stackTemplate[currentListingStatus].fields
          .filter(field => {
            let passes = true;
            if (blacklistNames.includes(field.name)) passes = false;
            if (side && field.sides && !_.includes(field.sides, side)) passes = false;
            return passes;
          })
          .map(field => {
            let fieldName = startCase(field.name);
            const error = maxLength(field.max)(formValues[field.name]);

            if (fieldName.includes('Url')) fieldName = fieldName.replace(/Url/g, 'URL');
            if (fieldName.includes('Cta')) fieldName = fieldName.replace(/Cta/g, 'CTA');

            return (
              <Form.Field
                key={formValuesHaveChanged ? formValues[field.name] || fieldName : fieldName}
              >
                <Form.Input
                  fluid
                  error={error && { content: error }}
                  label={fieldName}
                  placeholder={field.default}
                  type={field.type}
                  onChange={(e, input) => handleInputChange(input.value, field.name)}
                  defaultValue={formValues[field.name]}
                />
              </Form.Field>
            );
          });

        return (
          <Form color="green">
            <Segment basic padded className={isMobile ? null : 'secondary-grid-container'}>
              {stackFields}
            </Segment>
          </Form>
        );

      default:
        const defaultFields = ribbonTemplate[currentListingStatus].fields
          .filter(field => {
            let passes = true;
            if (blacklistNames.includes(field.name)) passes = false;
            if (side && field.sides && !_.includes(field.sides, side)) passes = false;
            return passes;
          })
          .map(field => {
            let fieldName = startCase(field.name);
            const error = maxLength(field.max)(formValues[field.name]);
            // console.log(field);

            if (fieldName.includes('Url')) fieldName = fieldName.replace(/Url/g, 'URL');
            if (fieldName.includes('Cta')) fieldName = fieldName.replace(/Cta/g, 'CTA');

            return (
              <Form.Field
                key={formValuesHaveChanged ? formValues[field.name] || fieldName : fieldName}
              >
                <Form.Input
                  fluid
                  error={error && { content: error }}
                  label={fieldName}
                  placeholder={field.default}
                  type={field.type}
                  onChange={(e, input) => handleInputChange(input.value, field.name)}
                  defaultValue={formValues[field.name]}
                />
              </Form.Field>
            );
          });

        return (
          <Form color="green">
            <Segment basic padded className={isMobile ? null : 'secondary-grid-container'}>
              {defaultFields}
            </Segment>
          </Form>
        );
    }
  };

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <Menu borderless fluid secondary>
            <Menu.Item>
              <Header as="h3">Campaign Edit</Header>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <Button
                  primary
                  inverted
                  onClick={() => handleBackClick()}
                  loading={updateMailoutEditIsPending || changeDisplayAgentPending}
                  disabled={updateMailoutEditIsPending || changeDisplayAgentPending}
                >
                  Back
                </Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>

      {error && <Snackbar error>{error}</Snackbar>}

      <Segment style={{ marginBottom: '1rem' }}>
        {currentPostcardSize !== postcardSize && (
          <Message negative style={{ margin: 0, display: 'flex', flexWrap: 'wrap' }}>
            <Message.Header style={{ flexShrink: 0, paddingRight: '1rem' }}>
              <Icon name="times circle" color="darkred"></Icon>Warning!
            </Message.Header>
            <Message.Content>
              Changing postcard size may change the aspect ratio of your cover photo. Please upload
              a cover photo according to the preferred size specified below.
            </Message.Content>
          </Message>
        )}
        <ContentBottomHeaderLayout>
          <ItemHeaderLayout attached="top" block>
            <span style={{ gridArea: 'label' }}>
              <Label
                size="large"
                color={resolveLabelStatus(currentListingStatus)}
                ribbon
                style={{ textTransform: 'capitalize', top: '-0.9em', left: '-2.7em' }}
              >
                {currentListingStatus}
              </Label>
            </span>
            <span style={{ gridArea: 'address', alignSelf: 'center' }}>
              <Header as="h3">
                {mailoutDetails.name || mailoutDetails?.details?.displayAddress}
              </Header>
            </span>

            <ItemHeaderMenuLayout>
              <span>
                <Button
                  primary
                  type="submit"
                  onClick={handleEditSubmitClick}
                  loading={updateMailoutEditIsPending || changeDisplayAgentPending}
                  disabled={updateMailoutEditIsPending || changeDisplayAgentPending}
                >
                  Save
                </Button>
              </span>
            </ItemHeaderMenuLayout>
          </ItemHeaderLayout>

          {updateMailoutEditIsPending && <Loading message="Saving campaign..." />}

          {!!updateMailoutEditError && (
            <Message negative>
              <Message.Header>We're sorry, something went wrong.</Message.Header>
              <p>{updateMailoutEditError}</p>
            </Message>
          )}

          {changeDisplayAgentPending && <Loading message="Updating postcard details..." />}

          {!!changeDisplayAgentError && (
            <Message negative>
              <Message.Header>We're sorry, something went wrong.</Message.Header>
              <p>{changeDisplayAgentError}</p>
            </Message>
          )}
        </ContentBottomHeaderLayout>

        {currentListingStatus !== 'custom' && (
          <Segment basic padded style={{}}>
            <Header as="h4">Template Theme</Header>
            <CarouselProvider
              naturalSlideWidth={130}
              naturalSlideHeight={100}
              totalSlides={stencilsAvailable?.length + 3 || 3}
              visibleSlides={sliderWidth > 320 ? Math.floor(sliderWidth / 320) : 1}
              step={1}
              infinite={true}
            >
              <SliderButtons ref={sliderRef}>
                <Slider>
                  <CustomSlide index={0}>
                    <div>{renderTemplatePicture('bookmark')}</div>
                  </CustomSlide>
                  <CustomSlide index={1}>
                    <div>{renderTemplatePicture('ribbon')}</div>
                  </CustomSlide>
                  <CustomSlide index={2}>
                    <div>{renderTemplatePicture('stack')}</div>
                  </CustomSlide>
                  {stencilsAvailable &&
                    stencilsAvailable.map((stencil, ind) => (
                      <CustomSlide key={stencil.templateTheme} index={ind + 3}>
                        <div>
                          {renderTemplatePicture(
                            stencil.templateTheme,
                            stencil.thumbnail,
                            stencil.new
                          )}
                        </div>
                      </CustomSlide>
                    ))}
                </Slider>
                <StyledButtonBack style={sliderButtonStyles} className="back-button">
                  <Icon name="chevron left" size="large"></Icon>
                </StyledButtonBack>
                <StyledButtonNext style={sliderButtonStyles} className="next-button">
                  <Icon name="chevron right" size="large"></Icon>
                </StyledButtonNext>
              </SliderButtons>
            </CarouselProvider>
          </Segment>
        )}

        <Segment
          basic
          padded
          style={
            currentListingStatus !== 'custom' ? optionsContainerStyles : customCampaignContainer
          }
        >
          <div style={windowSize.width > 620 ? postcardContainer : mobilePostcardContainer}>
            {currentListingStatus !== 'custom' && (
              <>
                <Header as="h4">Postcard Size</Header>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {renderPostcardSize('4x6', 'left')}
                  {renderPostcardSize('6x9')}
                  {renderPostcardSize('6x11', 'right')}
                </div>
              </>
            )}
            {multiUser && (
              <div
                style={
                  currentListingStatus === 'custom'
                    ? { width: '260px', marginBottom: '40px' }
                    : { margin: '2rem 0' }
                }
              >
                <Header as="h4">Display Agent</Header>
                <Dropdown
                  placeholder="Select Display Agent"
                  fluid
                  selection
                  options={profiles}
                  value={mailoutDisplayAgent?.userId}
                  onChange={handleAgentChange}
                />
              </div>
            )}
          </div>
          <div style={{ padding: '0 1em', margin: 'auto', marginTop: '0px' }}>
            <Header as="h4">Brand Color</Header>
            <BlockPicker
              triangle="hide"
              width="200px"
              color={selectedBrandColor}
              colors={colors}
              onChange={setTempColor}
              onChangeComplete={value => setSelectedBrandColor(value) && setTempColor(value)}
            />
            <Icon
              id="brandColourPickerIcon"
              bordered
              link
              color="grey"
              name="eye dropper"
              onClick={handleColorPickerClick}
            />
            {displayColorPicker ? (
              <div style={popover}>
                <div style={cover} onClick={handleColorPickerClose} />
                <ChromePicker color={tempColor} onChange={value => setTempColor(value)} />
              </div>
            ) : null}
          </div>

          {!mailoutDetails.frontResourceUrl && (
            <div style={{ maxWidth: 350, padding: '0 1rem', margin: 'auto' }}>
              <Header as="h4">Cover Photo</Header>
              {photoUpdating && <span>Please wait...</span>}
              {!photoUpdating && (
                <div>
                  <img src={coverPhoto} alt="postcard cover" />
                  <br />
                  <div style={{ display: 'flex' }}>
                    <CoverButtonGroup icon>
                      <Button onClick={() => changeCoverPhotoDec()}>
                        <Icon name="angle left" />
                      </Button>
                      <Button onClick={() => changeCoverPhotoInc()}>
                        <Icon name="angle right" />
                      </Button>
                    </CoverButtonGroup>
                    <div style={{ paddingLeft: '0.5rem' }}>
                      <a href="#/ignore" onClick={triggerFileDialog} id="postcardUploadText">
                        Upload new cover photo
                      </a>
                      <br />
                      <span
                        style={
                          currentPostcardSize !== postcardSize
                            ? { color: '#9F3A38', fontWeight: 'bold' }
                            : {}
                        }
                      >
                        {postcardSize === '11x6'
                          ? '(preferred size: 3438x1485)'
                          : postcardSize === '9x6'
                          ? '(preferred size: 2060x1485)'
                          : '(preferred size: 1375x990)'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <input
                id="postcardCoverFile"
                name="postcardcover"
                type="file"
                onChange={handleFileChange}
              ></input>
            </div>
          )}
        </Segment>

        {renderFrontDetails && (
          <Header as="h4" style={{ marginLeft: '1.5em', marginBottom: '-0.5em' }}>
            Front Postcard details
          </Header>
        )}
        {renderFrontDetails && renderThemeSpecificData('front')}

        {renderBackDetails && (
          <Header as="h4" style={{ marginLeft: '1.5em', marginBottom: '-0.5em' }}>
            Back Postcard details
          </Header>
        )}
        {renderBackDetails && renderThemeSpecificData('back')}

        <div>
          <Header as="h4">Customize call to action URL</Header>
          <Form.Field>
            <Checkbox
              radio
              label="Don't Customize - use default"
              name="checkboxRadioGroup"
              value="this"
              checked={!ctaUrl}
              onClick={() => {
                setCtaUrl(false);
                setShortenCTA(false);
              }}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              radio
              label="Customize call to action URL - URL will be shortened and lead tracking enabled"
              name="checkboxRadioGroup"
              value="that"
              checked={ctaUrl && shortenCTA}
              onClick={() => {
                setCtaUrl(ctaUrl || defaultCTAUrl);
                setShortenCTA(true);
              }}
            />
          </Form.Field>
          {ctaUrl && (
            <div className="ui fluid input">
              <input
                type="text"
                placeholder="URL"
                value={ctaUrl}
                onChange={e => setCtaUrl(e.target.value)}
              />
            </div>
          )}
        </div>
      </Segment>
    </Page>
  );
};

export default EditCampaignForm;
