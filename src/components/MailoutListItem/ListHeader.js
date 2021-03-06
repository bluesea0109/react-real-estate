import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import React, { Fragment, useState } from 'react';

import { ItemHeaderLayout, ItemHeaderMenuLayout } from '../../layouts';
import {
  canSend,
  canPickDestinations,
  resolveLabelStatus,
  resolveMailoutStatus,
} from './utils/helpers';
import { Button, Header, Input } from '../Base';
import { Label, Icon, Dropdown } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  archiveMailoutPending,
  undoArchiveMailoutPending,
  updateMailoutNamePending,
  resetMailout,
  duplicateMailoutPending,
} from '../../store/modules/mailout/actions';
import styled from 'styled-components';
import * as brandColors from '../utils/brandColors';

const StyledDropdown = styled(Dropdown)`
  &.dropdown.icon.button {
    color: rgba(0, 0, 0, 0.6);
    &:hover {
      background-color: #cacbcd;
    }
  }
`;

const SmallButton = styled(Button)`
  &&& {
    min-width: 0px;
  }
`;

const EditButton = styled.span`
  color: ${brandColors.primary};
  font-weight: bold;
  padding-left: 3em;
  cursor: pointer;
`;

const CampaignNameDiv = styled.div`
  display: flex;
  align-items: baseline;
  & .input {
    flex: 1 0 0px;
  }
`;

const ApproveAndSendButton = ({
  data,
  mailoutDetailPage,
  onClickApproveAndSend,
  lockControls = false,
  runArchive,
  archiveId,
  archivePending,
}) => {
  if (!data) return;

  if (!mailoutDetailPage) {
    return (
      <Fragment>
        {canSend(data.mailoutStatus) && (
          <Link to={`dashboard/${data._id}`}>
            <Button primary>
              <span>Review & Send</span>
            </Button>
          </Link>
        )}
        {canPickDestinations(data.mailoutStatus) && (
          <>
            <StyledDropdown
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
            </StyledDropdown>

            <Link to={`postcards/edit/${data._id}/destinations`}>
              <Button primary>
                <span>Choose Destinations</span>
              </Button>
            </Link>
          </>
        )}
      </Fragment>
    );
  }

  return (
    <Fragment>
      {canSend(data.mailoutStatus) && (
        <Button
          primary
          onClick={onClickApproveAndSend}
          disabled={lockControls}
          loading={lockControls}
        >
          <span>Approve & Send</span>
        </Button>
      )}
    </Fragment>
  );
};

