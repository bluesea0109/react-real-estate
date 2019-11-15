import { all } from 'redux-saga/effects';

import { authSagas } from './modules/user/sagas';

// TODO: Automate the saga adding
// const req = require.context('.', true, /\.\/.+\/sagas\.js$/);

// const sagas = req.keys().map(key => req(key).default);

// console.log('sagas', sagas);

// // replace the current rootSaga generator
// export default function* rootSaga() {
//   yield all([sagas.map(saga => saga)]);
// }

// replace the current rootSaga generator
export default function* rootSaga() {
  yield all([authSagas()]);
}
