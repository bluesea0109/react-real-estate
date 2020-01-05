import _ from 'lodash';
import React, { Fragment } from 'react';
import { Label } from 'semantic-ui-react';
import { Dropdown } from 'semantic-ui-react';
import * as isURL from 'validator/lib/isURL';
// import * as isInt from 'validator/lib/isInt';
import * as isEmail from 'validator/lib/isEmail';
import { Field, FormSpy } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Card, Form, Header, Image, Item, Popup } from '../Base';
import { ButtonBack, ButtonNext, CarouselProvider, Slide, Slider } from 'pure-react-carousel';
import { uploadPhotoPending, deletePhotoPending } from '../../store/modules/pictures/actions';
import { saveListedShortcodePending, saveSoldShortcodePending } from '../../store/modules/shortcode/actions';
import { saveTeamListedShortcodePending, saveTeamSoldShortcodePending } from '../../store/modules/teamShortcode/actions';

export const isValidURL = value => isURL(value, { require_protocol: true }) && isURL(value, { require_tld: true });
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const isEmpty = value => value === undefined || value === null || value === '';
export const email = value => !isEmpty(value) && !isEmail(value) && 'Invalid email address';
export const required = value => isEmpty(value) && 'Required field';
export const requiredOnlyInCalifornia = (value, condition) => {
  if (condition && condition.state === 'CA') {
    return value ? undefined : 'Required by state of California';
  }
  return undefined;
};
export const url = value => !isEmpty(value) && !isValidURL(value) && 'Invalid URL';

// export const minLength = min => value => !isEmpty(value) && value.length < min && `Must be at least ${min} characters`;
export const maxLength = max => value => !isEmpty(value) && value.length > max && `Must be no more than ${max} characters`;
// export const integer = value => !isInt(value) && 'Must be an integer';
// export const mustBeNumber = value => (isNaN(value) ? 'Must be a number' : undefined);
// export const minValue = min => value => (isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`);
export const composeValidators = (...validators) => value => validators.reduce((error, validator) => error || validator(value), undefined);

const mql = window.matchMedia('(max-width: 599px)');
export const isMobile = () => mql.matches;

// composeValidators(required, mustBeNumber, minValue(18))

export function objectIsEmpty(obj) {
  return !obj || Object.keys(obj).length === 0;
}

export function differenceObjectDeep(source, other) {
  return _.reduce(
    source,
    function(result, value, key) {
      if (_.isObject(value) && _.isObject(other[key])) {
        result[key] = differenceObjectDeep(value, other[key]);
      } else if (!_.isEqual(value, other[key])) {
        result[key] = other[key];
      }
      return result;
    },
    _.omit(other, _.keys(source))
  );
}

const disabledCss = {
  pointerEvents: 'none',
  opacity: 0.5,
};

export const renderSelectField = ({ name, label, type, options, required = undefined, validate, search = undefined, disabled = undefined }) => (
  <Field name={name} validate={validate}>
    {({ input, meta }) => (
      <Form.Field>
        <Header as="h4" style={{ margin: '0 0 .28571429rem 0' }}>
          {label}
          {required && !disabled ? <span style={{ margin: '-.2em 0 0 .2em', color: '#db2828' }}>*</span> : null}
        </Header>
        <Dropdown
          onChange={(param, data) => input.onChange(data.value)}
          value={input.value}
          options={options}
          name={name}
          label={label}
          type={type}
          required={required && !disabled}
          search={search}
          selection
          error={!disabled && meta.error && meta.touched}
          style={disabled ? disabledCss : {}}
        />
        {!disabled && meta.error && meta.touched && (
          <Label basic color="red" pointing>
            {meta.error}
          </Label>
        )}
      </Form.Field>
    )}
  </Field>
);

