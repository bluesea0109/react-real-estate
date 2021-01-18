import React, { Fragment, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import { getMailoutPending, getMailoutEditPending } from '../store/modules/mailout/actions';
import EditCampaignForm from '../components/Forms/EditCampaignForm';
import { Message } from '../components/Base';
import Loading from '../components/Loading';

const MailoutDetailsPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { mailoutId } = useParams();

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
    history.push(`/dashboard/${mailoutId}`);
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
