import React from 'react';
import { Grid, Item } from 'semantic-ui-react';

const PopupMinMax = ({ mailoutSizeMin, mailoutSizeMax }) => {
  return (
    <Grid>
      <Grid.Column>
        <Item>
          <span>Min:</span> {mailoutSizeMin}
          <br />
        </Item>
        <Item>
          <span>Max:</span> {mailoutSizeMax}
          <br />
        </Item>
      </Grid.Column>
    </Grid>
  );
};

export default PopupMinMax;
