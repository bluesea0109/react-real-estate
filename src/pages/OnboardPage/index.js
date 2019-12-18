import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useLocation } from 'react-router';

import { setOnboardedStatus } from '../../store/modules/onboarded/actions';
import OnboardPageProfile from './ProfilePage';
import OnboardPageCustomizeTeam from './CustomizeTeamPage';
import OnboardPageCustomize from './CustomizePage';
import OnboardPageInviteTeammates from './InviteTeammatesPage';

const OnboardPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const location = useLocation();
  const pathname = location.pathname;

  const isMultimode = useSelector(store => store.onLogin.mode === 'multiuser');
  const completedProfile = useSelector(store => store.onboarded.completedProfile);
  const completedTeamCustomization = useSelector(store => store.onboarded.completedTeamCustomization);
  const completedCustomization = useSelector(store => store.onboarded.completedCustomization);
  const completedInviteTeammates = useSelector(store => store.onboarded.completedInviteTeammates);

  const reviewTeamCustomizationCompleted = useSelector(store => store.teamCustomization.reviewed);
  const reviewCustomizationCompleted = useSelector(store => store.customization.reviewed);

  const onBoardProfilePath = '/onboard/profile';
  const onBoardCustomizationTeamPath = '/onboard/customization/team';
  const onBoardCustomizationPath = '/onboard/customization';
  const onBoardInvitePath = '/onboard/invite';

  const onProfile = !completedProfile;
  const onTeamCustomization = !reviewTeamCustomizationCompleted && !completedTeamCustomization && completedProfile;
  const onCustomization = !reviewCustomizationCompleted && !completedCustomization && completedTeamCustomization && completedProfile;
  const onInviteTeammates = !completedInviteTeammates && completedCustomization && completedTeamCustomization && completedProfile;
  const onboardingCompleted = completedInviteTeammates && completedCustomization && completedTeamCustomization && completedProfile;

  const onProfileSingleUser = !completedProfile;
  const onCustomizationSingleUser = !completedCustomization && completedProfile;
  const onboardingCompletedSingleUser = completedCustomization && completedProfile;

  useEffect(() => {
    if (!isMultimode) {
      if (onProfileSingleUser && pathname !== onBoardProfilePath) {
        history.push(onBoardProfilePath);
      }
      if (onCustomizationSingleUser && pathname !== onBoardCustomizationPath) {
        history.push(onBoardCustomizationPath);
      }
      if (onboardingCompletedSingleUser) {
        dispatch(setOnboardedStatus(true));
        history.push('/dashboard');
      }
    }

    if (isMultimode) {
      if (onProfile && pathname !== onBoardProfilePath) {
        history.push(onBoardProfilePath);
      }
      if (onTeamCustomization && pathname !== onBoardCustomizationTeamPath) {
        history.push(onBoardCustomizationTeamPath);
      }
      if (onCustomization && pathname !== onBoardCustomizationPath) {
        history.push(onBoardCustomizationPath);
      }
      if (onInviteTeammates && pathname !== onBoardInvitePath) {
        history.push(onBoardInvitePath);
      }
      if (onboardingCompleted) {
        dispatch(setOnboardedStatus(true));
        history.push('/dashboard');
      }
    }
  }, [
    onProfile,
    onTeamCustomization,
    onCustomization,
    onInviteTeammates,
    onboardingCompleted,
    onProfileSingleUser,
    onCustomizationSingleUser,
    onboardingCompletedSingleUser,
    pathname,
    isMultimode,
    dispatch,
    history,
  ]);

  return (
    <Switch>
      <Route path="/onboard/profile" component={OnboardPageProfile} />
      <Route path="/onboard/customization/team" component={OnboardPageCustomizeTeam} />
      <Route path="/onboard/customization" component={OnboardPageCustomize} />
      <Route path="/onboard/invite" component={OnboardPageInviteTeammates} />
    </Switch>
  );
};

export default OnboardPage;