const ListHeader = ({
  data,
  mailoutDetailPage = false,
  onClickEdit,
  onClickApproveAndSend,
  onClickDelete,
  lockControls = false,
}) => {
  const dispatch = useDispatch();
  const archivePending = useSelector(state => state.mailout.archivePending);
  const archiveId = useSelector(state => state.mailout.archiveId);
  const campaignName = useSelector(state => state.mailout.details?.name || '');
  const [EditingName, setEditingName] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState(data.name);

  const history = useHistory();
  const runArchive = () => {
    if (data.mailoutStatus === 'archived') {
      dispatch(undoArchiveMailoutPending(data._id));
    } else {
      dispatch(archiveMailoutPending(data._id));
    }
  };

  const saveName = async () => {
    if (newCampaignName !== campaignName)
      dispatch(updateMailoutNamePending({ name: newCampaignName, mailoutId: data._id }));
    setEditingName(false);
  };

  if (!data) return;
  const enableEdit =
    resolveMailoutStatus(data.mailoutStatus) !== 'Sent' &&
    resolveMailoutStatus(data.mailoutStatus) !== 'Processing';
  const enableDelete = resolveMailoutStatus(data.mailoutStatus) === 'Sent';
  const activeWhen = new Date(Date.now()).toISOString().split('T')[0] < data.send_date;
  const isArchived = data.mailoutStatus === 'hide' || data.mailoutStatus === 'archived';

  // Redirect the user to the edit page from the dashboard
  const handleEditClickFromDropdown = id => {
    dispatch(resetMailout());
    history.push(`/postcards/edit/${id}`);
  };

  const duplicateCampaign = id => {
    dispatch(duplicateMailoutPending(id));
  };

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
          <CampaignNameDiv>
            {EditingName ? (
              <>
                <Input
                  value={newCampaignName}
                  onChange={e => setNewCampaignName(e.target.value)}
                  onKeyUp={e => {
                    if (e.key === 'Enter') saveName();
                  }}
                  fluid
                ></Input>
                <SmallButton id="save-name-btn" primary onClick={saveName}>
                  Save
                </SmallButton>
              </>
            ) : (
              <>
                <Link to={`/dashboard/${data._id}`} className="ui header" style={{ margin: 0 }}>
                  <Header as="h3">{newCampaignName || data.details?.displayAddress}</Header>
                </Link>
                {data?.name && <EditButton onClick={_ => setEditingName(true)}>Edit</EditButton>}
              </>
            )}
          </CampaignNameDiv>
        )}
        {!mailoutDetailPage && isArchived && (
          <Header as="h3">{data.name || data.details?.displayAddress}</Header>
        )}
        {mailoutDetailPage && (
          <CampaignNameDiv>
            {EditingName ? (
              <>
                <Input
                  value={newCampaignName}
                  onChange={e => setNewCampaignName(e.target.value)}
                  onKeyUp={e => {
                    if (e.key === 'Enter') saveName();
                  }}
                  fluid
                ></Input>
                <SmallButton id="save-name-btn" primary onClick={saveName}>
                  Save
                </SmallButton>
              </>
            ) : (
              <>
                <Header as="h3">{newCampaignName || data.details?.displayAddress}</Header>
                {data?.name && <EditButton onClick={_ => setEditingName(true)}>Edit</EditButton>}
              </>
            )}
          </CampaignNameDiv>
        )}
      </span>
      <ItemHeaderMenuLayout>
        {mailoutDetailPage &&
          enableEdit &&
          ((!isArchived && data.mailoutStatus === 'sent') ||
            data.mailoutStatus === 'calculated') && (
            <Button
              primary
              inverted
              onClick={() => {
                duplicateCampaign(data._id);
                window.location = '/postcards';
              }}
            >
              Duplicate
            </Button>
          )}

        {mailoutDetailPage && enableEdit && (
          <>
            <span>
              <Button
                primary
                inverted
                onClick={onClickEdit}
                disabled={lockControls}
                loading={lockControls}
              >
                Edit
              </Button>
            </span>
          </>
        )}
        {data.mailoutStatus === 'archived' && (
          <Button
            onClick={runArchive}
            icon
            loading={data._id === archiveId && archivePending}
            disabled={data._id === archiveId && archivePending}
          >
            <Icon name="archive" /> Unarchive
          </Button>
        )}
        {!isArchived &&
          !mailoutDetailPage &&
          (data.mailoutStatus === 'sent' || data.mailoutStatus === 'calculated') && (
            <StyledDropdown
              loading={data._id === archiveId && archivePending}
              disabled={data._id === archiveId && archivePending}
              icon="ellipsis horizontal"
              direction="left"
              button
              className="icon"
            >
              <Dropdown.Menu>
                {data.mailoutStatus !== 'sent' && (
                  <Dropdown.Item onClick={() => handleEditClickFromDropdown(data._id)}>
                    <Icon name="edit" /> Edit
                  </Dropdown.Item>
                )}
                <Dropdown.Item onClick={() => duplicateCampaign(data._id)}>
                  <Icon name="clone" /> Duplicate
                </Dropdown.Item>

                <Dropdown.Item onClick={runArchive}>
                  <Icon name="archive" /> Archive
                </Dropdown.Item>
              </Dropdown.Menu>
            </StyledDropdown>
          )}
        <span>
          <ApproveAndSendButton
            data={data}
            mailoutDetailPage={mailoutDetailPage}
            onClickApproveAndSend={onClickApproveAndSend}
            lockControls={lockControls}
            runArchive={runArchive}
            archiveId={archiveId}
            archivePending={archivePending}
          />
        </span>
        <span>
          {!isArchived &&
            !mailoutDetailPage &&
            !canSend(data.mailoutStatus) &&
            !canPickDestinations(data.mailoutStatus) &&
            data.mailoutStatus !== 'calculated' && (
              <Link to={`dashboard/${data._id}`}>
                <Button primary>
                  <span>View Campaign</span>
                </Button>
              </Link>
            )}
        </span>
        <span>
          {mailoutDetailPage && enableDelete && activeWhen && (
            <Button
              primary
              inverted
              onClick={onClickDelete}
              disabled={lockControls}
              loading={lockControls}
            >
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
