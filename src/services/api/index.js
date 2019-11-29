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
  boards: () => ({ path: `/api/boards`, method: 'get' }),
  states: () => ({ path: `/api/states`, method: 'get' }),

  user: {
    onLogin: () => ({ path: `/api/user/onLogin`, method: 'get' }),

    team: {
      list: () => ({ path: `/api/user/team/list`, method: 'get' }),
      settings: {
        branding: {
          get: () => ({ path: `/api/user/team/settings/branding`, method: 'get' }),
          save: () => ({ path: `/api/user/team/settings/branding`, method: 'put' }),
        },
        photos: {
          brokerageLogo: {
            set: () => ({ path: `/api/user/team/settings/photos/brokerageLogo`, method: 'post' }),
            delete: () => ({ path: `/api/user/team/settings/photos/brokerageLogo`, method: 'delete' }),
          },
          teamLogo: {
            set: () => ({ path: `/api/user/team/settings/photos/teamLogo`, method: 'post' }),
            delete: () => ({ path: `/api/user/team/settings/photos/teamLogo`, method: 'delete' }),
          },
        },
        profile: {
          get: () => ({ path: `/api/user/team/settings/profile`, method: 'get' }),
          save: () => ({ path: `/api/user/team/settings/profile`, method: 'put' }),
        },
      },
    },

    settings: {
      branding: {
        get: () => ({ path: `/api/user/settings/branding`, method: 'get' }),
        save: () => ({ path: `/api/user/settings/branding`, method: 'put' }),
      },
      photos: {
        get: () => ({ path: `/api/user/settings/photos/realtorPhoto`, method: 'get' }),
        set: () => ({ path: `/api/user/settings/photos/realtorPhoto`, method: 'post' }),
        setUrl: url => ({ path: `/api/user/settings/photos/realtorPhoto/${url}`, method: 'post' }),
      },
      profile: {
        get: () => ({ path: `/api/user/settings/profile`, method: 'get' }),
        save: () => ({ path: `/api/user/settings/profile`, method: 'put' }),
      },
    },

    peer: {
      settings: {
        branding: {
          get: peerId => ({ path: `/api/user/peer/${peerId}/settings/branding`, method: 'get' }),
          save: peerId => ({ path: `/api/user/peer/${peerId}/settings/branding`, method: 'put' }),
        },
        photos: {
          get: peerId => ({ path: `/api/user/peer/${peerId}/settings/photos/realtorPhoto`, method: 'get' }),
          set: peerId => ({ path: `/api/user/peer/${peerId}/settings/photos/realtorPhoto`, method: 'post' }),
        },
        profile: {
          get: peerId => ({ path: `/api/user/peer/${peerId}/settings/profile`, method: 'get' }),
          save: peerId => ({ path: `/api/user/peer/${peerId}/settings/profile`, method: 'put' }),
        },
      },
    },

    mailouts: {
      list: () => ({ path: `/api/user/mailout`, method: 'get' }),
      get: mailoutId => ({ path: `/api/user/mailout/${mailoutId}?include_destinations=true`, method: 'get' }),
      cancel: mailoutId => ({ path: `/api/user/mailout/${mailoutId}`, method: 'del' }),
      approve: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/submit`, method: 'post' }),
      needsUpdate: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/needsUpdate`, method: 'get' }),
      regenerate: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/update`, method: 'post' }),
      initialize: () => ({ path: `/api/user/listing/mailout/initial`, method: 'post' }),
    },

    subscription: {
      get: () => ({ path: `/api/user/subscription`, method: 'get' }),
      create: token => ({ path: `/api/user/mailout`, props: { chargify_token: token }, method: 'post' }),
    },

    profile: {
      get: () => ({ path: `/api/user/profile`, method: 'get' }),
      save: payload => ({ path: `/api/user/profile`, props: payload, method: 'put' }),

      branding: {
        get: () => ({ path: `/api/user/profile/branding`, method: 'get' }),
        save: payload => ({ path: `/api/user/profile/branding`, props: payload, method: 'put' }),

        logos: {
          get: () => ({ path: `/api/user/profile/branding/logos`, method: 'get' }),
        },

        preview: {
          get: () => ({ path: `/api/user/profile/branding/preview`, method: 'get' }),
          generate: () => ({ path: `/api/user/profile/branding/preview`, method: 'post' }),
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
        get: () => ({ path: `/api/user/profile/automation`, method: 'get' }),
        save: payload => ({ path: `/api/user/profile/automation`, props: payload, method: 'put' }),
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
