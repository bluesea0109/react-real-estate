import React, { useRef } from 'react';
import { Checkbox } from 'semantic-ui-react';
import styled from 'styled-components';
import * as brandColors from '../../components/utils/brandColors';

const CTAContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  & .ui.checkbox {
    padding: 0.25rem 0;
    & label {
      color: ${brandColors.grey03};
    }
  }
  & #cta-input {
    margin-bottom: 0.5rem;
  }
  & .input-help.error {
    color: ${brandColors.error};
  }
`;

export default function CustomCTA({
  customizeCTA,
  hideCTA,
  setCustomizeCTA,
  newCTA,
  invalidCTA,
  setInvalidCTA,
  setNewCTA,
  setHideCTA,
  handleSave,
}) {
  const ctaInputRef = useRef(null);
  const handleCTAChange = e => {
    setInvalidCTA(!ctaInputRef?.current?.checkValidity());
    setNewCTA(e.target.value);
  };
  return (
    <CTAContent>
      <p>Customize the call to action URL for this campaign?</p>
      <div>
        <Checkbox
          radio
          label="Don't Customize - use default"
          name="checkboxRadioGroup"
          value="not-customized"
          checked={hideCTA ? false : !customizeCTA}
          onClick={() => {
            setHideCTA(false);
            setCustomizeCTA(false);
            handleSave({});
          }}
        />
        <Checkbox
          radio
          label="Customize call to action URL - URL will be shortened and lead tracking enabled"
          name="checkboxRadioGroup"
          value="customized"
          checked={hideCTA ? false : customizeCTA}
          onClick={() => {
            setHideCTA(false);
            setCustomizeCTA(true);
            handleSave({});
          }}
        />
        <Checkbox
          radio
          label="Hide call to action"
          name="checkboxRadioGroup"
          value="hide"
          checked={hideCTA}
          onClick={() => {
            setHideCTA(true);
            setCustomizeCTA(false);
          }}
        />
      </div>
      {customizeCTA && (
        <div>
          <div className={`ui input fluid ${invalidCTA ? `error` : ''}`}>
            <input
              id="cta-input"
              type="url"
              required
              value={newCTA}
              onChange={handleCTAChange}
              ref={ctaInputRef}
            />
          </div>
          <p className={`input-help ${invalidCTA ? `error` : ''}`}>
            Provide a valid web address starting with https:// or http://
          </p>
        </div>
      )}
    </CTAContent>
  );
}
