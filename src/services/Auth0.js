import auth0 from 'auth0-js';
import config from '../config';

const siteRoot = process.env.NODE_ENV === 'production' ? 'https://beta.brivitymarketer.com' : 'http://localhost:8082';

const auth0Client = new auth0.WebAuth({
  // the following three lines MUST be updated
  domain: config.auth0.domain,
  audience: `https://${config.auth0.domain}/userinfo`,
  clientID: config.auth0.clientId,
  redirectUri: `${siteRoot}/callback`,
  responseType: 'id_token',
  scope: 'openid profile email',
});

export function handleAuthentication() {
  return new Promise((resolve, reject) => {
    auth0Client.parseHash((err, authResult) => {
      if (err) return reject(err);
      if (!authResult || !authResult.idToken) {
        return reject(err);
      }
      const idToken = authResult.idToken;
      const profile = authResult.idTokenPayload;
      // set the time that the id token will expire at
      const expiresAt = authResult.idTokenPayload.exp * 1000;
      resolve({
        authenticated: true,
        idToken,
        profile,
        expiresAt,
      });
    });
  });
}

export function signIn() {
  auth0Client.authorize();
}

export function signOut() {
  auth0Client.logout({
    returnTo: `${siteRoot}`,
    clientID: config.auth0.clientId,
  });
}
