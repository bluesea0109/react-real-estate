import _ from 'lodash';

import { BlockPicker } from 'react-color';
import Nouislider from 'nouislider-react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Header, Label, Popup } from 'semantic-ui-react';
import React, { createRef, Fragment, useEffect, useState, useReducer } from 'react';

import { isMobile, popup, urlRegExp, required, minLength, maxLength, composeValidators, differenceObjectDeep } from '../utils';
import { saveListedShortcodePending, saveSoldShortcodePending } from '../../../store/modules/shortcode/actions';
import { saveCustomizationPending, reviewCustomizationCompleted } from '../../../store/modules/customization/actions';
import { Button, Icon, Image, Menu, Modal, Page, Segment } from '../../Base';
import { ContentTopHeaderLayout } from '../../../layouts';
import { colors, StyledHeader } from './helpers';
import FlipCard from '../../FlipCard';
import Loading from '../../Loading';
import Wizard from './CustomizationWizard';
import { Input } from '../Base';

const formReducer = (state, action) => {
  return _.merge({}, state, action);
};

const NEW_LISTING = 'listed';
const SOLD_LISTING = 'sold';

const NewCustomizeForm = ({ customizationData, teamCustomizationData = null }) => {
  const dispatch = useDispatch();

  const newListingShortenedURL = useSelector(store => store.shortcode && store.shortcode.listed);
  const newListingShortenedURLPending = useSelector(store => store.shortcode && store.shortcode.listedURLToShortenPending);
  const newListingShortenedURLError = useSelector(store => store.shortcode && store.shortcode.listedURLToShortenError);
  const soldListingShortenedURL = useSelector(store => store.shortcode && store.shortcode.sold);
  const soldListingShortenedURLPending = useSelector(store => store.shortcode && store.shortcode.soldURLToShortenPending);
  const soldListingShortenedURLError = useSelector(store => store.shortcode && store.shortcode.soldURLToShortenError);

  const onLoginUserId = useSelector(store => store.onLogin.user._id);
  const teammates = useSelector(store => store.team.profiles);

  const customizationPending = useSelector(store => store.customization && store.customization.pending);
  const customizationError = useSelector(store => store.customization && store.customization.error && store.customization.error.message);
  const postcardsPreviewIsPending = useSelector(store => store.postcards && store.postcards.pending);
  const postcardsPreviewError = useSelector(store => store.postcards && store.postcards.error && store.postcards.error.message);
  const postcardsPreview = useSelector(store => store.postcards && store.postcards.available);

  const profiles = [];

  const [page, setPage] = useState(0);
  const [formValues, setFormValues] = useReducer(formReducer, customizationData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);

  const [displayReview, setDisplayReview] = useState(false);
  const [listedIsFlipped, setListedIsFlipped] = useState(false);
  const [soldIsFlipped, setSoldIsFlipped] = useState(false);

  /* Instead of relying on handleSubmit changing the state of displayReview, we're doing it here */
  useEffect(() => {
    let isInitialized = true;

    if (isInitialized && !displayReview && postcardsPreviewIsPending) {
      setDisplayReview(true);
    }

    return () => (isInitialized = false);
  }, [displayReview, setDisplayReview, postcardsPreviewIsPending]);

  useEffect(() => {
    let isInitialized = true;

    if (isInitialized && customizationData) {
      const updatedFormValues = _.merge({}, formValues, customizationData);
      setFormValues(updatedFormValues);

      if (updatedFormValues.listed.cta) {
        dispatch(saveSoldShortcodePending(updatedFormValues.listed.cta));
      }
      if (updatedFormValues.sold.cta) {
        dispatch(saveSoldShortcodePending(updatedFormValues.sold.cta));
      }
    }

    return () => (isInitialized = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customizationData, teamCustomizationData, setFormValues, dispatch]);

  const handleSubmit = () => {
    const allData = _.merge({}, customizationData, formValues);

    if (allData.listed.shortenCTA || !allData.listed.kwkly) {
      delete allData.listed.kwkly;
    }

    if (allData.sold.shortenCTA || !allData.sold.kwkly) {
      delete allData.sold.kwkly;
    }

    const diffData = differenceObjectDeep(teamCustomizationData, allData);
    if (!diffData.listed.cta) delete diffData.listed.cta;
    if (!diffData.sold.cta) delete diffData.sold.cta;

    if (!diffData.listed.defaultDisplayAgent.userId) delete diffData.listed.defaultDisplayAgent;
    if (!diffData.sold.defaultDisplayAgent.userId) delete diffData.sold.defaultDisplayAgent;

    diffData.listed.createMailoutsOfThisType = formValues.listed.createMailoutsOfThisType;
    diffData.sold.createMailoutsOfThisType = formValues.sold.createMailoutsOfThisType;

    setFormValues(diffData);
    dispatch(saveCustomizationPending(diffData));
  };

  const handleReviewComplete = () => {
    setDisplayReview(false);
    dispatch(reviewCustomizationCompleted());
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

  const renderTemplatePicture = ({ templateName, listingType }) => {
    const currentValue = formValues[listingType].templateTheme;

    const resolveSource = type => {
      const types = {
        ribbon: require('../../../assets/ribbon-preview.png'),
        bookmark: require('../../../assets/bookmark-preview.png'),
        stack: require('../../../assets/stack-preview.png'),
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

  const renderField = ({ fieldName, listingType }) => {
    const adjustedName = fieldName === 'frontHeadline' ? 'Headline' : fieldName;

    const handleChange = input => {
      const newValue = formValues;
      newValue[listingType][fieldName] = input.target.value;
      setFormValues(newValue);
    };

    return (
      <Input
        label={adjustedName}
        name={listingType + '_frontHeadline'}
        onBlur={handleChange}
        validate={composeValidators(required, minLength(2), maxLength(formValues[listingType].frontHeadline.max))}
      />
    );
  };

  const renderMailoutSizeSlider = ({ listingType }) => {
    const INCREMENT = 10;
    const STEPS = INCREMENT;
    const MARGIN = INCREMENT;
    const SLIDER_INITIAL_VALUES = [];

    const currentMailoutSize = formValues[listingType].mailoutSize || 300;
    const currentMailoutSizeMin = formValues[listingType].mailoutSizeMin || 100;
    const currentMailoutSizeMax = formValues[listingType].mailoutSizeMax || 1000;

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
            max: currentMailoutSizeMax,
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
    const validURL = str => !urlRegExp.test(str) && 'URL is not valid';
    const isValidURL = str => !!urlRegExp.test(str);

    const currentValue = formValues[listingType].cta;
    const ctaEnabled = formValues[listingType].shortenCTA;
    const shortenedURL = listingType === NEW_LISTING ? newListingShortenedURL : soldListingShortenedURL;

    if (currentValue && isValidURL(currentValue)) {
      if (listingType === NEW_LISTING && !newListingShortenedURLPending && !newListingShortenedURL && !newListingShortenedURLError) {
        dispatch(saveListedShortcodePending(currentValue));
      }
      if (listingType === SOLD_LISTING && !soldListingShortenedURLPending && !soldListingShortenedURL && !soldListingShortenedURLError) {
        dispatch(saveSoldShortcodePending(currentValue));
      }
    }

    const handleCTAChange = input => {
      const eURL = input.target.value;

      const newValue = formValues;
      newValue[listingType].cta = eURL;
      setFormValues(newValue);

      if (listingType === NEW_LISTING && isValidURL(eURL)) dispatch(saveListedShortcodePending(eURL));
      if (listingType === SOLD_LISTING && isValidURL(eURL)) dispatch(saveSoldShortcodePending(eURL));
    };

    const isVisible = ctaEnabled && shortenedURL;

    const onErrors = () => {
      if (listingType === NEW_LISTING && newListingShortenedURLError) return newListingShortenedURLError.message;
      if (listingType === SOLD_LISTING && soldListingShortenedURLError) return soldListingShortenedURLError.message;
    };

    if (isVisible) {
      return (
        <Form.Group widths="2">
          <Input
            label="Call to action URL"
            name={listingType + '_cta'}
            onBlur={handleCTAChange}
            validate={ctaEnabled && composeValidators(required, validURL)}
            disabled={!ctaEnabled}
            errorState={onErrors()}
          />
          <Label style={{ marginTop: !isMobile() && '2.5em', backgroundColor: 'transparent' }}>
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
        </Form.Group>
      );
    } else {
      return (
        <Input
          label="Call to action URL"
          name={listingType + '_cta'}
          onBlur={handleCTAChange}
          validate={ctaEnabled && composeValidators(required, validURL)}
          disabled={!ctaEnabled}
          errorState={onErrors()}
        />
      );
    }
  };

  const renderKWKLY = ({ listingType }) => {
    const ctaEnabled = formValues[listingType].shortenCTA;

    const handleKwklyChange = input => {
      const newValue = formValues;
      newValue[listingType].kwkly = input.target.value;
      setFormValues(newValue);
    };

    return (
      <Input
        label="KWKLY Call to Action"
        name={listingType + '_kwkly'}
        onBlur={handleKwklyChange}
        validate={!ctaEnabled && composeValidators(required, minLength(2), maxLength(40))}
        disabled={ctaEnabled}
      />
    );
  };

  const Listings = ({ listingType }) => {
    return (
      <Fragment>
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

        <Segment padded className={isMobile() ? null : 'tertiary-grid-container'}>
          <div>{renderField({ fieldName: 'frontHeadline', listingType })}</div>

          <div>
            <Header as="h4">Number of postcards to send per listing</Header>
            {renderMailoutSizeSlider({ listingType })}
          </div>

          <div>{renderKWKLYCTAToggle({ listingType })}</div>

          <div> </div>

          <div>{renderCTA({ listingType })}</div>

          <div>{renderKWKLY({ listingType })}</div>
        </Segment>
      </Fragment>
    );
  };

  return (
    <Page basic>
      <Wizard
        controls={
          <ContentTopHeaderLayout>
            <Segment padded style={isMobile() ? { marginTop: '58px' } : {}}>
              <Menu borderless fluid secondary>
                <Header as="h1">
                  Personal Customization
                  <Header.Subheader>Set the default template customization options for your campaigns.</Header.Subheader>
                </Header>
                <Menu.Menu position="right">
                  <span>
                    {page === 1 && (
                      <Button primary inverted onClick={() => setPage(0)}>
                        Previous
                      </Button>
                    )}

                    <Button primary type="submit" disabled={isSubmitting}>
                      {isLastPage ? 'Submit' : 'Next'}
                    </Button>
                  </span>
                </Menu.Menu>
              </Menu>
            </Segment>
          </ContentTopHeaderLayout>
        }
        initialValues={{
          listed_frontHeadline: formValues.listed.frontHeadline,
          listed_cta: formValues.listed.cta,
          listed_kwkly: formValues.listed.kwkly,
          sold_frontHeadline: formValues.sold.frontHeadline,
          sold_cta: formValues.sold.cta,
          sold_kwkly: formValues.sold.kwkly,
        }}
        onSubmit={(values, actions) => handleSubmit(values, actions)}
        page={page}
        setPage={setPage}
        onLastPage={value => setIsLastPage(value)}
        onIsSubmitting={value => setIsSubmitting(value)}
      >
        <Listings listingType="listed" />
        <Listings listingType="sold" />
      </Wizard>

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
            <Button secondary inverted onClick={() => setDisplayReview(false)}>
              <Icon name="remove" /> Edit
            </Button>
            <Button primary onClick={handleReviewComplete}>
              <Icon name="checkmark" /> Continue
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
    </Page>
  );
};

export default NewCustomizeForm;
