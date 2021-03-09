import React, { createRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Dropdown, Icon, Popup } from '../../components/Base';
import * as brandColors from '../../components/utils/brandColors';

const DisplayAgentContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  color: ${brandColors.grey03};
  & > p {
    font-size: 14px;
  }
`;

const StyledDropdown = styled(Dropdown)`
  &&& {
    border: none;
    border-radius: 2px;
    background-color: ${brandColors.grey09};
    & input {
      height: 30px;
    }
    & .default.text {
      color: ${brandColors.grey03};
    }
    & > .search.icon {
      top: 1em;
      padding: 8px;
    }
    & > .visible.menu {
      min-width: 200px !important;
      border: none;
      max-height: 20rem;
      ::-webkit-scrollbar {
        width: 0;
      }
    }
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  & > img {
    height: 30px;
    width: 30px;
    border-radius: 30px;
    object-fit: cover;
    margin-right: 1rem;
  }
`;

const AgentCard = styled.div`
  display: flex;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px 0 rgba(213, 213, 213, 0.5);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  & > img {
    height: 50px;
    width: 50px;
    border-radius: 50px;
    object-fit: cover;
    margin-right: 1.5rem;
  }
  & .agent-details {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    & > .name {
      font-weight: bold;
    }
    & > .details {
      font-size: 0.9rem;
    }
  }
`;

export default function DisplayAgent({ handleSave }) {
  const mailoutEdit = useSelector(state => state.mailout?.mailoutEdit);
  const profiles = useSelector(state => state.team?.profiles);
  const teamName = useSelector(state => state.teamProfile?.available?.teamName);

  const [selectedDisplayAgent, setSelectedDisplayAgent] = useState(null);

  const currentProfile = profiles.find(
    agent => agent.userId === mailoutEdit.mailoutDisplayAgent?.userId
  );
  const isAdmin = currentProfile?.permissions?.teamAdmin;

  const handleAgentChange = (e, input) => {
    const selectedAgent = input.options.filter(o => o.value === input.value)[0];
    const { first, last, value: userId } = selectedAgent;
    setSelectedDisplayAgent({ userId, first, last });
    handleSave({ mailoutDisplayAgent: { userId, first, last } });
  };

  const dropdownItems = [];
  if (profiles?.length > 0) {
    profiles.map((profile, ind) => {
      const setupComplete = profile.doc?.setupComplete;
      const currentUser = profile.userId === selectedDisplayAgent?.userId;
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

      return dropdownItems.push({
        key: ind,
        first: profile.first,
        last: profile.last,
        text: fullName,
        value: profile.userId,
        content: (
          <DropdownItem ref={contextRef}>
            <img
              alt="profile"
              src={`${
                profile.realtorPhoto
                  ? profile.realtorPhoto
                  : 'https://react.semantic-ui.com/images/avatar/large/patrick.png'
              }`}
            />
            &nbsp;
            {profile.first}&nbsp;
            {profile.last}&nbsp;
            {currentUser ? currentUserIconWithPopup : null}
            {setupComplete ? setupCompletedIconWithPopup : null}
          </DropdownItem>
        ),
      });
    });
  }
  return (
    <DisplayAgentContent>
      <p>Select an agent to display on the back of your postcard.</p>
      <StyledDropdown
        placeholder="Search for an agent"
        fluid
        search
        selection
        icon="search"
        options={dropdownItems}
        value={selectedDisplayAgent?.userId}
        onChange={handleAgentChange}
      />
      {mailoutEdit.mailoutDisplayAgent && (
        <AgentCard>
          <img
            src={`${currentProfile?.realtorPhoto ||
              'https://react.semantic-ui.com/images/avatar/large/patrick.png'}`}
            alt="profile"
          />
          <div className="agent-details">
            <div className="name">{`${mailoutEdit.mailoutDisplayAgent.first} ${mailoutEdit.mailoutDisplayAgent.last}`}</div>
            <div className="details">{`${isAdmin ? 'Admin' : 'Realtor'} | ${teamName}`}</div>
          </div>
        </AgentCard>
      )}
    </DisplayAgentContent>
  );
}
