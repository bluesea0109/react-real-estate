import _ from 'lodash';
import { BlockPicker } from 'react-color';
import Nouislider from 'nouislider-react';
import { useDispatch, useSelector } from 'react-redux';
import { Header, Label, Popup } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { createRef, Fragment, useEffect, useState, useReducer } from 'react';

import { reviewTeamCustomizationCompleted, saveTeamCustomizationPending } from '../../../store/modules/teamCustomization/actions';
import { isMobile, popup, urlRegExp, keywordRegExp, required, minLength, maxLength, composeValidators, TrimStrAndConvertToInt } from '../../utils';
import { saveTeamSoldShortcodePending, saveTeamListedShortcodePending } from '../../../store/modules/teamShortcode/actions';
import { Button, Icon, Image, Menu, Modal, Page, Segment } from '../../Base';
import { ContentTopHeaderLayout } from '../../../layouts';
import { colors, StyledHeader } from '../../helpers';
import Wizard from './CustomizationWizard';
import { Form, Input } from '../Base';
import FlipCard from '../../FlipCard';
import Loading from '../../Loading';

const NEW_LISTING = 'listed';
const SOLD_LISTING = 'sold';

const validURL = str => !urlRegExp.test(str) && 'URL is not valid';
const validKeyword = str => !keywordRegExp.test(str) && 'KEYWORD is not valid';
const isNotDefaultKeyword = str => str.toLowerCase() === 'keyword' && 'Please replace KEYWORD with other phrase';
const isValidURL = str => !!urlRegExp.test(str);

const formReducer = (state, action) => {
  return _.merge({}, state, action);
};

