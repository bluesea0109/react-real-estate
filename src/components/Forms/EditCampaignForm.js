import styled from 'styled-components';
import startCase from 'lodash/startCase';
import { BlockPicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment, createRef, useState } from 'react';
import { Dropdown, Form, Header, Popup } from 'semantic-ui-react';

import { modifyMailoutPending } from '../../store/modules/mailout/actions';
import { Button, Divider, Icon, Image, Menu, Message, Segment } from '../Base';
import LoadingWithMessage from '../LoadingWithMessage';
import { isMobile, maxLength, sleep } from './helpers';
import './EditCampaignForm.css';

const StyledHeader = styled(Header)`
  min-width: 18em;
  display: inline-block;
`;

export const colors = ['#b40101', '#f2714d', '#f4b450', '#79c34d', '#2d9a2c', '#59c4c4', '#009ee7', '#0e2b5b', '#ee83ee', '#8b288f', '#808080', '#000000'];

const EditCampaignForm = ({ data, handleBackClick }) => {
  const dispatch = useDispatch();
  const bookmarkTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.bookmark);
  const ribbonTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.ribbon);
  const stackTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.stack);

  const modifyPending = useSelector(store => store.mailout.modifyPending);
  const modifyError = useSelector(store => store.mailout.modifyError);

  const teammates = useSelector(store => store.team.profiles);

  const currentListingStatus = data.listingStatus;
  const currentMailoutDisplayAgentUserID = data.mailoutDisplayAgent.userId;
  const currentTemplateTheme = data.templateTheme;
  const currentMailoutDisplayAgent = data.mailoutDisplayAgent;
  const currentMergeVariables = data.mergeVariables;
  const currentBrandColor = currentMergeVariables[0];

  const blacklistNames = ['brandColor', 'frontImgUrl', 'agentPicture', 'brokerageLogo', 'teamLogo'];
  const convertedMergeVariables = Object.assign({}, ...currentMergeVariables.map(object => ({ [object.name]: object.value })));

  const [templateTheme, setTemplateTheme] = useState(currentTemplateTheme);
  const [selectedBrandColor, setSelectedBrandColor] = useState(currentBrandColor.value);
  const [mailoutDisplayAgent, setMailoutDisplayAgent] = useState(currentMailoutDisplayAgent);
  const [formValues, setFormValues] = useState(convertedMergeVariables);

  const handleEditSubmitClick = async () => {
    const newMergeVariables = [];
    newMergeVariables.push({ name: 'brandColor', value: selectedBrandColor.hex || selectedBrandColor });

    Object.keys(formValues)
      .filter(key => key !== 'brandColor')
      .forEach(key => newMergeVariables.push({ name: key, value: formValues[key] }));

    const newData = Object.assign(
      {},
      { templateTheme },
      { mergeVariables: currentMergeVariables },
      { mergeVariables: newMergeVariables },
      { mailoutDisplayAgent }
    );

    dispatch(modifyMailoutPending(newData));
    await sleep(500);
    handleBackClick();
  };

  const profiles = [];

  if (teammates.length > 0) {
    teammates.map((profile, index) => {
      const setupComplete = profile.doc.setupComplete;
      const currentUser = profile.userId === currentMailoutDisplayAgentUserID;
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

  const renderTemplatePicture = templateName => {
    const resolveSource = type => {
      const types = {
        ribbon: require('../../assets/ribbon-preview.png'),
        bookmark: require('../../assets/bookmark-preview.png'),
        stack: require('../../assets/stack-preview.png'),
        undefined: null,
      };
      return type ? types[type] : types['undefined'];
    };

    return (
      <div style={{ margin: '1em' }}>
        <input
          type="radio"
          checked={templateTheme === templateName}
          value={templateName}
          onChange={(e, { value }) => setTemplateTheme(value)}
          style={{ visibility: 'hidden', display: 'none' }}
        />
        <div
          style={
            templateTheme === templateName
              ? { border: '2px solid teal', margin: 0, padding: '0.5em', borderRadius: '5px' }
              : { border: '1px solid lightgray', margin: 0, padding: '0.5em', borderRadius: '5px' }
          }
        >
          <img onClick={e => setTemplateTheme(templateName)} src={resolveSource(templateName)} alt={templateName} />
        </div>
      </div>
    );
  };

  const handleAgentChange = (e, input) => {
    const selectedAgent = input.options.filter(o => o.value === input.value)[0];
    const { first, last, value } = selectedAgent;

    setMailoutDisplayAgent({ userId: value, first, last });
  };

  const handleInputChange = (value, name) => {
    const newValues = Object.assign({}, formValues, { [name]: value });
    setFormValues(newValues);
  };

  const renderThemeSpecificData = () => {
    switch (templateTheme) {
      case 'ribbon':
        const ribbonFields = ribbonTemplate[currentListingStatus].fields
          .filter(field => !blacklistNames.includes(field.name))
          .map((field, index) => {
            const fieldName = startCase(field.name);
            const error = maxLength(field.max)(formValues[field.name]);

            return (
              <Form.Field key={index}>
                <Form.Input
                  fluid
                  error={error && { content: error }}
                  label={fieldName}
                  placeholder={field.default}
                  type={field.type}
                  onChange={(e, input) => handleInputChange(input.value, field.name)}
                  defaultValue={formValues[field.name]}
                />
              </Form.Field>
            );
          });

        return (
          <Form color="green">
            <Segment basic padded className={isMobile() ? null : 'secondary-grid-container'}>
              {ribbonFields}
            </Segment>
          </Form>
        );

      case 'bookmark':
        const bookmarkFields = bookmarkTemplate[currentListingStatus].fields
          .filter(field => !blacklistNames.includes(field.name))
          .map((field, index) => {
            const fieldName = startCase(field.name);
            const error = maxLength(field.max)(formValues[field.name]);

            return (
              <Form.Field key={index}>
                <Form.Input
                  fluid
                  error={error && { content: error }}
                  label={fieldName}
                  placeholder={field.default}
                  type={field.type}
                  onChange={(e, input) => handleInputChange(input.value, field.name)}
                  defaultValue={formValues[field.name]}
                />
              </Form.Field>
            );
          });

        return (
          <Form color="green">
            <Segment basic padded className={isMobile() ? null : 'secondary-grid-container'}>
              {bookmarkFields}
            </Segment>
          </Form>
        );

      case 'stack':
        const stackFields = stackTemplate[currentListingStatus].fields
          .filter(field => !blacklistNames.includes(field.name))
          .map((field, index) => {
            const fieldName = startCase(field.name);
            const error = maxLength(field.max)(formValues[field.name]);

            return (
              <Form.Field key={index}>
                <Form.Input
                  fluid
                  error={error && { content: error }}
                  label={fieldName}
                  placeholder={field.default}
                  type={field.type}
                  onChange={(e, input) => handleInputChange(input.value, field.name)}
                  defaultValue={formValues[field.name]}
                />
              </Form.Field>
            );
          });

        return (
          <Form color="green">
            <Segment basic padded className={isMobile() ? null : 'secondary-grid-container'}>
              {stackFields}
            </Segment>
          </Form>
        );

      default:
        return <span> Nothing here </span>;
    }
  };

  return (
    <Fragment>
      <Segment>
        <Menu borderless fluid secondary>
          <Menu.Item>
            <Header as="h3">Edit Campaign Details</Header>
          </Menu.Item>
          <Menu.Menu position="right">
            <span>
              <Button type="submit" onClick={handleEditSubmitClick} color="teal" loading={modifyPending} disabled={modifyPending}>
                Save
              </Button>
              <Button basic color="teal" onClick={() => handleBackClick()} loading={modifyPending} disabled={modifyPending}>
                Back
              </Button>
            </span>
          </Menu.Menu>
        </Menu>

        <Divider style={{ margin: '1em -1em' }} />

        {modifyPending && <LoadingWithMessage message="Saving campaign..." />}

        {modifyError && (
          <Message negative>
            <Message.Header>We're sorry, something went wrong.</Message.Header>
            <p>{modifyError}</p>
          </Message>
        )}

        <Segment basic padded className={isMobile() ? null : 'primary-grid-container'}>
          <div>
            <Header as="h4">Template Theme</Header>
            {renderTemplatePicture('bookmark')}
          </div>

          <div>
            <p>&nbsp;</p>
            {renderTemplatePicture('ribbon')}
          </div>

          <div>
            <p>&nbsp;</p>
            {renderTemplatePicture('stack')}
          </div>

          <div>
            <Header as="h4">Brand Color</Header>
            <BlockPicker triangle="hide" width="200px" color={selectedBrandColor} colors={colors} onChangeComplete={setSelectedBrandColor} />
          </div>

          <div>
            <Header as="h4">Choose Agent</Header>
            <Dropdown placeholder="Select Friend" fluid selection options={profiles} value={currentMailoutDisplayAgentUserID} onChange={handleAgentChange} />
          </div>

          <div>
            <p>&nbsp;</p>
            <Header as="h2" style={{ margin: 'auto' }}>
              Enter {templateTheme} details
            </Header>
          </div>
        </Segment>

        {renderThemeSpecificData()}
      </Segment>
    </Fragment>
  );
};

export default EditCampaignForm;
