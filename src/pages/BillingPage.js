import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { Header, Menu, Page, Segment, Image, Card } from '../components/Base';
import { Table } from 'semantic-ui-react';
import { format } from 'date-fns';
import PageTitleHeader from '../components/PageTitleHeader';
import { ContentBottomHeaderLayout, ContentTopHeaderLayout } from '../layouts';
import auth from '../services/auth';
import api from '../services/api';
import { postcardDimensionsDisplayed } from '../components/utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import visa from '../assets/visa.jpg';
import americanExpress from '../assets/american-express.jpg';
import discover from '../assets/discover.jpg';
import mastercard from '../assets/mastercard.jpg';
import styled from 'styled-components';

const cardStyles = {
  width: '33px',
  marginTop: '4px',
  marginRight: '10px',
};

const defaultCardStyles = { marginRight: '10px', marginTop: '6px', marginLeft: '3px' };

const BillingDetailsWrapper = styled.div`
  margin: 20px 0;
  .flexWrap {
    display: flex;
    flex-wrap: wrap;
    .cardDetails {
      margin-right: 120px;
      margin-top: 20px;
      .cardNumber {
        margin-bottom: 11px;
      }
      .flex {
        display: flex;
        .displayCard {
          font-size: 20px;
        }
        .maskedCardWrapper {
          padding-top: 5px;
          .cardNumber {
            font-size: 12px;
          }
        }
      }
      .expiry {
        font-size: 11px;
      }
      .expired {
        color: red;
      }
    }

    .billingName {
      margin-top: 15px;
    }

    .address {
      margin-right: 120px;
      margin-top: 20px;

      .billingAddress {
        margin-top: 15px;
      }
    }
  }

  .bold {
    font-weight: bold;
  }
  .errorWrapper {
    margin-right: 120px;
    margin-top: 20px;
  }
`;

