import { all, fork } from 'redux-saga/effects';

import auth0 from './modules/auth0/sagas';
import boards from './modules/boards/sagas';
import content from './modules/content/sagas';
import customization from './modules/customization/sagas';
import initialize from './modules/initialize/sagas';
import inviteUsers from './modules/inviteUsers/sagas';
import mailout from './modules/mailout/sagas';
import mailouts from './modules/mailouts/sagas';
import onboarded from './modules/onboarded/sagas';
import onLogin from './modules/onLogin/sagas';
import pictures from './modules/pictures/sagas';
import profile from './modules/profile/sagas';
import shortcode from './modules/shortcode/sagas';
import states from './modules/states/sagas';
import team from './modules/team/sagas';
import teamCustomization from './modules/teamCustomization/sagas';
import teamInitialize from './modules/teamInitialize/sagas';
import teamProfile from './modules/teamProfile/sagas';
import teamShortcode from './modules/teamShortcode/sagas';
import templates from './modules/templates/sagas';

const sagas = {
  auth0,
  boards,
  content,
  customization,
  initialize,
  inviteUsers,
  mailout,
  mailouts,
  onboarded,
  onLogin,
  pictures,
  profile,
  shortcode,
  states,
  team,
  teamCustomization,
  teamInitialize,
  teamProfile,
  teamShortcode,
  templates,
};

export default function* root(services) {
  yield all(Object.values(sagas).map(saga => fork(saga, services)));
}
