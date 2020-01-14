import Nouislider from 'nouislider-react';
import { Field, FormSpy } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment, useEffect, useState } from 'react';
import { Confirm, Header, Icon, Label, Radio } from 'semantic-ui-react';

import {
  url,
  popup,
  colors,
  isMobile,
  required,
  templates,
  maxLength,
  Condition,
  renderField,
  labelWithPopup,
  renderUrlField,
  composeValidators,
  renderCarouselField,
} from './helpers';
import FlipCard from '../FlipCard';
import LoadingWithMessage from '../LoadingWithMessage';
import CustomizationWizard from './CustomizationWizard';
import { Menu, Segment, Image, Modal, Button } from '../Base';
import { getTeamListedShortcodePending, getTeamSoldShortcodePending } from '../../store/modules/teamShortcode/actions';
import { saveTeamCustomizationPending, reviewTeamCustomizationCompleted } from '../../store/modules/teamCustomization/actions';

import './thin.css';

const NEW_LISTING = 'newListing';
const SOLD_LISTING = 'soldListing';

const MIN = 100;
const MAX = 2000;
const INCREMENT = 10;
const STEPS = INCREMENT;
const MARGIN = INCREMENT;
const SLIDER_INITIAL_VALUES = [200, 300, 1000];

const CustomizeTeamForm = () => {
  const dispatch = useDispatch();
  const [newListingEnabled, setNewListingEnabled] = useState(true);
  const [soldListingEnabled, setSoldListingEnabled] = useState(false);
  const [showSelectionAlert, setShowSelectionAlert] = useState(false);
  const [onlyOnce, setOnlyOnce] = useState(false);
  const [togglePages, setTogglePages] = useState('');
  const [displayReview, setDisplayReview] = useState(false);
  const [listedIsFlipped, setListedIsFlipped] = useState(false);
  const [soldIsFlipped, setSoldIsFlipped] = useState(false);
  const [newListingKwklyEnabled, setNewListingKwklyEnabled] = useState(false);
  const [soldListingKwklyEnabled, setSoldListingKwklyEnabled] = useState(false);

  const [selectedNewListingTemplate, setSelectedNewListingTemplate] = useState(templates[0].key);
  const [selectedSoldListingTemplate, setSelectedSoldListingTemplate] = useState(templates[0].key);
  const [selectedNewListingColor, setSelectedNewListingColor] = useState(colors[0]);
  const [selectedSoldListingColor, setSelectedSoldListingColor] = useState(colors[0]);

  const bookmarkTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.bookmark);
  const ribbonTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.ribbon);
  const stackTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.stack);

  const shortenedNewListingTeamURL = useSelector(store => store.teamShortcode && store.teamShortcode.listed);
  const shortenedSoldListingTeamURL = useSelector(store => store.teamShortcode && store.teamShortcode.sold);
  const newListingURL = useSelector(store => store.teamShortcode && store.teamShortcode.listedToSave);
  const soldListingURL = useSelector(store => store.teamShortcode && store.teamShortcode.soldToSave);
  const shortenedURLError = useSelector(store => store.teamShortcode && store.teamShortcode.error);

  const tc = useSelector(store => store.teamCustomization && store.teamCustomization.available);
  const teamCustomizationPending = useSelector(store => store.teamCustomization && store.teamCustomization.pending);
  const teamCustomizationError = useSelector(store => store.teamCustomization && store.teamCustomization.error);

  const teamPostcardsPreviewIsPending = useSelector(store => store.teamPostcards && store.teamPostcards.pending);
  const teamPostcardsPreviewError = useSelector(store => store.teamPostcards && store.teamPostcards.error);
  const teamPostcardsPreview = useSelector(store => store.teamPostcards && store.teamPostcards.available);

  const firstTeamAdmin = useSelector(
    store => store.team && store.team.profiles && store.team.profiles.filter(profile => profile.userId === store.onLogin.user._id)[0]
  );

  const resolveTemplate = type => {
    const types = {
      ribbon: ribbonTemplate,
      bookmark: bookmarkTemplate,
      stack: stackTemplate,
      undefined: undefined,
    };
    return type ? types[type] : types['undefined'];
  };

  const templateNewListing = resolveTemplate(selectedNewListingTemplate);
  const templateSoldListing = resolveTemplate(selectedSoldListingTemplate);
  const templateDefaultsNewListing = templateNewListing && templateNewListing.listed;
  const templateDefaultsSoldListing = templateSoldListing && templateSoldListing.sold;

  const frontHeadlineNewListing = templateDefaultsNewListing && templateDefaultsNewListing.fields.filter(field => field.name === 'frontHeadline')[0];
  const frontHeadlineSoldListing = templateDefaultsSoldListing && templateDefaultsSoldListing.fields.filter(field => field.name === 'frontHeadline')[0];

  useEffect(() => {
    if (!newListingEnabled && !soldListingEnabled) {
      setShowSelectionAlert(true);
    } else {
      setShowSelectionAlert(false);
    }
  }, [newListingEnabled, soldListingEnabled, setShowSelectionAlert]);

  const handleReviewComplete = () => {
    setDisplayReview(false);
    dispatch(reviewTeamCustomizationCompleted());
  };

  const onSubmit = values => {
    const data = {
      listed: {
        createMailoutsOfThisType: values.newListing_createMailoutsOfThisType,
        mailoutSize: values.newListing_numberOfPostcardsDefaults[1],
        mailoutSizeMin: values.newListing_numberOfPostcardsDefaults[0],
        mailoutSizeMax: values.newListing_numberOfPostcardsDefaults[2],
        templateTheme: values.newListing_template,
        brandColor: values.newListing_color,
        frontHeadline: values.newListing_headline,
      },
      sold: {
        createMailoutsOfThisType: values.soldListing_createMailoutsOfThisType,
        mailoutSize: values.soldListing_numberOfPostcardsDefaults[1],
        mailoutSizeMin: values.soldListing_numberOfPostcardsDefaults[0],
        mailoutSizeMax: values.soldListing_numberOfPostcardsDefaults[2],
        templateTheme: values.soldListing_template,
        brandColor: values.soldListing_color,
        frontHeadline: values.soldListing_headline,
      },
    };

    if (newListingKwklyEnabled) {
      data.listed.kwkly = values.newListing_kwkly;
    } else {
      data.listed.cta = values.newListing_actionURL;
    }

    if (soldListingKwklyEnabled) {
      data.sold.kwkly = values.soldListing_kwkly;
    } else {
      data.sold.cta = values.soldListing_actionURL;
    }

    if (tc) {
      data._id = tc._id;
      data._rev = tc._rev;

      data.listed.defaultDisplayAgent = tc.listed.defaultDisplayAgent;
      data.sold.defaultDisplayAgent = tc.sold.defaultDisplayAgent;
    } else {
      data.listed.defaultDisplayAgent = {
        userId: firstTeamAdmin && firstTeamAdmin.userId,
        first: firstTeamAdmin && firstTeamAdmin.first,
        last: firstTeamAdmin && firstTeamAdmin.last,
      };
      data.sold.defaultDisplayAgent = {
        userId: firstTeamAdmin && firstTeamAdmin.userId,
        first: firstTeamAdmin && firstTeamAdmin.first,
        last: firstTeamAdmin && firstTeamAdmin.last,
      };
    }

    dispatch(saveTeamCustomizationPending(data));
    setDisplayReview(true);
  };

  let initialValues = {
    [`${NEW_LISTING}_createMailoutsOfThisType`]: newListingEnabled,
    [`${NEW_LISTING}_template`]: selectedNewListingTemplate,
    [`${NEW_LISTING}_color`]: selectedNewListingColor,
    [`${NEW_LISTING}_headline`]: frontHeadlineNewListing && frontHeadlineNewListing.default,
    [`${NEW_LISTING}_numberOfPostcardsDefaults`]: SLIDER_INITIAL_VALUES,

    [`${SOLD_LISTING}_createMailoutsOfThisType`]: soldListingEnabled,
    [`${SOLD_LISTING}_template`]: selectedSoldListingTemplate,
    [`${SOLD_LISTING}_color`]: selectedSoldListingColor,
    [`${SOLD_LISTING}_headline`]: frontHeadlineSoldListing && frontHeadlineSoldListing.default,
    [`${SOLD_LISTING}_numberOfPostcardsDefaults`]: SLIDER_INITIAL_VALUES,
  };

  if (tc) {
    initialValues = {
      [`${NEW_LISTING}_createMailoutsOfThisType`]: tc.listed.createMailoutsOfThisType,
      [`${NEW_LISTING}_template`]: tc.listed.templateTheme,
      [`${NEW_LISTING}_color`]: tc.listed.brandColor,
      [`${NEW_LISTING}_headline`]: tc.listed.frontHeadline,
      [`${NEW_LISTING}_numberOfPostcardsDefaults`]: [tc.listed.mailoutSizeMin, tc.listed.mailoutSize, tc.listed.mailoutSizeMax],
      [`${NEW_LISTING}_actionURL`]: newListingURL || (tc.listed && tc.listed.cta),
      [`${NEW_LISTING}_kwkly`]: tc.listed && tc.listed.kwkly,

      [`${SOLD_LISTING}_createMailoutsOfThisType`]: tc.sold.createMailoutsOfThisType,
      [`${SOLD_LISTING}_template`]: tc.sold.templateTheme,
      [`${SOLD_LISTING}_color`]: tc.sold.brandColor,
      [`${SOLD_LISTING}_headline`]: tc.sold.frontHeadline,
      [`${SOLD_LISTING}_numberOfPostcardsDefaults`]: [tc.sold.mailoutSizeMin, tc.sold.mailoutSize, tc.sold.mailoutSizeMax],
      [`${SOLD_LISTING}_actionURL`]: soldListingURL || (tc.sold && tc.sold.cta),
      [`${SOLD_LISTING}_kwkly`]: tc.sold && tc.sold.kwkly,
    };

    if (!onlyOnce) {
      setOnlyOnce(true);

      if (tc.listed.createMailoutsOfThisType !== newListingEnabled) setNewListingEnabled(tc.listed.createMailoutsOfThisType);
      if (tc.sold.createMailoutsOfThisType !== soldListingEnabled) setSoldListingEnabled(tc.sold.createMailoutsOfThisType);

      if (tc.listed && tc.listed.kwkly) setNewListingKwklyEnabled(true);
      if (tc.sold && tc.sold.kwkly) setSoldListingKwklyEnabled(true);

      dispatch(getTeamListedShortcodePending());
      dispatch(getTeamSoldShortcodePending());
    }
  }

  const formPage = ({ listingType }) => {
    const radioToggleFx = value => (listingType === NEW_LISTING ? setNewListingEnabled(value) : setSoldListingEnabled(value));
    const radioValue = listingType === NEW_LISTING ? newListingEnabled : soldListingEnabled;
    const headingMaxValue =
      listingType === NEW_LISTING ? frontHeadlineNewListing && frontHeadlineNewListing.max : frontHeadlineSoldListing && frontHeadlineSoldListing.max;
    const setSelectedTemplate = value => (listingType === NEW_LISTING ? setSelectedNewListingTemplate(value) : setSelectedSoldListingTemplate(value));
    const setSelectedColor = value => (listingType === NEW_LISTING ? setSelectedNewListingColor(value) : setSelectedSoldListingColor(value));
    const shortenedURL = listingType === NEW_LISTING ? shortenedNewListingTeamURL : shortenedSoldListingTeamURL;
    const placeholder = listingType === NEW_LISTING ? 'Campaign will not be enabled for new listings' : 'Campaign will not be enabled for sold listings';
    const targetOn = listingType === NEW_LISTING ? 'Generate new listing campaigns' : 'Generate sold listing campaigns';
    const cta = listingType === NEW_LISTING ? initialValues[`${NEW_LISTING}_actionURL`] : initialValues[`${SOLD_LISTING}_actionURL`];

    const kwklyEnabled = listingType === NEW_LISTING ? newListingKwklyEnabled : soldListingKwklyEnabled;
    const setKwklyEnabled = listingType === NEW_LISTING ? setNewListingKwklyEnabled : setSoldListingKwklyEnabled;

    return (
      <Segment>
        <Header size="medium">
          {targetOn}: &nbsp;
          <Field name={`${listingType}_createMailoutsOfThisType`} type="checkbox">
            {props => {
              if (props.input.checked !== radioValue) {
                props.input.onChange(radioValue);
              }

              return (
                <Radio
                  toggle
                  name={props.input.name}
                  onChange={(param, data) => [props.input.onChange(data.checked), radioToggleFx(data.checked)]}
                  checked={radioValue}
                  style={{ verticalAlign: 'bottom' }}
                />
              );
            }}
          </Field>
        </Header>
        <Condition when={`${listingType}_createMailoutsOfThisType`} is={true}>
          <div
            style={
              isMobile()
                ? {}
                : {
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr .75fr',
                    gridTemplateRows: '4em 4em 3em 6em',
                    gridTemplateAreas: `
                      "ChooseTemplate Headline Headline"
                      "ChooseTemplate NumberOfPostcards NumberOfPostcards"
                      "ChooseTemplate NumberOfPostcards NumberOfPostcards"
                      "BrandColor CallToAction ShortenedURL"
                      "BrandColor Kwkly KwklyToggle"
                        `,
                    gridRowGap: '1em',
                    gridColumnGap: '2em',
                  }
            }
          >
            <div style={{ gridArea: 'ChooseTemplate' }}>
              {renderCarouselField({ name: `${listingType}_template`, label: 'Choose template', type: 'template', validate: required })}
            </div>
            <div style={{ gridArea: 'BrandColor' }}>
              {renderCarouselField({ name: `${listingType}_color`, label: 'Brand color', type: 'color', validate: required })}
            </div>
            <div style={{ gridArea: 'Headline' }}>
              {renderField({
                name: `${listingType}_headline`,
                label: labelWithPopup('Headline', popup('Some message')),
                type: 'text',
                validate: composeValidators(required, maxLength(headingMaxValue)),
              })}
            </div>
            <div style={{ gridArea: 'NumberOfPostcards' }}>
              {
                <div>
                  <Header as="h4" style={{ marginBottom: '28px' }}>
                    Number of postcards to send per listing
                  </Header>
                  <div
                    style={
                      isMobile()
                        ? {}
                        : {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gridTemplateRows: '2fr',
                            gridTemplateAreas: `
                            "PostcardsSlider PostcardsSlider PostcardsSlider"
                          `,
                            gridRowGap: '2em',
                            gridColumnGap: '2em',
                          }
                    }
                  >
                    <FormSpy>
                      {props => {
                        props.values[`${listingType}_numberOfPostcardsDefaults`] = props.values[`${listingType}_numberOfPostcardsDefaults`].map(val => {
                          let retVal = val;
                          if (typeof val === 'string') return parseInt(val.split(': ')[1], 10);
                          return retVal;
                        });

                        const template = props.values[`${listingType}_template`];
                        const color = props.values[`${listingType}_color`];
                        setSelectedTemplate(template);
                        setSelectedColor(color);

                        if (cta) props.values[`${listingType}_actionURL`] = cta;

                        return <span> </span>;
                      }}
                    </FormSpy>

                    <Field name={`${listingType}_numberOfPostcardsDefaults`}>
                      {props => (
                        <div className="slider" style={{ gridArea: 'PostcardsSlider', padding: '0 0.5em' }}>
                          {isMobile() && (
                            <Fragment>
                              <br />
                              <br />
                            </Fragment>
                          )}
                          <Nouislider
                            style={{ height: '3px' }}
                            range={{
                              min: MIN,
                              max: MAX,
                            }}
                            step={STEPS}
                            start={props.input.value || SLIDER_INITIAL_VALUES}
                            margin={MARGIN}
                            connect={true}
                            behaviour="tap-drag"
                            tooltips={true}
                            pips={{
                              mode: 'values',
                              values: [100, 250, 500, 1000, 2000],
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
                                else return newValue[1];
                              },
                            }}
                            onChange={props.input.onChange}
                          />
                          {isMobile() && (
                            <Fragment>
                              <br />
                              <br />
                            </Fragment>
                          )}
                        </div>
                      )}
                    </Field>
                  </div>
                </div>
              }
            </div>
            <div style={{ gridArea: 'CallToAction' }}>
              {renderUrlField({
                name: `${listingType}_actionURL`,
                label: labelWithPopup('Call to action URL', popup('Some message')),
                type: 'text',
                dispatch: dispatch,
                validate: kwklyEnabled ? null : composeValidators(required, url),
                target: listingType,
                disabled: kwklyEnabled,
                form: 'team',
              })}
            </div>
            <div style={{ gridArea: 'ShortenedURL' }}>
              <FormSpy>
                {props => {
                  let urlCallError;

                  if (listingType === NEW_LISTING) {
                    urlCallError = (shortenedURLError && shortenedURLError.onSaveListed) || (shortenedURLError && shortenedURLError.onGetListed);
                  }

                  if (listingType === SOLD_LISTING) {
                    urlCallError = (shortenedURLError && shortenedURLError.onSaveSold) || (shortenedURLError && shortenedURLError.onGetSold);
                  }

                  if (urlCallError) props.errors[`${listingType}_actionURL`] = urlCallError;

                  return <span> </span>;
                }}
              </FormSpy>

              {shortenedURL && (
                <Label style={{ marginTop: !isMobile() && '2em' }}>
                  <Icon name="linkify" />
                  Shortened URL:
                  <Label.Detail>
                    <Menu.Item href={'https://' + shortenedURL} position="left" target="_blank">
                      <span>
                        {shortenedURL} {popup('Some message')}
                      </span>
                    </Menu.Item>
                  </Label.Detail>
                </Label>
              )}
            </div>

            <div style={{ gridArea: 'Kwkly' }}>
              {renderUrlField({
                name: `${listingType}_kwkly`,
                label: labelWithPopup('KWKLY Call to Action', popup('Some message')),
                type: 'text',
                dispatch: dispatch,
                validate: !kwklyEnabled ? null : composeValidators(required, maxLength(44)),
                target: listingType,
                disabled: !kwklyEnabled,
              })}
            </div>
            <div style={{ gridArea: 'KwklyToggle' }}>
              <Radio
                toggle
                label="Enable Kwkly"
                onChange={() => setKwklyEnabled(!kwklyEnabled)}
                checked={kwklyEnabled}
                onClick={() => setKwklyEnabled(!kwklyEnabled)}
                style={{ marginTop: '2.25em', opacity: kwklyEnabled ? '1' : '0.4' }}
              />
            </div>
          </div>
        </Condition>
        <Condition when={`${listingType}_createMailoutsOfThisType`} is={false}>
          <Segment placeholder>
            <Header textAlign="center">{placeholder}</Header>
            <Image src={require('../../assets/undraw_choice_9385.png')} style={{ margin: 'auto', maxWidth: '500px' }} />
          </Segment>
        </Condition>
      </Segment>
    );
  };

  return (
    <Fragment>
      <Segment>
        <Header as="h1">
          Team Customization
          <Header.Subheader>
            Set the default template customization options for your team. Changes made here will not overwrite existing user-specific customization.
          </Header.Subheader>
        </Header>
      </Segment>

      <Confirm
        open={showSelectionAlert}
        content="In order to use Bravity Marketing platform, you must select at least one"
        cancelButton="Enable new listings"
        confirmButton="Enable sold listings"
        onCancel={() => [setNewListingEnabled(true), setTogglePages('first')]}
        onConfirm={() => [setSoldListingEnabled(true), setTogglePages('last')]}
      />

      <CustomizationWizard initialValues={initialValues} onSubmit={onSubmit} togglePages={togglePages} setTogglePages={setTogglePages}>
        {formPage({ listingType: NEW_LISTING })}

        {formPage({ listingType: SOLD_LISTING })}
      </CustomizationWizard>

      <Modal open={displayReview} basic size="tiny">
        {!teamPostcardsPreviewIsPending && <Modal.Header>Preview</Modal.Header>}

        {!teamCustomizationPending && (teamPostcardsPreviewError || teamCustomizationError) && <Modal.Header>Error</Modal.Header>}

        {teamPostcardsPreviewIsPending && <LoadingWithMessage message="Please wait, loading an example preview..." />}

        {!teamCustomizationPending && (teamPostcardsPreviewError || teamCustomizationError) && (
          <Modal.Content style={{ padding: '0 45px 10px' }}>{teamPostcardsPreviewError || teamCustomizationError}</Modal.Content>
        )}

        {newListingEnabled &&
          teamPostcardsPreview &&
          teamPostcardsPreview.listed &&
          teamPostcardsPreview.listed.sampleBackLargeUrl &&
          teamPostcardsPreview.listed.sampleFrontLargeUrl && (
            <Modal.Content image style={{ padding: '0 45px 10px' }}>
              <FlipCard isFlipped={listedIsFlipped}>
                <Image wrapped size="large" src={teamPostcardsPreview.listed.sampleFrontLargeUrl} onMouseOver={() => setListedIsFlipped(!listedIsFlipped)} />

                <Image wrapped size="large" src={teamPostcardsPreview.listed.sampleBackLargeUrl} onMouseOver={() => setListedIsFlipped(!listedIsFlipped)} />
              </FlipCard>
            </Modal.Content>
          )}

        {soldListingEnabled &&
          teamPostcardsPreview &&
          teamPostcardsPreview.sold &&
          teamPostcardsPreview.sold.sampleBackLargeUrl &&
          teamPostcardsPreview.sold.sampleFrontLargeUrl && (
            <Modal.Content image style={{ padding: '10px 45px 0' }}>
              <FlipCard isFlipped={soldIsFlipped}>
                <Image wrapped size="large" src={teamPostcardsPreview.sold.sampleFrontLargeUrl} onMouseOver={() => setSoldIsFlipped(!soldIsFlipped)} />

                <Image wrapped size="large" src={teamPostcardsPreview.sold.sampleBackLargeUrl} onMouseOver={() => setSoldIsFlipped(!soldIsFlipped)} />
              </FlipCard>
            </Modal.Content>
          )}

        {!teamPostcardsPreviewIsPending && (
          <Modal.Actions>
            <Button basic color="red" inverted onClick={() => setDisplayReview(false)}>
              <Icon name="remove" /> Edit
            </Button>
            <Button color="green" inverted onClick={handleReviewComplete}>
              <Icon name="checkmark" /> Continue
            </Button>
          </Modal.Actions>
        )}

        {!teamCustomizationPending && (teamPostcardsPreviewError || teamCustomizationError) && (
          <Modal.Actions>
            <Button basic color="red" inverted onClick={() => setDisplayReview(false)}>
              <Icon name="remove" /> OK
            </Button>
          </Modal.Actions>
        )}
      </Modal>
    </Fragment>
  );
};

export default CustomizeTeamForm;
