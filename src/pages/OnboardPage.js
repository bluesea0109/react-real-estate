import { Redirect } from 'react-router';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { setOnboardedStatus } from '../store/modules/onboarded/actions';
import Loading from '../components/Loading';

const OnboardPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const isMultimode = useSelector(store => store.onLogin.mode === 'multiuser');
  const step = useSelector(store => store.onboarded.step);

  useEffect(() => {
    if (step === 2 && !isMultimode) {
      dispatch(setOnboardedStatus(true));
      history.push('/dashboard');
    }

    if (step === 4 && isMultimode) {
      dispatch(setOnboardedStatus(true));
      history.push('/dashboard');
    }
  }, [step, isMultimode, dispatch, history]);

  if (step === 0) return <Redirect to="/onboard/profile" />;
  if (step === 1) return <Redirect to="/onboard/customization/team" />;
  if (step === 2) return <Redirect to="/onboard/customization" />;
  if (step === 3) return <Redirect to="/onboard/invite" />;

  return <Loading />;
};

export default OnboardPage;
