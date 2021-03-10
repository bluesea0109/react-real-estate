import React from 'react';
import styled from 'styled-components';
import { Step } from 'semantic-ui-react';
import { ReactComponent as Icon1 } from '../../assets/1-icon.svg';
import { ReactComponent as Icon2 } from '../../assets/2-icon.svg';
import { ReactComponent as Icon3 } from '../../assets/3-icon.svg';
import { ReactComponent as Icon4 } from '../../assets/4-icon.svg';
import { Icon } from '../Base';
import * as brandColors from '../utils/brandColors';

const sidebarTextStyle = {
  fontSize: '16px',
  width: '100%',
  marginLeft: '16px',
  marginTop: '-3px',
};

const StepLayout = styled(Step)`
  &&&&&& {
    display: inline-grid;
    height: 56px;
    padding: 0px;
    border-bottom: 1px solid #eaedf0;
    svg {
      margin-left: 8px;
    }
    & .title {
      font-weight: 400;
      font-family: 'Open Sans', sans-serif;
      color: rgba(0, 0, 0, 0.6);
    }
    &.active {
      border-radius: 0px;
      color: ${brandColors.primary};
      border-left: 5px solid ${brandColors.primary};
      border-bottom: 1px solid #eaedf0;
      font-weight: 600;
      background-color: ${brandColors.primaryLight};
      svg {
        margin-left: 3px;
      }
      #step1Path,
      #step2Path,
      #step3Path,
      #step4Path {
        fill: ${brandColors.primary};
      }
      .title {
        font-weight: 600;
        color: ${brandColors.primary};
      }
    }

    @media (min-width: 10px) {
      padding-right: 0;
      padding-left: 10px;

      grid-template-rows: 1fr;
      grid-template-columns: 30px 1fr;
      justify-items: left;
    }
  }
`;

const StepsLayout = styled(Step.Group)`
  display: grid !important;
  grid-template-columns: 1fr;
  width: 240px;
`;

export const OnboardStepsAdmin = ({
  completedCustomization,
  completedInviteTeammates,
  completedProfile,
  completedTeamCustomization,
  isMobile,
  onCustomization,
  onInviteTeammates,
  onProfile,
  onTeamCustomization,
}) => (
  <StepsLayout vertical={!isMobile}>
    <StepLayout active={onProfile} completed={completedProfile}>
      <Icon1 />
      <Step.Content>
        <Step.Title style={sidebarTextStyle}>Profile</Step.Title>
      </Step.Content>
    </StepLayout>

    <StepLayout active={onTeamCustomization} completed={completedTeamCustomization}>
      <Icon2 />
      <Step.Content>
        <Step.Title style={sidebarTextStyle}>Customize Team</Step.Title>
      </Step.Content>
    </StepLayout>

    <StepLayout active={onCustomization} completed={completedCustomization}>
      <Icon3 />
      <Step.Content>
        <Step.Title style={sidebarTextStyle}>Customize</Step.Title>
      </Step.Content>
    </StepLayout>

    <StepLayout active={onInviteTeammates} completed={completedInviteTeammates}>
      <Icon4 />
      <Step.Content>
        <Step.Title style={sidebarTextStyle}>Invite Teammates</Step.Title>
      </Step.Content>
    </StepLayout>
  </StepsLayout>
);

export const OnboardSteps = ({
  completedCustomization,
  completedProfile,
  isMobile,
  onCustomizationSingleUser,
  onProfileSingleUser,
}) => (
  <StepsLayout vertical={!isMobile}>
    <StepLayout active={onProfileSingleUser} completed={completedProfile}>
      <Icon name="user" />
      {isMobile ? null : (
        <Step.Content>
          <Step.Title style={sidebarTextStyle}>Profile</Step.Title>
        </Step.Content>
      )}
    </StepLayout>

    <StepLayout active={onCustomizationSingleUser} completed={completedCustomization}>
      <Icon name="paint brush" />
      {isMobile ? null : (
        <Step.Content>
          <Step.Title style={sidebarTextStyle}>Customize</Step.Title>
        </Step.Content>
      )}
    </StepLayout>
  </StepsLayout>
);
