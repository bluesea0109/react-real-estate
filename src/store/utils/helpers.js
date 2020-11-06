export function createAction(type, payload) {
  return typeof payload === 'undefined' ? { type } : { type, payload };
}

export function createErrorAction(type, error) {
  return { type, error };
}

export function createErrorActionWithPayload(type, payload, error) {
  return { type, payload, error };
}

export function normalizeBoards(arr) {
  return Object.keys(arr).map((s, v) => ({
    key: arr[s].mlsId,
    mlsid: arr[s].mlsId,
    value: arr[s].mlsId,
    text: arr[s].name,
    name: arr[s].name,
    shortname: arr[s].shortName ? arr[s].shortName : undefined,
  }));
}

export function normalizeStates(obj) {
  return Object.keys(obj).map((s, v) => ({ key: s, text: obj[s], value: s }));
}