export const renderField = ({ name, label, type, required = undefined, validate, disabled = undefined }) => {
  if (typeof label !== 'string') {
    return (
      <Field name={name} validate={validate}>
        {({ input, meta }) => (
          <Form.Field required={required}>
            {label}
            <Form.Input {...input} type={type} error={meta.error && meta.touched && { content: `${meta.error}` }} style={disabled ? disabledCss : {}} />
          </Form.Field>
        )}
      </Field>
    );
  } else {
    return (
      <Field name={name} validate={validate}>
        {({ input, meta }) => (
          <Form.Input
            required={required}
            {...input}
            type={type}
            label={label}
            error={meta.error && meta.touched && { content: `${meta.error}` }}
            style={disabled ? disabledCss : {}}
          />
        )}
      </Field>
    );
  }
};

export const renderUrlField = ({ name, label, type, dispatch, required = undefined, validate, target, disabled = undefined, form = undefined }) => {
  const onBlurHandler = e => {
    const eURL = e.target.value;

    if (form === 'team') {
      if (target === 'newListing' && isValidURL(eURL)) dispatch(saveTeamListedShortcodePending(eURL));
      if (target === 'soldListing' && isValidURL(eURL)) dispatch(saveTeamSoldShortcodePending(eURL));
    } else {
      if (target === 'newListing' && isValidURL(eURL)) dispatch(saveListedShortcodePending(eURL));
      if (target === 'soldListing' && isValidURL(eURL)) dispatch(saveSoldShortcodePending(eURL));
    }

    return null;
  };

  return (
    <Field name={name} validate={validate}>
      {({ input, meta }) => (
        <Fragment>
          <Form.Input
            required={required}
            {...input}
            type={type}
            label={label}
            error={meta.error && meta.touched && { content: `${meta.error}` }}
            onBlur={onBlurHandler}
            style={disabled ? disabledCss : {}}
          />
          <FormSpy subscription={{ values: true }}>
            {({ form, values }) => {
              if (!input.value && values[name]) {
                const e = { target: {} };
                e.target.value = values[name];
                onBlurHandler(e);
              }

              return <span> </span>;
            }}
          </FormSpy>
        </Fragment>
      )}
    </Field>
  );
};

export const renderPicturePickerField = ({ name, label, dispatch, required = undefined, validate }) => {
  const onChangeHandler = event => {
    const data = [name, event.target.files[0]];
    dispatch(uploadPhotoPending(data));
  };

  const onClickHandler = target => {
    dispatch(deletePhotoPending(target));
  };

  return (
    <Field name={name} validate={validate}>
      {({ input, meta }) => (
        <Form.Field required={required}>
          <div
            style={
              name === 'teamLogo'
                ? {
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    gridTemplateAreas: `"Label Func Func2" "Image Image Image"`,
                    width: '14em',
                  }
                : {
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gridTemplateAreas: `"Label Func" "Image Image"`,
                    width: '14em',
                  }
            }
          >
            <div style={{ gridArea: 'Label' }}>
              <Header as="h4">
                {label}
                {required ? <span style={{ margin: '-.2em 0 0 .2em', color: '#db2828' }}>*</span> : null}
              </Header>
            </div>
            <div style={{ gridArea: 'Func', justifySelf: 'end' }}>
              <Item as="label" htmlFor={name} style={{ cursor: 'pointer' }}>
                <Header as="h4" style={meta.error && meta.touched ? { color: 'red' } : { color: 'teal' }}>
                  Upload
                </Header>
                <input hidden id={name} type="file" onChange={onChangeHandler} />
              </Item>
            </div>

            {name === 'teamLogo' && (
              <div style={{ gridArea: 'Func2', justifySelf: 'end' }}>
                <Item as="label" style={{ cursor: 'pointer' }}>
                  <Header as="h4" style={meta.error && meta.touched ? { color: 'red' } : { color: 'teal' }} onClick={() => onClickHandler(name)}>
                    Delete
                  </Header>
                </Item>
              </div>
            )}

            <div style={{ gridArea: 'Image' /*margin: '-.8em 0'*/ }}>
              <Card
                style={
                  meta.error && meta.touched ? { maxHeight: '15em', overflow: 'hidden', border: '3px solid red' } : { maxHeight: '15em', overflow: 'hidden' }
                }
              >
                {input.value ? (
                  <Image size="tiny" src={input.value} wrapped ui={false} />
                ) : name === 'realtorPhoto' ? (
                  <Image size="tiny" src={require('../../assets/photo-placeholder.svg')} wrapped ui={false} />
                ) : (
                  <Image size="tiny" src={require('../../assets/image-placeholder.svg')} wrapped ui={false} />
                )}
              </Card>
              {meta.error && meta.touched && (
                <Label basic color="red" pointing>
                  {meta.error}
                </Label>
              )}
            </div>
          </div>
        </Form.Field>
      )}
    </Field>
  );
};

