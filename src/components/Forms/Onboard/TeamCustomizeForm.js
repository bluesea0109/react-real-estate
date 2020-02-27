import _ from 'lodash';
import { Header, Popup } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import React, { createRef, Fragment, useEffect, useState, useReducer } from 'react';

import { saveTeamSoldShortcodePending, saveTeamListedShortcodePending } from '../../../store/modules/teamShortcode/actions';
import { saveTeamCustomizationPending } from '../../../store/modules/teamCustomization/actions';
import { Button, Icon, Image, Menu, Page, Segment } from '../../Base';
import { ContentTopHeaderLayout } from '../../../layouts';
import { StyledHeader } from '../../helpers';
import Wizard from './CustomizationWizard';
import { isMobile } from '../../utils';

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

const TeamCustomizeForm = ({ teamCustomizationData, initialRun }) => {
  const dispatch = useDispatch();

  const teammates = useSelector(store => store.team.profiles);
  const onLoginUserId = useSelector(store => store.onLogin.user._id);
  const firstTeamAdmin = useSelector(store => store.team?.profiles.filter(profile => profile.userId === store.onLogin.user._id)[0]);

  const profiles = [];

  const [formValues, setFormValues] = useReducer(formReducer, teamCustomizationData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let isInitialized = true;

    if (isInitialized && teamCustomizationData) {
      const updatedFormValues = _.merge({}, formValues, teamCustomizationData);

      setFormValues(updatedFormValues);

      if (updatedFormValues.listed.cta) {
        dispatch(saveTeamListedShortcodePending(updatedFormValues.listed.cta));
      }

      if (updatedFormValues.sold.cta) {
        dispatch(saveTeamSoldShortcodePending(updatedFormValues.sold.cta));
      }
    }

    return () => (isInitialized = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamCustomizationData, setFormValues, dispatch]);

  const handleSubmit = (values, actions) => {
    const data = _.merge({}, teamCustomizationData, formValues);

    data.listed.createMailoutsOfThisType = true;
    data.listed.frontHeadline = values.listed_frontHeadline;
    data.listed.cta = values.listed_cta;
    data.listed.kwkly = values.listed_kwkly;

    data.sold.createMailoutsOfThisType = true;
    data.sold.frontHeadline = values.sold_frontHeadline;
    data.sold.cta = values.sold_cta;
    data.sold.kwkly = values.sold_kwkly;

    if (initialRun) {
      data.listed.defaultDisplayAgent = {
        userId: firstTeamAdmin && firstTeamAdmin.userId,
        first: firstTeamAdmin && firstTeamAdmin.first,
        last: firstTeamAdmin && firstTeamAdmin.last,
      };
      data.sold.defaultDisplayAgent = {
        userId: firstTeamAdmin && firstTeamAdmin.userId,
        first: firstTeamAdmin && firstTeamAdmin.first,
        last: firstTeamAdmin && firstTeamAdmin.last,
      };
    }

    if (!data.listed.cta) delete data.listed.cta;
    if (!data.sold.cta) delete data.sold.cta;

    if (data.listed.shortenCTA || !data.listed.kwkly) {
      delete data.listed.kwkly;
    }

    if (data.sold.shortenCTA || !data.sold.kwkly) {
      delete data.sold.kwkly;
    }

    if (!data.listed.defaultDisplayAgent.userId) delete data.listed.defaultDisplayAgent;
    if (!data.sold.defaultDisplayAgent.userId) delete data.sold.defaultDisplayAgent;

    if (!data.sold.shortenCTA && data.sold.kwkly) {
      data.sold.kwkly = `Text ${data.sold.kwkly} to 59559 for details!`;
    }

    if (!data.listed.shortenCTA && data.listed.kwkly) {
      data.listed.kwkly = `Text ${data.listed.kwkly} to 59559 for details!`;
    }

    setFormValues(data);
    dispatch(saveTeamCustomizationPending(data));
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
          {InputFormField({ fieldName: 'frontHeadline', listingType, formValues, setFormValues })}

          <div>
            <Header as="h4">Number of postcards to send per listing</Header>
            {MailoutSizeSliderFormField({ formType: 'team', listingType, formValues, setFormValues })}
          </div>

          <div>{KWKLYCTAToggleFormField({ listingType, formValues, setFormValues })}</div>

          <div> </div>

          <div>{CTAInputFormField({ formType: 'team', listingType, formValues, setFormValues })}</div>

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
                  Team Customization
                  <Header.Subheader>
                    Set the default template customization options for your team.&nbsp;
                    {isMobile() && <br />}
                    Changes made here will not overwrite existing user-specific customization.
                  </Header.Subheader>
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

      {PreviewModal({ formType: 'team' })}
    </Page>
  );
};

export default TeamCustomizeForm;
