import Merge from 'lodash/merge';
import styled from 'styled-components';
import { BlockPicker } from 'react-color';
import Nouislider from 'nouislider-react';
import { useSelector } from 'react-redux';
import { Confirm, Dropdown, Form, Header, Popup, Radio } from 'semantic-ui-react';
import React, { createRef, Fragment, useEffect, useState, useReducer } from 'react';

import { Button, Icon, Image, Menu, Segment } from '../Base';
import { isMobile } from './helpers';

import './EditCampaignForm.css';

export const colors = ['#b40101', '#f2714d', '#f4b450', '#79c34d', '#2d9a2c', '#59c4c4', '#009ee7', '#0e2b5b', '#ee83ee', '#8b288f', '#808080', '#000000'];

const StyledHeader = styled(Header)`
  min-width: 18em;
  display: inline-block;
`;

const formReducer = (state, action) => {
  return Merge({}, state, action);
};

const NewCustomizeForm = ({ customizationData, teamCustomizationData = null }) => {
  const bookmarkTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.bookmark);
  // const ribbonTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.ribbon);
  // const stackTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.stack);

  // const resolveTemplateValues = () => {
  //
  // };

  const initialValues = {
    listed: {
      createMailoutsOfThisType: true,
      defaultDisplayAgent: {
        userId: null,
        first: null,
        last: null,
      },
      mailoutSize: 300,
      mailoutSizeMin: 100,
      mailoutSizeMax: 1000,
      templateTheme: 'bookmark',
      brandColor: colors[0],
      frontHeadline: bookmarkTemplate.listed.fields.filter(field => field.name === 'frontHeadline')[0],
      cta: null,
      shortenCTA: null,
    },
    sold: {
      createMailoutsOfThisType: false,
      defaultDisplayAgent: {
        userId: null,
        first: null,
        last: null,
      },
      mailoutSize: 300,
      mailoutSizeMin: 100,
      mailoutSizeMax: 1000,
      templateTheme: 'bookmark',
      brandColor: colors[0],
      frontHeadline: bookmarkTemplate.sold.fields.filter(field => field.name === 'frontHeadline')[0],
      cta: null,
      shortenCTA: null,
    },
  };

  const onLoginUserId = useSelector(store => store.onLogin.user._id);
  const onLoginMode = useSelector(store => store.onLogin.mode);
  const teammates = useSelector(store => store.team.profiles);
  const peerId = useSelector(store => store.peer.peerId);

  const multiUser = onLoginMode === 'multiuser';
  const singleuser = onLoginMode === 'singleuser';
  const profiles = [];

  const [step, setStep] = useState(1);

  const [formValues, setFormValues] = useReducer(formReducer, initialValues);
  const [showSelectionAlert, setShowSelectionAlert] = useState(false);

  useEffect(() => {
    if (multiUser && customizationData && teamCustomizationData) {
      const updatedFormValues = Merge({}, formValues, teamCustomizationData, customizationData);
      delete updatedFormValues._rev;
      delete updatedFormValues._id;
      delete updatedFormValues.onboardingComplete;
      setFormValues(updatedFormValues);
    }

    if (singleuser && customizationData) {
      const updatedFormValues = Merge({}, formValues, customizationData);
      delete updatedFormValues._rev;
      delete updatedFormValues._id;
      delete updatedFormValues.onboardingComplete;
      setFormValues(updatedFormValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customizationData, teamCustomizationData, setFormValues]);

  useEffect(() => {
    if (!formValues.listed.createMailoutsOfThisType && !formValues.sold.createMailoutsOfThisType) {
      setShowSelectionAlert(true);
    } else {
      setShowSelectionAlert(false);
    }
  }, [formValues, setShowSelectionAlert]);

  // const handleChange = input => event => {
  //   console.log('changes....');
  //   console.log('input: ', input);
  //   console.log('event: ', event);
  //   // this.setState({ [input] : event.target.value })
  // };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
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

  const renderSwitch = ({ listingType }) => {
    const targetOn = listingType === 'listed' ? 'Generate new listing campaigns' : 'Generate sold listing campaigns';

    const currentValue = formValues[listingType].createMailoutsOfThisType;

    const handleChange = (param, data) => {
      const newValue = formValues;
      newValue[listingType].createMailoutsOfThisType = data.checked;
      setFormValues(newValue);
    };

    return (
      <Header size="medium">
        {targetOn}: &nbsp;
        <Radio toggle onChange={handleChange} checked={currentValue} style={{ verticalAlign: 'bottom' }} />
      </Header>
    );
  };

  const renderTemplatePicture = ({ templateName, listingType }) => {
    const currentValue = formValues[listingType].templateTheme;

    const resolveSource = type => {
      const types = {
        ribbon: require('../../assets/ribbon-preview.png'),
        bookmark: require('../../assets/bookmark-preview.png'),
        stack: require('../../assets/stack-preview.png'),
        undefined: null,
      };
      return type ? types[type] : types['undefined'];
    };

    const handleTemplateChange = value => {
      const newValue = formValues;
      newValue[listingType].templateTheme = value;
      setFormValues(newValue);
    };

    return (
      <div style={{ margin: '1em', minWidth: '128px', maxWidth: '270px' }}>
        <input
          type="radio"
          checked={currentValue === templateName}
          value={templateName}
          onChange={(e, { value }) => handleTemplateChange(value)}
          style={{ visibility: 'hidden', display: 'none' }}
        />
        <div
          style={
            currentValue === templateName
              ? { border: '2px solid teal', margin: 0, padding: '0.5em', borderRadius: '5px' }
              : { border: '1px solid lightgray', margin: 0, padding: '0.5em', borderRadius: '5px' }
          }
        >
          <img onClick={e => handleTemplateChange(templateName)} src={resolveSource(templateName)} alt={templateName} />
        </div>
      </div>
    );
  };

  const renderColorPicker = ({ listingType }) => {
    const currentValue = formValues[listingType].brandColor;

    const handleColorChange = value => {
      const newValue = formValues;
      newValue[listingType].brandColor = value.hex;
      setFormValues(newValue);
    };

    return <BlockPicker triangle="hide" width="200px" color={currentValue} colors={colors} onChangeComplete={handleColorChange} />;
  };

  const renderAgentDropdown = ({ listingType }) => {
    const currentValue = formValues[listingType].defaultDisplayAgent.userId;

    const handleAgentChange = (e, input) => {
      const selectedAgent = input.options.filter(o => o.value === input.value)[0];
      const { first, last, value } = selectedAgent;
      const newValue = formValues;
      newValue[listingType].defaultDisplayAgent = { userId: value, first, last };
      setFormValues(newValue);
    };

    return <Dropdown placeholder="Select Default Agent" fluid selection options={profiles} value={currentValue} onChange={handleAgentChange} />;
  };

  const renderField = ({ fieldName, listingType }) => {
    const adjustedName = fieldName === 'frontHeadline' ? 'Headline' : fieldName;

    const currentValue = formValues[listingType][fieldName];

    const handleChange = value => {
      const newValue = formValues;
      newValue[listingType][fieldName] = value;
      setFormValues(newValue);
    };

    return (
      <Form.Field>
        <Form.Input
          fluid
          label={<Header as="h4">{adjustedName}</Header>}
          // error={error && { content: error }}
          // placeholder={field.default}
          // type={field.type}
          onChange={(e, input) => handleChange(input.value)}
          defaultValue={currentValue}
        />
      </Form.Field>
    );
  };

  const renderMailoutSizeSlider = ({ listingType }) => {
    const INCREMENT = 10;
    const STEPS = INCREMENT;
    const MARGIN = INCREMENT;
    const SLIDER_INITIAL_VALUES = [];

    const currentMailoutSize = formValues[listingType].mailoutSize;
    const currentMailoutSizeMin = formValues[listingType].mailoutSizeMin;
    const currentMailoutSizeMax = formValues[listingType].mailoutSizeMax;

    // SLIDER_INITIAL_VALUES.push(currentMailoutSizeMin);
    SLIDER_INITIAL_VALUES.push(currentMailoutSize);
    // SLIDER_INITIAL_VALUES.push(currentMailoutSizeMax);

    const handleMailoutSizeChange = value => {
      const newValue = formValues;
      newValue[listingType].mailoutSize = value[0];
      setFormValues(newValue);
    };

    return (
      <div className="slider" style={{ marginTop: '2em', marginBottom: '2em' }}>
        {isMobile() && (
          <Fragment>
            <br />
            <br />
          </Fragment>
        )}
        <Nouislider
          style={{ height: '3px' }}
          range={{
            min: currentMailoutSizeMin,
            max: currentMailoutSizeMax,
          }}
          step={STEPS}
          start={SLIDER_INITIAL_VALUES}
          margin={MARGIN}
          connect={true}
          behaviour="tap-drag"
          tooltips={true}
          pips={{
            mode: 'values',
            values: [currentMailoutSizeMin, currentMailoutSizeMax],
            stepped: true,
            density: 3,
          }}
          format={{
            to: (value, index) => {
              // if (index === 0) return 'Min: ' + intValue;
              // if (index === 1) return 'Default: ' + intValue;
              // if (index === 2) return 'Max: ' + intValue;

              return Math.round(parseInt(value, 10) / 10) * 10;
            },
            from: value => {
              // const newValue = value.split(':');
              //
              // if (newValue.length === 1) return newValue[0];
              // else return newValue[1];

              return value;
            },
          }}
          onChange={handleMailoutSizeChange}
        />
        {isMobile() && (
          <Fragment>
            <br />
            <br />
          </Fragment>
        )}
      </div>
    );
  };

  const Listings = ({ listingType }) => {
    const placeholder = listingType === 'listed' ? 'Campaign will not be enabled for new listings' : 'Campaign will not be enabled for sold listings';

    return (
      <Fragment>
        <Segment>{renderSwitch({ listingType })}</Segment>

        {!formValues[listingType].createMailoutsOfThisType && (
          <Segment placeholder>
            <Header icon>
              <Icon name="exclamation triangle" />
              {placeholder}
            </Header>
          </Segment>
        )}

        {formValues[listingType].createMailoutsOfThisType && (
          <Segment padded className={isMobile() ? null : 'primary-grid-container'}>
            <div>
              <Header as="h4">{listingType} Template Theme</Header>
              {renderTemplatePicture({ templateName: 'bookmark', listingType })}
            </div>

            <div>
              <p>&nbsp;</p>
              {renderTemplatePicture({ templateName: 'ribbon', listingType })}
            </div>

            <div>
              <p>&nbsp;</p>
              {renderTemplatePicture({ templateName: 'stack', listingType })}
            </div>

            <div>
              <Header as="h4">Brand Color</Header>
              {renderColorPicker({ listingType })}
            </div>
          </Segment>
        )}

        {formValues[listingType].createMailoutsOfThisType && (
          <Segment padded className={isMobile() ? null : 'tertiary-grid-container'}>
            <div>
              <Header as="h4">Choose Agent</Header>
              {renderAgentDropdown({ listingType })}
            </div>

            <div>{renderField({ fieldName: 'frontHeadline', listingType })}</div>

            <div>
              <Header as="h4">Number of postcards to send per listing</Header>
              {renderMailoutSizeSlider({ listingType })}
            </div>
          </Segment>
        )}
      </Fragment>
    );
  };

  const renderSteps = () => {
    switch (step) {
      case 1:
        return <Listings listingType="listed" />;

      case 2:
        return <Listings listingType="sold" />;

      default:
        return <span> Nothing here </span>;
    }
  };

  return (
    <Fragment>
      <Segment>
        <Menu borderless fluid secondary>
          <Menu.Item>
            {peerId ? (
              <Header as="h1">
                Peer Customization (WORK IN PROGRESS)
                <Header.Subheader>Set the default template customization options for peer campaigns.</Header.Subheader>
              </Header>
            ) : (
              <Header as="h1">
                My Customization (WORK IN PROGRESS)
                <Header.Subheader>Set the default template customization options for your campaigns.</Header.Subheader>
              </Header>
            )}
          </Menu.Item>
          <Menu.Menu position="right">
            <span>
              <Button type="submit" color="teal">
                Save
              </Button>
            </span>
          </Menu.Menu>
        </Menu>
      </Segment>

      <Segment>
        <Menu pointing secondary>
          <Menu.Item name="newListing" active={step === 1} disabled={step === 1} onClick={prevStep} />
          <Menu.Item name="soldListing" active={step === 2} disabled={step === 2} onClick={nextStep} />
        </Menu>
      </Segment>

      <Confirm
        open={showSelectionAlert}
        content="In order to use Bravity Marketing platform, you must select at least one"
        cancelButton="Enable new listings"
        confirmButton="Enable sold listings"
        // onCancel={() => [setNewListingEnabled(true), setTogglePages('first')]}
        // onConfirm={() => [setSoldListingEnabled(true), setTogglePages('last')]}
      />

      {renderSteps()}
    </Fragment>
  );
};

export default NewCustomizeForm;
