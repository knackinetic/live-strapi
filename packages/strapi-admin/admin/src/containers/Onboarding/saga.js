import request from 'utils/request';
import { all, call, fork, takeLatest, put } from 'redux-saga/effects';

import { GET_VIDEOS } from './constants';
import { getVideosSucceeded } from './actions';

function* getVideos() {
  try {
    const data = yield call(request, 'https://strapi.io/videos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    false,
    true,
    { noAuth: true },
    );

    const storedVideo = JSON.parse(localStorage.getItem('videos')) || null;

    const videos = data.map(video => {
      const end = storedVideo ? storedVideo.find( v => v.order === video.order).end : false;
      const startTime = storedVideo ? storedVideo.find( v => v.order === video.order).startTime : 0;

      return {
        ...video,
        duration: null,
        end: end,
        isOpen: false,
        key: video.order,
        startTime: startTime,
      };
    }).sort((a,b) => (a.order - b.order));

    localStorage.setItem('videos', JSON.stringify(videos));

    yield put(
      getVideosSucceeded(videos),
    );
  } catch (err) {
    console.log(err); // eslint-disable-line no-console
  }
}

function* defaultSaga() {
  yield all([fork(takeLatest, GET_VIDEOS, getVideos)]);
}

export default defaultSaga;
