import 'isomorphic-unfetch';

import { all } from 'redux-saga/effects';
import es6promise from 'es6-promise';
import remoconSaga from './remocon';
import topSaga from './top';

es6promise.polyfill();

/** ルートのSaga */
function* rootSaga() {
  yield all([topSaga(), remoconSaga()]);
}

export default rootSaga;
