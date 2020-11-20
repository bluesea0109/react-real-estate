import _ from 'lodash';
import { Header, Popup } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import React, { createRef, Fragment, useState, useReducer } from 'react';

import { saveCustomizationPending } from '../../../store/modules/customization/actions';
import { Button, Icon, Image, Menu, Page, Segment } from '../../Base';
import { ContentTopHeaderLayout } from '../../../layouts';
import { StyledHeader } from '../../utils/helpers';
import Wizard from './CustomizationWizard';

import InputFormField from '../Common/InputFormField';
import CTAInputFormField from '../Common/CTAInputFormField';
import RenderPreviewModal from '../Common/RenderPreviewModal';
import KWKLYInputFormField from '../Common/KWKLYInputFormField';
import ColorPickerFormField from '../Common/ColorPickerFormField';
import UpdateWithoutRerender from '../Common/UpdateWithoutRerender';
import KWKLYCTAToggleFormField from '../Common/KWKLYCTAToggleFormField';
import EnableCustomizationSwitch from '../Common/EnableCustomizationSwitch';
import MailoutSizeSliderFormField from '../Common/MailoutSizeSliderFormField';
import ValidateURLWithoutRerender from '../Common/ValidateURLWithoutRerender';
import { useIsMobile } from '../../Hooks/useIsMobile';
import TemplatePostcardSizeField from '../Common/TemplatePostcardSizeField';
import { StyledTemplateDiv } from '../Base/Carousel';
import TemplateCarousel from '../Common/TemplateCarousel';

const formReducer = (state, action) => {
  return _.merge({}, action);
};

const strippedKWKLY = kwklyString => {
  return kwklyString.replace(/Text /g, '').replace(/ to 59559 for details!/g, '');
};

const NEW_LISTING = 'listed';

const CustomizeForm = ({ customizationData, initialValues }) => {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();

  const teammates = useSelector(store => store.team.profiles);
  const onLoginUserId = useSelector(store => store.onLogin.user._id);

  const profiles = [];

  const [formValues, setFormValues] = useReducer(formReducer, customizationData);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [page, setPage] = useState(0);

  const handleSubmit = () => {
    const data = _.merge({}, formValues);

    if (data.listed) {
      if (data.listed.shortenCTA) {
        delete data.listed.kwkly;
      } else {
        delete data.listed.cta;
      }

      if (!data.listed.shortenCTA && data.listed.kwkly) {
        let kwklyCode = strippedKWKLY(data.listed.kwkly);
        data.listed.kwkly = `Text ${kwklyCode} to 59559 for details!`;
      }

      if (!data.listed.defaultDisplayAgent.userId) {
        delete data.listed.defaultDisplayAgent;
      }
    }

    if (data.sold) {
      if (data.sold.shortenCTA) {
        delete data.sold.kwkly;
      } else {
        delete data.sold.cta;
      }

      if (!data.sold.shortenCTA && data.sold.kwkly) {
        let kwklyCode = strippedKWKLY(data.sold.kwkly);
        data.sold.kwkly = `Text ${kwklyCode} to 59559 for details!`;
      }

      if (!data.sold.defaultDisplayAgent.userId) {
        delete data.sold.defaultDisplayAgent;
      }
    }

    setFormValues(data);
    dispatch(saveCustomizationPending(data));
  };

  if (teammates.length > 0) {
    teammates.map((profile, index) => {
      const setupComplete = profile.doc.setupComplete;
      const currentUser = profile.userId === onLoginUserId;
      const fullName = `${profile.first} ${profile.last}`;

      const contextRef = createRef();
      const currentUserIconWithPopup = (
        <Popup
          context={contextRef}
          content="Currently selected agent"
          trigger={<Icon name="user" />}
        />
      );
      const setupCompletedIconWithPopup = (
        <Popup
          context={contextRef}
          content="Setup Completed"
          trigger={<Icon name="check circle" color="teal" />}
        />
      );

      return profiles.push({
        key: index,
        first: profile.first,
        last: profile.last,
        text: fullName,
        value: profile.userId,
        content: (
          <StyledHeader as="h4" ref={contextRef}>
            <Image
              size="mini"
              inline
              circular
              src="https://react.semantic-ui.com/images/avatar/large/patrick.png"
            />
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
    const editable =
      listingType === NEW_LISTING ? formValues && formValues.listed : formValues && formValues.sold;
    const initialCTA = initialValues?.[listingType]?.cta;
    const initialKWKLY = initialValues?.[listingType]?.kwkly;

    return (
      <Fragment>
        <Segment>
          {EnableCustomizationSwitch({ listingType, initialValues, formValues, setFormValues })}
        </Segment>

        <Segment
          padded
          className={isMobile ? null : 'primary-grid-container'}
          style={isMobile ? {} : { gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
        >
          <StyledTemplateDiv>
            <TemplateCarousel
              editable={true}
              listingType={listingType}
              initialValues={initialValues}
              formValues={formValues}
              setFormValues={setFormValues}
            ></TemplateCarousel>
            <div>
              {ColorPickerFormField({ listingType, initialValues, formValues, setFormValues })}
            </div>
          </StyledTemplateDiv>
        </Segment>

        <Segment padded className={isMobile ? null : 'tertiary-grid-container'}>
          <div>
            {InputFormField({
              fieldName: 'frontHeadline',
              listingType,
              initialValues,
              formValues,
              setFormValues,
            })}
          </div>

          <div>
            {MailoutSizeSliderFormField({
              formType: 'agent',
              listingType,
              initialValues,
              formValues,
              setFormValues,
            })}
          </div>

          <div style={{ display: !editable && !initialCTA ? 'none' : 'block' }}>
            {CTAInputFormField({
              formType: 'agent',
              listingType,
              initialValues,
              formValues,
              setFormValues,
            })}
          </div>

          <div style={{ display: !editable && !initialKWKLY ? 'none' : 'block' }}>
            {KWKLYInputFormField({ listingType, initialValues, formValues, setFormValues })}
            <div style={{ display: 'block', paddingTop: '1.5em' }}>
              <div>
                {KWKLYCTAToggleFormField({ listingType, initialValues, formValues, setFormValues })}
              </div>
            </div>
          </div>
          <div style={{ display: !editable ? 'none' : 'block' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                padding: '0.5rem',
              }}
            >
              <>
                {TemplatePostcardSizeField({
                  postcardSize: '4x6',
                  listingType,
                  initialValues,
                  formValues,
                  setFormValues,
                })}
              </>
              <>
                {TemplatePostcardSizeField({
                  postcardSize: '6x9',
                  listingType,
                  initialValues,
                  formValues,
                  setFormValues,
                })}
              </>
              <>
                {TemplatePostcardSizeField({
                  postcardSize: '6x11',
                  listingType,
                  initialValues,
                  formValues,
                  setFormValues,
                })}
              </>
            </div>
          </div>
        </Segment>

        <UpdateWithoutRerender formValues={formValues} />
        <ValidateURLWithoutRerender formType="agent" />
      </Fragment>
    );
  };

  return (
    <Page basic>
      <Wizard
        controls={
          <ContentTopHeaderLayout>
            <Segment padded style={isMobile ? { marginTop: '58px' } : {}}>
              <Menu borderless fluid secondary>
                <Header as="h1">
                  Personal Customization
                  <Header.Subheader>
                    Set the default template customization options for your campaigns.
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

      {RenderPreviewModal({ formType: 'agent', formValues })}
    </Page>
  );
};

export default CustomizeForm;
