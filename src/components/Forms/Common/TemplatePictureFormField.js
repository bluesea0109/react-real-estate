import React from 'react';

const NEW_LISTING = 'listed';

const TemplatePictureFormField = ({ templateName, listingType, initialValues, formValues, setFormValues }) => {
  const currentValue = (formValues && formValues[listingType]?.templateTheme) || initialValues[listingType].templateTheme;
  const editable = listingType === NEW_LISTING ? formValues && formValues.listed : formValues && formValues.sold;

  const resolveSource = type => {
    const types = {
      ribbon: require('../../../assets/ribbon-preview.png'),
      bookmark: require('../../../assets/bookmark-preview.png'),
      stack: require('../../../assets/stack-preview.png'),
      undefined: null,
    };
    return type ? types[type] : types['undefined'];
  };

  const handleTemplateChange = value => {
    const newValue = Object.assign({}, formValues);
    newValue[listingType].templateTheme = value;
    setFormValues(newValue);
  };

  if (!editable) {
    return (
      <div style={{ margin: '1em', minWidth: '128px', maxWidth: '270px', opacity: '0.4' }}>
        <input type="radio" defaultChecked={currentValue === templateName} value={templateName} style={{ visibility: 'hidden', display: 'none' }} />
        <div
          style={
            currentValue === templateName
              ? { border: '2px solid #59C4C4', margin: 0, padding: '0.5em', borderRadius: '5px' }
              : { border: '1px solid lightgray', margin: 0, padding: '0.5em', borderRadius: '5px' }
          }
        >
          <img src={resolveSource(templateName)} alt={templateName} />
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ margin: '1em', minWidth: '128px', maxWidth: '270px' }}>
        <input
          type="radio"
          checked={currentValue === templateName}
          value={templateName}
          onChange={(e, { value }) => handleTemplateChange(value)}
          style={{ visibility: 'hidden', display: 'none' }}
        />
        <div
          style={
            currentValue === templateName
              ? { border: '2px solid #59C4C4', margin: 0, padding: '0.5em', borderRadius: '5px' }
              : { border: '1px solid lightgray', margin: 0, padding: '0.5em', borderRadius: '5px' }
          }
        >
          <img onClick={e => handleTemplateChange(templateName)} src={resolveSource(templateName)} alt={templateName} />
        </div>
      </div>
    );
  }
};

export default TemplatePictureFormField;
