import React, { Fragment, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useLastLocation } from 'react-router-last-location';

import {
  getMailoutPending,
  getMailoutEditPending,
  resetMailout,
} from '../store/modules/mailout/actions';
import EditCampaignForm from '../components/Forms/EditCampaignForm';
import { Message } from '../components/Base';
import Loading from '../components/Loading';

const MailoutDetailsPage = () => {
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
    // eslint-disable-next-line
  }, []);

  const handleBackClick = () => {
    const editMailoutPath = `/dashboard/edit/${mailoutId}`;
    const mailOutPath = `/dashboard/${mailoutId}`;
    const lastPathName = lastLocation.pathname;
    if (lastPathName === editMailoutPath) {
      history.push(mailOutPath);
    }

    if (lastPathName === mailOutPath) {
      history.goBack();
    }

    if (
      lastPathName !== editMailoutPath &&
      lastPathName !== mailOutPath &&
      lastPathName === '/dashboard'
    ) {
      history.goBack();
    }
  };

  return (
    <Fragment>
      {mailoutDetails && mailoutEdit && (
        <EditCampaignForm
          mailoutDetails={mailoutDetails}
          mailoutEdit={mailoutEdit}
          handleBackClick={handleBackClick}
        />
      )}
      {((mailoutDetailsPending && !mailoutDetailsError) ||
        (mailoutEditPending && !mailoutEditError)) && <Loading />}
      {(mailoutDetailsError || mailoutEditError) && (
        <Message error>Oh snap! {mailoutDetailsError || mailoutEditError}.</Message>
      )}
    </Fragment>
  );
};

export default MailoutDetailsPage;
