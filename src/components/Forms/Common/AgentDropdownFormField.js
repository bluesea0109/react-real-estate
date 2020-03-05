import React, { createRef } from 'react';
import { useSelector } from 'react-redux';
import { Popup } from 'semantic-ui-react';

import { StyledHeader } from '../../helpers';
import { Icon, Image } from '../../Base';
import { Dropdown } from '../Base';

const NEW_LISTING = 'listed';

const AgentDropdownFormField = ({ listingType, initialValues, formValues, setFormValues }) => {
  const currentValue = (formValues && formValues[listingType]?.defaultDisplayAgent?.userId) || initialValues[listingType]?.defaultDisplayAgent?.userId;
  const editable = listingType === NEW_LISTING ? !!formValues?.listed : !!formValues?.sold;

  const onLoginUserId = useSelector(store => store.onLogin.user._id);
  const teammates = useSelector(store => store.team.profiles);

  const profiles = [];

  const handleAgentChange = (e, input) => {
    const selectedAgent = input.options.filter(o => o.value === input.value)[0];
    const { first, last, value } = selectedAgent;
    const newValue = Object.assign({}, formValues);
    newValue[listingType].defaultDisplayAgent = { userId: value, first, last };
    setFormValues(newValue);
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

  if (!editable) {
    return (
      <Dropdown
        label="Choose Default Agent"
        name={listingType + '_defaultDisplayAgent'}
        placeholder="Select Default Displayed Agent"
        fluid
        selection
        options={profiles}
        defaultValue={currentValue}
        disabled={true}
      />
    );
  } else {
    return (
      <Dropdown
        label="Choose Default Agent"
        name={listingType + '_defaultDisplayAgent'}
        placeholder="Select Default Displayed Agent"
        fluid
        selection
        options={profiles}
        onChange={handleAgentChange}
      />
    );
  }
};

export default AgentDropdownFormField;
