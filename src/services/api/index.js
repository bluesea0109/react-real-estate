import auth from '../auth';

async function handleResponse(response) {
  if (response.ok) {
    const data = await response.json();

    return data;
  } else {
    const error = new Error(`${response.status} ${response.statusText}`);
    error.response = response;

    throw error;
  }
}

function scrubEmptyStrings(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      return value === '' ? null : value;
    })
  );
}

async function get(path, query = {}, sendToken = true) {
  query = scrubEmptyStrings(query);

  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
  };
  const accessToken = await auth.getAccessToken();
  if (sendToken) headers['authorization'] = `Bearer ${accessToken}`;

  if (Object.keys(query).length > 0) {
    const params = new URLSearchParams();
    for (let key in query) {
      params.set(key, query[key]);
    }
    path += '?' + params.toString();
  }

  const response = await fetch(path, { headers, method: 'get', credentials: 'include' });

  return await handleResponse(response);
}

async function post(path, body = {}, sendToken = true) {
  body = scrubEmptyStrings(body);

  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
  };
  const accessToken = await auth.getAccessToken();
  if (sendToken) headers['authorization'] = `Bearer ${accessToken}`;

  body = JSON.stringify(body);

  const response = await fetch(path, { headers, method: 'post', body, credentials: 'include' });

  return await handleResponse(response);
}

async function postBlob(path, body, sendToken = true) {
  const headers = {
    accept: 'application/json',
  };
  const accessToken = await auth.getAccessToken();
  if (sendToken) headers['authorization'] = `Bearer ${accessToken}`;

  const response = await fetch(path, { headers, method: 'post', body, credentials: 'include' });

  return await handleResponse(response);
}

async function put(path, body = {}, sendToken = true) {
  body = scrubEmptyStrings(body);

  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
  };
  const accessToken = await auth.getAccessToken();
  if (sendToken) headers['authorization'] = `Bearer ${accessToken}`;

  body = JSON.stringify(body);

  const response = await fetch(path, { headers, method: 'put', body, credentials: 'include' });

  return await handleResponse(response);
}

async function del(path, sendToken = true) {
  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
  };
  const accessToken = await auth.getAccessToken();
  if (sendToken) headers['authorization'] = `Bearer ${accessToken}`;

  const response = await fetch(path, { headers, method: 'delete', credentials: 'include' });

  return await handleResponse(response);
}

const directory = {
  boards: () => ({ path: `/api/boards`, props: {}, method: 'get' }),

  states: () => ({ path: `/api/states`, props: {}, method: 'get' }),

  user: {
    onLogin: () => ({ path: `/api/user/onLogin`, props: {}, method: 'get' }),

    mailouts: {
      list: (page = 1, limit = 1) => ({ path: `/api/user/mailout`, props: { page, limit }, method: 'get' }),

      get: mailoutId => ({ path: `/api/user/mailout/${mailoutId}?include_destinations=true`, props: {}, method: 'get' }),

      cancel: mailoutId => ({ path: `/api/user/mailout/${mailoutId}`, props: {}, method: 'del' }),

      approve: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/submit`, props: {}, method: 'post' }),

      needsUpdate: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/needsUpdate`, props: {}, method: 'get' }),

      regenerate: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/update`, props: {}, method: 'post' }),

      initialize: () => ({ path: `/api/user/listing/mailout/initial`, props: {}, method: 'post' }),
    },

    subscription: {
      get: () => ({ path: `/api/user/subscription`, props: {}, method: 'get' }),

      create: token => ({ path: `/api/user/mailout`, props: { chargify_token: token }, method: 'post' }),
    },

    profile: {
      get: () => ({ path: `/api/user/profile`, props: {}, method: 'get' }),

      save: payload => ({ path: `/api/user/profile`, props: payload, method: 'put' }),

      branding: {
        get: () => ({ path: `/api/user/profile/branding`, props: {}, method: 'get' }),

        save: payload => ({ path: `/api/user/profile/branding`, props: payload, method: 'put' }),

        logos: {
          get: () => ({ path: `/api/user/profile/branding/logos`, props: {}, method: 'get' }),
        },

        preview: {
          get: () => ({ path: `/api/user/profile/branding/preview`, props: {}, method: 'get' }),

          generate: () => ({ path: `/api/user/profile/branding/preview`, props: {}, method: 'post' }),
        },

        teamLogo: {
          set: file => {
            const formData = new FormData();
            formData.append('teamLogo', file);
            return { path: `/api/user/profile/branding/teamLogo`, props: formData, method: 'postBlob' };
          },
        },

        brokerageLogo: {
          set: file => {
            const formData = new FormData();
            formData.append('brokerageLogo', file);
            return { path: `/api/user/profile/branding/brokerageLogo`, props: formData, method: 'postBlob' };
          },
        },

        realtorPhoto: {
          set: file => {
            const formData = new FormData();
            formData.append('realtorPhoto', file);
            return { path: `/api/user/profile/branding/realtorPhoto`, props: formData, method: 'postBlob' };
          },
        },
      },

      automation: {
        get: () => ({ path: `/api/user/profile/automation`, props: {}, method: 'get' }),

        save: payload => ({ path: `/api/user/profile/automation`, props: {}, method: 'put' }),
      },
    },
  },
};

export default {
  get,
  post,
  postBlob,
  put,
  del,
  directory,
};
