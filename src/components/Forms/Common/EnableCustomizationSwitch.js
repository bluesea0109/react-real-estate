import React from 'react';
import { Header } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NEW_LISTING = 'listed';

const EnableCustomizationSwitch = ({ listingType, initialValues, formValues, setFormValues }) => {
  const currentValue = listingType === NEW_LISTING ? !formValues?.listed : !formValues?.sold;

  const handleChange = () => {
    if (currentValue) {
      const newValues = Object.assign({}, formValues, { [listingType]: initialValues[listingType] });
      setFormValues(newValues);
    } else {
      const newValues = Object.assign({}, formValues);
      delete newValues[listingType];
      setFormValues(newValues);
    }
  };

  return (
    <Header size="medium">
      Use Team Defaults: &nbsp;
      {currentValue ? (
        <span style={{ verticalAlign: '-0.35em', color: '#59C4C4' }} onClick={handleChange}>
          <FontAwesomeIcon icon="toggle-on" size="2x" />
        </span>
      ) : (
        <span style={{ verticalAlign: '-0.35em', color: '#969696' }} onClick={handleChange}>
          <FontAwesomeIcon icon="toggle-on" size="2x" className="fa-flip-horizontal" />
        </span>
      )}
    </Header>
  );
};

export default EnableCustomizationSwitch;
