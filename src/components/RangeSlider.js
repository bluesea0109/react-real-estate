import React from 'react';
import { Label } from 'semantic-ui-react';

import { isMobile } from './Forms/helpers';
import { Header, Input } from './Base';
import Nouislider from './Nouislider';
import './Nouislider/thin.css';

const MIN = 100;
const MAX = 2000;
const INCREMENT = 10;
const STEPS = INCREMENT;
const MARGIN = INCREMENT;

/*
const renderButton = ({leftOnClick, rightOnClick, disableLeft, disableRight}) => (
  <span style={{marginTop: '1px'}}>
    <Button
      basic
      attached='left'
      circular
      icon='angle up'
      onClick={leftOnClick}
      disabled={disableLeft}
    />
    <Button
      basic
      attached='right'
      circular
      icon='angle down'
      onClick={rightOnClick}
      disabled={disableRight}
    />
  </span>
);
*/

export default ({ label, minValue, setMinValue, defaultValue, setDefaultValue, maxValue, setMaxValue }) => {
  const onChange = index => {
    setMinValue(index[0]);
    setDefaultValue(index[1]);
    setMaxValue(index[2]);
  };

  return (
    <div>
      <Header as="h4" style={{ marginBottom: 0 }}>
        {label}
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
        <Input style={{ gridArea: 'Min', opacity: 1, userSelect: 'none' }} labelPosition="right" disabled>
          <input style={{ width: 'unset' }} value={minValue} readOnly />
          <Label>Min</Label>
        </Input>

        <Input style={{ gridArea: 'Target', opacity: 1, userSelect: 'none' }} labelPosition="right" disabled>
          <input style={{ width: 'unset' }} value={defaultValue} readOnly />
          <Label>Default</Label>
        </Input>

        <Input style={{ gridArea: 'Max', opacity: 1, userSelect: 'none' }} labelPosition="right" disabled>
          <input style={{ width: 'unset' }} value={maxValue} readOnly />
          <Label>Max</Label>
        </Input>

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
            start={[minValue, defaultValue, maxValue]} // Handles start at ...
            margin={MARGIN} // ... must be at least 100 apart
            connect={true} // Display colored bars between handles
            // Move handle on tap, bars are draggable
            behaviour="tap-drag"
            tooltips={true}
            // Show a scale with the slider
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
            onChange={onChange}
          />
          {isMobile() && (
            <br>
              {' '}
              <br />{' '}
            </br>
          )}
        </div>
      </div>
    </div>
  );
};
