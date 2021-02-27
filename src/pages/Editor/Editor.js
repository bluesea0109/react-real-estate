import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getMailoutPending } from '../../store/modules/mailout/actions';

export default function Editor() {
  const dispatch = useDispatch();
  const mailoutId = useParams().mailoutId;
  const mailoutDetails = useSelector(store => store.mailout?.details);

  useEffect(() => {
    dispatch(getMailoutPending(mailoutId));
  }, [dispatch, mailoutId]);

  return (
    <div>
      <h1> Live Editor Page</h1>
      <p>{mailoutDetails?._id}</p>
    </div>
  );
}
