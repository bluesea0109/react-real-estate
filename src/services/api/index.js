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

    if (error.message === 'jwt expired' || error.statusText === 'jwt expired') {
      return auth.signOut();
    }

    throw error;
  }
}

function scrubEmptyStrings(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      return value === '' || value === null ? undefined : value;
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
  stencils: mapper => ({ stencilPath: `/api/user/stencils/list/${mapper}`, stencilMethod: 'get' }),
  stencilsByTag: tag => ({
    stencilTagPath: `/api/user/stencils/byTag/${tag}`,
    stencilTagMethod: 'get',
  }),
  stencilsByIntent: (intentPath = '') => ({
    stencilIntentPath: `/api/user/stencils/byIntent${intentPath}`,
    stencilIntentMethod: 'get',
  }),
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
    postcard: {
      render: {
        listed: {
          front: ({ userId }) => ({
            path: `/api/user/${userId}/team/postcard/render/listed/html/front`,
            method: 'get',
          }),
          back: ({ userId }) => ({
            path: `/api/user/${userId}/team/postcard/render/listed/html/back`,
            method: 'get',
          }),
        },
        sold: {
          front: ({ userId }) => ({
            path: `/api/user/${userId}/team/postcard/render/sold/html/front`,
            method: 'get',
          }),
          back: ({ userId }) => ({
            path: `/api/user/${userId}/team/postcard/render/sold/html/back`,
            method: 'get',
          }),
        },
      },
    },
  },

  user: {
    content: () => ({ path: `/api/user/content/list`, method: 'get' }),
    contentByTag: tag => ({ path: `/api/user/content/list/tag/${tag}`, method: 'get' }),
    listing: {
      initial: () => ({
        path: `/api/user/listing/mailout/initial?removeUnsent=true&skipEmailNotification=true`,
        method: 'post',
      }),
      poll: () => ({ path: `/api/user/listing/mailout/initial/poll`, method: 'get' }),
    },
    mailout: {
      filteredList: (searchValue, filterValue, sortValue, peerId) => {
        const params = new URLSearchParams();
        if (searchValue) params.append('text', searchValue);
        if (filterValue) params.append('filter', filterValue);
        if (sortValue) params.append('sortBy', sortValue);
        let path = `/api/user/mailout/search?${params.toString()}`;
        if (peerId) path = `/api/user/peer/${peerId}/mailout/search?${params.toString()}`;
        return { path, method: 'get' };
      },
      list: () => ({ path: `/api/user/mailout`, method: 'get' }),
      get: mailoutId => ({
        path: `/api/user/mailout/${mailoutId}?include_destinations=true`,
        method: 'get',
      }),
      getStencilFields: (mailoutId, templateId) => ({
        path: `/api/user/mailout/${mailoutId}/edit/stencil/${templateId}/fields`,
        method: `get`,
      }),
      csv: ({ userId, mailoutId }) => ({ path: `/api/user/${userId}/mailout/${mailoutId}/csv` }),
      byMls: mlsNum => ({ path: `/api/user/mailout/byMls`, method: 'post' }),
      createGenericCampaign: campaign => ({ path: `/api/user/mailout/campaign`, method: 'post' }),
      edit: {
        get: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/edit`, method: 'get' }),
        update: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/edit`, method: 'put' }),
        revert: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/edit`, method: 'del' }),
        updateDisplayAgent: mailoutId => ({
          path: `/api/user/mailout/${mailoutId}/edit/mailoutDisplayAgent`,
          method: 'put',
        }),
      },
      mailoutSize: mailoutId => ({
        path: `/api/user/mailout/${mailoutId}/edit/mailoutSize`,
        method: 'put',
      }),
      mailoutName: mailoutId => ({
        path: `/api/user/mailout/${mailoutId}/edit/name`,
        method: 'put',
      }),
      stop: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/stop`, method: 'post' }),
      submit: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/submit`, method: 'post' }),
      changeAgent: (mailoutId, displayAgentUserId) => ({
        path: `/api/user/mailout/${mailoutId}/edit/mailoutDisplayAgent?peerId=${displayAgentUserId}`,
        method: 'get',
      }),
      render: {
        front: ({ userId, mailoutId }) => ({
          path: `/api/user/${userId}/mailout/${mailoutId}/render/preview/html/front`,
          method: 'get',
        }),
        back: ({ userId, mailoutId }) => ({
          path: `/api/user/${userId}/mailout/${mailoutId}/render/preview/html/back`,
          method: 'get',
        }),
      },
      ignored: () => ({ path: `/api/user/mailout/ignored`, method: 'get' }),
      archive: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/archive`, method: 'post' }),
      unarchive: mailoutId => ({ path: `/api/user/mailout/${mailoutId}/archive`, method: 'del' }),
      clone: mailoutId => ({
        path: `/api/user/mailout/clone/${mailoutId}`,
        method: 'post',
      }),
      createAd: () => ({
        path: `/api/user/ads/forge`,
        method: 'post',
      }),
    },
    customization: {
      get: () => ({ path: `/api/user/settings/branding`, method: 'get' }),
      save: () => ({ path: `/api/user/settings/branding`, method: 'put' }),
      generatePostcardPreview: () => ({ path: `/api/user/postcard/preview`, method: 'post' }),
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
      photoLibrary: {
        get: () => ({ path: `/api/user/library/photos/search?scope=global|team`, method: 'get' }),
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
    password: {
      reset: () => ({ path: `/api/user/settings/password/reset`, method: 'post' }),
    },
    postcard: {
      render: {
        listed: {
          front: ({ userId }) => ({
            path: `/api/user/${userId}/postcard/render/listed/html/front`,
            method: 'get',
          }),
          back: ({ userId }) => ({
            path: `/api/user/${userId}/postcard/render/listed/html/back`,
            method: 'get',
          }),
        },
        sold: {
          front: ({ userId }) => ({
            path: `/api/user/${userId}/postcard/render/sold/html/front`,
            method: 'get',
          }),
          back: ({ userId }) => ({
            path: `/api/user/${userId}/postcard/render/sold/html/back`,
            method: 'get',
          }),
        },
      },
    },
  },

  peer: {
    listing: {
      initial: peerId => ({
        path: `/api/user/peer/${peerId}/listing/mailout/initial?removeUnsent=true&skipEmailNotification=true`,
        method: 'post',
      }),
      poll: peerId => ({
        path: `/api/user/peer/${peerId}/listing/mailout/initial/poll`,
        method: 'get',
      }),
    },
    mailout: {
      list: peerId => ({ path: `/api/user/peer/${peerId}/mailout`, method: 'get' }),
      get: (mailoutId, peerId) => ({
        path: `/api/user/peer/${peerId}/mailout/${mailoutId}?include_destinations=true`,
        method: 'get',
      }),
      csv: (userId, mailoutId, peerId) => ({
        path: `/api/user/${userId}/peer/${peerId}/mailout/${mailoutId}/csv`,
      }),
      byMls: (mlsNum, peerId) => ({
        path: `/api/user/peer/${peerId}/mailout/byMls`,
        method: 'post',
      }),
      createPeerGenericCampaign: peerId => ({
        path: `/api/user/peer/${peerId}/mailout/campaign`,
        method: 'post',
      }),
      edit: {
        get: (mailoutId, peerId) => ({
          path: `/api/user/peer/${peerId}/mailout/${mailoutId}/edit`,
          method: 'get',
        }),
        update: (mailoutId, peerId) => ({
          path: `/api/user/peer/${peerId}/mailout/${mailoutId}/edit`,
          method: 'put',
        }),
        revert: (mailoutId, peerId) => ({
          path: `/api/user/peer/${peerId}/mailout/${mailoutId}/edit`,
          method: 'del',
        }),
        updateDisplayAgent: (mailoutId, peerId) => ({
          path: `/api/user/peer/${peerId}/mailout/${mailoutId}/edit/mailoutDisplayAgent`,
          method: 'put',
        }),
      },
      mailoutSize: (mailoutId, peerId) => ({
        path: `/api/user/peer/${peerId}/mailout/${mailoutId}/edit/mailoutSize`,
        method: 'put',
      }),
      mailoutName: (mailoutId, peerId) => ({
        path: `/api/user/peer/${peerId}/mailout/${mailoutId}/edit/name`,
        method: 'put',
      }),
      stop: (mailoutId, peerId) => ({
        path: `/api/user/peer/${peerId}/mailout/${mailoutId}/stop`,
        method: 'post',
      }),
      submit: (mailoutId, peerId) => ({
        path: `/api/user/peer/${peerId}/mailout/${mailoutId}/submit`,
        method: 'post',
      }),
      changeAgent: (mailoutId, peerId, displayAgentUserId) => ({
        path: `/api/user/peer/${peerId}/mailout/${mailoutId}/edit/mailoutDisplayAgent?peerId=${displayAgentUserId}`,
        method: 'get',
      }),
      render: {
        front: ({ userId, peerId, mailoutId }) => ({
          path: `/api/user/${userId}/peer/${peerId}/mailout/${mailoutId}/render/preview/html/front`,
          method: 'get',
        }),
        back: ({ userId, peerId, mailoutId }) => ({
          path: `/api/user/${userId}/peer/${peerId}/mailout/${mailoutId}/render/preview/html/back`,
          method: 'get',
        }),
      },
      ignored: peerId => ({ path: `/api/user/peer/${peerId}/mailout/ignored`, method: 'get' }),
      archive: (mailoutId, peerId) => ({
        path: `/api/user/peer/${peerId}/mailout/${mailoutId}/archive`,
        method: 'post',
      }),
      unarchive: (mailoutId, peerId) => ({
        path: `/api/user/peer/${peerId}/mailout/${mailoutId}/archive`,
        method: 'del',
      }),
      clone: (mailoutId, peerId) => ({
        path: `/api/user/peer/${peerId}/mailout/clone/${mailoutId}`,
        method: 'post',
      }),
      createAd: peerId => ({
        path: `/api/user/peer/${peerId}/ads/forge`,
        method: 'post',
      }),
    },
    customization: {
      get: peerId => ({ path: `/api/user/peer/${peerId}/settings/branding`, method: 'get' }),
      save: peerId => ({ path: `/api/user/peer/${peerId}/settings/branding`, method: 'put' }),
      generatePostcardPreview: peerId => ({
        path: `/api/user/peer/${peerId}/postcard/preview`,
        method: 'post',
      }),
    },
    profile: {
      get: peerId => ({ path: `/api/user/peer/${peerId}/settings/profile`, method: 'get' }),
      save: peerId => ({ path: `/api/user/peer/${peerId}/settings/profile`, method: 'put' }),
    },
    photos: {
      realtorPhoto: {
        get: peerId => ({
          path: `/api/user/peer/${peerId}/settings/photos/realtorPhoto`,
          method: 'get',
        }),
        set: peerId => ({
          path: `/api/user/peer/${peerId}/settings/photos/realtorPhoto`,
          method: 'postBlob',
        }),
      },
    },
    shortcode: {
      listed: {
        get: peerId => ({
          path: `/api/user/peer/${peerId}/settings/shortcode/listed/example`,
          method: 'get',
        }),
        save: peerId => ({
          path: `/api/user/peer/${peerId}/settings/shortcode/listed/example`,
          method: 'put',
        }),
      },
      sold: {
        get: peerId => ({
          path: `/api/user/peer/${peerId}/settings/shortcode/sold/example`,
          method: 'get',
        }),
        save: peerId => ({
          path: `/api/user/peer/${peerId}/settings/shortcode/sold/example`,
          method: 'put',
        }),
      },
    },
    password: {
      reset: peerId => ({
        path: `/api/user/peer/${peerId}/settings/password/reset`,
        method: 'post',
      }),
    },
    postcard: {
      render: {
        listed: {
          front: ({ userId, peerId }) => ({
            path: `/api/user/${userId}/peer/${peerId}/postcard/render/listed/html/front`,
            method: 'get',
          }),
          back: ({ userId, peerId }) => ({
            path: `/api/user/${userId}/peer/${peerId}/postcard/render/listed/html/back`,
            method: 'get',
          }),
        },
        sold: {
          front: ({ userId, peerId }) => ({
            path: `/api/user/${userId}/peer/${peerId}/postcard/render/sold/html/front`,
            method: 'get',
          }),
          back: ({ userId, peerId }) => ({
            path: `/api/user/${userId}/peer/${peerId}/postcard/render/sold/html/back`,
            method: 'get',
          }),
        },
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
  handleResponse,
};
