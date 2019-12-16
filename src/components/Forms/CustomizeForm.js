import Nouislider from 'nouislider-react';
import { Field, FormSpy } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment, useEffect, useState } from 'react';
import { Confirm, Header, Label, Radio } from 'semantic-ui-react';

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
import { Icon, Menu, Segment } from '../Base';
import CustomizationWizard from './CustomizationWizard';

import { saveCustomizationPending } from '../../store/modules/customization/actions';
import { getTeamListedShortcodePending, getTeamSoldShortcodePending } from '../../store/modules/teamShortcode/actions';

import './thin.css';

const NEW_LISTING = 'newListing';
const SOLD_LISTING = 'soldListing';

const MIN = 100;
const MAX = 2000;
const INCREMENT = 10;
const STEPS = INCREMENT;
const MARGIN = INCREMENT;
const SLIDER_INITIAL_VALUES = [300];

const CustomizeTeamForm = () => {
  const dispatch = useDispatch();
  const [newListingEnabled, setNewListingEnabled] = useState(true);
  const [soldListingEnabled, setSoldListingEnabled] = useState(false);
  const [showSelectionAlert, setShowSelectionAlert] = useState(false);
  const [onlyOnce, setOnlyOnce] = useState(false);
  const [togglePages, setTogglePages] = useState('');

  const [selectedNewListingTemplate, setSelectedNewListingTemplate] = useState(templates[0].key);
  const [selectedSoldListingTemplate, setSelectedSoldListingTemplate] = useState(templates[0].key);
  const [selectedNewListingColor, setSelectedNewListingColor] = useState(colors[0]);
  const [selectedSoldListingColor, setSelectedSoldListingColor] = useState(colors[0]);

  const bookmarkTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.bookmark);
  const ribbonTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.ribbon);
  const stackTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.stack);

  const shortenedNewListingTeamURL = useSelector(store => store.teamShortcode && store.teamShortcode.listed);
  const shortenedSoldListingTeamURL = useSelector(store => store.teamShortcode && store.teamShortcode.sold);
  const shortenedNewListingURL = useSelector(store => store.shortcode && store.shortcode.listed);
  const shortenedSoldListingURL = useSelector(store => store.shortcode && store.shortcode.sold);

  const tc = useSelector(store => store.teamCustomization && store.teamCustomization.available);

  const isMultimode = useSelector(store => store.onLogin.mode === 'multiuser');
  // const custError = useSelector(store => store.customization && store.customization.error);
  // const cust = useSelector(store => store.customization && store.customization.available);

  const resolveTemplate = type => {
    const types = {
      'alf-theme-ribbon': ribbonTemplate,
      'alf-theme-bookmark': bookmarkTemplate,
      'alf-theme-stack': stackTemplate,
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

  const returnIfNotEqual = (x, y) => (x !== y ? x : undefined);

  const onSubmit = values => {
    let data;
    if (isMultimode) {
      data = {
        listed: {
          createMailoutsOfThisType: returnIfNotEqual(values.newListing_createMailoutsOfThisType, tc.listed.createMailoutsOfThisType),
          mailoutSize: returnIfNotEqual(values.newListing_numberOfPostcardsDefaults[0], tc.listed.mailoutSize),
          templateTheme: returnIfNotEqual(values.newListing_template, tc.listed.templateTheme),
          brandColor: returnIfNotEqual(values.newListing_color, tc.listed.brandColor),
          cta: returnIfNotEqual(values.newListing_actionURL, tc.listed.cta),
          shortenCTA: values.newListing_actionURL !== tc.listed.cta ? true : undefined,
          // kwkly: "string",
          frontHeadline: returnIfNotEqual(values.newListing_headline, tc.listed.frontHeadline),
        },
        sold: {
          createMailoutsOfThisType: returnIfNotEqual(values.soldListing_createMailoutsOfThisType, tc.sold.createMailoutsOfThisType),
          mailoutSize: returnIfNotEqual(values.soldListing_numberOfPostcardsDefaults[0], tc.sold.mailoutSize),
          templateTheme: returnIfNotEqual(values.soldListing_template, tc.sold.templateTheme),
          brandColor: returnIfNotEqual(values.soldListing_color, tc.sold.brandColor),
          cta: returnIfNotEqual(values.soldListing_actionURL, tc.sold.cta),
          shortenCTA: values.soldListing_actionURL !== tc.sold.cta ? true : undefined,
          // kwkly: "string",
          frontHeadline: returnIfNotEqual(values.soldListing_headline, tc.sold.frontHeadline),
        },
      };
    } else {
      data = {
        listed: {
          createMailoutsOfThisType: values.newListing_createMailoutsOfThisType,
          mailoutSize: values.newListing_numberOfPostcardsDefaults[0],
          templateTheme: values.newListing_template,
          brandColor: values.newListing_color,
          cta: values.newListing_actionURL,
          shortenCTA: true,
          // kwkly: "string",
          frontHeadline: values.newListing_headline,
        },
        sold: {
          createMailoutsOfThisType: values.soldListing_createMailoutsOfThisType,
          mailoutSize: values.soldListing_numberOfPostcardsDefaults[0],
          templateTheme: values.soldListing_template,
          brandColor: values.soldListing_color,
          cta: values.soldListing_actionURL,
          shortenCTA: true,
          // kwkly: "string",
          frontHeadline: values.soldListing_headline,
        },
      };
    }

    dispatch(saveCustomizationPending(data));
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
      [`${NEW_LISTING}_numberOfPostcardsDefaults`]: [tc.listed.mailoutSize],
      [`${NEW_LISTING}_actionURL`]: tc.listed.cta,

      [`${SOLD_LISTING}_createMailoutsOfThisType`]: tc.sold.createMailoutsOfThisType,
      [`${SOLD_LISTING}_template`]: tc.sold.templateTheme,
      [`${SOLD_LISTING}_color`]: tc.sold.brandColor,
      [`${SOLD_LISTING}_headline`]: tc.sold.frontHeadline,
      [`${SOLD_LISTING}_numberOfPostcardsDefaults`]: [tc.sold.mailoutSize],
      [`${SOLD_LISTING}_actionURL`]: tc.sold.cta,
    };

    if (!onlyOnce) {
      setOnlyOnce(true);

      if (tc.listed.createMailoutsOfThisType !== newListingEnabled) setNewListingEnabled(tc.listed.createMailoutsOfThisType);
      if (tc.sold.createMailoutsOfThisType !== soldListingEnabled) setSoldListingEnabled(tc.sold.createMailoutsOfThisType);

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

    let cta;
    let shortenedURL;
    if (isMultimode) {
      shortenedURL = listingType === NEW_LISTING ? shortenedNewListingTeamURL : shortenedSoldListingTeamURL;
      if (tc) {
        cta = listingType === NEW_LISTING ? initialValues[`${NEW_LISTING}_actionURL`] : initialValues[`${SOLD_LISTING}_actionURL`];
      }
    } else {
      shortenedURL = listingType === NEW_LISTING ? shortenedNewListingURL : shortenedSoldListingURL;
    }

    const placeholder = listingType === NEW_LISTING ? 'Campaign will not be enabled for new listings' : 'Campaign will not be enabled for sold listings';
    const targetOn = listingType === NEW_LISTING ? 'Generate new listing campaigns' : 'Generate sold listing campaigns';

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
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: '4em 4em 4em 6em 2em',
                    gridTemplateAreas: `
                      "ChooseTemplate Headline"
                      "ChooseTemplate NumberOfPostcards"
                      "ChooseTemplate NumberOfPostcards"
                      "BrandColor CallToAction"
                      "BrandColor ShortenedURL"
                    `,
                    gridRowGap: '1em',
                    gridColumnGap: '2em',
                  }
            }
          >
            <FormSpy>
              {props => {
                const template = props.values[`${listingType}_template`];
                const color = props.values[`${listingType}_color`];
                setSelectedTemplate(template);
                setSelectedColor(color);

                if (cta) props.values[`${listingType}_actionURL`] = cta;

                return <span> </span>;
              }}
            </FormSpy>
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
                  <Header as="h4" style={{ marginBottom: '38px' }}>
                    Number of postcards to send per listing
                  </Header>
                  <div
                    style={
                      isMobile()
                        ? {}
                        : {
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gridTemplateRows: '2fr',
                            gridTemplateAreas: `
                            "PostcardsSlider"
                          `,
                            gridRowGap: '3em',
                            gridColumnGap: '2em',
                          }
                    }
                  >
                    <Field name={`${listingType}_numberOfPostcardsDefaults`}>
                      {props => {
                        let newMin;
                        let newMax;

                        if (tc) {
                          newMin = listingType === NEW_LISTING ? tc.listed.mailoutSizeMin : tc.sold.mailoutSizeMin;
                          newMax = listingType === NEW_LISTING ? tc.listed.mailoutSizeMax : tc.sold.mailoutSizeMax;
                        }

                        if (!isMultimode) {
                          newMin = MIN;
                          newMax = MAX;
                        }

                        if (!newMin || !newMax) return <span>Loading... </span>;

                        return (
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
                                min: newMin,
                                max: newMax,
                              }}
                              step={STEPS}
                              start={props.input.value || SLIDER_INITIAL_VALUES}
                              margin={MARGIN}
                              connect={true}
                              behaviour="tap-drag"
                              tooltips={true}
                              pips={{
                                mode: 'values',
                                values: [newMin, newMax],
                                stepped: true,
                                density: 3,
                              }}
                              format={{
                                to: (value, i) => {
                                  return Math.round(parseInt(value, 10) / 10) * 10;
                                },
                                from: value => value,
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
                        );
                      }}
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
                validate: composeValidators(required, url),
                target: listingType,
              })}
            </div>
            <div style={{ gridArea: 'ShortenedURL' }}>
              {shortenedURL && (cta || !isMultimode) && (
                <Label>
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
          </div>
        </Condition>
        <Condition when={`${listingType}_createMailoutsOfThisType`} is={false}>
          <Segment placeholder>
            <Header icon>
              <Icon name="exclamation triangle" />
              {placeholder}
            </Header>
          </Segment>
        </Condition>
      </Segment>
    );
  };

  return (
    <Fragment>
      <Segment>
        <Header as="h1">
          My Customization
          <Header.Subheader>
            Set the default template customization options for your campaigns. Changes made here will overwrite existing team customization.
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
    </Fragment>
  );
};

export default CustomizeTeamForm;
