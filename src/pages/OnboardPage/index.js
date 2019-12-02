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
  const step = useSelector(store => store.onboarded.step);

  const onBoardProfilePath = '/onboard/profile';
  const onBoardCustomizationTeamPath = '/onboard/customization/team';
  const onBoardCustomizationPath = '/onboard/customization';
  const onBoardInvitePath = '/onboard/invite';

  useEffect(() => {
    if (!isMultimode) {
      if (step === 0 && pathname !== onBoardProfilePath) {
        history.push(onBoardProfilePath);
      }
      if (step === 1 && pathname !== onBoardCustomizationPath) {
        history.push(onBoardCustomizationPath);
      }
      if (step === 2) {
        dispatch(setOnboardedStatus(true));
        history.push('/dashboard');
      }
    }

    if (isMultimode) {
      if (step === 0 && pathname !== onBoardProfilePath) {
        history.push(onBoardProfilePath);
      }
      if (step === 1 && pathname !== onBoardCustomizationTeamPath) {
        history.push(onBoardCustomizationTeamPath);
      }
      if (step === 2 && pathname !== onBoardCustomizationPath) {
        history.push(onBoardCustomizationPath);
      }
      if (step === 3 && pathname !== onBoardInvitePath) {
        history.push(onBoardInvitePath);
      }
      if (step === 4) {
        dispatch(setOnboardedStatus(true));
        history.push('/dashboard');
      }
    }
  }, [step, pathname, isMultimode, dispatch, history]);

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
