import styled from 'styled-components';
import { Header } from 'semantic-ui-react';

export const colors = ['#b40101', '#f2714d', '#f4b450', '#79c34d', '#2d9a2c', '#59c4c4', '#009ee7', '#0e2b5b', '#ee83ee', '#8b288f', '#808080', '#000000'];

export const StyledHeader = styled(Header)`
  min-width: 18em;
  display: inline-block;
`;

export const iframeLinkStyle = { position: 'absolute', top: 0, left: 0, display: 'inline-block', width: '300px', height: '204px', zIndex: 5 };
export const iframeTransformMobile = 'translate(-25.15%, -25.39%) scale(0.53, 0.545)';
export const iframeTransformDesktop = 'scale(1.06, 1.099)';

export const initialValues = {
  listed: {
    createMailoutsOfThisType: true,
    defaultDisplayAgent: {
      userId: '',
      first: '',
      last: '',
    },
    mailoutSize: 300,
    mailoutSizeMin: 100,
    mailoutSizeMax: 1000,
    templateTheme: 'bookmark',
    brandColor: colors[0],
    frontHeadline: 'Just Listed!',
    cta: '',
    shortenCTA: true,
    kwkly: 'KEYWORD',
  },
  sold: {
    createMailoutsOfThisType: true,
    defaultDisplayAgent: {
      userId: '',
      first: '',
      last: '',
    },
    mailoutSize: 300,
    mailoutSizeMin: 100,
    mailoutSizeMax: 1000,
    templateTheme: 'bookmark',
    brandColor: colors[0],
    frontHeadline: 'Just Sold!',
    cta: '',
    shortenCTA: true,
    kwkly: 'KEYWORD',
  },
};
