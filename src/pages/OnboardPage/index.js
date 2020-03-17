import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useLocation } from 'react-router';

import { finalizeOnboarding } from '../../store/modules/onboarded/actions';
import ProfilePage from './ProfilePage';
import TeamCustomizationPage from './TeamCustomizationPage';
import CustomizationPage from './CustomizationPage';
import InviteTeammatesPage from './InviteTeammatesPage';

const OnboardPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const location = useLocation();
  const pathname = location.pathname;

  const isOnboarded = useSelector(store => store.onboarded.status);
  const isMultimode = useSelector(store => store.onLogin?.mode === 'multiuser');
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
    if (isOnboarded) {
      history.push('/dashboard');
    }

    if (!isOnboarded && !isMultimode) {
      if (onProfileSingleUser && pathname !== onBoardProfilePath) {
        history.push(onBoardProfilePath);
      }
      if (onCustomizationSingleUser && pathname !== onBoardCustomizationPath) {
        history.push(onBoardCustomizationPath);
      }
      if (onboardingCompletedSingleUser) {
        dispatch(finalizeOnboarding());
        history.push('/dashboard');
      }
    }

    if (!isOnboarded && isMultimode) {
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
        dispatch(finalizeOnboarding());
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
    isOnboarded,
  ]);

  return (
    <Switch>
      <Route path="/onboard/profile" component={ProfilePage} />
      <Route path="/onboard/customization/team" component={TeamCustomizationPage} />
      <Route path="/onboard/customization" component={CustomizationPage} />
      <Route path="/onboard/invite" component={InviteTeammatesPage} />
    </Switch>
  );
};

export default OnboardPage;
