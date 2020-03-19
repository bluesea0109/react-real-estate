import _ from 'lodash';
import { Header } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment, useEffect, useState, useReducer, useRef } from 'react';

import { saveListedShortcodePending, saveSoldShortcodePending } from '../../store/modules/shortcode/actions';
import { saveCustomizationPending } from '../../store/modules/customization/actions';
import { ContentTopHeaderLayout } from '../../layouts';
import { Button, Menu, Page, Segment } from '../Base';
import { isMobile, objectIsEmpty } from '../utils';
import { Form } from './Base';

import PageTitleHeader from '../PageTitleHeader';
import InputFormField from './Common/InputFormField';
import CTAInputFormField from './Common/CTAInputFormField';
import RenderPreviewModal from './Common/RenderPreviewModal';
import KWKLYInputFormField from './Common/KWKLYInputFormField';
import ColorPickerFormField from './Common/ColorPickerFormField';
import UpdateWithoutRerender from './Common/UpdateWithoutRerender';
import AgentDropdownFormField from './Common/AgentDropdownFormField';
import KWKLYCTAToggleFormField from './Common/KWKLYCTAToggleFormField';
import TemplatePictureFormField from './Common/TemplatePictureFormField';
import EnableCustomizationSwitch from './Common/EnableCustomizationSwitch';
import MailoutSizeSliderFormField from './Common/MailoutSizeSliderFormField';
import ValidateURLWithoutRerender from './Common/ValidateURLWithoutRerender';

const formReducer = (state, action) => {
  return _.merge({}, action);
};

const NEW_LISTING = 'listed';

