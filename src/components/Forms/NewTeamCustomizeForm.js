import _ from 'lodash';
import styled from 'styled-components';
import { BlockPicker } from 'react-color';
import Nouislider from 'nouislider-react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Confirm, Dropdown, Form, Header, Label, Popup } from 'semantic-ui-react';
import React, { createRef, Fragment, useEffect, useState, useReducer } from 'react';

import { saveTeamSoldShortcodePending, saveTeamListedShortcodePending } from '../../store/modules/teamShortcode/actions';
import { ContentBottomHeaderLayout, ContentTopHeaderLayout, ContentSpacerLayout } from '../../layouts';
import { isMobile, isValidURL, maxLength, popup, required, composeValidators, url } from './helpers';
import { saveTeamCustomizationPending } from '../../store/modules/teamCustomization/actions';
import { Button, Icon, Image, Menu, Modal, Page, Segment } from '../Base';
import FlipCard from '../FlipCard';
import Loading from '../Loading';

export const colors = ['#b40101', '#f2714d', '#f4b450', '#79c34d', '#2d9a2c', '#59c4c4', '#009ee7', '#0e2b5b', '#ee83ee', '#8b288f', '#808080', '#000000'];

const StyledHeader = styled(Header)`
  min-width: 18em;
  display: inline-block;
`;

const formReducer = (state, action) => {
  return _.merge({}, state, action);
};

const NEW_LISTING = 'listed';
const SOLD_LISTING = 'sold';

let multiUserStartState;

const TrimStrAndConvertToInt = value => Math.round(parseInt(value.trim(), 10) / 10) * 10;

