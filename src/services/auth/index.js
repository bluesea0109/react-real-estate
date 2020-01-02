import auth0 from 'auth0-js';
import EventEmitter from 'events';
import config from '../../config';

const localStorageKey = 'loggedIn';
const loginEvent = 'loginEvent';
const homepage = process.env.PUBLIC_URL;
const siteRoot = process.env.NODE_ENV === 'production' ? `https://beta.brivitymarketer.com${homepage}` : 'http://localhost:8082';

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
  idTokenPayload = null;
  accessToken = null;
  accessTokenExpiry = null;

  signIn = customState => {
    webAuth.authorize({
      appState: customState,
    });
  };

  cookieLogin = idToken => {
    this.idToken = idToken;
    this.accessToken = idToken;
    this.accessTokenExpiry = new Date(Date.now() + 900000000);

    localStorage.setItem(localStorageKey, 'true');

    this.emit(loginEvent, {
      loggedIn: true,
    });
  };

  localLogin = authResult => {
    this.idToken = authResult.idToken;
    this.idTokenPayload = authResult.idTokenPayload;
    this.accessToken = authResult.accessToken;
    this.accessTokenExpiry = new Date(authResult.idTokenPayload.exp * 1000);

    localStorage.setItem(localStorageKey, 'true');

    this.emit(loginEvent, {
      loggedIn: true,
      idTokenPayload: authResult.idTokenPayload,
      state: authResult.appState || {},
    });
  };

  handleAuthentication = () => {
    return new Promise((resolve, reject) => {
      webAuth.parseHash((err, authResult) => {
        if (err) {
          return reject(err);
        } else {
          this.localLogin(authResult);
          resolve(authResult);
        }
      });
    });
  };

  renewTokens = () => {
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
  };

  signOut = () => {
    localStorage.removeItem(localStorageKey);

    this.idToken = null;
    this.idTokenPayload = null;
    this.accessToken = null;
    this.accessTokenExpiry = null;

    webAuth.logout({
      returnTo: `${siteRoot}`,
      clientID: config.auth0.clientId,
    });

    this.emit(loginEvent, { loggedIn: false });
  };

  isAccessTokenValid() {
    return this.accessToken && this.accessTokenExpiry && Date.now() < this.accessTokenExpiry;
  }

  getAccessToken = () => {
    return new Promise((resolve, reject) => {
      if (this.isAccessTokenValid()) {
        resolve(this.accessToken);
      } else {
        this.renewTokens().then(authResult => {
          resolve(authResult.accessToken);
        }, reject);
      }
    });
  };

  isAuthenticated = () => {
    return this.isAccessTokenValid() && localStorage.getItem(localStorageKey) === 'true';
  };
}

export default new AuthService();
