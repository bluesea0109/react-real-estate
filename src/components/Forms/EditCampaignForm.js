import startCase from 'lodash/startCase';
import { BlockPicker, ChromePicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import React, { createRef, useEffect, useState } from 'react';
import { Dropdown, Form, Header, Label, Popup, Checkbox } from 'semantic-ui-react';

import { ContentBottomHeaderLayout, ContentSpacerLayout, ContentTopHeaderLayout, ItemHeaderLayout, ItemHeaderMenuLayout } from '../../layouts';
import { changeMailoutDisplayAgentPending, updateMailoutEditPending } from '../../store/modules/mailout/actions';
import { differenceObjectDeep, isMobile, maxLength, objectIsEmpty, sleep } from '../utils';
import { Button, Icon, Image, Menu, Message, Page, Segment } from '../Base';
import { resolveLabelStatus } from '../MailoutListItem/helpers';
import { StyledHeader, colors } from '../helpers';
import PageTitleHeader from '../PageTitleHeader';
import Loading from '../Loading';

const blacklistNames = ['brandColor', 'frontImgUrl', 'agentPicture', 'brokerageLogo', 'teamLogo', 'backUrl', 'frontAgentUrl'];

const EditCampaignForm = ({ mailoutDetails, mailoutEdit, handleBackClick }) => {
  const dispatch = useDispatch();
  const bookmarkTemplate = useSelector(store => store.templates.available?.bookmark);
  const ribbonTemplate = useSelector(store => store.templates.available?.ribbon);
  const stackTemplate = useSelector(store => store.templates.available?.stack);

  const onLoginMode = useSelector(store => store.onLogin?.mode);
  const multiUser = onLoginMode === 'multiuser';

  const updateMailoutEditIsPending = useSelector(store => store.mailout.updateMailoutEditPending);
  const updateMailoutEditError = useSelector(store => store.mailout.updateMailoutEditError?.message);
  const changeDisplayAgentPending = useSelector(store => store.mailout.changeDisplayAgentPending);
  const changeDisplayAgentError = useSelector(store => store.mailout.changeDisplayAgentError?.message);

  const teammates = useSelector(store => store.team.profiles);

  const currentListingStatus = mailoutDetails?.listingStatus;
  const currentTemplateTheme = mailoutDetails?.templateTheme;
  const currentMailoutDisplayAgentUserID = mailoutDetails.mailoutDisplayAgent ? mailoutDetails.mailoutDisplayAgent?.userId : mailoutDetails.userId;
  const currentMailoutDisplayAgent = mailoutDetails.mailoutDisplayAgent || { userId: mailoutDetails.userId };

  const [templateTheme, setTemplateTheme] = useState(currentTemplateTheme);
  const [selectedBrandColor, setSelectedBrandColor] = useState(mailoutEdit?.mergeVariables?.brandColor);
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const [tempColor, setTempColor] = useState(mailoutEdit?.mergeVariables?.brandColor)
  const [mailoutDisplayAgent, setMailoutDisplayAgent] = useState(currentMailoutDisplayAgent);
  const [formValues, setFormValues] = useState(mailoutEdit?.mergeVariables);

  //const defaultCTAUrl = useSelector(store => store.)
  const [ctaUrl, setCtaUrl] = useState(mailoutDetails.cta)
  const [shortenCTA, setShortenCTA] = useState(mailoutDetails.shortenCTA)
  const defaultCTAUrl = useSelector(store => {
    let bestCta = mailoutDetails.cta
    if (!bestCta) bestCta = store.onLogin.userBranding[currentListingStatus]?.cta
    if (!bestCta) bestCta = store.onLogin.teamBranding[currentListingStatus]?.cta
    if (!bestCta) bestCta = store.onLogin.teamProfile.website
    if (!bestCta) return 'https://www.google.com'
    return bestCta
  })

  const popover = {
    position: 'absolute',
    zIndex: '11',
    top: '125px'
  }
  const cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  }
  const handleColorPickerClick = () => setDisplayColorPicker(!displayColorPicker)
  const handleColorPickerClose = () => {
    setDisplayColorPicker(false)
    setSelectedBrandColor(tempColor)
  }


  /* This is a hack to enable fields to updated while enabling use to edit them as well
   * TODO: find a more permanents (correct) solution to this problem */
  const [formValuesHaveChanged, setFormValuesHaveChanged] = useState(false);
  useEffect(() => {
    let isInitialized = true;

    async function delaySwitchOn() {
      await sleep(1000);
      if (isInitialized) {
        setFormValuesHaveChanged(true);
      }
    }

    async function delaySwitchOff() {
      await sleep(1000);
      if (isInitialized) {
        setFormValuesHaveChanged(false);
      }
    }

    if (updateMailoutEditIsPending || changeDisplayAgentPending) {
      delaySwitchOn();
    } else {
      delaySwitchOff();
    }

    return () => (isInitialized = false);
  }, [updateMailoutEditIsPending, changeDisplayAgentPending, setFormValuesHaveChanged]);

  useEffect(() => {
    const diff = differenceObjectDeep(formValues, mailoutEdit.mergeVariables);

    if (!objectIsEmpty(diff) && formValuesHaveChanged) {
      setFormValues(mailoutEdit.mergeVariables);
    }
  }, [mailoutEdit.mergeVariables, formValues, setFormValues, formValuesHaveChanged]);

  const handleEditSubmitClick = async () => {
    const newMergeVariables = [];
    newMergeVariables.push({ name: 'brandColor', value: selectedBrandColor.hex || selectedBrandColor });

    Object.keys(formValues)
      .filter(key => key !== 'brandColor')
      .forEach(key => newMergeVariables.push({ name: key, value: formValues[key] }));

    const newData = Object.assign(
      {},
      { templateTheme },
      { mergeVariables: mailoutEdit?.mergeVariables },
      { mergeVariables: newMergeVariables },
      { mailoutDisplayAgent } // add the   "ctas" object here
    );
    if (ctaUrl) {
      newData.ctas = {
        cta: ctaUrl,
        shortenCTA: shortenCTA
      }
    } else {
      newData.ctas = { dontOverride: true }
    }

    dispatch(updateMailoutEditPending(newData));
    await sleep(500);
    handleBackClick();
  };

  const profiles = [];

  if (teammates.length > 0) {
    teammates.map((profile, index) => {
      const setupComplete = profile.doc.setupComplete;
      const currentUser = profile.userId === currentMailoutDisplayAgentUserID;
      const fullName = `${profile.first} ${profile.last}`;

      const contextRef = createRef();
      const currentUserIconWithPopup = <Popup context={contextRef} content="Currently selected agent" trigger={<Icon name="user" />} />;
      const setupCompletedIconWithPopup = <Popup context={contextRef} content="Setup Completed" trigger={<Icon name="check circle" color="teal" />} />;

      return profiles.push({
        key: index,
        first: profile.first,
        last: profile.last,
        text: fullName,
        value: profile.userId,
        content: (
          <StyledHeader as="h4" ref={contextRef}>
            <Image size="mini" inline circular src="https://react.semantic-ui.com/images/avatar/large/patrick.png" />
            &nbsp;
            {profile.first}&nbsp;
            {profile.last}&nbsp;
            {currentUser ? currentUserIconWithPopup : null}
            {setupComplete ? setupCompletedIconWithPopup : null}
          </StyledHeader>
        ),
      });
    });
  }

  const renderTemplatePicture = templateName => {
    const resolveSource = type => {
      const types = {
        ribbon: require('../../assets/ribbon-preview.png'),
        bookmark: require('../../assets/bookmark-preview.png'),
        stack: require('../../assets/stack-preview.png'),
        undefined: null,
      };
      return type ? types[type] : types['undefined'];
    };

    return (
      <div style={{ margin: '1em' }}>
        <input
          type="radio"
          checked={templateTheme === templateName}
          value={templateName}
          onChange={(e, { value }) => setTemplateTheme(value)}
          style={{ visibility: 'hidden', display: 'none' }}
        />
        <div
          style={
            templateTheme === templateName
              ? { border: '2px solid teal', margin: 0, padding: '0.5em', borderRadius: '5px', maxWidth: '260px' }
              : { border: '1px solid lightgray', margin: 0, padding: '0.5em', borderRadius: '5px', maxWidth: '260px' }
          }
        >
          <img onClick={e => setTemplateTheme(templateName)} src={resolveSource(templateName)} alt={templateName} />
        </div>
      </div>
    );
  };

  const handleAgentChange = (e, input) => {
    const selectedAgent = input.options.filter(o => o.value === input.value)[0];
    const { first, last, value } = selectedAgent;

    setMailoutDisplayAgent({ userId: value, first, last });
    dispatch(changeMailoutDisplayAgentPending(value));
  };

  const handleInputChange = (value, name) => {
    const newValues = Object.assign({}, formValues, { [name]: value });
    setFormValues(newValues);
  };

  const renderThemeSpecificData = () => {
    switch (templateTheme) {
      case 'ribbon':
        const ribbonFields = ribbonTemplate[currentListingStatus].fields
          .filter(field => !blacklistNames.includes(field.name))
          .map(field => {
            let fieldName = startCase(field.name);
            const error = maxLength(field.max)(formValues[field.name]);

            if (fieldName.includes('Url')) fieldName = fieldName.replace(/Url/g, 'URL');
            if (fieldName.includes('Cta')) fieldName = fieldName.replace(/Cta/g, 'CTA');

            return (
              <Form.Field key={formValuesHaveChanged ? formValues[field.name] || fieldName : fieldName}>
                <Form.Input
                  fluid
                  error={error && { content: error }}
                  label={fieldName}
                  placeholder={field.default}
                  type={field.type}
                  onChange={(e, input) => handleInputChange(input.value, field.name)}
                  defaultValue={formValues[field.name]}
                />
              </Form.Field>
            );
          });

        return (
          <Form color="green">
            <Segment basic padded className={isMobile() ? null : 'secondary-grid-container'}>
              {ribbonFields}
            </Segment>
          </Form>
        );

      case 'bookmark':
        const bookmarkFields = bookmarkTemplate[currentListingStatus].fields
          .filter(field => !blacklistNames.includes(field.name))
          .map(field => {
            let fieldName = startCase(field.name);
            const error = maxLength(field.max)(formValues[field.name]);

            if (fieldName.includes('Url')) fieldName = fieldName.replace(/Url/g, 'URL');
            if (fieldName.includes('Cta')) fieldName = fieldName.replace(/Cta/g, 'CTA');

            return (
              <Form.Field key={formValuesHaveChanged ? formValues[field.name] || fieldName : fieldName}>
                <Form.Input
                  fluid
                  error={error && { content: error }}
                  label={fieldName}
                  placeholder={field.default}
                  type={field.type}
                  onChange={(e, input) => handleInputChange(input.value, field.name)}
                  defaultValue={formValues[field.name]}
                />
              </Form.Field>
            );
          });

        return (
          <Form color="green">
            <Segment basic padded className={isMobile() ? null : 'secondary-grid-container'}>
              {bookmarkFields}
            </Segment>
          </Form>
        );

      case 'stack':
        const stackFields = stackTemplate[currentListingStatus].fields
          .filter(field => !blacklistNames.includes(field.name))
          .map(field => {
            let fieldName = startCase(field.name);
            const error = maxLength(field.max)(formValues[field.name]);

            if (fieldName.includes('Url')) fieldName = fieldName.replace(/Url/g, 'URL');
            if (fieldName.includes('Cta')) fieldName = fieldName.replace(/Cta/g, 'CTA');

            return (
              <Form.Field key={formValuesHaveChanged ? formValues[field.name] || fieldName : fieldName}>
                <Form.Input
                  fluid
                  error={error && { content: error }}
                  label={fieldName}
                  placeholder={field.default}
                  type={field.type}
                  onChange={(e, input) => handleInputChange(input.value, field.name)}
                  defaultValue={formValues[field.name]}
                />
              </Form.Field>
            );
          });

        return (
          <Form color="green">
            <Segment basic padded className={isMobile() ? null : 'secondary-grid-container'}>
              {stackFields}
            </Segment>
          </Form>
        );

      default:
        return <span> Nothing here </span>;
    }
  };

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <Menu borderless fluid secondary>
            <Menu.Item>
              <Header as="h3">Campaign Edit</Header>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <Button
                  primary
                  inverted
                  onClick={() => handleBackClick()}
                  loading={updateMailoutEditIsPending || changeDisplayAgentPending}
                  disabled={updateMailoutEditIsPending || changeDisplayAgentPending}
                >
                  Back
                </Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>

      <ContentSpacerLayout />

      <Segment>
        <ContentBottomHeaderLayout>
          <ItemHeaderLayout attached="top" block style={isMobile() ? { marginTop: '56px' } : {}}>
            <span style={{ gridArea: 'label' }}>
              <Label
                size="large"
                color={resolveLabelStatus(currentListingStatus)}
                ribbon
                style={{ textTransform: 'capitalize', top: '-0.9em', left: '-2.7em' }}
              >
                {currentListingStatus}
              </Label>
            </span>
            <span style={{ gridArea: 'address', alignSelf: 'center' }}>
              <Header as="h3">{mailoutDetails?.details?.displayAddress}</Header>
            </span>

            <ItemHeaderMenuLayout>
              <span>
                <Button
                  primary
                  type="submit"
                  onClick={handleEditSubmitClick}
                  loading={updateMailoutEditIsPending || changeDisplayAgentPending}
                  disabled={updateMailoutEditIsPending || changeDisplayAgentPending}
                >
                  Save
                </Button>
              </span>
            </ItemHeaderMenuLayout>
          </ItemHeaderLayout>

          {updateMailoutEditIsPending && <Loading message="Saving campaign..." />}

          {!!updateMailoutEditError && (
            <Message negative>
              <Message.Header>We're sorry, something went wrong.</Message.Header>
              <p>{updateMailoutEditError}</p>
            </Message>
          )}

          {changeDisplayAgentPending && <Loading message="Updating postcard details..." />}

          {!!changeDisplayAgentError && (
            <Message negative>
              <Message.Header>We're sorry, something went wrong.</Message.Header>
              <p>{changeDisplayAgentError}</p>
            </Message>
          )}
        </ContentBottomHeaderLayout>

        <Segment
          basic
          padded
          className={isMobile() ? null : 'primary-grid-container'}
          style={isMobile() ? { marginTop: '140px' } : { padding: 10, marginTop: '120px' }}
        >
          <div>
            <Header as="h4">Template Theme</Header>
            {renderTemplatePicture('bookmark')}
          </div>

          <div>
            <p>&nbsp;</p>
            {renderTemplatePicture('ribbon')}
          </div>

          <div>
            <p>&nbsp;</p>
            {renderTemplatePicture('stack')}
          </div>

          <div>
            <Header as="h4">Brand Color</Header>
            <BlockPicker triangle="hide" width="200px" color={selectedBrandColor} colors={colors} onChange={setTempColor} onChangeComplete={value => setSelectedBrandColor(value) && setTempColor(value)} />
            <Icon id="brandColourPickerIcon" bordered link color='grey' name="eye dropper" onClick={ handleColorPickerClick } />
            { displayColorPicker ? <div style={ popover }>
                <div style={ cover } onClick={ handleColorPickerClose } />
                <ChromePicker color={tempColor} onChange={value => setTempColor(value)} />
              </div> : null }
          </div>

          {multiUser && (
            <div>
              <Header as="h4">Display Agent</Header>
              <Dropdown
                placeholder="Select Display Agent"
                fluid
                selection
                options={profiles}
                value={mailoutDisplayAgent?.userId}
                onChange={handleAgentChange}
              />
            </div>
          )}
        </Segment>

        <Header as="h4" style={{ marginLeft: '1.5em', marginBottom: '-0.5em' }}>
          Change Postcard details
        </Header>

        {renderThemeSpecificData()}

        <div>
          <Header as="h4">Customize call to action URL</Header>
          <Form.Field>
            <Checkbox
              radio
              label="Don't Customize - use default"
              name='checkboxRadioGroup'
              value='this'
              checked={!ctaUrl}
              onClick={() => {
                setCtaUrl(false)
                setShortenCTA(false)
              }}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              radio
              label='Customize call to action URL - URL will be shortened and lead tracking enabled'
              name='checkboxRadioGroup'
              value='that'
              checked={ctaUrl && shortenCTA}
              onClick={() => {
                setCtaUrl(ctaUrl || defaultCTAUrl)
                setShortenCTA(true)
              }}
            />
          </Form.Field>
          {ctaUrl && (
            <div className="ui fluid input">
              <input type="text" placeholder="URL" value={ctaUrl} onChange={e => setCtaUrl(e.target.value)} />
            </div>
          )}
        </div>
      </Segment>
    </Page>
  );
};

export default EditCampaignForm;
