import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  resolveMailoutStatusColor,
  resolveMailoutStatusIcon,
  resolveMailoutStatusUI,
} from './utils/helpers';
import styled from 'styled-components';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  & .popup-item {
    padding: 2px;
    & .icon {
      width: 1rem;
      margin-right: 0.5rem;
    }
  }
`;

const formatPopupContentItem = (type, msg) => {
  return (
    <div className="popup-item">
      <FontAwesomeIcon
        className="icon"
        icon={resolveMailoutStatusIcon(type)}
        style={{ color: resolveMailoutStatusColor(type) }}
      />
      <span style={{ color: resolveMailoutStatusColor(type) }}>
        {`${resolveMailoutStatusUI(type)}: ${msg}`}
      </span>
    </div>
  );
};

const PopupContent = () => {
  return (
    <ListContainer>
      {formatPopupContentItem('calculated', 'The campaign is ready for your review.')}
      {formatPopupContentItem('created', 'We are processing your campaign.')}
      {formatPopupContentItem('queued-for-printing', 'The campaign is in the queue for printing.')}
      {formatPopupContentItem('printing', 'The campaign is being printed.')}
      {formatPopupContentItem('mailing', 'The campaign has started mailing to recipients.')}
      {formatPopupContentItem('complete', 'Your campaign is complete.')}
      {formatPopupContentItem('cancelled', 'Your campaign has been fully cancelled.')}
      {formatPopupContentItem('hide', 'We are not scheduling mailouts for this campaign.')}
      {formatPopupContentItem('errored', 'Something strange has happened to this order.')}
    </ListContainer>
  );
};

export default PopupContent;