const CreditBalanceWrapper = styled.div`
  margin: 20px 0;
  .flexWrap {
    display: flex;
    flex-wrap: wrap;
    .creditBalance {
      margin-right: 100px;
    }
    .teamBilling {
      margin-right: 40px;
    }
  }
  .bold {
    font-weight: bold;
  }
`;
const BillingPage = () => {
  const isAdmin = useSelector(store => store.onLogin?.permissions?.teamAdmin);
  const teamBillingId = useSelector(
    store => store.onLogin?.teamProfile.brivitySync.billing_reference
  );
  const personalBillingId = useSelector(
    store => store.onLogin?.userProfile.brivitySync.billing_reference
  );
  const [billingDetails, setBillingDetails] = useState(null);

  let BillingInfo = null;
  let billingName = null;
  let billingAddress1 = null;
  let billingAddress2 = null;
  let maskedCardXCount = null;
  let maskedCardNumbers = null;
  let displayCard = null;
  let cardLogo = null;
  let cardExpiration = null;
  let expired = null;
  var date = new Date();
  var currentMonth = date.getMonth() + 1;
  var currentYear = date.getFullYear();
  if (billingDetails && billingDetails.chargify.paymentProfile) {
    const {
      first_name,
      last_name,
      masked_card_number,
      billing_address,
      billing_city,
      billing_state,
      billing_zip,
      card_type,
      expiration_month,
      expiration_year,
    } = billingDetails.chargify?.paymentProfile;

    switch (card_type) {
      case 'visa':
        cardLogo = <img style={cardStyles} src={visa} alt="visa" />;
        break;
      case 'discover':
        cardLogo = <img style={cardStyles} src={discover} alt="visa" />;
        break;
      case 'mastercard':
        cardLogo = <img style={cardStyles} src={mastercard} alt="visa" />;
        break;
      case 'american':
        cardLogo = <img style={cardStyles} src={americanExpress} alt="visa" />;
        break;
      default:
        cardLogo = <FontAwesomeIcon icon="credit-card" style={defaultCardStyles} />;
    }
    maskedCardXCount = masked_card_number.match(/X/g);
    maskedCardNumbers = masked_card_number.match(/\d+/g).map(Number);

    displayCard = maskedCardXCount.map((x, index) => {
      if ((index + 1) % 4 !== 0) return <span key={index}>&middot;</span>;
      else return <span key={index}>&middot; &nbsp;</span>;
    });

    billingName = (
      <span>
        {first_name} {last_name}
      </span>
    );
    billingAddress1 = billing_address;
    billingAddress2 = (
      <span>
        {billing_city} {billing_state} {billing_zip}
      </span>
    );
    cardExpiration = (
      <span>
        {expiration_month}/{expiration_year}
      </span>
    );
    if (
      expiration_year < currentYear ||
      (expiration_year <= currentYear && expiration_month < currentMonth)
    ) {
      expired = 'expired';
    }
  }
  if (billingDetails && billingDetails.chargify.hasOwnProperty('error')) {
    BillingInfo = (
      <span>
        Your credit card is not configured.{' '}
        <a
          href="https://info.brivity.com/knowledge/kb-tickets/new"
          rel="noopener noreferrer"
          target="_blank"
        >
          Please contact support to set this up.
        </a>
      </span>
    );
  }

  useEffect(() => {
    async function fetchData() {
      if (billingDetails) return;
      let path = `/api/user/team/settings/billings`;
      if (!isAdmin) path = `/api/user/settings/billings`;
      const headers = {};
      const accessToken = await auth.getAccessToken();
      headers['authorization'] = `Bearer ${accessToken}`;
      const response = await fetch(path, { headers, method: 'get', credentials: 'include' });
      const results = await api.handleResponse(response);
      setBillingDetails(results);
    }
    fetchData();
  }, [billingDetails, isAdmin]);

  const tableBody = () => {
    return billingDetails.billings.map((item, index) => (
      <Table.Row key={item.id}>
        <Table.Cell>{format(new Date(item.billingDate), 'MM/dd/yyyy')}</Table.Cell>
        <Table.Cell>
          <Link to={`dashboard/${item.id}`}>{item.name}</Link>
        </Table.Cell>
        <Table.Cell>
          {item.postcardSize
            ? `${postcardDimensionsDisplayed(item.postcardSize)}" Postcard`
            : `4x6" Postcard`}
        </Table.Cell>
        <Table.Cell>{item.recipientCount}</Table.Cell>
        <Table.Cell>${item.creditsAmountApplied || '0.00'}</Table.Cell>
        <Table.Cell>
          {item.userProfile.first} {item.userProfile.last}
        </Table.Cell>
        {item.approvedByUser && (
          <Table.Cell>
            {item.approvedByUser.first} {item.approvedByUser.last}
          </Table.Cell>
        )}
        {!item.approvedByUser && <Table.Cell></Table.Cell>}
        <Table.Cell>
          ${(Number(item.amount_in_cents) + Number(item.tax_amount_in_cents)) / 100}
        </Table.Cell>
      </Table.Row>
    ));
  };

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <Menu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Billing</Header>
            </Menu.Item>
          </Menu>
          {!isAdmin && billingDetails && !billingDetails.billings.length && (
            <p id="billingSubHeader">
              Billing is connected to your team&apos;s administrator by default. If a user would
              like to be billed directly, please contact{' '}
              <a href="mailto:support@brivity.com">support@brivity.com</a>
            </p>
          )}
        </PageTitleHeader>
        <BillingDetailsWrapper>
          <Segment style={{ padding: '20px' }}>
            <Header as="h2">Card Details</Header>
            {billingDetails && billingDetails.chargify.paymentProfile ? (
              <div className="flexWrap">
                <div className="cardDetails">
                  <p>
                    <span className="bold">Cardholder Name </span>
                  </p>
                  <p className="billingName">{billingName}</p>
                </div>
                <div className="cardDetails">
                  <p className="cardNumber">
                    <span className="bold">Card Number </span>
                  </p>
                  <div className="flex">
                    <div>{cardLogo}</div>
                    <div>
                      <p className="displayCard">{displayCard}</p>
                    </div>
                    <div className="maskedCardWrapper">
                      <p className="cardNumber">
                        <span>{maskedCardNumbers}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className={`expiry ${expired}`}>
                      <span className="bold">Expiry</span> {cardExpiration}
                    </p>
                  </div>
                </div>
                <div className="address">
                  <p>
                    <span className="bold">Address </span>
                  </p>
                  <p className="billingAddress">
                    {billingAddress1}
                    <br />
                    {billingAddress2}
                  </p>
                </div>
              </div>
            ) : (
              <div className="errorWrapper">
                <p>
                  <span className="bold">{BillingInfo}</span>
                </p>
              </div>
            )}
          </Segment>
        </BillingDetailsWrapper>
      </ContentTopHeaderLayout>
      <div style={{ margin: '20px 0' }}>
        <Segment>
          <ContentBottomHeaderLayout style={{ minHeight: 0 }}>
            {!billingDetails && <Loading message="Retrieving billing information..." />}
          </ContentBottomHeaderLayout>
          {billingDetails && !!billingDetails.billings.length && (
            <Table basic="very" className="BillingTable">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                  <Table.HeaderCell>Campaign Title</Table.HeaderCell>
                  <Table.HeaderCell>Campaign Type</Table.HeaderCell>
                  <Table.HeaderCell>Recipients</Table.HeaderCell>
                  <Table.HeaderCell>Credits Applied</Table.HeaderCell>
                  <Table.HeaderCell>Profile</Table.HeaderCell>
                  <Table.HeaderCell>Approved By</Table.HeaderCell>
                  <Table.HeaderCell>Cost</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>{tableBody()}</Table.Body>
            </Table>
          )}
          {billingDetails && !billingDetails.billings.length && (
            <Card centered style={{ minWidth: '380px', boxShadow: 'none' }}>
              <Image
                centered
                size="large"
                src={require('../assets/Billing_empty_state.png')}
                style={{ background: 'unset', marginTop: '1em' }}
              />
              <Card.Content style={{ borderTop: 'none' }}>
                <Header as="h5" textAlign="center">
                  <Header.Content style={{ width: '380px', textAlign: 'center' }}>
                    Your billing invoices will appear here
                  </Header.Content>
                </Header>
              </Card.Content>
            </Card>
          )}
        </Segment>
      </div>

      {billingDetails && billingDetails.credits && (
        <CreditBalanceWrapper>
          <Segment>
            <ContentBottomHeaderLayout style={{ minHeight: 0 }}>
              <div className="flexWrap">
                <p className="creditBalance">
                  <span className="bold">Credit Balance: </span> ${billingDetails.credits}
                </p>

                <p className="teamBilling">
                  <span className="bold">Team Billing Reference ID: </span>
                  {teamBillingId}
                </p>

                {personalBillingId && (
                  <p>
                    <span className="bold">Personal Billing ID: </span>
                    {personalBillingId}
                  </p>
                )}
              </div>
            </ContentBottomHeaderLayout>
          </Segment>
        </CreditBalanceWrapper>
      )}
    </Page>
  );
};

export default BillingPage;
