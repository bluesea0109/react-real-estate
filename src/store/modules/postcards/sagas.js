import { call, delay, put, race, take } from 'redux-saga/effects';

import {
  GENERATE_POSTCARDS_PREVIEW_PENDING,
  GENERATE_POSTCARDS_PREVIEW_SUCCESS,
  GENERATE_POSTCARDS_PREVIEW_ERROR,
  generatePostcardsPreviewSuccess,
  generatePostcardsPreviewError,
} from './actions';
import ApiService from '../../../services/api/index';
import { select } from '@redux-saga/core/effects';

const getDimensions = ({ url }) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve({ height: img.height, width: img.width, url });
    img.onerror = reject;
    img.src = url;
  });
};

export const getSelectedPeerId = state => state.peer.peerId;

export function* getPostcardsPreviewSaga() {
  while (true) {
    try {
      const peerId = yield select(getSelectedPeerId);

      const { path, method } = peerId
        ? ApiService.directory.peer.customization.generatePostcardPreview(peerId)
        : ApiService.directory.user.customization.generatePostcardPreview();

      const response = yield call(ApiService[method], path);

      let listedFrontLarge = { height: 0, width: 0 };
      let listedBackLarge = { height: 0, width: 0 };
      let soldFrontLarge = { height: 0, width: 0 };
      let soldBackLarge = { height: 0, width: 0 };

      try {
        listedFrontLarge = yield getDimensions({ url: response.listed.sampleFrontLargeUrl });
      } catch (err) {
        console.log('Error @ getPostcardsPreviewSaga on listedFrontLarge');
        console.error(err);
      }

      try {
        listedBackLarge = yield getDimensions({ url: response.listed.sampleBackLargeUrl });
      } catch (err) {
        console.log('Error @ getPostcardsPreviewSaga on listedBackLarge');
        console.error(err);
      }

      try {
        soldFrontLarge = yield getDimensions({ url: response.sold.sampleFrontLargeUrl });
      } catch (err) {
        console.log('Error @ getPostcardsPreviewSaga on soldFrontLarge');
        console.error(err);
      }

      try {
        soldBackLarge = yield getDimensions({ url: response.sold.sampleBackLargeUrl });
      } catch (err) {
        console.log('Error @ getPostcardsPreviewSaga on soldBackLarge');
        console.error(err);
      }

      if (
        listedFrontLarge.height > 0 &&
        listedFrontLarge.width > 0 &&
        listedBackLarge.height > 0 &&
        listedBackLarge.width > 0 &&
        soldFrontLarge.height > 0 &&
        soldFrontLarge.width > 0 &&
        soldBackLarge.height > 0 &&
        soldBackLarge.width > 0
      ) {
        yield put(generatePostcardsPreviewSuccess(response));
      } else {
        console.log('listedFrontLarge', listedFrontLarge);
        console.log('listedBackLarge', listedBackLarge);
        console.log('soldFrontLarge', soldFrontLarge);
        console.log('soldBackLarge', soldBackLarge);

        yield delay(1000);
      }
    } catch (err) {
      console.log('Error @ getPostcardsPreviewSaga on Main loop');
      console.error(err);
      yield put(generatePostcardsPreviewError(err));
    }
  }
}

export default function*() {
  while (true) {
    yield take(GENERATE_POSTCARDS_PREVIEW_PENDING);
    yield race([call(getPostcardsPreviewSaga), take(GENERATE_POSTCARDS_PREVIEW_ERROR), take(GENERATE_POSTCARDS_PREVIEW_SUCCESS)]);
  }
}
