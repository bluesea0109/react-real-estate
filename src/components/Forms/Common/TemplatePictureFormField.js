import React from 'react';

const TemplatePictureFormField = ({ templateName, listingType, formValues, setFormValues }) => {
  const currentValue = formValues[listingType].templateTheme;

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
    const newValue = formValues;
    newValue[listingType].templateTheme = value;
    setFormValues(newValue);
  };

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
};

export default TemplatePictureFormField;
