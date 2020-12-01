import { combineReducers } from 'redux';

import auth0 from './modules/auth0/reducer';
import boards from './modules/boards/reducer';
import customization from './modules/customization/reducer';
import initialize from './modules/initialize/reducer';
import inviteUsers from './modules/inviteUsers/reducer';
import mailout from './modules/mailout/reducer';
import mailouts from './modules/mailouts/reducer';
import onboarded from './modules/onboarded/reducer';
import onLogin from './modules/onLogin/reducer';
import peer from './modules/peer/reducer';
import pictures from './modules/pictures/reducer';
import profile from './modules/profile/reducer';
import shortcode from './modules/shortcode/reducer';
import states from './modules/states/reducer';
import team from './modules/team/reducer';
import teamCustomization from './modules/teamCustomization/reducer';
import teamInitialize from './modules/teamInitialize/reducer';
import teamProfile from './modules/teamProfile/reducer';
import teamShortcode from './modules/teamShortcode/reducer';
import templates from './modules/templates/reducer';
import ui from './modules/ui/reducer';

const reducers = {
  auth0,
  boards,
  customization,
  initialize,
  inviteUsers,
  mailout,
  mailouts,
  onboarded,
  onLogin,
  peer,
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
  ui,
};

export default combineReducers(reducers);
