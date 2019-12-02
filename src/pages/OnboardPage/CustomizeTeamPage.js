import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { incrementStep } from '../../store/modules/onboarded/actions';
import { Button, Header, Menu, Page, Segment } from '../../components/Base';
import CustomizeNewListingForm from '../../components/Forms/CustomizeNewListingForm';
import CustomizeSoldListingForm from '../../components/Forms/CustomizeSoldListingForm';

const OnboardPage = () => {
  const dispatch = useDispatch();
  const [listingNewOrSold, setListingNewOrSold] = useState('new');

  const handleListingToggle = (e, { name }) => setListingNewOrSold(name);

  return (
    <Page basic>
      <Segment>
        <Header as="h1">Customize Team</Header>
        <Menu pointing secondary>
          <Menu.Item name="new" active={listingNewOrSold === 'new'} onClick={handleListingToggle} />
          <Menu.Item name="sold" active={listingNewOrSold === 'sold'} onClick={handleListingToggle} />
        </Menu>
        {listingNewOrSold === 'new' && <CustomizeNewListingForm />}
        {listingNewOrSold === 'sold' && <CustomizeSoldListingForm />}
        <Button onClick={() => dispatch(incrementStep(2))}>Stage 2 Completed</Button>
      </Segment>
    </Page>
  );
};

export default OnboardPage;
