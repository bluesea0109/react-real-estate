import _ from 'lodash';
import { Header, Popup } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import React, { createRef, Fragment, useEffect, useState, useReducer } from 'react';

import { saveSoldShortcodePending, saveListedShortcodePending } from '../../../store/modules/shortcode/actions';
import { saveCustomizationPending } from '../../../store/modules/customization/actions';
import { Button, Icon, Image, Menu, Page, Segment } from '../../Base';
import { isMobile, differenceObjectDeep } from '../../utils';
import { ContentTopHeaderLayout } from '../../../layouts';
import { StyledHeader } from '../../helpers';
import Wizard from './CustomizationWizard';

import PreviewModal from '../Common/PreviewModal';
import InputFormField from '../Common/InputFormField';
import CTAInputFormField from '../Common/CTAInputFormField';
import KWKLYInputFormField from '../Common/KWKLYInputFormField';
import ColorPickerFormField from '../Common/ColorPickerFormField';
import KWKLYCTAToggleFormField from '../Common/KWKLYCTAToggleFormField';
import TemplatePictureFormField from '../Common/TemplatePictureFormField';
import MailoutSizeSliderFormField from '../Common/MailoutSizeSliderFormField';

const formReducer = (state, action) => {
  return _.merge({}, state, action);
};

const CustomizeForm = ({ customizationData, teamCustomizationData = null }) => {
  const dispatch = useDispatch();

  const teammates = useSelector(store => store.team.profiles);
  const onLoginUserId = useSelector(store => store.onLogin.user._id);

  const profiles = [];

  const [formValues, setFormValues] = useReducer(formReducer, customizationData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let isInitialized = true;

    if (isInitialized && customizationData) {
      const updatedFormValues = _.merge({}, formValues, customizationData);
      setFormValues(updatedFormValues);

      if (updatedFormValues.listed.cta) {
        dispatch(saveListedShortcodePending(updatedFormValues.listed.cta));
      }
      if (updatedFormValues.sold.cta) {
        dispatch(saveSoldShortcodePending(updatedFormValues.sold.cta));
      }
    }

    return () => (isInitialized = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customizationData, teamCustomizationData, setFormValues, dispatch]);

  const handleSubmit = () => {
    const allData = _.merge({}, customizationData, formValues);

    if (allData.listed.shortenCTA || !allData.listed.kwkly) {
      delete allData.listed.kwkly;
    }

    if (allData.sold.shortenCTA || !allData.sold.kwkly) {
      delete allData.sold.kwkly;
    }

    const diffData = differenceObjectDeep(teamCustomizationData, allData);
    if (!diffData.listed.cta) delete diffData.listed.cta;
    if (!diffData.sold.cta) delete diffData.sold.cta;

    if (!diffData.listed.defaultDisplayAgent.userId) delete diffData.listed.defaultDisplayAgent;
    if (!diffData.sold.defaultDisplayAgent.userId) delete diffData.sold.defaultDisplayAgent;

    diffData.listed.createMailoutsOfThisType = formValues.listed.createMailoutsOfThisType;
    diffData.sold.createMailoutsOfThisType = formValues.sold.createMailoutsOfThisType;

    setFormValues(diffData);
    dispatch(saveCustomizationPending(diffData));
  };

  if (teammates.length > 0) {
    teammates.map((profile, index) => {
      const setupComplete = profile.doc.setupComplete;
      const currentUser = profile.userId === onLoginUserId;
      const fullName = `${profile.first} ${profile.last}`;

      const contextRef = createRef();
      const currentUserIconWithPopup = <Popup context={contextRef} content="Currently selected agent" trigger={<Icon name="user" />} />;
      const setupCompletedIconWithPopup = <Popup context={contextRef} content="Setup Completed" trigger={<Icon name="check circle" color="teal" />} />;

      return profiles.push({
        key: index,
        first: profile.first,
        last: profile.last,
        text: fullName,
        value: profile.userId,
        content: (
          <StyledHeader as="h4" ref={contextRef}>
            <Image size="mini" inline circular src="https://react.semantic-ui.com/images/avatar/large/patrick.png" />
            &nbsp;
            {profile.first}&nbsp;
            {profile.last}&nbsp;
            {currentUser ? currentUserIconWithPopup : null}
            {setupComplete ? setupCompletedIconWithPopup : null}
          </StyledHeader>
        ),
      });
    });
  }

  const Listings = ({ listingType }) => {
    return (
      <Fragment>
        <Segment
          padded
          className={isMobile() ? null : 'primary-grid-container'}
          style={isMobile() ? {} : { gridTemplateRows: 'unset', gridTemplateAreas: 'unset' }}
        >
          <div>
            <Header as="h4">Template Theme</Header>
            {TemplatePictureFormField({ templateName: 'ribbon', listingType, formValues, setFormValues })}
          </div>

          <div>
            <p>&nbsp;</p>
            {TemplatePictureFormField({ templateName: 'bookmark', listingType, formValues, setFormValues })}
          </div>

          <div>
            <p>&nbsp;</p>
            {TemplatePictureFormField({ templateName: 'stack', listingType, formValues, setFormValues })}
          </div>

          <div>
            <Header as="h4">Brand Color</Header>
            {ColorPickerFormField({ listingType, formValues, setFormValues })}
          </div>
        </Segment>

        <Segment padded className={isMobile() ? null : 'tertiary-grid-container'}>
          <div>{InputFormField({ fieldName: 'frontHeadline', listingType, formValues, setFormValues })}</div>

          <div>
            <Header as="h4">Number of postcards to send per listing</Header>
            {MailoutSizeSliderFormField({ formType: 'agent', listingType, formValues, setFormValues })}
          </div>

          <div>{KWKLYCTAToggleFormField({ listingType, formValues, setFormValues })}</div>

          <div> </div>

          <div>{CTAInputFormField({ formType: 'agent', listingType, formValues, setFormValues })}</div>

          <div>{KWKLYInputFormField({ listingType, formValues, setFormValues })}</div>
        </Segment>
      </Fragment>
    );
  };

  return (
    <Page basic>
      <Wizard
        controls={
          <ContentTopHeaderLayout>
            <Segment padded style={isMobile() ? { marginTop: '58px' } : {}}>
              <Menu borderless fluid secondary>
                <Header as="h1">
                  Personal Customization
                  <Header.Subheader>Set the default template customization options for your campaigns.</Header.Subheader>
                </Header>
                <Menu.Menu position="right">
                  <span>
                    {page === 1 && (
                      <Button primary inverted onClick={() => setPage(0)}>
                        Previous
                      </Button>
                    )}
                    <Button primary type="submit" disabled={isSubmitting}>
                      {isLastPage ? 'Submit' : 'Next'}
                    </Button>
                  </span>
                </Menu.Menu>
              </Menu>
            </Segment>
          </ContentTopHeaderLayout>
        }
        initialValues={{
          listed_frontHeadline: formValues.listed.frontHeadline,
          listed_cta: formValues.listed.cta,
          listed_kwkly: formValues.listed.kwkly,
          sold_frontHeadline: formValues.sold.frontHeadline,
          sold_cta: formValues.sold.cta,
          sold_kwkly: formValues.sold.kwkly,
        }}
        onSubmit={(values, actions) => handleSubmit(values, actions)}
        page={page}
        setPage={setPage}
        onLastPage={value => setIsLastPage(value)}
        onIsSubmitting={value => setIsSubmitting(value)}
      >
        <Listings listingType="listed" />
        <Listings listingType="sold" />
      </Wizard>

      {PreviewModal({ formType: 'agent' })}
    </Page>
  );
};

export default CustomizeForm;
