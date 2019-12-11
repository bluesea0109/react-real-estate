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
import './thin.css';

const NEW_LISTING = 'newListing';
const SOLD_LISTING = 'soldListing';

const MIN = 100;
const MAX = 2000;
const INCREMENT = 10;
const STEPS = INCREMENT;
const MARGIN = INCREMENT;
const SLIDER_INITIAL_VALUES = [200, 300, 1000];

const CustomizeForm = () => {
  const dispatch = useDispatch();
  const [newListingEnabled, setNewListingEnabled] = useState(true);
  const [soldListingEnabled, setSoldListingEnabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [selectedNewListingTemplate, setSelectedNewListingTemplate] = useState(templates[0].key);
  const [selectedSoldListingTemplate, setSelectedSoldListingTemplate] = useState(templates[0].key);
  const [selectedNewListingColor, setSelectedNewListingColor] = useState(colors[0]);
  const [selectedSoldListingColor, setSelectedSoldListingColor] = useState(colors[0]);

  const bookmarkTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.bookmark);
  const ribbonTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.ribbon);
  const stackTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.stack);

  const shortenedNewListingURL = useSelector(store => store.teamShortcode && store.teamShortcode.listed);
  const shortenedSoldListingURL = useSelector(store => store.teamShortcode && store.teamShortcode.sold);

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
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [newListingEnabled, soldListingEnabled, setShowAlert]);

  const onSubmit = values => {
    console.log('form values: ', values);
    // await sleep(300);
    // window.alert(JSON.stringify(values, 0, 2));
  };

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
            {props => (
              <Radio
                toggle
                name={props.input.name}
                onChange={(param, data) => [props.input.onChange(data.checked), radioToggleFx(data.checked)]}
                checked={radioValue}
                // checked={props.input.checked}
                style={{ verticalAlign: 'bottom' }}
              />
            )}
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
                    gridTemplateRows: '4fr 3fr 1fr 1fr',
                    gridTemplateAreas: `
                      "ChooseTemplate BrandColor"
                      "Headline NumberOfPostcards"
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
                            "Min Target Max"
                            "Slider Slider Slider"
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

                      return (
                        <Fragment>
                          <Input style={{ gridArea: 'Min', opacity: 1, userSelect: 'none' }} labelPosition="right" disabled>
                            <input style={{ width: 'unset' }} value={values[0]} readOnly />
                            <Label>Min</Label>
                          </Input>

                          <Input style={{ gridArea: 'Target', opacity: 1, userSelect: 'none' }} labelPosition="right" disabled>
                            <input style={{ width: 'unset' }} value={values[1]} readOnly />
                            <Label>Default</Label>
                          </Input>

                          <Input style={{ gridArea: 'Max', opacity: 1, userSelect: 'none' }} labelPosition="right" disabled>
                            <input style={{ width: 'unset' }} value={values[2]} readOnly />
                            <Label>Max</Label>
                          </Input>
                        </Fragment>
                      );
                    }}
                  </FormSpy>

                  <Field name={`${listingType}_numberOfPostcardsDefaults`}>
                    {props => (
                      <div className="slider" style={{ gridArea: 'Slider', padding: '0 0.5em' }}>
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
              validate: composeValidators(required, url),
              target: listingType,
            })}
          </div>
          <div style={{ gridArea: 'ShortenedURL' }}>
            Shortened URL: {shortenedURL} {popup('Some message')}
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
        open={showAlert}
        content="In order to use Bravity Marketing platform, you must select at least one"
        cancelButton="Enable new listings"
        confirmButton="Enable sold listings"
        onCancel={() => setNewListingEnabled(true)}
        onConfirm={() => setSoldListingEnabled(true)}
      />

      <CustomizationWizard
        initialValues={{
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
        }}
        onSubmit={onSubmit}
      >
        {formPage({ listingType: NEW_LISTING })}

        {formPage({ listingType: SOLD_LISTING })}
      </CustomizationWizard>
    </Fragment>
  );
};

export default CustomizeForm;