const CustomizeForm = ({ teamCustomizationData, initialRun }) => {
  const dispatch = useDispatch();

  const newListingShortenedURL = useSelector(store => store.teamShortcode && store.teamShortcode.listed);
  const newListingShortenedURLPending = useSelector(store => store.teamShortcode && store.teamShortcode.listedURLToShortenPending);
  const newListingShortenedURLError = useSelector(store => store.teamShortcode && store.teamShortcode.listedURLToShortenError);
  const soldListingShortenedURL = useSelector(store => store.teamShortcode && store.teamShortcode.sold);
  const soldListingShortenedURLPending = useSelector(store => store.teamShortcode && store.teamShortcode.soldURLToShortenPending);
  const soldListingShortenedURLError = useSelector(store => store.teamShortcode && store.teamShortcode.soldURLToShortenError);

  const onLoginUserId = useSelector(store => store.onLogin.user._id);
  const teammates = useSelector(store => store.team.profiles);

  const teamCustomizationPending = useSelector(store => store.teamCustomization && store.teamCustomization.pending);
  const customizationError = useSelector(store => store.teamCustomization && store.teamCustomization.error && store.teamCustomization.error.message);
  const postcardsPreviewIsPending = useSelector(store => store.teamPostcards && store.teamPostcards.pending);
  const postcardsPreviewError = useSelector(store => store.teamPostcards && store.teamPostcards.error && store.teamPostcards.error.message);
  const postcardsPreview = useSelector(store => store.teamPostcards && store.teamPostcards.available);

  const firstTeamAdmin = useSelector(
    store => store.team && store.team.profiles && store.team.profiles.filter(profile => profile.userId === store.onLogin.user._id)[0]
  );

  const profiles = [];

  const [page, setPage] = useState(0);
  const [formValues, setFormValues] = useReducer(formReducer, teamCustomizationData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);

  const [displayReview, setDisplayReview] = useState(false);
  const [listedIsFlipped, setListedIsFlipped] = useState(false);
  const [soldIsFlipped, setSoldIsFlipped] = useState(false);

  /* Instead of relying on handleSubmit changing the state of displayReview, we're doing it here */
  useEffect(() => {
    let isInitialized = true;

    if (isInitialized && !displayReview && postcardsPreviewIsPending) {
      setDisplayReview(true);
    }

    return () => (isInitialized = false);
  }, [displayReview, setDisplayReview, postcardsPreviewIsPending]);

  useEffect(() => {
    let isInitialized = true;

    if (isInitialized && teamCustomizationData) {
      const updatedFormValues = _.merge({}, formValues, teamCustomizationData);

      setFormValues(updatedFormValues);

      if (updatedFormValues.listed.cta) {
        dispatch(saveTeamSoldShortcodePending(updatedFormValues.listed.cta));
      }
      if (updatedFormValues.sold.cta) {
        dispatch(saveTeamSoldShortcodePending(updatedFormValues.sold.cta));
      }
    }

    return () => (isInitialized = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamCustomizationData, setFormValues, dispatch]);

  const handleSubmit = (values, actions) => {
    const data = _.merge({}, teamCustomizationData, formValues);

    data.listed.createMailoutsOfThisType = true;
    data.listed.frontHeadline = values.listed_frontHeadline;
    data.listed.cta = values.listed_cta;
    data.listed.kwkly = values.listed_kwkly;

    data.sold.createMailoutsOfThisType = true;
    data.sold.frontHeadline = values.sold_frontHeadline;
    data.sold.cta = values.sold_cta;
    data.sold.kwkly = values.sold_kwkly;

    if (initialRun) {
      data.listed.defaultDisplayAgent = {
        userId: firstTeamAdmin && firstTeamAdmin.userId,
        first: firstTeamAdmin && firstTeamAdmin.first,
        last: firstTeamAdmin && firstTeamAdmin.last,
      };
      data.sold.defaultDisplayAgent = {
        userId: firstTeamAdmin && firstTeamAdmin.userId,
        first: firstTeamAdmin && firstTeamAdmin.first,
        last: firstTeamAdmin && firstTeamAdmin.last,
      };
    }

    if (!data.listed.cta) delete data.listed.cta;
    if (!data.sold.cta) delete data.sold.cta;

    if (data.listed.shortenCTA || !data.listed.kwkly) {
      delete data.listed.kwkly;
    }

    if (data.sold.shortenCTA || !data.sold.kwkly) {
      delete data.sold.kwkly;
    }

    if (!data.listed.defaultDisplayAgent.userId) delete data.listed.defaultDisplayAgent;
    if (!data.sold.defaultDisplayAgent.userId) delete data.sold.defaultDisplayAgent;

    if (!data.sold.shortenCTA && data.sold.kwkly) {
      data.sold.kwkly = `Text ${data.sold.kwkly} to 59559 for details!`;
    }

    if (!data.listed.shortenCTA && data.listed.kwkly) {
      data.listed.kwkly = `Text ${data.listed.kwkly} to 59559 for details!`;
    }

    setFormValues(data);
    dispatch(saveTeamCustomizationPending(data));
  };

  const handleReviewComplete = () => {
    setDisplayReview(false);
    dispatch(reviewTeamCustomizationCompleted());
  };

  if (teammates.length > 0) {
    teammates.map((profile, index) => {
      const setupComplete = profile.doc.setupComplete;
      const currentUser = profile.userId === onLoginUserId;
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

  const renderTemplatePicture = ({ templateName, listingType }) => {
    const currentValue = formValues[listingType].templateTheme;

    const resolveSource = type => {
      const types = {
        ribbon: require('../../../assets/ribbon-preview.png'),
        bookmark: require('../../../assets/bookmark-preview.png'),
        stack: require('../../../assets/stack-preview.png'),
        undefined: null,
      };
      return type ? types[type] : types['undefined'];
    };

    const handleTemplateChange = value => {
      const newValue = formValues;
      newValue[listingType].templateTheme = value;
      setFormValues(newValue);
    };

    return (
      <div style={{ margin: '1em', minWidth: '128px', maxWidth: '270px' }}>
        <input
          type="radio"
          checked={currentValue === templateName}
          value={templateName}
          onChange={(e, { value }) => handleTemplateChange(value)}
          style={{ visibility: 'hidden', display: 'none' }}
        />
        <div
          style={
            currentValue === templateName
              ? { border: '2px solid #59C4C4', margin: 0, padding: '0.5em', borderRadius: '5px' }
              : { border: '1px solid lightgray', margin: 0, padding: '0.5em', borderRadius: '5px' }
          }
        >
          <img onClick={e => handleTemplateChange(templateName)} src={resolveSource(templateName)} alt={templateName} />
        </div>
      </div>
    );
  };

  const renderColorPicker = ({ listingType }) => {
    const currentValue = formValues[listingType].brandColor;

    const handleColorChange = value => {
      const newValue = formValues;
      newValue[listingType].brandColor = value.hex;
      setFormValues(newValue);
    };

    return <BlockPicker triangle="hide" width="200px" color={currentValue} colors={colors} onChangeComplete={handleColorChange} />;
  };

  const renderField = ({ fieldName, listingType }) => {
    const adjustedName = fieldName === 'frontHeadline' ? 'Headline' : fieldName;

    const handleChange = input => {
      const newValue = formValues;
      newValue[listingType][fieldName] = input.target.value;
      setFormValues(newValue);
    };

    return (
      <Input
        label={adjustedName}
        name={listingType + '_frontHeadline'}
        onBlur={handleChange}
        validate={composeValidators(required, minLength(2), maxLength(15))}
      />
    );
  };

  const renderMailoutSizeSlider = ({ listingType }) => {
    const MIN = 100;
    const MAX = 2000;
    const INCREMENT = 10;
    const STEPS = INCREMENT;
    const MARGIN = 10;
    const SLIDER_INITIAL_VALUES = [];

    const currentMailoutSize = formValues[listingType].mailoutSize;
    const currentMailoutSizeMin = formValues[listingType].mailoutSizeMin;
    const currentMailoutSizeMax = formValues[listingType].mailoutSizeMax;

    SLIDER_INITIAL_VALUES.push(currentMailoutSizeMin);
    SLIDER_INITIAL_VALUES.push(currentMailoutSize);
    SLIDER_INITIAL_VALUES.push(currentMailoutSizeMax);

    const handleMailoutSizeChange = value => {
      const newValue = formValues;

      value.map(item => {
        const itemArr = item.split(':');
        if (itemArr[0] === 'Min') return (newValue[listingType].mailoutSizeMin = TrimStrAndConvertToInt(itemArr[1]));
        if (itemArr[0] === 'Default') return (newValue[listingType].mailoutSize = TrimStrAndConvertToInt(itemArr[1]));
        if (itemArr[0] === 'Max') return (newValue[listingType].mailoutSizeMax = TrimStrAndConvertToInt(itemArr[1]));
        return null;
      });

      setFormValues(newValue);
    };

    return (
      <div className="slider" style={{ marginTop: '2em', marginBottom: '2em' }}>
        {isMobile() && (
          <Fragment>
            <br />
            <br />
          </Fragment>
        )}
        <Nouislider
          range={{
            min: MIN,
            max: MAX,
          }}
          step={STEPS}
          start={SLIDER_INITIAL_VALUES}
          margin={MARGIN}
          connect={true}
          behaviour="tap-drag"
          tooltips={true}
          pips={{
            mode: 'values',
            values: [currentMailoutSizeMin, currentMailoutSizeMax],
            stepped: true,
            density: 3,
          }}
          format={{
            to: (value, index) => {
              const intValue = Math.round(parseInt(value, 10) / 10) * 10;

              if (index === 0) return 'Min: ' + intValue;
              if (index === 1) return 'Default: ' + intValue;
              if (index === 2) return 'Max: ' + intValue;
            },
            from: value => {
              const newValue = value.split(':');

              if (newValue.length === 1) return newValue[0];
              else return TrimStrAndConvertToInt(newValue[1]);
            },
          }}
          onChange={handleMailoutSizeChange}
        />
        {isMobile() && (
          <Fragment>
            <br />
            <br />
          </Fragment>
        )}
      </div>
    );
  };

  const renderKWKLYCTAToggle = ({ listingType }) => {
    const ctaEnabled = formValues[listingType].shortenCTA;

    const handleKwklyEnabledChange = () => {
      const newValue = formValues;
      newValue[listingType].shortenCTA = !ctaEnabled;
      setFormValues(newValue);
    };

    return (
      <Form.Field>
        {!ctaEnabled ? (
          <span style={{ verticalAlign: '-0.35em', color: '#59C4C4' }} onClick={handleKwklyEnabledChange}>
            <FontAwesomeIcon icon="toggle-on" size="2x" />
          </span>
        ) : (
          <span style={{ verticalAlign: '-0.35em', color: '#969696' }} onClick={handleKwklyEnabledChange}>
            <FontAwesomeIcon icon="toggle-on" size="2x" className="fa-flip-horizontal" />
          </span>
        )}
        &nbsp;
        {!ctaEnabled ? 'Disable Kwkly' : 'Enable Kwkly'}
      </Form.Field>
    );
  };

  const renderCTA = ({ listingType }) => {
    const currentValue = formValues[listingType].cta;
    const ctaEnabled = formValues[listingType].shortenCTA;
    const shortenedURL = listingType === NEW_LISTING ? newListingShortenedURL : soldListingShortenedURL;

    if (currentValue && isValidURL(currentValue)) {
      if (listingType === NEW_LISTING && !newListingShortenedURLPending && !newListingShortenedURL && !newListingShortenedURLError) {
        dispatch(saveTeamListedShortcodePending(currentValue));
      }
      if (listingType === SOLD_LISTING && !soldListingShortenedURLPending && !soldListingShortenedURL && !soldListingShortenedURLError) {
        dispatch(saveTeamSoldShortcodePending(currentValue));
      }
    }

    const handleCTAChange = input => {
      const eURL = input.target.value;

      const newValue = formValues;
      newValue[listingType].cta = eURL;
      setFormValues(newValue);

      if (listingType === NEW_LISTING && isValidURL(eURL)) dispatch(saveTeamListedShortcodePending(eURL));
      if (listingType === SOLD_LISTING && isValidURL(eURL)) dispatch(saveTeamSoldShortcodePending(eURL));
    };

    const isVisible = ctaEnabled && shortenedURL;

    const onErrors = () => {
      if (listingType === NEW_LISTING && newListingShortenedURLError) return newListingShortenedURLError.message;
      if (listingType === SOLD_LISTING && soldListingShortenedURLError) return soldListingShortenedURLError.message;
    };

    if (isVisible) {
      return (
        <Form.Group widths="2">
          <Input
            label="Call to action URL"
            name={listingType + '_cta'}
            onBlur={handleCTAChange}
            validate={ctaEnabled && composeValidators(required, validURL)}
            disabled={!ctaEnabled}
            errorState={onErrors()}
          />
          <Label style={{ marginTop: !isMobile() && '2.5em', backgroundColor: 'transparent' }}>
            <Icon name="linkify" />
            Shortened URL:
            <Label.Detail>
              <Menu.Item href={'https://' + shortenedURL} position="left" target="_blank">
                <span>
                  {shortenedURL}{' '}
                  {popup('We automatically shorten your call to action links and generate URLs for each card to provide tracking and increase conversion.')}
                </span>
              </Menu.Item>
            </Label.Detail>
          </Label>
        </Form.Group>
      );
    } else {
      return (
        <Input
          label="Call to action URL"
          name={listingType + '_cta'}
          onBlur={handleCTAChange}
          validate={ctaEnabled && composeValidators(required, validURL)}
          disabled={!ctaEnabled}
          errorState={onErrors()}
        />
      );
    }
  };

  const renderKWKLY = ({ listingType }) => {
    const ctaEnabled = formValues[listingType].shortenCTA;

    const handleKwklyChange = input => {
      const newValue = formValues;
      newValue[listingType].kwkly = input.target.value;
      setFormValues(newValue);
    };

    return (
      <Input
        label="KWKLY Call to Action Phrase"
        name={listingType + '_kwkly'}
        onBlur={handleKwklyChange}
        validate={!ctaEnabled && composeValidators(required, validKeyword, isNotDefaultKeyword, minLength(2), maxLength(40))}
        disabled={ctaEnabled}
        labelPosition="right"
        type="text"
        placeholder="KEYWORD"
        tag={popup('Please enter your KWKLY keyword and we will put the keyword into a the KWKLY phrase for you.')}
      >
        <Label style={{ opacity: !ctaEnabled ? '1' : '0.4' }}>Text </Label>
        <input />
        <Label style={{ opacity: !ctaEnabled ? '1' : '0.4' }}> to 59559 for details!</Label>
      </Input>
    );
  };

  const Listings = ({ listingType }) => {
    return (
      <Fragment>
        <Segment
          padded
          className={isMobile() ? null : 'primary-grid-container'}
          style={isMobile() ? {} : { gridTemplateRows: 'unset', gridTemplateAreas: 'unset' }}
        >
          <div>
            <Header as="h4">Template Theme</Header>
            {renderTemplatePicture({ templateName: 'ribbon', listingType })}
          </div>

          <div>
            <p>&nbsp;</p>
            {renderTemplatePicture({ templateName: 'bookmark', listingType })}
          </div>

          <div>
            <p>&nbsp;</p>
            {renderTemplatePicture({ templateName: 'stack', listingType })}
          </div>

          <div>
            <Header as="h4">Brand Color</Header>
            {renderColorPicker({ listingType })}
          </div>
        </Segment>

        <Segment padded className={isMobile() ? null : 'tertiary-grid-container'}>
          {renderField({ fieldName: 'frontHeadline', listingType })}

          <div>
            <Header as="h4">Number of postcards to send per listing</Header>
            {renderMailoutSizeSlider({ listingType })}
          </div>

          <div>{renderKWKLYCTAToggle({ listingType })}</div>

          <div> </div>

          <div>{renderCTA({ listingType })}</div>

          <div>{renderKWKLY({ listingType })}</div>
        </Segment>
      </Fragment>
    );
  };

  return (
    <Page basic>
      <Wizard
        controls={
          <ContentTopHeaderLayout>
            <Segment padded style={isMobile() ? { marginTop: '58px' } : {}}>
              <Menu borderless fluid secondary>
                <Header as="h1">
                  Team Customization
                  <Header.Subheader>
                    Set the default template customization options for your team.&nbsp;
                    {isMobile() && <br />}
                    Changes made here will not overwrite existing user-specific customization.
                  </Header.Subheader>
                </Header>
                <Menu.Menu position="right">
                  <span>
                    {page === 1 && (
                      <Button primary inverted onClick={() => setPage(0)}>
                        Previous
                      </Button>
                    )}

                    <Button primary type="submit" disabled={isSubmitting}>
                      {isLastPage ? 'Submit' : 'Next'}
                    </Button>
                  </span>
                </Menu.Menu>
              </Menu>
            </Segment>
          </ContentTopHeaderLayout>
        }
        initialValues={{
          listed_frontHeadline: formValues.listed.frontHeadline,
          listed_cta: formValues.listed.cta,
          listed_kwkly: formValues.listed.kwkly,
          sold_frontHeadline: formValues.sold.frontHeadline,
          sold_cta: formValues.sold.cta,
          sold_kwkly: formValues.sold.kwkly,
        }}
        onSubmit={(values, actions) => handleSubmit(values, actions)}
        page={page}
        setPage={setPage}
        onLastPage={value => setIsLastPage(value)}
        onIsSubmitting={value => setIsSubmitting(value)}
      >
        <Listings listingType="listed" />
        <Listings listingType="sold" />
      </Wizard>

      <Modal open={displayReview} basic size="tiny">
        {!postcardsPreviewIsPending && (
          <Modal.Header>
            Preview
            <Button primary inverted floated="right" onClick={() => [setListedIsFlipped(true), setSoldIsFlipped(true)]}>
              Flip Back
            </Button>
            <Button primary inverted floated="right" onClick={() => [setListedIsFlipped(false), setSoldIsFlipped(false)]}>
              Flip Forward
            </Button>
          </Modal.Header>
        )}

        {!teamCustomizationPending && (postcardsPreviewError || customizationError) && <Modal.Header>Error</Modal.Header>}

        {postcardsPreviewIsPending && <Loading message="Please wait, loading an example preview..." />}

        {!teamCustomizationPending && (postcardsPreviewError || customizationError) && (
          <Modal.Content style={{ padding: '0 45px 10px' }}>{postcardsPreviewError || customizationError}</Modal.Content>
        )}

        {formValues.listed.createMailoutsOfThisType &&
          postcardsPreview &&
          postcardsPreview.listed &&
          postcardsPreview.listed.sampleBackLargeUrl &&
          postcardsPreview.listed.sampleFrontLargeUrl && (
            <Modal.Content image style={{ padding: '0 45px 10px' }}>
              <FlipCard isFlipped={listedIsFlipped}>
                <Image
                  wrapped
                  size="large"
                  src={postcardsPreview.listed.sampleFrontLargeUrl}
                  label={{ as: 'a', corner: 'right', icon: 'undo', onClick: () => setListedIsFlipped(!listedIsFlipped) }}
                />

                <Image
                  wrapped
                  size="large"
                  src={postcardsPreview.listed.sampleBackLargeUrl}
                  label={{ as: 'a', corner: 'right', icon: 'redo', onClick: () => setListedIsFlipped(!listedIsFlipped) }}
                />
              </FlipCard>
            </Modal.Content>
          )}

        {formValues.sold.createMailoutsOfThisType &&
          postcardsPreview &&
          postcardsPreview.sold &&
          postcardsPreview.sold.sampleBackLargeUrl &&
          postcardsPreview.sold.sampleFrontLargeUrl && (
            <Modal.Content image style={{ padding: '10px 45px 0' }}>
              <FlipCard isFlipped={soldIsFlipped}>
                <Image
                  wrapped
                  size="large"
                  src={postcardsPreview.sold.sampleFrontLargeUrl}
                  label={{ as: 'a', corner: 'right', icon: 'undo', onClick: () => setSoldIsFlipped(!soldIsFlipped) }}
                />

                <Image
                  wrapped
                  size="large"
                  src={postcardsPreview.sold.sampleBackLargeUrl}
                  label={{ as: 'a', corner: 'right', icon: 'redo', onClick: () => setSoldIsFlipped(!soldIsFlipped) }}
                />
              </FlipCard>
            </Modal.Content>
          )}

        {!postcardsPreviewIsPending && (
          <Modal.Actions>
            <Button secondary inverted onClick={() => setDisplayReview(false)}>
              <Icon name="remove" /> Edit
            </Button>
            <Button primary onClick={handleReviewComplete}>
              <Icon name="checkmark" /> Continue
            </Button>
          </Modal.Actions>
        )}

        {!teamCustomizationPending && (postcardsPreviewError || customizationError) && (
          <Modal.Actions>
            <Button secondary onClick={() => setDisplayReview(false)}>
              <Icon name="remove" /> OK
            </Button>
          </Modal.Actions>
        )}
      </Modal>
    </Page>
  );
};

export default CustomizeForm;