const CustomizeForm = ({ customizationData, initialValues }) => {
  const dispatch = useDispatch();
  const formRef = useRef();

  const peerId = useSelector(store => store.peer.peerId);
  const teammates = useSelector(store => store.team.profiles);
  const customizationPending = useSelector(store => store.customization && store.customization.pending);
  const soldListingAgentShortenedURLPending = useSelector(store => store.shortcode.soldURLToShortenPending);
  const newListingAgentShortenedURLPending = useSelector(store => store.shortcode.listedURLToShortenPending);

  const [formValues, setFormValues] = useReducer(formReducer, customizationData);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (customizationData) {
      if (customizationData?.listed?.cta) {
        dispatch(saveListedShortcodePending(customizationData.listed.cta));
      }

      if (customizationData?.sold?.cta) {
        dispatch(saveSoldShortcodePending(customizationData.sold.cta));
      }

      setFormValues(customizationData);
    }
  }, [customizationData, dispatch, setFormValues]);

  const handleSubmit = () => {
    const data = _.merge({}, formValues);

    if (customizationData) {
      data._id = customizationData._id;
      data._rev = customizationData._rev;
      data.onboardingComplete = customizationData.onboardingComplete;
    }

    if (data.listed) {
      if (data.listed.shortenCTA) {
        delete data.listed.kwkly;
      } else {
        delete data.listed.cta;
      }

      if (!data.listed.shortenCTA && data.listed.kwkly) {
        data.listed.kwkly = `Text ${data.listed.kwkly} to 59559 for details!`;
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
        data.sold.kwkly = `Text ${data.sold.kwkly} to 59559 for details!`;
      }

      if (!data.sold.defaultDisplayAgent.userId) {
        delete data.sold.defaultDisplayAgent;
      }
    }

    setFormValues(data);
    dispatch(saveCustomizationPending(data));
  };

  const triggerSubmit = () => {
    if (formRef.current && !formRef.current.status) {
      formRef.current.handleSubmit();
    } else {
      if (page === 1 && !!formRef.current.status?.sold_cta) {
        setPage(page + 1);
      }
      if (page === 2 && !!formRef.current.status?.listed_cta) {
        setPage(page - 1);
      }
    }
  };

  const nextPage = () => {
    if (formRef.current) {
      formRef.current.validateForm().then(errors => {
        if ((objectIsEmpty(errors) && !formRef.current.status) || (page === 1 && !!formRef.current.status?.sold_cta)) {
          setPage(page + 1);
        } else if (!formRef.current.status) {
          formRef.current.handleSubmit();
        }
      });
    }
  };

  const prevPage = () => {
    if (formRef.current) {
      formRef.current.validateForm().then(errors => {
        if ((objectIsEmpty(errors) && !formRef.current.status) || (page === 2 && !!formRef.current.status?.listed_cta)) {
          setPage(page - 1);
        } else if (!formRef.current.status) {
          formRef.current.handleSubmit();
        }
      });
    }
  };

  const selectedPeer = () => {
    if (teammates.length > 0 && peerId) {
      return teammates.find(profile => profile.userId === peerId);
    } else {
      return null;
    }
  };

  const getPeer = selectedPeer();
  const peersName = getPeer && getPeer.first;

  const Listings = ({ listingType }) => {
    const editable = listingType === NEW_LISTING ? formValues && formValues.listed : formValues && formValues.sold;
    const initialCTA = initialValues?.[listingType]?.cta;
    const initialKWKLY = initialValues?.[listingType]?.kwkly;

    return (
      <Form key={listingType} innerRef={formRef} onSubmit={handleSubmit} validateOnMount={true} validateOnChange={true} enableReinitialize={true}>
        {() => (
          <Fragment>
            <Segment>{EnableCustomizationSwitch({ listingType, initialValues, formValues, setFormValues })}</Segment>

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
              <div>{AgentDropdownFormField({ listingType, initialValues, formValues, setFormValues })}</div>

              <div>{InputFormField({ fieldName: 'frontHeadline', listingType, initialValues, formValues, setFormValues })}</div>

              <div style={{ display: !editable ? 'none' : 'block', paddingTop: isMobile() ? 'unset' : '3.85em' }}>
                {KWKLYCTAToggleFormField({ listingType, initialValues, formValues, setFormValues })}
              </div>

              <div>{MailoutSizeSliderFormField({ formType: 'agent', listingType, initialValues, formValues, setFormValues })}</div>

              <div style={{ display: !editable && !initialCTA ? 'none' : 'block' }}>
                {CTAInputFormField({ formType: 'agent', listingType, initialValues, formValues, setFormValues })}
              </div>

              <div style={{ display: !editable && !initialKWKLY ? 'none' : 'block' }}>
                {KWKLYInputFormField({ listingType, initialValues, formValues, setFormValues })}
              </div>
            </Segment>

            <UpdateWithoutRerender formValues={formValues} />
            <ValidateURLWithoutRerender formType="agent" />
          </Fragment>
        )}
      </Form>
    );
  };

  const renderSteps = () => {
    switch (page) {
      case 1:
        return <Listings listingType="listed" />;

      case 2:
        return <Listings listingType="sold" />;

      default:
        return <span> Nothing here </span>;
    }
  };

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader padded>
          <Menu borderless fluid secondary>
            {peerId ? (
              <Header as="h1">
                {peersName}'s Customization
                <Header.Subheader>Set the default template customization options for peer campaigns.</Header.Subheader>
              </Header>
            ) : (
              <Header as="h1">
                Personal Customization
                <Header.Subheader>Set the default template customization options for your campaigns.</Header.Subheader>
              </Header>
            )}
            <Menu.Menu position="right">
              <span>
                <Button
                  primary
                  type="submit"
                  disabled={customizationPending || soldListingAgentShortenedURLPending || newListingAgentShortenedURLPending}
                  loading={customizationPending || soldListingAgentShortenedURLPending || newListingAgentShortenedURLPending}
                  onClick={triggerSubmit}
                >
                  Save
                </Button>
              </span>
            </Menu.Menu>
          </Menu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>

      <Segment style={isMobile() ? { marginTop: '155px' } : { marginTop: '90px' }}>
        <Menu pointing secondary>
          <Menu.Item
            name="newListing"
            active={page === 1}
            disabled={page === 1 || customizationPending || soldListingAgentShortenedURLPending}
            onClick={prevPage}
          />
          <Menu.Item
            name="soldListing"
            active={page === 2}
            disabled={page === 2 || customizationPending || newListingAgentShortenedURLPending}
            onClick={nextPage}
          />
        </Menu>

        {renderSteps()}
      </Segment>

      {RenderPreviewModal({ formType: 'agent', formValues })}
    </Page>
  );
};

export default CustomizeForm;
