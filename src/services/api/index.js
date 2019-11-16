import auth from '../auth';

const apiPath = '';

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

  try {
    path = apiPath + path;

    if (Object.keys(query).length > 0) {
      const params = new URLSearchParams();
      for (let key in query) {
        params.set(key, query[key]);
      }
      path += '?' + params.toString();
    }

    const response = await fetch(path, { headers, method: 'get', credentials: 'include' });
    const data = await response.json();

    return data;
  } catch (err) {
    return { error: err };
  }
}

async function post(path, body = {}, sendToken = true) {
  body = scrubEmptyStrings(body);

  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
  };
  const accessToken = await auth.getAccessToken();
  if (sendToken) headers['authorization'] = `Bearer ${accessToken}`;

  try {
    path = apiPath + path;
    body = JSON.stringify(body);

    const response = await fetch(path, { headers, method: 'post', body, credentials: 'include' });
    const data = await response.json();

    return data;
  } catch (err) {
    return { error: err };
  }
}

async function postBlob(path, body, sendToken = true) {
  const headers = {
    accept: 'application/json',
  };
  const accessToken = await auth.getAccessToken();
  if (sendToken) headers['authorization'] = `Bearer ${accessToken}`;

  try {
    path = apiPath + path;

    const response = await fetch(path, { headers, method: 'post', body, credentials: 'include' });
    const data = await response.json();

    return data;
  } catch (err) {
    return { error: err };
  }
}

async function put(path, body = {}, sendToken = true) {
  body = scrubEmptyStrings(body);

  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
  };
  const accessToken = await auth.getAccessToken();
  if (sendToken) headers['authorization'] = `Bearer ${accessToken}`;

  try {
    path = apiPath + path;
    body = JSON.stringify(body);

    const response = await fetch(path, { headers, method: 'put', body, credentials: 'include' });
    const data = await response.json();

    return data;
  } catch (err) {
    return { error: err };
  }
}

async function del(path, sendToken = true) {
  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
  };
  const accessToken = await auth.getAccessToken();
  if (sendToken) headers['authorization'] = `Bearer ${accessToken}`;

  try {
    path = apiPath + path;

    const response = await fetch(path, { headers, method: 'delete', credentials: 'include' });
    const data = await response.json();

    return data;
  } catch (err) {
    return { errors: [err.stack] };
  }
}

export default {
  boards: {
    async get() {
      const response = await get(`/api/boards`);
      return response;
    },
  },

  states: {
    async get() {
      const response = await get(`/api/states`);
      return response;
    },
  },

  user: {
    mailouts: {
      async list(page = 1, limit = 100) {
        const response = await get(`/api/user/mailout`, { page, limit });
        return response;
      },

      async get(mailoutId) {
        const response = await get(`/api/user/mailout/${mailoutId}?include_destinations=true`);
        return response;
      },

      async cancel(mailoutId) {
        const response = await del(`/api/user/mailout/${mailoutId}`);
        return response;
      },

      async approve(mailoutId) {
        const response = await post(`/api/user/mailout/${mailoutId}/submit`);
        return response;
      },
      async needsUpdate(mailoutId) {
        const response = await get(`/api/user/mailout/${mailoutId}/needsUpdate`);
        return response;
      },
      async regenerate(mailoutId) {
        const response = await post(`/api/user/mailout/${mailoutId}/update`);
        return response;
      },
      async initialize() {
        const response = await post(`/api/user/listing/mailout/initial`);
        return response;
      },
    },

    subscription: {
      async get() {
        const response = await get(`/api/user/subscription`);
        return response;
      },

      async create(token) {
        const response = await post(`/api/user/subscription`, {
          chargify_token: token,
        });
        return response;
      },
    },

    profile: {
      async get() {
        const response = await get(`/api/user/profile`);
        return response;
      },

      async save(payload) {
        //payload = payload || store.state.user.profile
        const response = await put(`/api/user/profile`, payload);

        return response;
      },

      branding: {
        async get() {
          const response = await get(`/api/user/profile/branding`);
          return response;
        },

        async save(payload) {
          //payload = payload || store.state.user.branding
          const response = await put(`/api/user/profile/branding`, payload);
          return response;
        },

        logos: {
          async get() {
            const response = await get(`/api/user/profile/branding/logos`);
            return response;
          },
        },

        preview: {
          async get() {
            const response = await get(`/api/user/profile/branding/preview`);
            return response;
          },

          async generate() {
            const response = await post(`/api/user/profile/branding/preview`);
            return response;
          },
        },

        teamLogo: {
          async set(file) {
            const formData = new FormData();
            formData.append('teamLogo', file);
            const response = await postBlob(`/api/user/profile/branding/teamLogo`, formData);
            return response;
          },
        },

        brokerageLogo: {
          async set(file) {
            const formData = new FormData();
            formData.append('brokerageLogo', file);
            const response = await postBlob(`/api/user/profile/branding/brokerageLogo`, formData);
            return response;
          },
        },

        realtorPhoto: {
          async set(file) {
            const formData = new FormData();
            formData.append('realtorPhoto', file);
            const response = await postBlob(`/api/user/profile/branding/realtorPhoto`, formData);
            return response;
          },
        },
      },

      automation: {
        async get() {
          const response = await get(`/api/user/profile/automation`);
          return response;
        },

        async save(payload) {
          //payload = payload || store.state.user.automation
          const response = await put(`/api/user/profile/automation`, payload);
          return response;
        },
      },
    },
  },
};
