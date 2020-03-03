import _ from 'lodash';
import Nouislider from 'nouislider-react';
import React, { Fragment, createRef, useEffect, useReducer, useState } from 'react';
import { BlockPicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Form, Label, Popup } from 'semantic-ui-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { isMobile, maxLength, popup, required, composeValidators, differenceObjectDeep, urlRegExp, keywordRegExp } from '../utils';
import { saveListedShortcodePending, saveSoldShortcodePending } from '../../store/modules/shortcode/actions';
import { saveCustomizationPending } from '../../store/modules/customization/actions';
import { ContentTopHeaderLayout } from '../../layouts';
import { Button, Header, Icon, Image, Menu, Modal, Page, Segment } from '../Base';
import FlipCard from '../FlipCard';
import Loading from '../Loading';
import PageTitleHeader from '../PageTitleHeader';
import { StyledHeader, colors } from '../helpers';

const formReducer = (state, action) => {
  return _.merge({}, state, action);
};

const NEW_LISTING = 'listed';
const SOLD_LISTING = 'sold';

const OLD_KWKLY_DEFAULT = 'Text KEYWORD to 59559 for details!';
const validURL = str => !urlRegExp.test(str) && 'URL is not valid';
const validKeyword = str => !keywordRegExp.test(str) && 'KEYWORD is not valid';
const isValidURL = str => !!urlRegExp.test(str);
const isValidKeyword = str => !!keywordRegExp.test(str);

let multiUserStartState;
let singleUserStartState;

