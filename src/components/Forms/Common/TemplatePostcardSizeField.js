import React from 'react';
import { calculateCost } from '../../MailoutListItem/utils/helpers';
import PostcardSizeButton from './PostcardSizeButton';
import { postcardDimensions } from '../../utils/utils';

const NEW_LISTING = 'listed';

const TemplatePostcardSizeField = ({
  postcardSize,
  listingType,
  initialValues,
  formValues,
  setFormValues,
}) => {
  const currentValue =
    (formValues && formValues[listingType]?.postcardSize) ||
    initialValues[listingType].postcardSize ||
    '6x4';
  const editable = listingType === NEW_LISTING ? !!formValues?.listed : !!formValues?.sold;

  const handlePostcardSizeChange = value => {
    const newValue = Object.assign({}, formValues);
    newValue[listingType].postcardSize = postcardDimensions(value);
    setFormValues(newValue);
  };

  if (!editable) {
    return (
      <div style={{ width: '118px', height: '84px', opacity: '0.4', margin: '1rem 1rem 1rem 0px' }}>
        <input
          type="radio"
          defaultChecked={currentValue === postcardSize}
          value={postcardSize}
          style={{ visibility: 'hidden', display: 'none' }}
        />
        <div
          style={
            currentValue === postcardDimensions(postcardSize)
              ? { border: '2px solid #59C4C4', margin: 0, padding: '0.5em', borderRadius: '5px' }
              : { border: '1px solid lightgray', margin: 0, padding: '0.5em', borderRadius: '5px' }
          }
        >
          <PostcardSizeButton postcardSize={postcardSize} />
        </div>
        <div>{`${calculateCost(1, postcardSize)}/each`}</div>
      </div>
    );
  } else {
    return (
      <div style={{ margin: '1rem 1rem 1rem 0', width: '118px', height: '84px' }}>
        <input
          type="radio"
          checked={currentValue === postcardSize}
          value={postcardSize}
          onChange={(e, { value }) => handlePostcardSizeChange(value)}
          style={{ visibility: 'hidden', display: 'none' }}
        />
        <div
          onClick={e => handlePostcardSizeChange(postcardSize)}
          style={
            currentValue === postcardDimensions(postcardSize)
              ? {
                  border: '2px solid #59C4C4',
                  margin: 0,
                  padding: '0.5em',
                  borderRadius: '5px',
                  height: '100%',
                }
              : {
                  border: '1px solid lightgray',
                  margin: 0,
                  padding: '0.5em',
                  borderRadius: '5px',
                  height: '100%',
                }
          }
        >
          <PostcardSizeButton postcardSize={postcardSize} />
        </div>
        <div style={{ textAlign: 'center', padding: '0.5rem' }}>{`${calculateCost(
          1,
          postcardSize
        )}/each`}</div>
      </div>
    );
  }
};

export default TemplatePostcardSizeField;
