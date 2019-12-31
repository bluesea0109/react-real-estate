import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { BlockPicker } from 'react-color';
import { Dropdown, Header, Popup } from 'semantic-ui-react';
import React, { Fragment, createRef, useState } from 'react';

import { Icon, Image, Segment } from '../Base';
import { isMobile } from './helpers';
import './EditCampaignForm.css';

const StyledHeader = styled(Header)`
  min-width: 18em;
  display: inline-block;
`;

export const colors = ['#b40101', '#f2714d', '#f4b450', '#79c34d', '#2d9a2c', '#59c4c4', '#009ee7', '#0e2b5b', '#ee83ee', '#8b288f', '#808080', '#000000'];

// function useInput({ type, initalState }) {
//   const [value, setValue] = useState(initalState);
//   const input = <input value={value} onChange={e => setValue(e.target.value)} type={type} />;
//   return [value, input];
// }
//
// const [recipientsNumber, userRecipientsNumber] = useInput({ type: "text", initalState: 0 });

const EditCampaignForm = ({ data }) => {
  // const bookmarkTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.bookmark);
  // const ribbonTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.ribbon);
  // const stackTemplate = useSelector(store => store.templates && store.templates.available && store.templates.available.stack);

  const teammates = useSelector(store => store.team.profiles);

  const currentMailoutDisplayAgentUserID = data.mailoutDisplayAgent.userId;
  const currentTemplateTheme = data.templateTheme;
  const currentMergeVariables = data.mergeVariables;
  const currentBrandColor = currentMergeVariables[0];

  const [selectedTemplateTheme, setSelectedTemplateTheme] = useState(currentTemplateTheme);
  const [selectedBrandColor, setSelectedBrandColor] = useState(currentBrandColor.value);

  // const renderFields = currentMergeVariables.map((field) => {
  //   console.log('field', field);
  // });

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
          checked={selectedTemplateTheme === templateName}
          value={templateName}
          onChange={(e, { value }) => setSelectedTemplateTheme(value)}
          style={{ visibility: 'hidden', display: 'none' }}
        />
        <div
          style={
            selectedTemplateTheme === templateName
              ? { border: '2px solid teal', margin: 0, padding: '0.5em', borderRadius: '5px' }
              : { border: '1px solid lightgray', margin: 0, padding: '0.5em', borderRadius: '5px' }
          }
        >
          <img onClick={e => setSelectedTemplateTheme(templateName)} src={resolveSource(templateName)} alt={templateName} />
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <Segment basic padded className={isMobile() ? null : 'grid-container'}>
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
          <Dropdown placeholder="Select Friend" fluid selection options={profiles} value={currentMailoutDisplayAgentUserID} />
        </div>
      </Segment>
    </Fragment>
  );
};

export default EditCampaignForm;
