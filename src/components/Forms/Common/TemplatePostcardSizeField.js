import React from 'react';
import { Icon } from 'semantic-ui-react';
import { calculateCost } from '../../MailoutListItem/helpers';

const NEW_LISTING = 'listed';

const PostcardButton = ({ postcardSize }) => (
  <div style={{
    display: 'grid',
    height: '100%',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr 20px',
    justifyItems: 'center',
    alignItems: 'center',
  }}>
    <div style={{
      width: `${postcardSize === '6x9' ? '47px' : postcardSize === '6x11' ? '57px' : '32px'}`,
      height: `${postcardSize === '6x9' ? '32px' : postcardSize === '6x11' ? '32px' : '22px'}`,
      border: '2px solid #666666',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Icon
        color='grey'
        fitted
        name='home'
        size={postcardSize === '6x9' ? 'large' : postcardSize === '6x11' ? 'large' : undefined}
      ></Icon>
    </div>
    <span style={{
      fontSize: '13px',
      fontWeight: 'bold',
      color: '#59C4C4',
    }}>{`${postcardSize}" Postcard`}</span>
  </div>
)

const TemplatePostcardSizeField = ({ postcardSize, listingType, initialValues, formValues, setFormValues }) => {

  const currentValue = (formValues && formValues[listingType]?.postcardSize) || initialValues[listingType].postcardSize;
  const editable = listingType === NEW_LISTING ? !!formValues?.listed : !!formValues?.sold;

  const handlePostcardSizeChange = value => {
    const newValue = Object.assign({}, formValues);
    newValue[listingType].postcardSize = value;
    setFormValues(newValue);
  };



  if (!editable) {
    return (
      <div style={{ width: '118px', height: '84px', opacity: '0.4' }}>
        <input type="radio" defaultChecked={currentValue === postcardSize} value={postcardSize} style={{ visibility: 'hidden', display: 'none' }} />
        <div
          style={
            currentValue === postcardSize
              ? { border: '2px solid #59C4C4', margin: 0, padding: '0.5em', borderRadius: '5px' }
              : { border: '1px solid lightgray', margin: 0, padding: '0.5em', borderRadius: '5px' }
          }
        >
          <PostcardButton postcardSize={postcardSize} />
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
            currentValue === postcardSize
              ? { border: '2px solid #59C4C4', margin: 0, padding: '0.5em', borderRadius: '5px', height: '100%' }
              : { border: '1px solid lightgray', margin: 0, padding: '0.5em', borderRadius: '5px', height: '100%' }
          }
        >
          <PostcardButton postcardSize={postcardSize} />
        </div>
        <div style={{textAlign: 'center', padding: '0.5rem'}}>{`${calculateCost(1, postcardSize)}/each`}</div>
      </div>
    );
  }
};

export default TemplatePostcardSizeField;