export const WhenFieldChanges = ({ field, becomes, set, to, when }) => (
  <Field name={set} subscription={{}}>
    {(
      // No subscription. We only use Field to get to the change function
      { input: { onChange } }
    ) => (
      <FormSpy subscription={{ values: true }}>
        {({ form, values }) => (
          <OnChange name={field}>
            {value => {
              if (when) {
                if (value === becomes || becomes === undefined) {
                  onChange(to);
                }
              }
            }}
          </OnChange>
        )}
      </FormSpy>
    )}
  </Field>
);

export const ExternalChanges = ({ whenTrue, set, to }) => (
  <Field name={set} subscription={{}}>
    {(
      // No subscription. We only use Field to get to the change function
      { input: { onChange } }
    ) => <FormSpy subscription={{}}>{({ form }) => <span>{whenTrue && onChange(to)}</span>}</FormSpy>}
  </Field>
);

export const colors = ['#b40101', '#f2714d', '#f4b450', '#79c34d', '#2d9a2c', '#59c4c4', '#009ee7', '#0e2b5b', '#ee83ee', '#8b288f', '#808080', '#000000'];

export const templates = [
  { key: 'ribbon', value: require('../../assets/ribbon-preview.png') },
  { key: 'bookmark', value: require('../../assets/bookmark-preview.png') },
  { key: 'stack', value: require('../../assets/stack-preview.png') },
];

const renderColorRadio = field => {
  return (
    <div>
      <Slide
        tag="a"
        index={field.radioValue}
        style={{
          minWidth: isMobile() && '60px',
          maxWidth: '150px',
          marginTop: isMobile() && '-2em',
        }}
      >
        <div style={{ margin: '1em' }}>
          <input
            type="radio"
            checked={field.input.value === field.radioValue}
            name={field.input.name}
            onChange={(e, { checked }) => field.input.onChange(field.radioValue)}
            style={{ visibility: 'hidden', display: 'none' }}
          />
          <div
            style={
              field.input.value === field.radioValue
                ? { border: '2px solid teal', margin: 0, padding: '0.5em', borderRadius: '5px' }
                : { border: '1px solid lightgray', margin: 0, padding: '0.5em', borderRadius: '5px' }
            }
          >
            <svg style={{ marginTop: '2px' }} viewBox="0 0 220 170" xmlns="http://www.w3.org/2000/svg" onClick={e => field.input.onChange(field.radioValue)}>
              <g color={`${field.hex}`}>
                <rect x="5" y="5" width="210" height="165" rx="5" fill="currentColor" />
              </g>
            </svg>
          </div>
        </div>
      </Slide>
    </div>
  );
};

