import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useSelector } from 'react-redux';
import { List, Popup } from '../../components/Base';
import PopupContent from '../../components/MailoutListItem/PopupContent';
import PopupMinMax from '../../components/MailoutListItem/PopupMinMax';
import {
  calculateCost,
  formatDate,
  resolveMailoutStatusColor,
  resolveMailoutStatusIcon,
  resolveMailoutStatusUI,
} from '../../components/MailoutListItem/utils/helpers';
import { postcardDimensionsDisplayed } from '../../components/utils/utils';
import { ItemBodyDataLayout } from '../../layouts';
import RenderRecipients from './RenderRecipients';

export default function MailoutData({ currentNumberOfRecipients }) {
  const teamCustomization = useSelector(store => store.teamCustomization.available);
  const details = useSelector(store => store.mailout.details);
  const listingType = details && details.listingStatus;
  const listingDefaults = teamCustomization && teamCustomization[listingType];
  const mailoutSizeMin = listingDefaults && listingDefaults.mailoutSizeMin;
  const mailoutSizeMax = listingDefaults && listingDefaults.mailoutSizeMax;
  const onLoginMode = useSelector(store => store.onLogin?.mode);
  const multiUser = onLoginMode === 'multiuser';

  return (
    <ItemBodyDataLayout relaxed>
      <List.Item>
        <List.Content>
          <List.Header>
            Recipients
            {multiUser && (
              <Popup
                flowing
                trigger={
                  <FontAwesomeIcon
                    icon="info-circle"
                    style={{ marginLeft: '.5em', color: '#59C4C4' }}
                  />
                }
                content={PopupMinMax({ mailoutSizeMin, mailoutSizeMax })}
                position="top right"
              />
            )}
          </List.Header>
          <List.Description>
            <RenderRecipients
              currentNumberOfRecipients={currentNumberOfRecipients}
              details={details}
            />
          </List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>Size</List.Header>
          <List.Description>{`${
            details.postcardSize ? postcardDimensionsDisplayed(details.postcardSize) : '4x6'
          }" / ${calculateCost(
            1,
            details.postcardSize ? details.postcardSize : '4x6'
          )}`}</List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>Cost</List.Header>
          <List.Description>
            {calculateCost(
              details.recipientCount,
              details.postcardSize ? details.postcardSize : '4x6'
            )}
          </List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>
            Status
            <Popup
              flowing
              trigger={
                <FontAwesomeIcon
                  icon="info-circle"
                  style={{ marginLeft: '.5em', color: '#2DB5AD' }}
                />
              }
              content={PopupContent()}
              position="top right"
            />
          </List.Header>
          <List.Description style={{ color: resolveMailoutStatusColor(details.mailoutStatus) }}>
            <FontAwesomeIcon
              icon={resolveMailoutStatusIcon(details.mailoutStatus)}
              style={{ marginRight: '.5em' }}
            />
            {resolveMailoutStatusUI(details.mailoutStatus)}
          </List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>Created</List.Header>
          <List.Description>{formatDate(details.created)}</List.Description>
        </List.Content>
      </List.Item>
    </ItemBodyDataLayout>
  );
}
