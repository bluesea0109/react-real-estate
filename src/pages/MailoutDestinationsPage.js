import React, { Fragment, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useLastLocation } from 'react-router-last-location';
import { getMailoutPending, getMailoutEditPending } from '../store/modules/mailout/actions';
import EditDestinationsForm from '../components/Forms/EditDestinationsForm';

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
  const mailoutEdit = useSelector(store => store.mailout.mailoutEdit);

  const mailoutEditPending = useSelector(store => store.mailout.getMailoutEditPending);
  const mailoutDestinationsEdit = useSelector(store => store.mailout.mailoutDestinationsEdit);
  const mailoutEditError = useSelector(store => store.mailout.getMailoutEditError?.message);

  useEffect(() => {
    if (!mailoutDetails) dispatch(getMailoutPending(mailoutId));
    if (!mailoutEdit) dispatch(getMailoutEditPending(mailoutId));
  }, [mailoutDetails, mailoutEdit, dispatch, mailoutId]);

  const handleBackClick = () => {
    if (lastLocation.pathname === `/dashboard/edit/${mailoutId}`) {
      return history.push(`/dashboard/${mailoutId}`);
    }
    if (lastLocation.pathname === `/dashboard/${mailoutId}`) {
      return history.goBack();
    }
    return history.push(`/dashboard/${mailoutId}`);
  };

  return (
    <Fragment>
      {mailoutDetails && mailoutEdit && <EditDestinationsForm mailoutDetails={mailoutDetails} mailoutDestinationsEdit={mailoutDestinationsEdit} handleBackClick={handleBackClick} />}
      {((mailoutDetailsPending && !mailoutDetailsError) || (mailoutEditPending && !mailoutEditError)) && <Loading />}
      {(mailoutDetailsError || mailoutEditError) && <Message error>Oh snap! {mailoutDetailsError || mailoutEditError}.</Message>}

    </Fragment>
  );
};

export default MailoutDestinationsPage;
