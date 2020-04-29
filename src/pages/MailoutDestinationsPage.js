import React, { Fragment, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useLastLocation } from 'react-router-last-location';
import { getMailoutPending, getMailoutEditPending } from '../store/modules/mailout/actions';

import { Message } from '../components/Base';
import Loading from '../components/Loading';

const MailoutDestinationsPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { mailoutId } = useParams();
  const lastLocation = useLastLocation();

  const mailoutDetailsPending = useSelector(store => store.mailout.pending);
  const mailoutDetails = useSelector(store => store.mailout.details);
  const mailoutDetailsError = useSelector(store => store.mailout.error?.message);

  const mailoutEditPending = useSelector(store => store.mailout.getMailoutEditPending);
  const mailoutEdit = useSelector(store => store.mailout.mailoutEdit);
  const mailoutEditError = useSelector(store => store.mailout.getMailoutEditError?.message);

  useEffect(() => {
    if (!mailoutDetails) dispatch(getMailoutPending(mailoutId));
    if (!mailoutEdit) dispatch(getMailoutEditPending(mailoutId));
  }, [mailoutDetails, mailoutEdit, dispatch, mailoutId]);

  const handleBackClick = () => {
    if (lastLocation.pathname === `/dashboard/edit/${mailoutId}`) {
      history.push(`/dashboard/${mailoutId}`);
    }
    if (lastLocation.pathname === `/dashboard/${mailoutId}`) {
      history.goBack();
    }
  };

  return (
    <Fragment>
      {mailoutDetails && mailoutEdit && (
        <div>Hi {mailoutDetails._id}</div>
      )}
      {((mailoutDetailsPending && !mailoutDetailsError) || (mailoutEditPending && !mailoutEditError)) && <Loading />}
      {(mailoutDetailsError || mailoutEditError) && <Message error>Oh snap! {mailoutDetailsError || mailoutEditError}.</Message>}

    </Fragment>
  );
};

export default MailoutDestinationsPage;
