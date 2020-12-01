import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { showAddCampaignModal } from '../store/modules/mailouts/actions';
import Button from '../components/Base/Button';
import Styled from 'styled-components';

const CampaignButton = Styled(Button)`
&&&{
    background-color:transparent !important;
    padding:0px;
    text-transform:lowercase;
    font-size:12px;
    text-align:left;
}
`;

const containerStyles = {
  backgroundColor: '#F2714D',
  width: '100%',
  flex: ' 0 0 100%',
  textAlign: 'center',
  padding: '10px',
};
const pStyles = {
  color: '#ffffff',
  fontSize: '12px',
  color: '#ffffff',
};
const AlertPromo = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const addHolidayCampaign = () => {
    history.push('/dashboard');
    dispatch(showAddCampaignModal());
  };

  return (
    <div style={containerStyles}>
      <p style={pStyles}>
        <span style={{ fontWeight: 'bold' }}>NEW Holiday Postcards are here!</span> Choose from four
        customizable designs by click "Add Campaign" on the Dashboard, or{' '}
        <CampaignButton
          style={{ textDecoration: 'underline', fontWeight: 'bold', color: '#ffffff' }}
          onClick={addHolidayCampaign}
        >
          get started here
        </CampaignButton>
      </p>
    </div>
  );
};

export default AlertPromo;
