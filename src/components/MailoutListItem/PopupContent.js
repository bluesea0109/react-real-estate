import React from 'react';
import { Grid, Item } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { resolveMailoutStatus, resolveMailoutStatusColor, resolveMailoutStatusIcon } from './helpers';

const formatPopupContentItem = (type, msg) => {
  return (
    <Item>
      <FontAwesomeIcon icon={resolveMailoutStatusIcon(type)} style={{ marginRight: '.5em', color: resolveMailoutStatusColor(type) }} />
      <span style={{ color: resolveMailoutStatusColor(type) }}>{resolveMailoutStatus(type)}:</span> {msg}
      <br />
    </Item>
  );
};

const PopupContent = () => {
  return (
    <Grid>
      <Grid.Column>
        {formatPopupContentItem('calculated', 'The campaign is ready for your review.')}
        {formatPopupContentItem('created', 'We are processing your campaign.')}
        {formatPopupContentItem('', 'Your campaign is sent.')}
        {formatPopupContentItem('cancelled', 'Your campaign has been fully cancelled.')}
        {formatPopupContentItem('errored', 'Something strange has happened to this order.')}
        {formatPopupContentItem('excluded', 'Based upon configuration, we aren’t scheduling mailouts for this property.')}
      </Grid.Column>
    </Grid>
  );
};

export default PopupContent;