const CustomizeForm = ({ customizationData, teamCustomizationData = null }) => {
  const dispatch = useDispatch();
  const bookmarkTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.bookmark);
  const ribbonTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.ribbon);
  const stackTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.stack);

  const resolveTemplateFieldValues = type => {
    const types = {
      ribbon: ribbonTemplate,
      bookmark: bookmarkTemplate,
      stack: stackTemplate,
    };
    return type ? types[type] : undefined;
  };

  const initialValues = {
    listed: {
      createMailoutsOfThisType: true,
      defaultDisplayAgent: {
        userId: null,
        first: null,
        last: null,
      },
      mailoutSize: 300,
      mailoutSizeMin: 100,
      mailoutSizeMax: 1000,
      templateTheme: 'bookmark',
      brandColor: colors[0],
      frontHeadline: bookmarkTemplate.listed.fields.filter(field => field.name === 'frontHeadline')[0],
      cta: null,
      shortenCTA: null,
      kwkly: null,
    },
    sold: {
      createMailoutsOfThisType: true,
      defaultDisplayAgent: {
        userId: null,
        first: null,
        last: null,
      },
      mailoutSize: 300,
      mailoutSizeMin: 100,
      mailoutSizeMax: 1000,
      templateTheme: 'bookmark',
      brandColor: colors[0],
      frontHeadline: bookmarkTemplate.sold.fields.filter(field => field.name === 'frontHeadline')[0],
      cta: null,
      shortenCTA: null,
      kwkly: null,
    },
  };

  const newListingShortenedURL = useSelector(store => store.shortcode && store.shortcode.listed);
  const newListingShortenedURLPending = useSelector(store => store.shortcode && store.shortcode.listedURLToShortenPending);
  const newListingShortenedURLError = useSelector(store => store.shortcode && store.shortcode.listedURLToShortenError);
  const soldListingShortenedURL = useSelector(store => store.shortcode && store.shortcode.sold);
  const soldListingShortenedURLPending = useSelector(store => store.shortcode && store.shortcode.soldURLToShortenPending);
  const soldListingShortenedURLError = useSelector(store => store.shortcode && store.shortcode.soldURLToShortenError);

  const onLoginUserId = useSelector(store => store.onLogin.user._id);
  const onLoginMode = useSelector(store => store.onLogin.mode);
  const teammates = useSelector(store => store.team.profiles);
  const peerId = useSelector(store => store.peer.peerId);

  const customizationPending = useSelector(store => store.customization && store.customization.pending);
  const customizationError = useSelector(store => store.customization && store.customization.error && store.customization.error.message);
  const postcardsPreviewIsPending = useSelector(store => store.postcards && store.postcards.pending);
  const postcardsPreviewError = useSelector(store => store.postcards && store.postcards.error && store.postcards.error.message);
  const postcardsPreview = useSelector(store => store.postcards && store.postcards.available);

  const multiUser = onLoginMode === 'multiuser';
  const singleUser = onLoginMode === 'singleuser';
  const profiles = [];

  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useReducer(formReducer, initialValues);
  const [formError, setFormError] = useState('');

  // const [showSelectionAlert, setShowSelectionAlert] = useState(false);

  const [displayReview, setDisplayReview] = useState(false);
  const [listedIsFlipped, setListedIsFlipped] = useState(false);
  const [soldIsFlipped, setSoldIsFlipped] = useState(false);

  let pristineState;
  if (multiUser) pristineState = _.isEqual(formValues, multiUserStartState);
  if (singleUser) pristineState = _.isEqual(formValues, singleUserStartState);

  useEffect(() => {
    if (!displayReview && postcardsPreviewIsPending) {
      setDisplayReview(true);
    }
  }, [displayReview, setDisplayReview, postcardsPreviewIsPending]);

  useEffect(() => {
    if (multiUser && customizationData && teamCustomizationData) {
      if (customizationData.listed && customizationData.listed.cta) {
        dispatch(saveListedShortcodePending(customizationData.listed.cta));
      } else {
        if (teamCustomizationData.listed && teamCustomizationData.listed.cta) {
          dispatch(saveListedShortcodePending(teamCustomizationData.listed.cta));
        }
      }

      if (customizationData.sold && customizationData.sold.cta) {
        dispatch(saveSoldShortcodePending(customizationData.sold.cta));
      } else {
        if (teamCustomizationData.sold && teamCustomizationData.sold.cta) {
          dispatch(saveSoldShortcodePending(teamCustomizationData.sold.cta));
        }
      }
    }

    if (singleUser && customizationData) {
      if (customizationData.listed && customizationData.listed.cta) {
        dispatch(saveListedShortcodePending(customizationData.listed.cta));
      }

      if (customizationData.sold && customizationData.sold.cta) {
        dispatch(saveSoldShortcodePending(customizationData.sold.cta));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customizationData, teamCustomizationData, dispatch]);

  useEffect(() => {
    if (multiUser && customizationData && teamCustomizationData) {
      const updatedFormValues = _.merge({}, formValues, teamCustomizationData, customizationData);
      delete updatedFormValues._rev;
      delete updatedFormValues._id;
      delete updatedFormValues.onboardingComplete;

      if (updatedFormValues.listed.kwkly === OLD_KWKLY_DEFAULT) {
        updatedFormValues.listed.kwkly = null;
      }

      if (updatedFormValues.sold.kwkly === OLD_KWKLY_DEFAULT) {
        updatedFormValues.sold.kwkly = null;
      }

      if (customizationData?.listed?.cta && customizationData?.listed?.shortenCTA) {
        updatedFormValues.listed.cta = customizationData.listed.cta;
        updatedFormValues.listed.shortenCTA = true;
      }

      if (customizationData?.listed?.kwkly && !customizationData?.listed?.shortenCTA) {
        updatedFormValues.listed.kwkly = customizationData.listed.kwkly;
      }

      if (customizationData?.sold?.cta && customizationData?.sold?.shortenCTA) {
        updatedFormValues.sold.cta = customizationData.sold.cta;
        updatedFormValues.sold.shortenCTA = true;
      }

      if (customizationData?.sold?.kwkly && !customizationData?.sold?.shortenCTA) {
        updatedFormValues.sold.kwkly = customizationData.sold.kwkly;
      }

      updatedFormValues.listed.createMailoutsOfThisType = true;
      updatedFormValues.sold.createMailoutsOfThisType = true;

      if (updatedFormValues.sold.kwkly) {
        if (updatedFormValues.sold.kwkly.includes('to 59559 for details!')) {
          updatedFormValues.sold.kwkly = updatedFormValues.sold.kwkly.split(' ')[1];
        }
      }

      if (updatedFormValues.listed.kwkly) {
        if (updatedFormValues.listed.kwkly.includes('to 59559 for details!')) {
          updatedFormValues.listed.kwkly = updatedFormValues.listed.kwkly.split(' ')[1];
        }
      }

      if (customizationData?.listed?.cta && customizationData?.listed?.shortenCTA) {
        updatedFormValues.listed.shortenCTA = true;
      }

      if (customizationData?.sold?.cta && customizationData?.sold?.shortenCTA) {
        updatedFormValues.sold.shortenCTA = true;
      }

      setFormValues(updatedFormValues);
      multiUserStartState = updatedFormValues;
    }

    if (singleUser && customizationData) {
      const updatedFormValues = _.merge({}, formValues, customizationData);
      delete updatedFormValues._rev;
      delete updatedFormValues._id;
      delete updatedFormValues.onboardingComplete;

      if (updatedFormValues.listed.kwkly === OLD_KWKLY_DEFAULT) {
        updatedFormValues.listed.kwkly = null;
      }
      updatedFormValues.listed.shortenCTA = !!customizationData.listed.cta;

      if (updatedFormValues.sold.kwkly === OLD_KWKLY_DEFAULT) {
        updatedFormValues.sold.kwkly = null;
      }
      updatedFormValues.sold.shortenCTA = !!customizationData.sold.cta;

      updatedFormValues.listed.createMailoutsOfThisType = true;
      updatedFormValues.sold.createMailoutsOfThisType = true;

      if (updatedFormValues.sold.kwkly) {
        if (updatedFormValues.sold.kwkly.includes('to 59559 for details!')) {
          updatedFormValues.sold.kwkly = updatedFormValues.sold.kwkly.split(' ')[1];
        }
      }

      if (updatedFormValues.listed.kwkly) {
        if (updatedFormValues.listed.kwkly.includes('to 59559 for details!')) {
          updatedFormValues.listed.kwkly = updatedFormValues.listed.kwkly.split(' ')[1];
        }
      }

      setFormValues(updatedFormValues);
      singleUserStartState = updatedFormValues;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customizationData, teamCustomizationData, setFormValues, dispatch]);

  // useEffect(() => {
  //   if (!formValues.listed.createMailoutsOfThisType && !formValues.sold.createMailoutsOfThisType) {
  //     setShowSelectionAlert(true);
  //   } else {
  //     setShowSelectionAlert(false);
  //   }
  // }, [formValues, setShowSelectionAlert]);

  const handleSubmit = () => {
    const allData = _.merge({}, customizationData, formValues);

    // We need to format KWKLY before we compare it to existing team settings
    if (isValidKeyword(allData.sold.kwkly) && allData.sold.kwkly) {
      allData.sold.kwkly = `Text ${allData.sold.kwkly} to 59559 for details!`;
    }

    if (isValidKeyword(allData.listed.kwkly) && allData.listed.kwkly) {
      allData.listed.kwkly = `Text ${allData.listed.kwkly} to 59559 for details!`;
    }

    const diffData = differenceObjectDeep(teamCustomizationData, allData);
    if (!diffData.listed.cta) delete diffData.listed.cta;
    if (!diffData.sold.cta) delete diffData.sold.cta;

    if (!diffData.listed.kwkly) delete diffData.listed.kwkly;
    if (!diffData.sold.kwkly) delete diffData.sold.kwkly;

    if (!diffData.listed.defaultDisplayAgent.userId) delete diffData.listed.defaultDisplayAgent;
    if (!diffData.sold.defaultDisplayAgent.userId) delete diffData.sold.defaultDisplayAgent;

    diffData.listed.createMailoutsOfThisType = true;
    diffData.sold.createMailoutsOfThisType = true;

    if (diffData.sold.hasOwnProperty('frontHeadline') && !diffData.sold.frontHeadline) {
      setFormError('Sold Listing Headline is missing');
      return null;
    }

    if (diffData.listed.hasOwnProperty('frontHeadline') && !diffData.listed.frontHeadline) {
      setFormError('New Listing Headline is missing');
      return null;
    }

    if (diffData.sold.shortenCTA || diffData.sold.hasOwnProperty('cta')) {
      if (!diffData.sold.cta) {
        setFormError('Sold Listing Call to action URL is missing');
        return null;
      }

      if (!isValidURL(diffData.sold.cta)) {
        setFormError('Sold Listing Call to action URL is not valid');
        return null;
      }

      if (!!soldListingShortenedURLError) {
        setFormError(`Sold Listing Call to action ${soldListingShortenedURLError.message}`);
        return null;
      }
    }

    if (diffData.listed.shortenCTA || diffData.listed.hasOwnProperty('cta')) {
      if (!diffData.listed.cta) {
        setFormError('New Listing Call to action URL is missing');
        return null;
      }

      if (!isValidURL(diffData.listed.cta)) {
        setFormError('New Listing Call to action URL is not valid');
        return null;
      }

      if (!!newListingShortenedURLError) {
        setFormError(`New Listing Call to action ${newListingShortenedURLError.message}`);
        return null;
      }
    }

    if ((diffData.sold.shortenCTA === false && !diffData.sold.hasOwnProperty('kwkly')) || diffData.sold.hasOwnProperty('kwkly')) {
      if (!diffData.sold.kwkly) {
        setFormError('Sold Listing KWKLY Call to Action Phrase is missing');
        return null;
      }

      // Since we formatted KWKLY before, we should validate original values only
      if (!isValidKeyword(formValues.sold.kwkly)) {
        setFormError('Sold Listing KWKLY Call to Action Phrase is not valid');
        return null;
      }
    }

    if (diffData.listed.shortenCTA === false && !diffData.listed.hasOwnProperty('kwkly') && diffData.listed.hasOwnProperty('kwkly')) {
      if (!diffData.listed.kwkly) {
        setFormError('New Listing KWKLY Call to Action Phrase is missing');
        return null;
      }

      // Since we formatted KWKLY before, we should validate original values only
      if (!isValidKeyword(formValues.listed.kwkly)) {
        setFormError('New Listing KWKLY Call to Action Phrase is not valid');
        return null;
      }
    }

    dispatch(saveCustomizationPending(diffData));
  };

  // const handleConfirm = listingType => {
  //   const newValue = formValues;
  //   newValue[listingType].createMailoutsOfThisType = true;
  //   setFormValues(newValue);
  // };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  if (teammates.length > 0) {
    teammates.map((profile, index) => {
      const setupComplete = profile.doc.setupComplete;
      const currentUser = profile.userId === onLoginUserId;
      const fullName = `${profile.first} ${profile.last}`;

      const contextRef = createRef();
      const currentUserIconWithPopup = <Popup context={contextRef} content="Currently selected agent" trigger={<Icon name="user" />} />;
      const setupCompletedIconWithPopup = <Popup context={contextRef} content="Setup Completed" trigger={<Icon name="check circle" color="teal" />} />;

      return profiles.push({
        key: index,
        first: profile.first,
        last: profile.last,
        text: fullName,
        value: profile.userId,
        content: (
          <StyledHeader as="h4" ref={contextRef}>
            <Image size="mini" inline circular src="https://react.semantic-ui.com/images/avatar/large/patrick.png" />
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

  const selectedPeer = () => {
    if (teammates.length > 0 && peerId) {
      return teammates.find(profile => profile.userId === peerId);
    } else {
      return null;
    }
  };

  // const renderSwitch = ({ listingType }) => {
  //   const targetOn = listingType === NEW_LISTING ? 'Generate new listing campaigns' : 'Generate sold listing campaigns';
  //
  //   const currentValue = formValues[listingType].createMailoutsOfThisType;
  //
  //   const handleChange = () => {
  //     const newValue = formValues;
  //     newValue[listingType].createMailoutsOfThisType = !currentValue;
  //
  //     // To ensure that we have cta or kwkly when switching
  //     if (newValue.listed.createMailoutsOfThisType) {
  //       if (newValue.sold.cta && !newValue.listed.cta) {
  //         newValue.listed.cta = newValue.sold.cta;
  //       }
  //       if (newValue.sold.kwkly && !newValue.listed.kwkly) {
  //         newValue.listed.kwkly = newValue.sold.kwkly;
  //       }
  //     }
  //
  //     if (newValue.sold.createMailoutsOfThisType) {
  //       if (newValue.listed.cta && !newValue.sold.cta) {
  //         newValue.sold.cta = newValue.listed.cta;
  //       }
  //       if (newValue.listed.kwkly && !newValue.sold.kwkly) {
  //         newValue.sold.kwkly = newValue.listed.kwkly;
  //       }
  //     }
  //
  //     setFormValues(newValue);
  //   };
  //
  //   return (
  //     <Header size="medium">
  //       {targetOn}: &nbsp;
  //       {currentValue ? (
  //         <span style={{ verticalAlign: '-0.35em', color: '#59C4C4' }} onClick={handleChange}>
  //           <FontAwesomeIcon icon="toggle-on" size="2x" />
  //         </span>
  //       ) : (
  //         <span style={{ verticalAlign: '-0.35em', color: '#969696' }} onClick={handleChange}>
  //           <FontAwesomeIcon icon="toggle-on" size="2x" className="fa-flip-horizontal" />
  //         </span>
  //       )}
  //     </Header>
  //   );
  // };

  const renderTemplatePicture = ({ templateName, listingType }) => {
    const currentValue = formValues[listingType].templateTheme;

    const resolveSource = type => {
      const types = {
        ribbon: require('../../assets/ribbon-preview.png'),
        bookmark: require('../../assets/bookmark-preview.png'),
        stack: require('../../assets/stack-preview.png'),
        undefined: null,
      };
      return type ? types[type] : types['undefined'];
    };

    const handleTemplateChange = value => {
      const newValue = formValues;
      newValue[listingType].templateTheme = value;
      setFormValues(newValue);
    };

    return (
      <div style={{ margin: '1em', minWidth: '128px', maxWidth: '270px' }}>
        <input
          type="radio"
          checked={currentValue === templateName}
          value={templateName}
          onChange={(e, { value }) => handleTemplateChange(value)}
          style={{ visibility: 'hidden', display: 'none' }}
        />
        <div
          style={
            currentValue === templateName
              ? { border: '2px solid #59C4C4', margin: 0, padding: '0.5em', borderRadius: '5px' }
              : { border: '1px solid lightgray', margin: 0, padding: '0.5em', borderRadius: '5px' }
          }
        >
          <img onClick={e => handleTemplateChange(templateName)} src={resolveSource(templateName)} alt={templateName} />
        </div>
      </div>
    );
  };

  const renderColorPicker = ({ listingType }) => {
    const currentValue = formValues[listingType].brandColor;

    const handleColorChange = value => {
      const newValue = formValues;
      newValue[listingType].brandColor = value.hex;
      setFormValues(newValue);
    };

    return <BlockPicker triangle="hide" width="200px" color={currentValue} colors={colors} onChangeComplete={handleColorChange} />;
  };

  const renderAgentDropdown = ({ listingType }) => {
    const currentValue = formValues[listingType].defaultDisplayAgent.userId;

    const handleAgentChange = (e, input) => {
      const selectedAgent = input.options.filter(o => o.value === input.value)[0];
      const { first, last, value } = selectedAgent;
      const newValue = formValues;
      newValue[listingType].defaultDisplayAgent = { userId: value, first, last };
      setFormValues(newValue);
    };

    const error = composeValidators(required)(currentValue) && true;

    return (
      <Dropdown
        error={error}
        placeholder="Select Default Displayed Agent"
        fluid
        selection
        options={profiles}
        value={currentValue}
        onChange={handleAgentChange}
      />
    );
  };

  const renderField = ({ fieldName, listingType }) => {
    const adjustedName = fieldName === 'frontHeadline' ? 'Headline' : fieldName;

    const currentValue = formValues[listingType][fieldName];
    const currentTemplate = formValues[listingType].templateTheme;
    const currentTemplateFields = resolveTemplateFieldValues(currentTemplate)[listingType].fields;
    const templateDefaults = currentTemplateFields.filter(field => fieldName === field.name)[0];
    const error = composeValidators(required, maxLength(templateDefaults.max))(currentValue);

    const handleChange = input => {
      const newValue = formValues;
      newValue[listingType][fieldName] = input.target.value;
      setFormValues(newValue);
    };

    return (
      <Form.Field>
        <Form.Input
          fluid
          label={<Header as="h4">{adjustedName}</Header>}
          error={error && { content: error }}
          placeholder={templateDefaults.default}
          type={templateDefaults.type}
          onBlur={handleChange}
          defaultValue={currentValue}
        />
      </Form.Field>
    );
  };

  const renderMailoutSizeSlider = ({ listingType }) => {
    const INCREMENT = 10;
    const STEPS = INCREMENT;
    const MARGIN = INCREMENT;
    const SLIDER_INITIAL_VALUES = [];

    const currentMailoutSize = formValues[listingType].mailoutSize;
    const currentMailoutSizeMin = formValues[listingType].mailoutSizeMin;
    const currentMailoutSizeMax = formValues[listingType].mailoutSizeMax;

    const adjustedMailoutSizeMax = currentMailoutSizeMin === currentMailoutSizeMax ? currentMailoutSizeMax + 20 : undefined;

    SLIDER_INITIAL_VALUES.push(currentMailoutSize);

    const handleMailoutSizeChange = value => {
      const newValue = formValues;
      newValue[listingType].mailoutSize = value[0];
      setFormValues(newValue);
    };

    return (
      <div className="slider" style={{ marginTop: '2em', marginBottom: '2em' }}>
        {isMobile() && (
          <Fragment>
            <br />
            <br />
          </Fragment>
        )}
        <Nouislider
          range={{
            min: currentMailoutSizeMin,
            max: adjustedMailoutSizeMax || currentMailoutSizeMax,
          }}
          step={STEPS}
          start={SLIDER_INITIAL_VALUES}
          margin={MARGIN}
          connect={true}
          behaviour="tap-drag"
          tooltips={true}
          pips={{
            mode: 'values',
            values: adjustedMailoutSizeMax ? [currentMailoutSizeMin, adjustedMailoutSizeMax] : [currentMailoutSizeMin, currentMailoutSizeMax],
            stepped: true,
            density: 3,
          }}
          format={{
            to: (value, index) => {
              return Math.round(parseInt(value, 10) / 10) * 10;
            },
            from: value => {
              return value;
            },
          }}
          onChange={handleMailoutSizeChange}
        />
        {isMobile() && (
          <Fragment>
            <br />
            <br />
          </Fragment>
        )}
      </div>
    );
  };

  const renderKWKLYCTAToggle = ({ listingType }) => {
    const ctaEnabled = formValues[listingType].shortenCTA;

    const handleKwklyEnabledChange = () => {
      const newValue = formValues;
      newValue[listingType].shortenCTA = !ctaEnabled;
      setFormValues(newValue);
    };

    return (
      <Form.Field>
        {!ctaEnabled ? (
          <span style={{ verticalAlign: '-0.35em', color: '#59C4C4' }} onClick={handleKwklyEnabledChange}>
            <FontAwesomeIcon icon="toggle-on" size="2x" />
          </span>
        ) : (
          <span style={{ verticalAlign: '-0.35em', color: '#969696' }} onClick={handleKwklyEnabledChange}>
            <FontAwesomeIcon icon="toggle-on" size="2x" className="fa-flip-horizontal" />
          </span>
        )}
        &nbsp;
        {!ctaEnabled ? 'Disable Kwkly' : 'Enable Kwkly'}
      </Form.Field>
    );
  };

  const renderCTA = ({ listingType }) => {
    const currentValue = formValues[listingType].cta;
    const ctaEnabled = formValues[listingType].shortenCTA;
    const shortenedURL = listingType === NEW_LISTING ? newListingShortenedURL : soldListingShortenedURL;

    const handleCTAChange = input => {
      const eURL = input.target.value;

      const newValue = formValues;
      newValue[listingType].cta = eURL;
      setFormValues(newValue);

      if (listingType === NEW_LISTING && isValidURL(eURL)) dispatch(saveListedShortcodePending(eURL));
      if (listingType === SOLD_LISTING && isValidURL(eURL)) dispatch(saveSoldShortcodePending(eURL));
    };

    let serverValidationError = null;

    if (ctaEnabled) {
      if (listingType === NEW_LISTING && newListingShortenedURLError) serverValidationError = newListingShortenedURLError.message;
      if (listingType === SOLD_LISTING && soldListingShortenedURLError) serverValidationError = soldListingShortenedURLError.message;
    }

    const error = ctaEnabled && composeValidators(required, validURL)(currentValue);
    const isVisible = ctaEnabled && !error && shortenedURL;

    return (
      <Form.Field className={isMobile() ? null : isVisible ? 'tertiary-grid-container' : null}>
        <Form.Input
          className={!ctaEnabled ? 'disabled-form-field' : null}
          fluid
          label={
            <Header as="h4" style={{ opacity: ctaEnabled ? '1' : '0.4' }}>
              Call to action URL
            </Header>
          }
          error={(error && { content: error }) || (serverValidationError && { content: serverValidationError })}
          onBlur={handleCTAChange}
          defaultValue={currentValue}
          disabled={!ctaEnabled}
        />
        {isVisible && (
          <Label style={{ marginTop: !isMobile() && '2.75em', padding: '1em', backgroundColor: 'transparent' }}>
            <Icon name="linkify" />
            Shortened URL:
            <Label.Detail>
              <Menu.Item href={'https://' + shortenedURL} position="left" target="_blank">
                <span>
                  {shortenedURL}{' '}
                  {popup('We automatically shorten your call to action links and generate URLs for each card to provide tracking and increase conversion.')}
                </span>
              </Menu.Item>
            </Label.Detail>
          </Label>
        )}
      </Form.Field>
    );
  };

  const renderKWKLY = ({ listingType }) => {
    const currentValue = formValues[listingType].kwkly;
    const ctaEnabled = formValues[listingType].shortenCTA;

    const handleKwklyChange = input => {
      const newValue = formValues;
      newValue[listingType].kwkly = input.target.value;
      setFormValues(newValue);
    };

    const error = !ctaEnabled && composeValidators(required, validKeyword)(currentValue);

    return (
      <Form.Field>
        <Form.Input
          className={ctaEnabled ? 'disabled-form-field' : null}
          label={
            <Header as="h4" style={{ opacity: !ctaEnabled ? '1' : '0.4' }}>
              KWKLY Call to Action Phrase {popup('Please enter your KWKLY keyword and we will put the keyword into a the KWKLY phrase for you.')}
            </Header>
          }
          onBlur={handleKwklyChange}
          defaultValue={currentValue}
          disabled={ctaEnabled}
          labelPosition="right"
          type="text"
          placeholder="KEYWORD"
        >
          <Label style={{ opacity: !ctaEnabled ? '1' : '0.4' }}>Text </Label>
          <input />
          <Label style={{ opacity: !ctaEnabled ? '1' : '0.4' }}> to 59559 for details!</Label>
        </Form.Input>
        {error && <span className="sui-error-message">{error}</span>}
      </Form.Field>
    );
  };

  const Listings = ({ listingType }) => {
    // const placeholder = listingType === NEW_LISTING ? 'Campaign will not be enabled for new listings' : 'Campaign will not be enabled for sold listings';

    return (
      <Fragment>
        {/*<Segment>{renderSwitch({ listingType })}</Segment>*/}

        {/*{!formValues[listingType].createMailoutsOfThisType && (*/}
        {/*  <Segment placeholder>*/}
        {/*    <Header textAlign="center">{placeholder}</Header>*/}
        {/*    <Image src={require('../../assets/undraw_choice_9385.png')} style={{ margin: 'auto', maxWidth: '500px' }} />*/}
        {/*  </Segment>*/}
        {/*)}*/}

        {/*{formValues[listingType].createMailoutsOfThisType && (*/}
        <Segment
          padded
          className={isMobile() ? null : 'primary-grid-container'}
          style={isMobile() ? {} : { gridTemplateRows: 'unset', gridTemplateAreas: 'unset' }}
        >
          <div>
            <Header as="h4">Template Theme</Header>
            {renderTemplatePicture({ templateName: 'ribbon', listingType })}
          </div>

          <div>
            <p>&nbsp;</p>
            {renderTemplatePicture({ templateName: 'bookmark', listingType })}
          </div>

          <div>
            <p>&nbsp;</p>
            {renderTemplatePicture({ templateName: 'stack', listingType })}
          </div>

          <div>
            <Header as="h4">Brand Color</Header>
            {renderColorPicker({ listingType })}
          </div>
        </Segment>
        {/*)}*/}

        {/*{formValues[listingType].createMailoutsOfThisType && (*/}
        <Segment padded className={isMobile() ? null : 'tertiary-grid-container'}>
          {multiUser && (
            <div>
              <Header as="h4">Choose Default Agent</Header>
              {renderAgentDropdown({ listingType })}
            </div>
          )}

          <div>{renderField({ fieldName: 'frontHeadline', listingType })}</div>

          <div>
            <Header as="h4">Number of postcards to send per listing</Header>
            {renderMailoutSizeSlider({ listingType })}
          </div>

          <div> </div>

          <div>{renderKWKLYCTAToggle({ listingType })}</div>

          <div> </div>

          <div>{renderCTA({ listingType })}</div>

          <div>{renderKWKLY({ listingType })}</div>
        </Segment>
        {/*)}*/}
      </Fragment>
    );
  };

  const renderSteps = () => {
    switch (step) {
      case 1:
        return <Listings listingType="listed" />;

      case 2:
        return <Listings listingType="sold" />;

      default:
        return <span> Nothing here </span>;
    }
  };

  const getPeer = selectedPeer();
  const peersName = getPeer && getPeer.first;

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader padded>
          <Menu borderless fluid secondary>
            {peerId ? (
              <Header as="h1">
                {peersName}'s Customization
                <Header.Subheader>Set the default template customization options for peer campaigns.</Header.Subheader>
              </Header>
            ) : (
              <Header as="h1">
                Personal Customization
                <Header.Subheader>Set the default template customization options for your campaigns.</Header.Subheader>
              </Header>
            )}
            <Menu.Menu position="right">
              <span>
                <Button
                  primary
                  type="submit"
                  onClick={handleSubmit}
                  disabled={pristineState || newListingShortenedURLPending || soldListingShortenedURLPending}
                >
                  Save
                </Button>
              </span>
            </Menu.Menu>
          </Menu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>

      <Segment style={isMobile() ? { marginTop: '170px' } : { marginTop: '110px' }}>
        <Menu pointing secondary>
          <Menu.Item name="newListing" active={step === 1} disabled={step === 1} onClick={prevStep} />
          <Menu.Item name="soldListing" active={step === 2} disabled={step === 2} onClick={nextStep} />
        </Menu>

        {/*<Confirm*/}
        {/*  open={showSelectionAlert}*/}
        {/*  content="In order to use Brivity Marketing platform, you must select at least one"*/}
        {/*  cancelButton="Enable new listings"*/}
        {/*  confirmButton="Enable sold listings"*/}
        {/*  onCancel={() => [handleConfirm(NEW_LISTING), setStep(1)]}*/}
        {/*  onConfirm={() => [handleConfirm(SOLD_LISTING), setStep(2)]}*/}
        {/*/>*/}

        {renderSteps()}

        <Modal basic size="tiny" open={!!formError} onClose={() => setFormError('')}>
          <Header icon="warning" content="Unable to save!" />
          <Modal.Content>
            <p>{formError}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button primary inverted onClick={() => setFormError('')}>
              <Icon name="checkmark" /> OK
            </Button>
          </Modal.Actions>
        </Modal>

        <Modal open={displayReview} basic size="tiny">
          {!postcardsPreviewIsPending && (
            <Modal.Header>
              Preview
              <Button primary inverted floated="right" onClick={() => [setListedIsFlipped(true), setSoldIsFlipped(true)]}>
                Flip Back
              </Button>
              <Button primary inverted floated="right" onClick={() => [setListedIsFlipped(false), setSoldIsFlipped(false)]}>
                Flip Forward
              </Button>
            </Modal.Header>
          )}

          {!customizationPending && (postcardsPreviewError || customizationError) && <Modal.Header>Error</Modal.Header>}

          {postcardsPreviewIsPending && <Loading message="Please wait, loading an example preview..." />}

          {!customizationPending && (postcardsPreviewError || customizationError) && (
            <Modal.Content style={{ padding: '0 45px 10px' }}>{postcardsPreviewError || customizationError}</Modal.Content>
          )}

          {formValues.listed.createMailoutsOfThisType &&
            postcardsPreview &&
            postcardsPreview.listed &&
            postcardsPreview.listed.sampleBackLargeUrl &&
            postcardsPreview.listed.sampleFrontLargeUrl && (
              <Modal.Content image style={{ padding: '0 45px 10px' }}>
                <FlipCard isFlipped={listedIsFlipped}>
                  <Image
                    wrapped
                    size="large"
                    src={postcardsPreview.listed.sampleFrontLargeUrl}
                    label={{ as: 'a', corner: 'right', icon: 'undo', onClick: () => setListedIsFlipped(!listedIsFlipped) }}
                  />

                  <Image
                    wrapped
                    size="large"
                    src={postcardsPreview.listed.sampleBackLargeUrl}
                    label={{ as: 'a', corner: 'right', icon: 'redo', onClick: () => setListedIsFlipped(!listedIsFlipped) }}
                  />
                </FlipCard>
              </Modal.Content>
            )}

          {formValues.sold.createMailoutsOfThisType &&
            postcardsPreview &&
            postcardsPreview.sold &&
            postcardsPreview.sold.sampleBackLargeUrl &&
            postcardsPreview.sold.sampleFrontLargeUrl && (
              <Modal.Content image style={{ padding: '10px 45px 0' }}>
                <FlipCard isFlipped={soldIsFlipped}>
                  <Image
                    wrapped
                    size="large"
                    src={postcardsPreview.sold.sampleFrontLargeUrl}
                    label={{ as: 'a', corner: 'right', icon: 'undo', onClick: () => setSoldIsFlipped(!soldIsFlipped) }}
                  />

                  <Image
                    wrapped
                    size="large"
                    src={postcardsPreview.sold.sampleBackLargeUrl}
                    label={{ as: 'a', corner: 'right', icon: 'redo', onClick: () => setSoldIsFlipped(!soldIsFlipped) }}
                  />
                </FlipCard>
              </Modal.Content>
            )}

          {!postcardsPreviewIsPending && (
            <Modal.Actions>
              <Button primary inverted onClick={() => setDisplayReview(false)}>
                <Icon name="checkmark" /> OK
              </Button>
            </Modal.Actions>
          )}

          {!customizationPending && (postcardsPreviewError || customizationError) && (
            <Modal.Actions>
              <Button secondary inverted onClick={() => setDisplayReview(false)}>
                <Icon name="remove" /> OK
              </Button>
            </Modal.Actions>
          )}
        </Modal>
      </Segment>
    </Page>
  );
};

export default CustomizeForm;
