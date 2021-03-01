import React from 'react';
import { Button, Header, Icon, Menu } from '../../components/Base';
import PageTitleHeader from '../../components/PageTitleHeader';

export default function TopHeader({ handleBackClick, working }) {
  return (
    <PageTitleHeader>
      <Menu borderless fluid secondary>
        <Menu.Item>
          <Header as="h1">Campaign Details</Header>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Button
              primary
              inverted
              onClick={() => handleBackClick()}
              disabled={working}
              loading={working}
            >
              <Icon name="left arrow" />
              <span>All Campaigns</span>
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </PageTitleHeader>
  );
}
