import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MobileDisabledLayout, MobileEnabledLayout, ItemHeaderLayout, ItemHeaderMenuLayout } from '../../layouts';
import { canSend, canPickDestinations, resolveLabelStatus, resolveMailoutStatus } from './helpers';
import { Button, Header } from '../Base';
import { Label, Icon, Dropdown } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { archiveMailoutPending, undoArchiveMailoutPending } from '../../store/modules/mailout/actions';

const ApproveAndSendButton = ({ data, mailoutDetailPage, onClickApproveAndSend, lockControls = false }) => {
  if (!data) return;

  if (!mailoutDetailPage) {
    return (
      <Fragment>
        {canSend(data.mailoutStatus) && (
          <Link to={`dashboard/${data._id}`}>
            <Button primary>
              <MobileDisabledLayout>
                <Fragment>Review & Send</Fragment>
              </MobileDisabledLayout>
              <MobileEnabledLayout>
                <FontAwesomeIcon icon="thumbs-up" />
              </MobileEnabledLayout>
            </Button>
          </Link>
        )}
        {canPickDestinations(data.mailoutStatus) && (
          <Link to={`dashboard/edit/${data._id}/destinations`}>
            <Button primary>
              <MobileDisabledLayout>
                <Fragment>Choose Destinations</Fragment>
              </MobileDisabledLayout>
              <MobileEnabledLayout>
                <FontAwesomeIcon icon="thumbs-up" />
              </MobileEnabledLayout>
            </Button>
          </Link>
        )}
      </Fragment>
    );
  }

  return (
    <Fragment>
      {canSend(data.mailoutStatus) && (
        <Button primary onClick={onClickApproveAndSend} disabled={lockControls} loading={lockControls}>
          <MobileDisabledLayout>
            <Fragment>Approve & Send</Fragment>
          </MobileDisabledLayout>
          <MobileEnabledLayout>
            <FontAwesomeIcon icon="thumbs-up" />
          </MobileEnabledLayout>
        </Button>
      )}
    </Fragment>
  );
};

const ListHeader = ({ data, mailoutDetailPage = false, onClickEdit, onClickApproveAndSend, onClickDelete, lockControls = false, onClickRevertEdit }) => {
  let dispatch = useDispatch();
  let archivePending = useSelector(state => state.mailout.archivePending);
  let archiveId = useSelector(state => state.mailout.archiveId);

  const runArchive = () => {
    if (data.mailoutStatus === 'archived') {
      dispatch(undoArchiveMailoutPending(data._id));
    } else {
      dispatch(archiveMailoutPending(data._id));
    }
  };

  if (!data) return;
  const enableEdit = resolveMailoutStatus(data.mailoutStatus) !== 'Sent' && resolveMailoutStatus(data.mailoutStatus) !== 'Processing';
  const enableDelete = resolveMailoutStatus(data.mailoutStatus) === 'Sent';
  const activeWhen = new Date(Date.now()).toISOString().split('T')[0] < data.send_date;
  const enableRevertEdit = data.edited;
  const isArchived = data.mailoutStatus === 'hide' || data.mailoutStatus === 'archived';

  return (
    <ItemHeaderLayout attached="top" block>
      <span style={{ gridArea: 'label' }}>
        <Label
          size="large"
          color={resolveLabelStatus(data.listingStatus, data.mailoutStatus)}
          ribbon
          style={{ textTransform: 'capitalize', top: '-0.9em', left: '-2.7em' }}
        >
          {data.listingStatus}
        </Label>
      </span>
      <span style={{ gridArea: 'address', alignSelf: 'center' }}>
        {!mailoutDetailPage && !isArchived && (
          <Link to={`/dashboard/${data._id}`} className="ui header">
            <Header as="h3" className="bm-color-effect">
              {data.name || data.details?.displayAddress}
            </Header>
          </Link>
        )}
        {!mailoutDetailPage && isArchived && <Header as="h3">{data.name || data.details?.displayAddress}</Header>}
        {mailoutDetailPage && <Header as="h3">{data.name || data.details?.displayAddress}</Header>}
      </span>
      <ItemHeaderMenuLayout>
        {canSend(data.mailoutStatus) && mailoutDetailPage && enableRevertEdit && (
          <span>
            <Button secondary inverted onClick={onClickRevertEdit} disabled={lockControls} loading={lockControls}>
              Revert & Unlock
            </Button>
          </span>
        )}
        {mailoutDetailPage && enableEdit && (
          <span>
            <Button primary inverted onClick={onClickEdit} disabled={lockControls} loading={lockControls}>
              Edit
            </Button>
          </span>
        )}
        {data.mailoutStatus === 'archived' && (
          <Button onClick={runArchive} icon loading={data._id === archiveId && archivePending} disabled={data._id === archiveId && archivePending}>
            <Icon name="archive" /> Unarchive
          </Button>
        )}
        {!isArchived && !mailoutDetailPage && canSend(data.mailoutStatus) && (
          <Dropdown
            loading={data._id === archiveId && archivePending}
            disabled={data._id === archiveId && archivePending}
            icon="ellipsis horizontal"
            direction="left"
            button
            className="icon"
          >
            <Dropdown.Menu>
              <Dropdown.Item onClick={runArchive}>
                <Icon name="archive" /> Archive
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
        <span>
          <ApproveAndSendButton data={data} mailoutDetailPage={mailoutDetailPage} onClickApproveAndSend={onClickApproveAndSend} lockControls={lockControls} />
        </span>
        <span>
          {mailoutDetailPage && enableDelete && activeWhen && (
            <Button primary inverted onClick={onClickDelete} disabled={lockControls} loading={lockControls}>
              Stop Sending
            </Button>
          )}
        </span>
      </ItemHeaderMenuLayout>
    </ItemHeaderLayout>
  );
};

ListHeader.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ListHeader;
