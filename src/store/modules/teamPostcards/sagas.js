import { call, delay, put, race, take } from 'redux-saga/effects';

import {
  GENERATE_TEAM_POSTCARDS_PREVIEW_PENDING,
  GENERATE_TEAM_POSTCARDS_PREVIEW_SUCCESS,
  GENERATE_TEAM_POSTCARDS_PREVIEW_ERROR,
  generateTeamPostcardsPreviewError,
  generateTeamPostcardsPreviewSuccess,
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

export function* getTeamPostcardsPreviewSaga() {
  while (true) {
    try {
      const { path, method } = ApiService.directory.onboard.teamCustomization.generatePostcardPreview();
      const response = yield call(ApiService[method], path);

      let listedFrontLarge = { height: 0, width: 0 };
      let listedBackLarge = { height: 0, width: 0 };
      let soldFrontLarge = { height: 0, width: 0 };
      let soldBackLarge = { height: 0, width: 0 };

      try {
        listedFrontLarge = yield getDimensions({ url: response.listed.sampleFrontLargeUrl });
      } catch (err) {
        console.log('Error @ getTeamPostcardsPreviewSaga on listedFrontLarge');
        console.error(err.message);
      }

      try {
        listedBackLarge = yield getDimensions({ url: response.listed.sampleBackLargeUrl });
      } catch (err) {
        console.log('Error @ getTeamPostcardsPreviewSaga on listedBackLarge');
        console.error(err.message);
      }

      try {
        soldFrontLarge = yield getDimensions({ url: response.sold.sampleFrontLargeUrl });
      } catch (err) {
        console.log('Error @ getTeamPostcardsPreviewSaga on soldFrontLarge');
        console.error(err.message);
      }

      try {
        soldBackLarge = yield getDimensions({ url: response.sold.sampleBackLargeUrl });
      } catch (err) {
        console.log('Error @ getTeamPostcardsPreviewSaga on soldBackLarge');
        console.error(err.message);
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
        yield put(generateTeamPostcardsPreviewSuccess(response));
      } else {
        console.log('listedFrontLarge', listedFrontLarge);
        console.log('listedBackLarge', listedBackLarge);
        console.log('soldFrontLarge', soldFrontLarge);
        console.log('soldBackLarge', soldBackLarge);

        yield delay(1000);
      }
    } catch (err) {
      console.log('Error @ getTeamPostcardsPreviewSaga on Main loop');
      console.error(err.message);
      yield put(generateTeamPostcardsPreviewError(err.message));
    }
  }
}

export default function*() {
  while (true) {
    yield take(GENERATE_TEAM_POSTCARDS_PREVIEW_PENDING);
    yield race([call(getTeamPostcardsPreviewSaga), take(GENERATE_TEAM_POSTCARDS_PREVIEW_ERROR), take(GENERATE_TEAM_POSTCARDS_PREVIEW_SUCCESS)]);
  }
}
