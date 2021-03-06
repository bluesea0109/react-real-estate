import React from 'react';
import { NewLabel } from '../Base/Carousel';
import * as brandColors from '../../utils/brandColors';

const NEW_LISTING = 'listed';

const TemplatePictureFormField = ({
  templateName,
  listingType,
  initialValues,
  formValues,
  setFormValues,
  src = '',
  isNew = false,
}) => {
  const currentValue =
    (formValues && formValues[listingType]?.templateTheme) ||
    initialValues[listingType].templateTheme;
  const editable = listingType === NEW_LISTING ? !!formValues?.listed : !!formValues?.sold;

  const resolveSource = type => {
    const types = {
      ribbon: require('../../../assets/ribbon-preview.png'),
      bookmark: require('../../../assets/bookmark-preview.png'),
      stack: require('../../../assets/stack-preview.png'),
      undefined: 'undefined',
    };
    return type ? types[type] : types['undefined'];
  };

  if (!editable) {
    return (
      <div key={templateName}>
        <div
          style={
            currentValue === templateName
              ? {
                  border: `2px solid ${brandColors.primary}`,
                  margin: '0 0.5em',
                  padding: '0.5em',
                  borderRadius: '5px',
                  maxWidth: 500,
                }
              : {
                  border: '1px solid lightgray',
                  margin: '0 0.5em',
                  padding: '0.5em',
                  borderRadius: '5px',
                  maxWidth: 500,
                }
          }
        >
          <img src={src ? src : resolveSource(templateName)} alt={templateName} />
        </div>
        {isNew && (
          <NewLabel>
            <span className="label">New</span>
          </NewLabel>
        )}
      </div>
    );
  } else {
    return (
      <div key={templateName}>
        <div
          style={
            currentValue === templateName
              ? {
                  border: '2px solid #59C4C4',
                  margin: '0 0.5em',
                  padding: '0.5em',
                  borderRadius: '5px',
                  maxWidth: 500,
                }
              : {
                  margin: '0 0.5em',
                  padding: '0.5em',
                }
          }
        >
          <img
            src={src ? src : resolveSource(templateName)}
            alt={templateName}
            style={{
              width: '100%',
              border: '1px solid lightgrey',
              boxShadow: '1px 1px 4px lightgrey',
            }}
          />
        </div>
        {isNew && (
          <NewLabel>
            <span className="label">New</span>
          </NewLabel>
        )}
      </div>
    );
  }
};

export default TemplatePictureFormField;
