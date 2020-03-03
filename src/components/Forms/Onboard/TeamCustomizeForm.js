import _ from 'lodash';
import { Header, Popup } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import React, { createRef, Fragment, useEffect, useState, useReducer } from 'react';

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
import UpdateWithoutRerender from '../Common/UpdateWithoutRerender';
import KWKLYCTAToggleFormField from '../Common/KWKLYCTAToggleFormField';
import TemplatePictureFormField from '../Common/TemplatePictureFormField';
import ValidateURLWithoutRerender from '../Common/ValidateURLWithoutRerender';
import MailoutSizeSliderFormField from '../Common/MailoutSizeSliderFormField';

const formReducer = (state, action) => {
  return _.merge({}, action);
};

const NEW_LISTING = 'listed';

const TeamCustomizeForm = ({ teamCustomizationData, initialValues }) => {
  const dispatch = useDispatch();

  const teammates = useSelector(store => store.team.profiles);
  const onLoginUserId = useSelector(store => store.onLogin.user._id);
  const firstTeamAdmin = useSelector(store => store.team?.profiles.filter(profile => profile.userId === store.onLogin.user._id)[0]);

  const profiles = [];

  const [formValues, setFormValues] = useReducer(formReducer, teamCustomizationData);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let isInitialized = true;

    if (isInitialized && !teamCustomizationData) {
      const updatedFormValues = _.merge({}, formValues, initialValues);

      setFormValues(updatedFormValues);
    }

    return () => (isInitialized = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamCustomizationData, initialValues, setFormValues, dispatch]);

  const handleSubmit = (values, actions) => {
    const data = _.merge({}, formValues);

    if (!teamCustomizationData) {
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

    if (data.listed.shortenCTA) {
      delete data.listed.kwkly;
    } else {
      delete data.listed.cta;
    }

    if (data.sold.shortenCTA) {
      delete data.sold.kwkly;
    } else {
      delete data.sold.cta;
    }

    if (!data.listed.shortenCTA && data.listed.kwkly) {
      data.listed.kwkly = `Text ${data.listed.kwkly} to 59559 for details!`;
    }

    if (!data.sold.shortenCTA && data.sold.kwkly) {
      data.sold.kwkly = `Text ${data.sold.kwkly} to 59559 for details!`;
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
    const editable = listingType === NEW_LISTING ? formValues && formValues.listed : formValues && formValues.sold;

    return (
      <Fragment>
        <Segment
          padded
          className={isMobile() ? null : 'primary-grid-container'}
          style={isMobile() ? {} : { gridTemplateRows: 'unset', gridTemplateAreas: 'unset' }}
        >
          <div>
            <Header as="h5" style={{ opacity: !editable ? 0.4 : 1 }}>
              Template Theme
            </Header>
            {TemplatePictureFormField({ templateName: 'ribbon', listingType, initialValues, formValues, setFormValues })}
          </div>

          <div>
            <p>&nbsp;</p>
            {TemplatePictureFormField({ templateName: 'bookmark', listingType, initialValues, formValues, setFormValues })}
          </div>

          <div>
            <p>&nbsp;</p>
            {TemplatePictureFormField({ templateName: 'stack', listingType, initialValues, formValues, setFormValues })}
          </div>

          <div>{ColorPickerFormField({ listingType, initialValues, formValues, setFormValues })}</div>
        </Segment>

        <Segment padded className={isMobile() ? null : 'tertiary-grid-container'}>
          {InputFormField({ fieldName: 'frontHeadline', listingType, initialValues, formValues, setFormValues })}

          <div>{MailoutSizeSliderFormField({ formType: 'team', listingType, initialValues, formValues, setFormValues })}</div>

          <div>{KWKLYCTAToggleFormField({ listingType, initialValues, formValues, setFormValues })}</div>

          <div> </div>

          <div>{CTAInputFormField({ formType: 'team', listingType, initialValues, formValues, setFormValues })}</div>

          <div>{KWKLYInputFormField({ listingType, initialValues, formValues, setFormValues })}</div>
        </Segment>

        <UpdateWithoutRerender formValues={formValues} />
        <ValidateURLWithoutRerender formType="team" />
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
                    <Button primary type="submit" disabled={isDisabled}>
                      {isLastPage ? 'Submit' : 'Next'}
                    </Button>
                  </span>
                </Menu.Menu>
              </Menu>
            </Segment>
          </ContentTopHeaderLayout>
        }
        onSubmit={(values, actions) => handleSubmit(values, actions)}
        page={page}
        setPage={setPage}
        onLastPage={value => setIsLastPage(value)}
        onIsDisabled={value => setIsDisabled(value)}
      >
        <Listings listingType="listed" />
        <Listings listingType="sold" />
      </Wizard>

      {PreviewModal({ formType: 'team', formValues })}
    </Page>
  );
};

export default TeamCustomizeForm;
