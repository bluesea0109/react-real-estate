import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { showAddCampaignModal } from '../store/modules/mailouts/actions';
import { closeAlert } from '../store/modules/ui/actions';
import Button from '../components/Base/Button';
import Styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as brandColors from './utils/brandColors';

const containerStyles = {
  backgroundColor: `${brandColors.brivityCoral}`,
  width: '100%',
  flex: ' 0 0 100%',
  textAlign: 'center',
  padding: '10px',
  display: 'flex',
  justifyContent: 'center',
};

const hide = {
  padding: '0px',
  transition: '1s',
  height: '0px',
};

const pStyles = {
  color: '#ffffff',
  fontSize: '12px',
};

const CampaignButtonStyles = {
  textDecoration: 'underline',
  fontWeight: 'bold',
  color: '#ffffff',
};

const CampaignButton = Styled(Button)`
&&&{
    background-color:transparent !important;
    padding:0px;
    text-transform:lowercase;
    font-size:12px;
    text-align:left;
}
`;

const ButtonX = Styled(Button)`
&&&{
    background-color:transparent !important;
    padding:0px;
    text-transform:lowercase;
    font-size:12px;
    width: auto;
    min-width:10px;
    position:absolute;
    right:10px;
    top:8px;
}
`;

const AlertPromo = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const showAlert = useSelector(store => store.ui.showAlert);

  const addHolidayCampaign = () => {
    history.push('/dashboard');
    dispatch(showAddCampaignModal());
  };

  const close = () => {
    dispatch(closeAlert());
  };

  return (
    <div style={showAlert ? containerStyles : { ...containerStyles, ...hide }}>
      <p style={pStyles}>
        <span style={{ fontWeight: 'bold' }}>NEW Holiday Postcards are here!</span> Choose from four
        customizable designs by click "Add Campaign" on the Dashboard, or{' '}
        <CampaignButton style={CampaignButtonStyles} onClick={addHolidayCampaign}>
          get started here
        </CampaignButton>
      </p>
      <ButtonX onClick={close}>
        <FontAwesomeIcon icon="times" style={{ color: '#ffffff', fontSize: '16px' }} />
      </ButtonX>
    </div>
  );
};

export default AlertPromo;
