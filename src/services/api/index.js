import auth from '../auth';

async function handleResponse(response) {
  const { url, ok } = response;

  if (ok) {
    try {
      const data = await response.json();
      return data;
    } catch (e) {
      throw new Error('404 Not Found');
    }
  } else {
    let error;

    try {
      error = await response.json();
    } catch (e) {
      error = {};
      error.ok = response.ok;
      error.url = response.url;
      error.status = response.status;
      error.statusText = response.statusText;
      error.message = `${error.status} ${error.statusText}`;
    }

    if (!error.url) error.url = url;
    if (!error.message) error.message = `${response.status} ${response.statusText}`;

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
  onLogin: () => ({ path: `/api/user/onLogin`, method: 'get' }),
  templates: () => ({ path: `/api/templates`, method: 'get' }),

  team: {
    list: () => ({ path: `/api/user/team/list`, method: 'get' }),
    sync: () => ({ path: `/api/user/team/settings/brivity/sync`, method: 'post' }),
    listing: {
      initial: () => ({ path: `/api/user/team/listing/mailout/initial`, method: 'post' }),
      poll: () => ({ path: `/api/user/team/listing/mailout/initial/poll`, method: 'get' }),
    },
    customization: {
      get: () => ({ path: `/api/user/team/settings/branding`, method: 'get' }),
      save: () => ({ path: `/api/user/team/settings/branding`, method: 'put' }),
    },
    profile: {
      get: () => ({ path: `/api/user/team/settings/profile`, method: 'get' }),
      save: () => ({ path: `/api/user/team/settings/profile`, method: 'put' }),
    },
  },

  user: {
    listing: {
      initial: () => ({ path: `/api/user/listing/mailout/initial?removeUnsent=true&skipEmailNotification=true`, method: 'post' }),
      poll: () => ({ path: `/api/user/listing/mailout/initial/poll`, method: 'get' }),
    },
    mailout: {
      list: () => ({ path: `/api/user/mailout`, method: 'get' }),
      get: mailoutId => ({ path: `/api/user/mailout/${mailoutId}?include_destinations=true`, method: 'get' }),
      edit: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/edit`, method: 'put' }),
      mailoutSize: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/edit/mailoutSize`, method: 'put' }),
      stop: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/stop`, method: 'post' }),
      submit: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/submit`, method: 'post' }),
      needsUpdate: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/needsUpdate`, method: 'get' }),
      update: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/update`, method: 'post' }),
    },
    customization: {
      get: () => ({ path: `/api/user/settings/branding`, method: 'get' }),
      save: () => ({ path: `/api/user/settings/branding`, method: 'put' }),
    },
    profile: {
      get: () => ({ path: `/api/user/settings/profile`, method: 'get' }),
      save: () => ({ path: `/api/user/settings/profile`, method: 'put' }),
    },
    photos: {
      realtorPhoto: {
        get: () => ({ path: `/api/user/settings/photos/realtorPhoto`, method: 'get' }),
        set: () => ({ path: `/api/user/settings/photos/realtorPhoto`, method: 'postBlob' }),
      },
    },
    shortcode: {
      listed: {
        get: () => ({ path: `/api/user/settings/shortcode/listed/example`, method: 'get' }),
        save: () => ({ path: `/api/user/settings/shortcode/listed/example`, method: 'put' }),
      },
      sold: {
        get: () => ({ path: `/api/user/settings/shortcode/sold/example`, method: 'get' }),
        save: () => ({ path: `/api/user/settings/shortcode/sold/example`, method: 'put' }),
      },
    },
  },

  peer: {
    listing: {
      initial: peerId => ({ path: `/api/user/peer/${peerId}/listing/mailout/initial?removeUnsent=true&skipEmailNotification=true`, method: 'post' }),
      poll: peerId => ({ path: `/api/user/peer/${peerId}/listing/mailout/initial/poll`, method: 'get' }),
    },
    mailout: {
      list: peerId => ({ path: `/api/user/peer/${peerId}/mailout`, method: 'get' }),
      get: (mailoutId, peerId) => ({ path: `/api/user/peer/${peerId}/mailout/${mailoutId}?include_destinations=true`, method: 'get' }),
      edit: (mailoutId, peerId) => ({ path: `/api/user/peer/${peerId}/mailout/${mailoutId}/edit`, method: 'put' }),
      mailoutSize: (mailoutId, peerId) => ({ path: `/api/user/peer/${peerId}/mailout/${mailoutId}/edit/mailoutSize`, method: 'put' }),
      stop: (mailoutId, peerId) => ({ path: `/api/user/peer/${peerId}/mailout/${mailoutId}/stop`, method: 'post' }),
      submit: (mailoutId, peerId) => ({ path: `/api/user/peer/${peerId}/mailout/${mailoutId}/submit`, method: 'post' }),
      needsUpdate: (mailoutId, peerId) => ({ path: `/api/user/peer/${peerId}/mailout/${mailoutId}/needsUpdate`, method: 'get' }),
      update: (mailoutId, peerId) => ({ path: `/api/user/peer/${peerId}/mailout/${mailoutId}/update`, method: 'post' }),
    },
    customization: {
      get: peerId => ({ path: `/api/user/peer/${peerId}/settings/branding`, method: 'get' }),
      save: peerId => ({ path: `/api/user/peer/${peerId}/settings/branding`, method: 'put' }),
    },
    profile: {
      get: peerId => ({ path: `/api/user/peer/${peerId}/settings/profile`, method: 'get' }),
      save: peerId => ({ path: `/api/user/peer/${peerId}/settings/profile`, method: 'put' }),
    },
    photos: {
      realtorPhoto: {
        get: peerId => ({ path: `/api/user/peer/${peerId}/settings/photos/realtorPhoto`, method: 'get' }),
        set: peerId => ({ path: `/api/user/peer/${peerId}/settings/photos/realtorPhoto`, method: 'postBlob' }),
      },
    },
    shortcode: {
      listed: {
        get: peerId => ({ path: `/api/user/peer/${peerId}/settings/shortcode/listed/example`, method: 'get' }),
        save: peerId => ({ path: `/api/user/peer/${peerId}/settings/shortcode/listed/example`, method: 'put' }),
      },
      sold: {
        get: peerId => ({ path: `/api/user/peer/${peerId}/settings/shortcode/sold/example`, method: 'get' }),
        save: peerId => ({ path: `/api/user/peer/${peerId}/settings/shortcode/sold/example`, method: 'put' }),
      },
    },
  },

  /* TODO: Clean onboarding section at some point */
  onboard: {
    fillInYourProfile: {
      profile: {
        save: () => ({ path: `/api/user/settings/profile`, method: 'put' }),
      },
      teamProfile: {
        save: () => ({ path: `/api/user/team/settings/profile`, method: 'put' }),
      },
      photos: {
        brokerageLogo: {
          set: () => ({ path: `/api/user/team/settings/photos/brokerageLogo`, method: 'postBlob' }),
        },
        teamLogo: {
          set: () => ({ path: `/api/user/team/settings/photos/teamLogo`, method: 'postBlob' }),
          delete: () => ({ path: `/api/user/team/settings/photos/teamLogo`, method: 'del' }),
        },
      },
    },
    teamCustomization: {
      get: () => ({ path: `/api/user/team/settings/branding`, method: 'get' }),
      save: () => ({ path: `/api/user/team/settings/branding`, method: 'put' }),
      shortcode: {
        listed: {
          get: () => ({ path: `/api/user/team/settings/shortcode/listed/example`, method: 'get' }),
          save: () => ({ path: `/api/user/team/settings/shortcode/listed/example`, method: 'put' }),
        },
        sold: {
          get: () => ({ path: `/api/user/team/settings/shortcode/sold/example`, method: 'get' }),
          save: () => ({ path: `/api/user/team/settings/shortcode/sold/example`, method: 'put' }),
        },
      },
      generatePostcardPreview: () => ({ path: `/api/user/team/postcard/preview`, method: 'post' }),
    },
    customization: {
      get: () => ({ path: `/api/user/settings/branding`, method: 'get' }),
      save: () => ({ path: `/api/user/settings/branding`, method: 'put' }),
      shortcode: {
        listed: {
          get: () => ({ path: `/api/user/settings/shortcode/listed/example`, method: 'get' }),
          save: () => ({ path: `/api/user/settings/shortcode/listed/example`, method: 'put' }),
        },
        sold: {
          get: () => ({ path: `/api/user/settings/shortcode/sold/example`, method: 'get' }),
          save: () => ({ path: `/api/user/settings/shortcode/sold/example`, method: 'put' }),
        },
      },
      generatePostcardPreview: () => ({ path: `/api/user/postcard/preview`, method: 'post' }),
    },
    inviteUsers: {
      send: () => ({ path: `/api/user/peer/invite`, method: 'post' }),
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
