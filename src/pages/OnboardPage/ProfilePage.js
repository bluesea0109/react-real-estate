import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ProfileForm from '../../components/Forms/ProfileForm';
import { getProfilePending } from '../../store/modules/profile/actions';
import { getTeamProfilePending } from '../../store/modules/teamProfile/actions';

const OnboardPage = () => {
  const dispatch = useDispatch();

  const isAdmin = useSelector(store => store.onLogin.permissions && store.onLogin.permissions.teamAdmin);
  const onLoginProfileAvailable = useSelector(store => store.onLogin.userProfile);
  const onLoginTeamProfileAvailable = useSelector(store => store.onLogin.teamProfile);

  const profileAvailable = useSelector(store => store.profile.available);
  const teamProfileAvailable = useSelector(store => store.teamProfile.available);

  useEffect(() => {
    dispatch(getProfilePending());
    if (isAdmin) dispatch(getTeamProfilePending());
  }, [isAdmin, dispatch]);

  return (
    <ProfileForm profileAvailable={profileAvailable || onLoginProfileAvailable} teamProfileAvailable={teamProfileAvailable || onLoginTeamProfileAvailable} />
  );
};

export default OnboardPage;
