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
import { Input, Segment } from '../Base';
import CustomizationWizard from './CustomizationWizard';
import { saveTeamCustomizationPending } from '../../store/modules/teamCustomization/actions';
import { getTeamListedShortcodePending, getTeamSoldShortcodePending } from '../../store/modules/teamShortcode/actions';

import './thin.css';

const NEW_LISTING = 'newListing';
const SOLD_LISTING = 'soldListing';

const MIN = 100;
const MAX = 2000;
const INCREMENT = 10;
const STEPS = INCREMENT;
const MARGIN = INCREMENT;
let SLIDER_INITIAL_VALUES = [200, 300, 1000];

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

  const shortenedNewListingURL = useSelector(store => store.teamShortcode && store.teamShortcode.listed);
  const shortenedSoldListingURL = useSelector(store => store.teamShortcode && store.teamShortcode.sold);

  const tcError = useSelector(store => store.teamCustomization && store.teamCustomization.error);
  const tc = useSelector(store => store.teamCustomization && store.teamCustomization.available);

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

  // if (!frontHeadlineNewListing || !frontHeadlineSoldListing) return null;
  // if (!(tcError === '410 Gone') && !tc) return null;

  const onSubmit = values => {
    const data = {
      listed: {
        createMailoutsOfThisType: values.newListing_createMailoutsOfThisType,
        mailoutSize: values.newListing_numberOfPostcardsDefaults[1],
        mailoutSizeMin: values.newListing_numberOfPostcardsDefaults[0],
        mailoutSizeMax: values.newListing_numberOfPostcardsDefaults[2],
        templateTheme: values.newListing_template,
        brandColor: values.newListing_color,
        cta: values.newListing_actionURL,
        shortenCTA: true,
        // kwkly: "string",
        frontHeadline: values.newListing_headline,
      },
      sold: {
        createMailoutsOfThisType: values.soldListing_createMailoutsOfThisType,
        mailoutSize: values.soldListing_numberOfPostcardsDefaults[1],
        mailoutSizeMin: values.soldListing_numberOfPostcardsDefaults[0],
        mailoutSizeMax: values.soldListing_numberOfPostcardsDefaults[2],
        templateTheme: values.soldListing_template,
        brandColor: values.soldListing_color,
        cta: values.soldListing_actionURL,
        shortenCTA: true,
        // kwkly: "string",
        frontHeadline: values.soldListing_headline,
      },
    };

    dispatch(saveTeamCustomizationPending(data));
  };

  let initialValues;

  if (tcError === '410 Gone') {
    initialValues = {
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
  } else {
    if (tc) {
      initialValues = {
        [`${NEW_LISTING}_createMailoutsOfThisType`]: tc.listed.createMailoutsOfThisType,
        [`${NEW_LISTING}_template`]: tc.listed.templateTheme,
        [`${NEW_LISTING}_color`]: tc.listed.brandColor,
        [`${NEW_LISTING}_headline`]: tc.listed.frontHeadline,
        [`${NEW_LISTING}_numberOfPostcardsDefaults`]: [tc.listed.mailoutSizeMin, tc.listed.mailoutSize, tc.listed.mailoutSizeMax],
        [`${NEW_LISTING}_actionURL`]: tc.listed && tc.listed.cta,

        [`${SOLD_LISTING}_createMailoutsOfThisType`]: tc.sold.createMailoutsOfThisType,
        [`${SOLD_LISTING}_template`]: tc.sold.templateTheme,
        [`${SOLD_LISTING}_color`]: tc.sold.brandColor,
        [`${SOLD_LISTING}_headline`]: tc.sold.frontHeadline,
        [`${SOLD_LISTING}_numberOfPostcardsDefaults`]: [tc.sold.mailoutSizeMin, tc.sold.mailoutSize, tc.sold.mailoutSizeMax],
        [`${SOLD_LISTING}_actionURL`]: tc.sold && tc.sold.cta,
      };
    }
  }

  if (!(tcError === '410 Gone') && tc) {
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
    const shortenedURL = listingType === NEW_LISTING ? shortenedNewListingURL : shortenedSoldListingURL;
    const placeholder = listingType === NEW_LISTING ? 'Campaign will not be enabled for new listings' : 'Campaign will not be enabled for sold listings';

    return (
      <Segment>
        <Header size="medium">
          Target on new: &nbsp;
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
                    gridTemplateRows: '230px 120px 40px 40px 20px',
                    gridTemplateAreas: `
                      "ChooseTemplate BrandColor"
                      "Headline NumberOfPostcards"
                      "CallToAction CallToAction"
                      "CallToAction CallToAction"
                      "ShortenedURL ShortenedURL"
                        `,
                    gridRowGap: '1em',
                    gridColumnGap: '2em',
                  }
            }
          >
            <div style={{ gridArea: 'BrandColor' }}>
              {renderCarouselField({ name: `${listingType}_color`, label: 'Brand color', type: 'color', validate: required })}
            </div>
            <div style={{ gridArea: 'ChooseTemplate' }}>
              {renderCarouselField({ name: `${listingType}_template`, label: 'Choose template', type: 'template', validate: required })}
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
                  <Header as="h4" style={{ marginBottom: 0 }}>
                    Number of postcards to send per listing
                  </Header>
                  <div
                    style={
                      isMobile()
                        ? {}
                        : {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gridTemplateRows: '1fr 2fr',
                            gridTemplateAreas: `
                            "PostcardsMin PostcardsTarget PostcardsMax"
                            "PostcardsSlider PostcardsSlider PostcardsSlider"
                          `,
                            gridRowGap: '3em',
                            gridColumnGap: '2em',
                          }
                    }
                  >
                    <FormSpy>
                      {props => {
                        const values = props.values[`${listingType}_numberOfPostcardsDefaults`];

                        const template = props.values[`${listingType}_template`];
                        const color = props.values[`${listingType}_color`];
                        setSelectedTemplate(template);
                        setSelectedColor(color);

                        if (!values[0] || !values[1] || !values[2]) return null;

                        return (
                          <Fragment>
                            <Input style={{ gridArea: 'PostcardsMin', opacity: 1, userSelect: 'none' }} labelPosition="right" disabled>
                              <input style={{ width: 'unset' }} value={values && values[0]} readOnly />
                              <Label>Min</Label>
                            </Input>

                            <Input style={{ gridArea: 'PostcardsTarget', opacity: 1, userSelect: 'none' }} labelPosition="right" disabled>
                              <input style={{ width: 'unset' }} value={values && values[1]} readOnly />
                              <Label>Default</Label>
                            </Input>

                            <Input style={{ gridArea: 'PostcardsMax', opacity: 1, userSelect: 'none' }} labelPosition="right" disabled>
                              <input style={{ width: 'unset' }} value={values && values[2]} readOnly />
                              <Label>Max</Label>
                            </Input>
                          </Fragment>
                        );
                      }}
                    </FormSpy>

                    <Field name={`${listingType}_numberOfPostcardsDefaults`}>
                      {props => {
                        if (SLIDER_INITIAL_VALUES !== props.input.value) SLIDER_INITIAL_VALUES = props.input.value;

                        return (
                          <div className="slider" style={{ gridArea: 'PostcardsSlider', padding: '0 0.5em' }}>
                            {isMobile() && (
                              <br>
                                {' '}
                                <br />{' '}
                              </br>
                            )}
                            <Nouislider
                              style={{ height: '3px' }}
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
                                values: [100, 250, 500, 1000, 2000],
                                stepped: true,
                                density: 3,
                              }}
                              format={{
                                to: value => Math.round(parseInt(value, 10) / 10) * 10,
                                from: value => value,
                              }}
                              onChange={props.input.onChange}
                            />
                            {isMobile() && (
                              <br>
                                {' '}
                                <br />{' '}
                              </br>
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
              Shortened URL: {shortenedURL} {popup('Some message')}
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
    </Fragment>
  );
};

export default CustomizeTeamForm;
