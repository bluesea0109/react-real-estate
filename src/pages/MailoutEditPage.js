import React, { Fragment, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useLastLocation } from 'react-router-last-location';

import { getMailoutPending } from '../store/modules/mailout/actions';
import EditCampaignForm from '../components/Forms/EditCampaignForm';
import { Message } from '../components/Base';
import Loading from '../components/Loading';

const MailoutDetailsPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { mailoutId } = useParams();
  const lastLocation = useLastLocation();

  const isLoading = useSelector(store => store.mailout.pending);
  const details = useSelector(store => store.mailout.details);
  const error = useSelector(store => store.mailout.error && store.mailout.error.message);

  useEffect(() => {
    if (!details) dispatch(getMailoutPending(mailoutId));
  }, [details, dispatch, mailoutId, history, lastLocation]);

  const handleBackClick = () => {
    if (lastLocation.pathname === `/dashboard/edit/${mailoutId}`) {
      history.push(`/dashboard/${details._id}`);
    }
    if (lastLocation.pathname === `/dashboard/${mailoutId}`) {
      history.goBack();
    }
  };

  return (
    <Fragment>
      {details && <EditCampaignForm data={details} handleBackClick={handleBackClick} />}
      {isLoading && !error && <Loading />}
      {error && <Message error>Oh snap! {error}.</Message>}
    </Fragment>
  );
};

export default MailoutDetailsPage;
