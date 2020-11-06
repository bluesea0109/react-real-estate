import React, { Fragment } from 'react';
import Nouislider from 'nouislider-react';

import { TrimStrAndConvertToInt } from '../../utils/utils';
import { Header } from 'semantic-ui-react';
import { useIsMobile } from '../../Hooks/useIsMobile';

const MIN = 100;
const MAX = 2000;
const INCREMENT = 10;
const STEPS = INCREMENT;
const MARGIN = 10;
const NEW_LISTING = 'listed';

const MailoutSizeSliderFormField = ({ formType, listingType, initialValues, formValues, setFormValues }) => {
  const isMobile = useIsMobile();

  const editable = listingType === NEW_LISTING ? !!formValues?.listed : !!formValues?.sold;

  let currentMailoutSize;
  let currentMailoutSizeMin;
  let currentMailoutSizeMax;
  let adjustedMailoutSizeMax;

  const SLIDER_INITIAL_VALUES = [];

  if (formType === 'team') {
    currentMailoutSize = (formValues && formValues[listingType]?.mailoutSize) || initialValues[listingType].mailoutSize;
    currentMailoutSizeMin = (formValues && formValues[listingType]?.mailoutSizeMin) || MIN;
    currentMailoutSizeMax = (formValues && formValues[listingType]?.mailoutSizeMax) || MAX;

    SLIDER_INITIAL_VALUES.push(currentMailoutSizeMin);
    SLIDER_INITIAL_VALUES.push(currentMailoutSize);
    SLIDER_INITIAL_VALUES.push(currentMailoutSizeMax);
  }

  if (formType === 'agent') {
    currentMailoutSize = (formValues && formValues[listingType]?.mailoutSize) || initialValues[listingType].mailoutSize;
    currentMailoutSizeMin = (formValues && formValues[listingType]?.mailoutSizeMin) || initialValues[listingType].mailoutSizeMin;
    currentMailoutSizeMax = (formValues && formValues[listingType]?.mailoutSizeMax) || initialValues[listingType].mailoutSizeMax;

    adjustedMailoutSizeMax = currentMailoutSizeMin === currentMailoutSizeMax ? currentMailoutSizeMax + 20 : undefined;

    SLIDER_INITIAL_VALUES.push(currentMailoutSize);
  }

  const handleMailoutSizeChange = value => {
    const newValue = Object.assign({}, formValues);

    if (formType === 'team') {
      value.map(item => {
        const itemArr = item.split(':');
        if (itemArr[0] === 'Min') return (newValue[listingType].mailoutSizeMin = TrimStrAndConvertToInt(itemArr[1]));
        if (itemArr[0] === 'Default') return (newValue[listingType].mailoutSize = TrimStrAndConvertToInt(itemArr[1]));
        if (itemArr[0] === 'Max') return (newValue[listingType].mailoutSizeMax = TrimStrAndConvertToInt(itemArr[1]));
        return null;
      });
    }

    if (formType === 'agent') {
      newValue[listingType].mailoutSize = value[0];
    }

    setFormValues(newValue);
  };

  if (!editable) {
    return (
      <div style={{ opacity: 0.4 }}>
        <Header as="h5">Number of postcards to send per listing</Header>
        <div className="slider" style={{ marginTop: '2em', marginBottom: '2em' }}>
          {isMobile && (
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
                if (formType === 'team') {
                  const intValue = Math.round(parseInt(value, 10) / 10) * 10;

                  if (index === 0) return 'Min: ' + intValue;
                  if (index === 1) return 'Default: ' + intValue;
                  if (index === 2) return 'Max: ' + intValue;
                }

                if (formType === 'agent') {
                  return Math.round(parseInt(value, 10) / 10) * 10;
                }
              },
              from: value => {
                if (formType === 'team') {
                  const newValue = value.split(':');

                  if (newValue.length === 1) return newValue[0];
                  else return TrimStrAndConvertToInt(newValue[1]);
                }

                if (formType === 'agent') {
                  return value;
                }
              },
            }}
          />
          {isMobile && (
            <Fragment>
              <br />
              <br />
            </Fragment>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Header as="h5">Number of postcards to send per listing</Header>
        <div className="slider" style={{ marginTop: '2em', marginBottom: '2em' }}>
          {isMobile && (
            <Fragment>
              <br />
              <br />
            </Fragment>
          )}
          <Nouislider
            range={{
              min: formType === 'agent' ? currentMailoutSizeMin : MIN,
              max: formType === 'agent' ? adjustedMailoutSizeMax || currentMailoutSizeMax : MAX,
            }}
            step={STEPS}
            start={SLIDER_INITIAL_VALUES}
            margin={MARGIN}
            connect={true}
            behaviour="tap-drag"
            tooltips={true}
            pips={{
              mode: 'values',
              values:
                formType === 'agent'
                  ? adjustedMailoutSizeMax
                    ? [currentMailoutSizeMin, adjustedMailoutSizeMax]
                    : [currentMailoutSizeMin, currentMailoutSizeMax]
                  : [MIN, MAX],
              stepped: true,
              density: 3,
            }}
            format={{
              to: (value, index) => {
                if (formType === 'team') {
                  const intValue = Math.round(parseInt(value, 10) / 10) * 10;

                  if (index === 0) return 'Min: ' + intValue;
                  if (index === 1) return 'Default: ' + intValue;
                  if (index === 2) return 'Max: ' + intValue;
                }

                if (formType === 'agent') {
                  return Math.round(parseInt(value, 10) / 10) * 10;
                }
              },
              from: value => {
                if (formType === 'team') {
                  const newValue = value.split(':');

                  if (newValue.length === 1) return newValue[0];
                  else return TrimStrAndConvertToInt(newValue[1]);
                }

                if (formType === 'agent') {
                  return value;
                }
              },
            }}
            onChange={handleMailoutSizeChange}
          />
          {isMobile && (
            <Fragment>
              <br />
              <br />
            </Fragment>
          )}
        </div>
      </div>
    );
  }
};

export default MailoutSizeSliderFormField;