const renderImageRadio = field => {
  return (
    <Slide
      tag="a"
      index={field.radioValue}
      style={{
        minWidth: '138px',
        maxWidth: '248px',
      }}
    >
      <div style={{ margin: '1em' }}>
        <input
          type="radio"
          checked={field.input.value === field.radioValue}
          name={field.input.name}
          onChange={(e, { checked }) => field.input.onChange(field.radioValue)}
          style={{ visibility: 'hidden', display: 'none' }}
        />
        <div
          style={
            field.input.value === field.radioValue
              ? { border: '2px solid teal', margin: 0, padding: '0.5em', borderRadius: '5px' }
              : { border: '1px solid lightgray', margin: 0, padding: '0.5em', borderRadius: '5px' }
          }
        >
          <img onClick={e => field.input.onChange(field.radioValue)} src={field.src} alt={field.radioValue} />
        </div>
      </div>
    </Slide>
  );
};

export const renderCarouselField = ({ name, label, type, required = undefined, validate }) => {
  const resolveVisibleSlides = type => {
    const types = {
      template: 3,
      color: 5,
      undefined: 0,
    };
    return type ? types[type] : types['undefined'];
  };

  const resolveTotalSlides = type => {
    const types = {
      template: templates.length,
      color: colors.length,
      undefined: 0,
    };
    return type ? types[type] : types['undefined'];
  };

  const resolveStep = type => {
    const types = {
      template: 1,
      color: 2,
      undefined: 0,
    };
    return type ? types[type] : types['undefined'];
  };

  const resolveSlider = type => {
    const types = {
      template: templates.map((image, index) => <Field key={index} component={renderImageRadio} name={name} radioValue={image.key} src={image.value} />),
      color: colors.map((color, index) => <Field key={index} component={renderColorRadio} name={name} radioValue={color} hex={color} />),
      undefined: <span>Nothing here...</span>,
    };
    return type ? types[type] : types['undefined'];
  };

  const resolveHeight = type => {
    const types = {
      template: '200px',
      color: '155px',
      undefined: 0,
    };
    return type ? types[type] : types['undefined'];
  };

  const visibleSlides = resolveVisibleSlides(type);
  const totalSlides = resolveTotalSlides(type);
  const step = resolveStep(type);

  return (
    <Field name={name} validate={validate}>
      {({ input, meta }) => {
        return (
          <Form.Field required={required}>
            <label>{label}</label>

            <CarouselProvider
              visibleSlides={isMobile() ? 1 : visibleSlides}
              totalSlides={totalSlides}
              step={step}
              naturalSlideWidth={360}
              naturalSlideHeight={240}
              dragEnabled={false}
              style={{
                display: 'grid',
                gridTemplateColumns: '.5fr 14fr .5fr',
                gridTemplateRows: resolveHeight(type),
                gridTemplateAreas: `"ButtonBack Slider ButtonNext"`,
              }}
            >
              <Slider
                style={{
                  overflowX: 'hidden',
                  gridArea: 'Slider',
                  minWidth: '148px',
                  // maxWidth: '248px'
                }}
              >
                {resolveSlider(type)}
              </Slider>
              <ButtonBack
                style={{
                  gridArea: 'ButtonBack',
                  backgroundColor: 'unset',
                  border: 'unset',
                  outline: 'none',
                }}
              >
                <FontAwesomeIcon icon="angle-left" />
              </ButtonBack>
              <ButtonNext
                style={{
                  gridArea: 'ButtonNext',
                  backgroundColor: 'unset',
                  border: 'unset',
                  outline: 'none',
                }}
              >
                <FontAwesomeIcon icon="angle-right" />
              </ButtonNext>
            </CarouselProvider>
          </Form.Field>
        );
      }}
    </Field>
  );
};

export const popup = msg => <Popup flowing trigger={<FontAwesomeIcon icon="info-circle" style={{ color: '#2DB5AD' }} />} content={msg} position="top right" />;

export const labelWithPopup = (label, popup) => (
  <span>
    <span style={{ fontWeight: 700, fontSize: '.92857143em' }}>{label}</span> {popup}
  </span>
);

export const Condition = ({ when, is, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {({ input: { value } }) => (value === is ? children : null)}
  </Field>
);
