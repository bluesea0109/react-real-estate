// import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment, useState } from 'react';

import { Form, Header } from 'semantic-ui-react';

import { Button, Segment } from '../Base';

/*
available: {
      _id: 'alf|branding|brivity-team-72|branding',
      _rev: '1-a0bdefecbc198f3441ea09e218d0f726',
      listed: {
        createMailoutsOfThisType: true,
        mailoutSize: 300,
        mailoutSizeMin: 100,
        mailoutSizeMax: 500,
        templateTheme: 'alf-theme-stack',
        brandColor: '#f4b450',
        cta: 'https://austin.benkinneyteam.com/buy/',
        shortenCTA: true,
        frontHeadline: 'Just Listed!'
      },
      sold: {
        createMailoutsOfThisType: false,
        mailoutSize: 300,
        mailoutSizeMin: 200,
        mailoutSizeMax: 1000,
        templateTheme: 'alf-theme-ribbon',
        brandColor: '#b40101',
        shortenCTA: true,
        frontHeadline: 'Just Sold!'
      }
    },

const emptyState = {
  _id: null,
  _rev: null,
  listed: {
    createMailoutsOfThisType: null,
    mailoutSize: null,
    mailoutSizeMin: null,
    mailoutSizeMax: null,
    templateTheme: null,
    brandColor: null,
    cta: null,
    shortenCTA: true,
    frontHeadline: 'Just Listed!'
  },
  sold: {
    createMailoutsOfThisType: null,
    mailoutSize: null,
    mailoutSizeMin: null,
    mailoutSizeMax: null,
    templateTheme: null,
    brandColor: null,
    shortenCTA: null,
    frontHeadline: null
  }
};
 */

const NewListings = ({ nextStep }) => {
  const saveAndContinue = e => {
    e.preventDefault();
    nextStep();
  };

  return (
    <Form color="green">
      <h1 className="ui centered">Enter User Details</h1>
      <Form.Field>
        <label>First Name</label>
        <input
          placeholder="First Name"
          // onChange={this.props.handleChange('firstName')}
          // defaultValue={values.firstName}
        />
      </Form.Field>
      <Form.Field>
        <label>Last Name</label>
        <input
          placeholder="Last Name"
          // onChange={this.props.handleChange('lastName')}
          // defaultValue={values.lastName}
        />
      </Form.Field>
      <Form.Field>
        <label>Email Address</label>
        <input
          type="email"
          placeholder="Email Address"
          // onChange={this.props.handleChange('email')}
          // defaultValue={values.email}
        />
      </Form.Field>
      <Button onClick={saveAndContinue}>Save And Continue </Button>
    </Form>
  );
};

const SoldListings = ({ nextStep, prevStep }) => {
  const saveAndContinue = e => {
    e.preventDefault();
    nextStep();
  };

  const back = e => {
    e.preventDefault();
    prevStep();
  };

  return (
    <Form color="green">
      <h1 className="ui centered">Enter User Details</h1>
      <Form.Field>
        <label>First Name</label>
        <input
          placeholder="First Name"
          // onChange={this.props.handleChange('firstName')}
          // defaultValue={values.firstName}
        />
      </Form.Field>
      <Form.Field>
        <label>Last Name</label>
        <input
          placeholder="Last Name"
          // onChange={this.props.handleChange('lastName')}
          // defaultValue={values.lastName}
        />
      </Form.Field>
      <Form.Field>
        <label>Email Address</label>
        <input
          type="email"
          placeholder="Email Address"
          // onChange={this.props.handleChange('email')}
          // defaultValue={values.email}
        />
      </Form.Field>
      <Button onClick={back}>Back</Button>
      <Button onClick={saveAndContinue}>Save And Continue </Button>
    </Form>
  );
};

const NewCustomizeForm = () => {
  // const dispatch = useDispatch();
  // const [newListingEnabled, setNewListingEnabled] = useState(true);
  // const [soldListingEnabled, setSoldListingEnabled] = useState(false);
  // const [showSelectionAlert, setShowSelectionAlert] = useState(false);
  // const [togglePages, setTogglePages] = useState('');
  const [step, setStep] = useState(1);
  // const [teamCustomization, setTeamCustomization] = useState(emptyState);
  // const [customization, setCustomization] = useState(emptyState);

  // const availableTeamCustomization = useSelector(store => store.teamCustomization && store.teamCustomization.available);
  // const availableCustomization = useSelector(store => store.customization && store.customization.available);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step + 1);
  };

  const handleChange = input => event => {
    console.log('changes....');
    console.log('input: ', input);
    console.log('event: ', event);
    // this.setState({ [input] : event.target.value })
  };

  const renderSteps = () => {
    switch (step) {
      case 1:
        return (
          <NewListings
            nextStep={nextStep}
            handleChange={handleChange}
            // values={values}
          />
        );

      case 2:
        return (
          <SoldListings
            nextStep={nextStep}
            prevStep={prevStep}
            handleChange={handleChange}
            // values={values}
          />
        );

      default:
        return <span> Nothing here </span>;
    }
  };

  return (
    <Fragment>
      <Segment>
        <Header as="h1">
          My Customization
          <Header.Subheader>
            Set the default template customization options for your campaigns. Changes made here will overwrite existing team customization.
          </Header.Subheader>
        </Header>
      </Segment>

      {renderSteps()}
    </Fragment>
  );
};

export default NewCustomizeForm;