const NewCustomizeForm = ({ teamCustomizationData }) => {
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
      createMailoutsOfThisType: false,
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

  const newListingShortenedURL = useSelector(store => store.teamShortcode && store.teamShortcode.listed);
  const newListingShortenedURLPending = useSelector(store => store.teamShortcode && store.teamShortcode.listedURLToShortenPending);
  const soldListingShortenedURL = useSelector(store => store.teamShortcode && store.teamShortcode.sold);
  const soldListingShortenedURLPending = useSelector(store => store.teamShortcode && store.teamShortcode.soldURLToShortenPending);

  const onLoginUserId = useSelector(store => store.onLogin.user._id);
  const teammates = useSelector(store => store.team.profiles);

  const teamCustomizationPending = useSelector(store => store.teamCustomization && store.teamCustomization.pending);
  const customizationError = useSelector(store => store.teamCustomization && store.teamCustomization.error && store.teamCustomization.error.message);
  const postcardsPreviewIsPending = useSelector(store => store.teamPostcards && store.teamPostcards.pending);
  const postcardsPreviewError = useSelector(store => store.teamPostcards && store.teamPostcards.error && store.teamPostcards.error.message);
  const postcardsPreview = useSelector(store => store.teamPostcards && store.teamPostcards.available);

  const profiles = [];

  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useReducer(formReducer, initialValues);

  const [showSelectionAlert, setShowSelectionAlert] = useState(false);

  const [displayReview, setDisplayReview] = useState(false);
  const [listedIsFlipped, setListedIsFlipped] = useState(false);
  const [soldIsFlipped, setSoldIsFlipped] = useState(false);

  const pristineState = _.isEqual(formValues, multiUserStartState);

  useEffect(() => {
    if (teamCustomizationData) {
      const updatedFormValues = _.merge({}, formValues, teamCustomizationData);
      delete updatedFormValues._rev;
      delete updatedFormValues._id;
      delete updatedFormValues.onboardingComplete;
      setFormValues(updatedFormValues);
      multiUserStartState = updatedFormValues;

      if (updatedFormValues.listed.cta) {
        dispatch(saveTeamSoldShortcodePending(updatedFormValues.listed.cta));
      }
      if (updatedFormValues.sold.cta) {
        dispatch(saveTeamSoldShortcodePending(updatedFormValues.sold.cta));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamCustomizationData, setFormValues, dispatch]);

  useEffect(() => {
    if (!formValues.listed.createMailoutsOfThisType && !formValues.sold.createMailoutsOfThisType) {
      setShowSelectionAlert(true);
    } else {
      setShowSelectionAlert(false);
    }
  }, [formValues, setShowSelectionAlert]);

  const handleSubmit = () => {
    const data = _.merge({}, teamCustomizationData, formValues);

    if (!data.listed.cta) delete data.listed.cta;
    if (!data.sold.cta) delete data.sold.cta;

    if (!data.listed.kwkly) delete data.listed.kwkly;
    if (!data.sold.kwkly) delete data.sold.kwkly;

    if (!data.listed.defaultDisplayAgent.userId) delete data.listed.defaultDisplayAgent;
    if (!data.sold.defaultDisplayAgent.userId) delete data.sold.defaultDisplayAgent;

    dispatch(saveTeamCustomizationPending(data));
    setDisplayReview(true);
  };

  const handleConfirm = listingType => {
    const newValue = formValues;
    newValue[listingType].createMailoutsOfThisType = true;
    setFormValues(newValue);
  };

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

  const renderSwitch = ({ listingType }) => {
    const targetOn = listingType === NEW_LISTING ? 'Generate new listing campaigns' : 'Generate sold listing campaigns';

    const currentValue = formValues[listingType].createMailoutsOfThisType;

    const handleChange = () => {
      const newValue = formValues;
      newValue[listingType].createMailoutsOfThisType = !currentValue;

      // To ensure that we have cta or kwkly when switching
      if (newValue.listed.createMailoutsOfThisType) {
        if (newValue.sold.cta && !newValue.listed.cta) {
          newValue.listed.cta = newValue.sold.cta;
        }
        if (newValue.sold.kwkly && !newValue.listed.kwkly) {
          newValue.listed.kwkly = newValue.sold.kwkly;
        }
      }

      if (newValue.sold.createMailoutsOfThisType) {
        if (newValue.listed.cta && !newValue.sold.cta) {
          newValue.sold.cta = newValue.listed.cta;
        }
        if (newValue.listed.kwkly && !newValue.sold.kwkly) {
          newValue.sold.kwkly = newValue.listed.kwkly;
        }
      }

      setFormValues(newValue);
    };

    return (
      <Header size="medium">
        {targetOn}: &nbsp;
        <span style={{ verticalAlign: '-0.35em', color: '#59C4C4' }} onClick={handleChange}>
          {currentValue ? <FontAwesomeIcon icon="toggle-on" size="2x" /> : <FontAwesomeIcon icon="toggle-off" size="2x" />}
        </span>
      </Header>
    );
  };

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
    const MIN = 100;
    const MAX = 2000;
    const INCREMENT = 10;
    const STEPS = INCREMENT;
    const MARGIN = 0;
    const SLIDER_INITIAL_VALUES = [];

    const currentMailoutSize = formValues[listingType].mailoutSize;
    const currentMailoutSizeMin = formValues[listingType].mailoutSizeMin;
    const currentMailoutSizeMax = formValues[listingType].mailoutSizeMax;

    SLIDER_INITIAL_VALUES.push(currentMailoutSizeMin);
    SLIDER_INITIAL_VALUES.push(currentMailoutSize);
    SLIDER_INITIAL_VALUES.push(currentMailoutSizeMax);

    const handleMailoutSizeChange = value => {
      const newValue = formValues;

      value.map(item => {
        const itemArr = item.split(':');
        if (itemArr[0] === 'Min') return (newValue[listingType].mailoutSizeMin = TrimStrAndConvertToInt(itemArr[1]));
        if (itemArr[0] === 'Default') return (newValue[listingType].mailoutSize = TrimStrAndConvertToInt(itemArr[1]));
        if (itemArr[0] === 'Max') return (newValue[listingType].mailoutSizeMax = TrimStrAndConvertToInt(itemArr[1]));
        return null;
      });

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
            min: MIN,
            max: MAX,
          }}
          step={STEPS}
          start={SLIDER_INITIAL_VALUES}
          margin={MARGIN}
          connect={true}
          behaviour="tap-drag"
          tooltips={true}
          pips={{
            mode: 'values',
            values: [currentMailoutSizeMin, currentMailoutSizeMax],
            stepped: true,
            density: 3,
          }}
          format={{
            to: (value, index) => {
              const intValue = Math.round(parseInt(value, 10) / 10) * 10;

              if (index === 0) return 'Min: ' + intValue;
              if (index === 1) return 'Default: ' + intValue;
              if (index === 2) return 'Max: ' + intValue;
            },
            from: value => {
              const newValue = value.split(':');

              if (newValue.length === 1) return newValue[0];
              else return TrimStrAndConvertToInt(newValue[1]);
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
        <span style={{ verticalAlign: '-0.35em', color: '#59C4C4' }} onClick={handleKwklyEnabledChange}>
          {!ctaEnabled ? <FontAwesomeIcon icon="toggle-on" size="2x" /> : <FontAwesomeIcon icon="toggle-off" size="2x" />}
        </span>
        &nbsp;
        {!ctaEnabled ? 'Disable Kwkly' : 'Enable Kwkly'}
      </Form.Field>
    );
  };

  const renderCTA = ({ listingType }) => {
    const currentValue = formValues[listingType].cta;
    const ctaEnabled = formValues[listingType].shortenCTA;
    const shortenedURL = listingType === NEW_LISTING ? newListingShortenedURL : soldListingShortenedURL;

    if (currentValue && isValidURL(currentValue)) {
      if (listingType === NEW_LISTING && !newListingShortenedURLPending && !newListingShortenedURL) dispatch(saveTeamListedShortcodePending(currentValue));
      if (listingType === SOLD_LISTING && !soldListingShortenedURLPending && !soldListingShortenedURL) dispatch(saveTeamSoldShortcodePending(currentValue));
    }

    const handleCTAChange = input => {
      const eURL = input.target.value;

      const newValue = formValues;
      newValue[listingType].cta = eURL;
      setFormValues(newValue);

      if (listingType === NEW_LISTING && isValidURL(eURL)) dispatch(saveTeamListedShortcodePending(eURL));
      if (listingType === SOLD_LISTING && isValidURL(eURL)) dispatch(saveTeamSoldShortcodePending(eURL));
    };

    const error = ctaEnabled && composeValidators(required, url)(currentValue);

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
          error={error && { content: error }}
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

    const error = !ctaEnabled && composeValidators(required)(currentValue);

    return (
      <Form.Field>
        <Form.Input
          className={ctaEnabled ? 'disabled-form-field' : null}
          fluid
          label={
            <Header as="h4" style={{ opacity: !ctaEnabled ? '1' : '0.4' }}>
              KWKLY Call to Action
            </Header>
          }
          error={error && { content: error }}
          onBlur={handleKwklyChange}
          defaultValue={currentValue}
          disabled={ctaEnabled}
        />
      </Form.Field>
    );
  };

  const Listings = ({ listingType }) => {
    const placeholder = listingType === NEW_LISTING ? 'Campaign will not be enabled for new listings' : 'Campaign will not be enabled for sold listings';

    return (
      <Fragment>
        <Segment>{renderSwitch({ listingType })}</Segment>

        {!formValues[listingType].createMailoutsOfThisType && (
          <Segment placeholder>
            <Header textAlign="center">{placeholder}</Header>
            <Image src={require('../../assets/undraw_choice_9385.png')} style={{ margin: 'auto', maxWidth: '500px' }} />
          </Segment>
        )}

        {formValues[listingType].createMailoutsOfThisType && (
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
        )}

        {formValues[listingType].createMailoutsOfThisType && (
          <Segment padded className={isMobile() ? null : 'tertiary-grid-container'}>
            <div>
              <Header as="h4">Choose Default Agent</Header>
              {renderAgentDropdown({ listingType })}
            </div>

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
        )}
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

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <Segment style={isMobile() ? { marginTop: '58px' } : {}}>
          <Menu borderless fluid secondary>
            <Header as="h1">
              Team Customization
              <Header.Subheader style={{ lineHeight: '1.5em', marginBottom: '-11px' }}>
                Set the default template customization options for your team. <br />
                Changes made here will not overwrite existing user-specific customization.
              </Header.Subheader>
            </Header>
            <Menu.Menu position="right">
              <span>
                <Button primary type="submit" onClick={handleSubmit} disabled={pristineState}>
                  Save
                </Button>
              </span>
            </Menu.Menu>
          </Menu>
        </Segment>
      </ContentTopHeaderLayout>

      <ContentSpacerLayout style={isMobile() ? { minHeight: '226px' } : { top: '175px', minHeight: '22px' }} />

      <ContentBottomHeaderLayout style={isMobile() ? {} : { top: '170px', minWidth: `calc(100% - 203px)` }}>
        <Segment style={isMobile() ? { marginTop: '133px' } : { marginTop: '20px' }}>
          <Menu pointing secondary>
            <Menu.Item name="newListing" active={step === 1} disabled={step === 1} onClick={prevStep} />
            <Menu.Item name="soldListing" active={step === 2} disabled={step === 2} onClick={nextStep} />
          </Menu>
        </Segment>
      </ContentBottomHeaderLayout>

      <Segment style={isMobile() ? { marginTop: '242px' } : { marginTop: '200px' }}>
        <Confirm
          open={showSelectionAlert}
          content="In order to use Brivity Marketing platform, you must select at least one"
          cancelButton="Enable new listings"
          confirmButton="Enable sold listings"
          onCancel={() => [handleConfirm(NEW_LISTING), setStep(1)]}
          onConfirm={() => [handleConfirm(SOLD_LISTING), setStep(2)]}
        />

        {renderSteps()}

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

          {!teamCustomizationPending && (postcardsPreviewError || customizationError) && <Modal.Header>Error</Modal.Header>}

          {postcardsPreviewIsPending && <Loading message="Please wait, loading an example preview..." />}

          {!teamCustomizationPending && (postcardsPreviewError || customizationError) && (
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
              <Button color="green" inverted onClick={() => setDisplayReview(false)}>
                <Icon name="checkmark" /> OK
              </Button>
            </Modal.Actions>
          )}

          {!teamCustomizationPending && (postcardsPreviewError || customizationError) && (
            <Modal.Actions>
              <Button basic color="red" inverted onClick={() => setDisplayReview(false)}>
                <Icon name="remove" /> OK
              </Button>
            </Modal.Actions>
          )}
        </Modal>
      </Segment>
    </Page>
  );
};

export default NewCustomizeForm;
