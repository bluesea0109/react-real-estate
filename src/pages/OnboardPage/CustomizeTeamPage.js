import { Header, Radio, Icon, Confirm } from 'semantic-ui-react';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Wizard from './Wizard';
import { incrementStep } from '../../store/modules/onboarded/actions';
import { Button, Menu, Page, Segment } from '../../components/Base';
import CustomizeForm from '../../components/Forms/CustomizeForm';

const CustomizeTeamPage = () => {
  const dispatch = useDispatch();
  const [listingNewOrSold, setListingNewOrSold] = useState('newListing');
  const [newListingEnabled, setNewListingEnabled] = useState(true);
  const [soldListingEnabled, setSoldListingEnabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleListingToggle = (e, { name }) => setListingNewOrSold(name);
  const handleNewListingEnableToggle = () => setNewListingEnabled(!newListingEnabled);
  const handleSoldListingEnableToggle = () => setSoldListingEnabled(!soldListingEnabled);

  useEffect(() => {
    if (!newListingEnabled && !soldListingEnabled) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }

    if (!newListingEnabled && soldListingEnabled) {
      setListingNewOrSold('soldListing');
    }

    if (newListingEnabled && !soldListingEnabled) {
      setListingNewOrSold('newListing');
    }
  }, [newListingEnabled, soldListingEnabled, setShowAlert, setListingNewOrSold]);

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
            <Menu.Item name="newListing" active={listingNewOrSold === 'newListing'} onClick={handleListingToggle} />
            <Menu.Item name="soldListing" active={listingNewOrSold === 'soldListing'} onClick={handleListingToggle} />
          </Menu>
        </Segment>

        <Confirm
          open={showAlert}
          content="In order to use Bravity Marketing platform, you must select at least one"
          cancelButton="Enable new listings"
          confirmButton="Enable sold listings"
          onCancel={() => setNewListingEnabled(true)}
          onConfirm={() => setSoldListingEnabled(true)}
        />

        {listingNewOrSold === 'newListing' && (
          <Fragment>
            <Segment>
              <Header size="medium">
                Target on new: &nbsp;
                <Radio toggle onChange={handleNewListingEnableToggle} checked={newListingEnabled} style={{ verticalAlign: 'bottom' }} />
              </Header>
            </Segment>

            {newListingEnabled ? (
              <CustomizeForm onboard={true} formType="newListing" />
            ) : (
              <Segment placeholder>
                <Header icon>
                  <Icon name="exclamation triangle" />
                  Campaign will not be enabled for new listings
                </Header>
              </Segment>
            )}
          </Fragment>
        )}
        {listingNewOrSold === 'soldListing' && (
          <Fragment>
            <Segment>
              <Header size="medium">
                Target on sold: &nbsp;
                <Radio toggle onChange={handleSoldListingEnableToggle} checked={soldListingEnabled} style={{ verticalAlign: 'bottom' }} />
              </Header>
            </Segment>

            {soldListingEnabled ? (
              <CustomizeForm onboard={true} formType="soldListing" />
            ) : (
              <Segment placeholder>
                <Header icon>
                  <Icon name="exclamation triangle" />
                  Campaign will not be enabled for sold listings
                </Header>
              </Segment>
            )}
          </Fragment>
        )}

        <Button onClick={() => dispatch(incrementStep(2))}>Stage 2 Completed</Button>
      </Segment>
    </Page>
  );
};

export default CustomizeTeamPage;
