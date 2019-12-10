import React, { Fragment, useState } from 'react';
import { Form } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { Form as FinalForm } from 'react-final-form';

import {
  isMobile,
  required,
  maxLength,
  renderField,
  renderCarouselField,
  popup,
  labelWithPopup,
  renderSelectField,
  colors,
  templates,
  composeValidators,
  url,
  renderUrlField,
} from './helpers';
import { Button, Segment } from '../Base';
import RangeSlider from '../RangeSlider';

const CustomizeForm = ({ onboard = undefined, formType = undefined }) => {
  const dispatch = useDispatch();
  const [minValue, setMinValue] = useState(200);
  const [defaultValue, setDefaultValue] = useState(300);
  const [maxValue, setMaxValue] = useState(1000);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].key);
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const teammates = useSelector(store => store.team.profiles);
  const teamCustomizationError = useSelector(store => store.teamCustomization && store.teamCustomization.error);
  const bookmarkTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.bookmark);
  const ribbonTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.ribbon);
  const stackTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.stack);
  const newListingShortenedURL = useSelector(store => store.teamShortcode && store.teamShortcode.listed);
  const soldListingShortenedURL = useSelector(store => store.teamShortcode && store.teamShortcode.sold);

  const resolveTemplate = type => {
    const types = {
      'alf-theme-ribbon': ribbonTemplate,
      'alf-theme-bookmark': bookmarkTemplate,
      'alf-theme-stack': stackTemplate,
      undefined: undefined,
    };
    return type ? types[type] : types['undefined'];
  };

  const templateDefaults = resolveTemplate(selectedTemplate);

  const resolveListedOrSoldDefaults = type => {
    const types = {
      newListing: templateDefaults && templateDefaults.listed,
      soldListing: templateDefaults && templateDefaults.sold,
      undefined: undefined,
    };
    return type ? types[type] : types['undefined'];
  };

  const formDefaults = resolveListedOrSoldDefaults(formType);

  const frontHeadline = formDefaults && formDefaults.fields.filter(field => field.name === 'frontHeadline')[0];

  const resolveListedOrSoldURL = type => {
    const types = {
      newListing: newListingShortenedURL,
      soldListing: soldListingShortenedURL,
      undefined: undefined,
    };
    return type ? types[type] : types['undefined'];
  };

  const shortenedURL = resolveListedOrSoldURL(formType);

  const agents = [];

  if (!onboard && teammates.length > 0) {
    teammates.map((agent, index) => {
      return agents.push({
        key: index,
        text: `${agent.first} ${agent.last}`,
        value: agent.userId,
      });
    });
  }

  const onSubmit = values => {
    console.log('submitted: ', values);
    // saveProfile(values);
  };

  let initialValues;
  if (teamCustomizationError === '410 Gone') {
    initialValues = {
      color: selectedColor,
      template: selectedTemplate,
      headline: frontHeadline && frontHeadline.default,
    };
  }

  return (
    <Fragment>
      <FinalForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ handleSubmit, form, submitting, pristine, values }) => {
          values.mailoutSizeMin = minValue;
          values.mailoutSize = defaultValue;
          values.mailoutSizeMax = maxValue;

          if (values.template) setSelectedTemplate(values.template);
          if (values.color) setSelectedColor(values.color);

          return (
            <Form onSubmit={handleSubmit}>
              <Segment style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                <div
                  style={
                    isMobile()
                      ? {}
                      : {
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gridTemplateRows: onboard ? '4fr 3fr 1fr 1fr' : '4fr 3fr 1fr 1fr 1fr',
                          gridTemplateAreas: onboard
                            ? `
                          "ChooseTemplate BrandColor"
                          "Headline NumberOfPostcards"
                          "CallToAction CallToAction"
                          "ShortenedURL ShortenedURL"
                        `
                            : `
                          "ChooseTemplate BrandColor"
                          "Agent Agent"
                          "Headline NumberOfPostcards"
                          "CallToAction CallToAction"
                          "ShortenedURL ShortenedURL"
                        `,
                          gridRowGap: '1em',
                          gridColumnGap: '2em',
                        }
                  }
                >
                  {!onboard ? (
                    <div style={{ gridArea: 'Agent' }}>
                      {renderSelectField({
                        name: 'agent',
                        label: labelWithPopup('Choose agent to display on postcards', popup('Some message')),
                        type: 'text',
                        validate: required,
                        options: agents,
                        search: true,
                      })}
                    </div>
                  ) : (
                    undefined
                  )}

                  <div style={{ gridArea: 'BrandColor' }}>
                    {renderCarouselField({ name: 'color', label: 'Brand color', type: 'color', validate: required })}
                  </div>
                  <div style={{ gridArea: 'ChooseTemplate' }}>
                    {renderCarouselField({ name: 'template', label: 'Choose template', type: 'template', validate: required })}
                  </div>
                  <div style={{ gridArea: 'Headline' }}>
                    {renderField({
                      name: 'headline',
                      label: labelWithPopup('Headline', popup('Some message')),
                      type: 'text',
                      validate: composeValidators(required, maxLength(frontHeadline && frontHeadline.max)),
                    })}
                  </div>
                  <div style={{ gridArea: 'NumberOfPostcards' }}>
                    {RangeSlider({
                      label: 'Number of postcards to send per listing',
                      minValue,
                      setMinValue,
                      defaultValue,
                      setDefaultValue,
                      maxValue,
                      setMaxValue,
                    })}
                  </div>
                  <div style={{ gridArea: 'CallToAction' }}>
                    {renderUrlField({
                      name: 'actionURL',
                      label: labelWithPopup('Call to action URL', popup('Some message')),
                      type: 'text',
                      dispatch: dispatch,
                      validate: composeValidators(required, url),
                      target: formType,
                    })}
                  </div>
                  <div style={{ gridArea: 'ShortenedURL' }}>
                    Shortened URL: {shortenedURL} {popup('Some message')}
                  </div>
                </div>
              </Segment>

              <div style={{ display: 'grid', justifyContent: 'end' }}>
                <span>
                  <Button basic type="button" onClick={form.reset} disabled={submitting || pristine} color="teal">
                    Discard
                  </Button>
                  <Button type="submit" disabled={submitting} color="teal">
                    Save
                  </Button>
                </span>
              </div>

              <pre>{JSON.stringify(values, null, 2)}</pre>
            </Form>
          );
        }}
      />
    </Fragment>
  );
};

export default CustomizeForm;
