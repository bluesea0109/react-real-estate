import React from 'react';
import { Label } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { saveTeamListedShortcodePending, saveTeamSoldShortcodePending } from '../../../store/modules/teamShortcode/actions';
import { saveListedShortcodePending, saveSoldShortcodePending } from '../../../store/modules/shortcode/actions';
import { composeValidators, popup, required, urlRegExp } from '../../utils';
import { Icon, Menu } from '../../Base';
import { Form, Input } from '../Base';
import { useIsMobile } from '../../Hooks/useIsMobile';

const NEW_LISTING = 'listed';
const SOLD_LISTING = 'sold';

const validURL = str => !urlRegExp.test(str) && 'URL is not valid';
const isValidURL = str => !!urlRegExp.test(str);

const CTAInputFormField = ({ formType, listingType, initialValues, formValues, setFormValues }) => {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const editable = listingType === NEW_LISTING ? !!formValues?.listed : !!formValues?.sold;
  const ctaEnabled = editable ? formValues?.[listingType]?.shortenCTA : initialValues?.[listingType]?.shortenCTA;
  const currentValue = editable ? formValues?.[listingType]?.cta : initialValues?.[listingType]?.cta;

  let newListingShortenedURL;
  let newListingShortenedURLPending;
  let newListingShortenedURLError;
  let soldListingShortenedURL;
  let soldListingShortenedURLPending;
  let soldListingShortenedURLError;

  const newListingTeamShortenedURL = useSelector(store => store.teamShortcode.listed);
  const newListingTeamShortenedURLPending = useSelector(store => store.teamShortcode.listedURLToShortenPending);
  const newListingTeamShortenedURLError = useSelector(store => store.teamShortcode.listedURLToShortenError);
  const soldListingTeamShortenedURL = useSelector(store => store.teamShortcode.sold);
  const soldListingTeamShortenedURLPending = useSelector(store => store.teamShortcode.soldURLToShortenPending);
  const soldListingTeamShortenedURLError = useSelector(store => store.teamShortcode.soldURLToShortenError);

  const newListingAgentShortenedURL = useSelector(store => store.shortcode.listed);
  const newListingAgentShortenedURLPending = useSelector(store => store.shortcode.listedURLToShortenPending);
  const newListingAgentShortenedURLError = useSelector(store => store.shortcode.listedURLToShortenError);
  const soldListingAgentShortenedURL = useSelector(store => store.shortcode.sold);
  const soldListingAgentShortenedURLPending = useSelector(store => store.shortcode.soldURLToShortenPending);
  const soldListingAgentShortenedURLError = useSelector(store => store.shortcode.soldURLToShortenError);

  if (formType === 'team') {
    newListingShortenedURL = newListingTeamShortenedURL;
    newListingShortenedURLPending = newListingTeamShortenedURLPending;
    newListingShortenedURLError = newListingTeamShortenedURLError;
    soldListingShortenedURL = soldListingTeamShortenedURL;
    soldListingShortenedURLPending = soldListingTeamShortenedURLPending;
    soldListingShortenedURLError = soldListingTeamShortenedURLError;
  }

  if (formType === 'agent') {
    newListingShortenedURL = newListingAgentShortenedURL;
    newListingShortenedURLPending = newListingAgentShortenedURLPending;
    newListingShortenedURLError = newListingAgentShortenedURLError;
    soldListingShortenedURL = soldListingAgentShortenedURL;
    soldListingShortenedURLPending = soldListingAgentShortenedURLPending;
    soldListingShortenedURLError = soldListingAgentShortenedURLError;
  }

  const shortenedURL = listingType === NEW_LISTING ? newListingShortenedURL : soldListingShortenedURL;

  if (currentValue && isValidURL(currentValue)) {
    if (listingType === NEW_LISTING && !newListingShortenedURLPending && !newListingShortenedURL && !newListingShortenedURLError) {
      if (formType === 'team') {
        dispatch(saveTeamListedShortcodePending(currentValue));
      }

      if (formType === 'agent') {
        dispatch(saveListedShortcodePending(currentValue));
      }
    }

    if (listingType === SOLD_LISTING && !soldListingShortenedURLPending && !soldListingShortenedURL && !soldListingShortenedURLError) {
      if (formType === 'team') {
        dispatch(saveTeamSoldShortcodePending(currentValue));
      }

      if (formType === 'agent') {
        dispatch(saveSoldShortcodePending(currentValue));
      }
    }
  }

  const handleCTAChange = input => {
    const eURL = input.target.value;

    const newValue = Object.assign({}, formValues);
    newValue[listingType].cta = eURL;
    setFormValues(newValue);

    if (formType === 'team') {
      if (listingType === NEW_LISTING && isValidURL(eURL)) dispatch(saveTeamListedShortcodePending(eURL));
      if (listingType === SOLD_LISTING && isValidURL(eURL)) dispatch(saveTeamSoldShortcodePending(eURL));
    }

    if (formType === 'agent') {
      if (listingType === NEW_LISTING && isValidURL(eURL)) dispatch(saveListedShortcodePending(eURL));
      if (listingType === SOLD_LISTING && isValidURL(eURL)) dispatch(saveSoldShortcodePending(eURL));
    }
  };

  const isVisible = ctaEnabled && shortenedURL;

  if (!editable) {
    if (isVisible) {
      return (
        <Form.Group widths="2">
          <Input label="Call to action URL" name={listingType + '_cta'} value={currentValue} disabled={true} />
          <Label style={{ marginTop: !isMobile && '2.5em', backgroundColor: 'transparent' }}>
            <Icon name="linkify" />
            Shortened URL:
            <Label.Detail>
              <Menu.Item href={'https://' + shortenedURL} position="left" target="_blank">
                <span>
                  {shortenedURL}{' '}
                  {popup('We automatically shorten your call to action links and generate URLs for each card to provide tracking and increase conversion.')}
                </span>
              </Menu.Item>
            </Label.Detail>
          </Label>
        </Form.Group>
      );
    } else {
      return <Input label="Call to action URL" name={listingType + '_cta'} value={currentValue} disabled={true} />;
    }
  } else {
    if (isVisible) {
      return (
        <Form.Group widths="2">
          <Input
            type="url"
            label="Call to action URL"
            name={listingType + '_cta'}
            onBlur={handleCTAChange}
            validate={ctaEnabled && composeValidators(required, validURL)}
            disabled={!ctaEnabled}
          />
          <Label style={{ marginTop: !isMobile && '2.5em', backgroundColor: 'transparent' }}>
            <Icon name="linkify" />
            Shortened URL:
            <Label.Detail>
              <Menu.Item href={'https://' + shortenedURL} position="left" target="_blank">
                <span>
                  {shortenedURL}{' '}
                  {popup('We automatically shorten your call to action links and generate URLs for each card to provide tracking and increase conversion.')}
                </span>
              </Menu.Item>
            </Label.Detail>
          </Label>
        </Form.Group>
      );
    } else {
      return (
        <Input
          label="Call to action URL"
          name={listingType + '_cta'}
          onBlur={handleCTAChange}
          validate={ctaEnabled && composeValidators(required, validURL)}
          disabled={!ctaEnabled}
        />
      );
    }
  }
};

export default CTAInputFormField;
