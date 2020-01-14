import { call, delay, put, race, take } from 'redux-saga/effects';

import {
  GENERATE_POSTCARDS_PREVIEW_PENDING,
  GENERATE_POSTCARDS_PREVIEW_SUCCESS,
  GENERATE_POSTCARDS_PREVIEW_ERROR,
  generatePostcardsPreviewSuccess,
  generatePostcardsPreviewError,
} from './actions';
import ApiService from '../../../services/api/index';

const getDimensions = ({ url }) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve({ height: img.height, width: img.width, url });
    img.onerror = reject;
    img.src = url;
  });
};

export function* getPostcardsPreviewSaga() {
  while (true) {
    try {
      const { path, method } = ApiService.directory.onboard.customization.generatePostcardPreview();
      const response = yield call(ApiService[method], path);

      const listedFrontLarge = yield getDimensions({ url: response.listed.sampleFrontLargeUrl });
      const listedBackLarge = yield getDimensions({ url: response.listed.sampleBackLargeUrl });
      const soldFrontLarge = yield getDimensions({ url: response.sold.sampleFrontLargeUrl });
      const soldBackLarge = yield getDimensions({ url: response.sold.sampleBackLargeUrl });

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
      console.log('getPostcardsPreviewSaga');
      console.error(err);
      yield put(generatePostcardsPreviewError(err.message));
    }
  }
}

export default function*() {
  while (true) {
    yield take(GENERATE_POSTCARDS_PREVIEW_PENDING);
    yield race([call(getPostcardsPreviewSaga), take(GENERATE_POSTCARDS_PREVIEW_ERROR), take(GENERATE_POSTCARDS_PREVIEW_SUCCESS)]);
  }
}
