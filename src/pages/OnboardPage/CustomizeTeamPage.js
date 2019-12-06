import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Header } from 'semantic-ui-react';
import { incrementStep } from '../../store/modules/onboarded/actions';

import CustomizeNewListingForm from '../../components/Forms/CustomizeNewListingForm';
import CustomizeSoldListingForm from '../../components/Forms/CustomizeSoldListingForm';

import { Button, Menu, Page, Segment } from '../../components/Base';

const OnboardPage = () => {
  const dispatch = useDispatch();
  const [listingNewOrSold, setListingNewOrSold] = useState('new');

  const handleListingToggle = (e, { name }) => setListingNewOrSold(name);

  return (
    <Page basic>
      <Segment basic>
        <Segment>
          <Header as="h1">
            Team Customization
            <Header.Subheader>
              Set the default template customization options for your team. Changes made here will not overwrite existing user-specific customization.
            </Header.Subheader>
          </Header>
        </Segment>

        <Segment style={{ margin: '0 0 -1px 0', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
          <Menu pointing secondary>
            <Menu.Item name="new" active={listingNewOrSold === 'new'} onClick={handleListingToggle} />
            <Menu.Item name="sold" active={listingNewOrSold === 'sold'} onClick={handleListingToggle} />
          </Menu>
        </Segment>

        {listingNewOrSold === 'new' && <CustomizeNewListingForm />}
        {listingNewOrSold === 'sold' && <CustomizeSoldListingForm />}

        <Button onClick={() => dispatch(incrementStep(2))}>Stage 2 Completed</Button>
      </Segment>
    </Page>
  );
};

export default OnboardPage;
