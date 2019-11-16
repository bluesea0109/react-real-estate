import auth0 from 'auth0-js';
import EventEmitter from 'events';
import config from '../../config';

const localStorageKey = 'loggedIn';
const loginEvent = 'loginEvent';
const siteRoot = process.env.NODE_ENV === 'production' ? 'https://beta.brivitymarketer.com' : 'http://localhost:8082';

const webAuth = new auth0.WebAuth({
  domain: config.auth0.domain,
  audience: `${config.auth0.audience}`,
  clientID: config.auth0.clientId,
  redirectUri: `${siteRoot}/callback`,
  responseType: 'token id_token',
  scope: 'openid profile email',
});

class AuthService extends EventEmitter {
  idToken = null;
  profile = null;
  tokenExpiry = null;

  accessToken = null;
  accessTokenExpiry = null;

  signIn(customState) {
    webAuth.authorize({
      appState: customState,
    });
  }

  localLogin(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;

    // NEW - Save the Access Token and expiry time in memory
    this.accessToken = authResult.accessToken;
    this.tokenExpiry = authResult.expiresAtDate;

    localStorage.setItem(localStorageKey, 'true');

    this.emit(loginEvent, {
      loggedIn: true,
      profile: authResult.idTokenPayload,
      state: authResult.appState || {},
    });
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      webAuth.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        const accessToken = authResult.accessToken;
        const idToken = authResult.idToken;
        // set the time that the id token will expire at
        const expiresAt = authResult.idTokenPayload.exp * 1000;
        // make the time human readable
        const expiresAtDate = new Date(expiresAt).toString();

        resolve({
          authenticated: true,
          accessToken,
          idToken,
          expiresAt,
          expiresAtDate,
        });
      });
    });
  }

  renewTokens() {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem(localStorageKey) !== 'true') {
        return reject('Not logged in');
      }

      webAuth.checkSession({}, (err, authResult) => {
        if (err) {
          reject(err);
        } else {
          this.localLogin(authResult);
          resolve(authResult);
        }
      });
    });
  }

  signOut() {
    localStorage.removeItem(localStorageKey);

    this.idToken = null;
    this.tokenExpiry = null;
    this.profile = null;

    webAuth.logout({
      returnTo: `${siteRoot}`,
      clientID: config.auth0.clientId,
    });

    this.emit(loginEvent, { loggedIn: false });
  }

  isAccessTokenValid() {
    return this.accessToken && this.accessTokenExpiry && Date.now() < this.accessTokenExpiry;
  }

  getAccessToken() {
    return new Promise((resolve, reject) => {
      if (this.isAccessTokenValid()) {
        resolve(this.accessToken);
      } else {
        this.renewTokens().then(authResult => {
          resolve(authResult.accessToken);
        }, reject);
      }
    });
  }

  isAuthenticated() {
    return Date.now() < this.tokenExpiry && localStorage.getItem(localStorageKey) === 'true';
  }
}

export default new AuthService();
