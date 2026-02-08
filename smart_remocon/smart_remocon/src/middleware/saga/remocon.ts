import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as api from '../../api';

import {
  RemoconActionTypes,
  initialize,
  receiveSignal,
  registerSignal,
  sendSignal,
} from '../../actions/remocon';

import { Signal } from '../../interfaces/entities';

/** 初期化 */
function* runInitialization(action: ReturnType<typeof initialize.start>) {
  try {
    const { remoconId } = action.payload;
    const { remocon, signals } = yield call(() =>
      api.findRemoconAndSignals(remoconId)
    );
    yield put(initialize.succeed(action.payload, { remocon, signals }));
  } catch (error) {
    yield put(initialize.fail(action.payload, error));
  }
}

/** 信号送信 */
function* runSendingSignal(action: ReturnType<typeof sendSignal.start>) {
  try {
    const { signalId, minutes } = action.payload;
    yield call(() => api.sendSignal(signalId, minutes || 0));
    yield put(sendSignal.succeed(action.payload));
  } catch (error) {
    yield put(sendSignal.fail(action.payload, error));
  }
}

/** 信号受信 */
function* runReceivingSignal(action: ReturnType<typeof receiveSignal.start>) {
  try {
    const code: number[] = yield call(() => api.receiveSignal());
    yield put(receiveSignal.succeed({ code }));
  } catch (error) {
    yield put(receiveSignal.fail(error));
  }
}

/** 信号登録 */
function* runRegistrationSignal(
  action: ReturnType<typeof registerSignal.start>
) {
  try {
    const { remoconId, name, code } = action.payload;
    const signal: Signal = yield call(() =>
      api.createSignal(remoconId, name, code)
    );
    yield put(registerSignal.succeed(action.payload, { signal }));
  } catch (error) {
    yield put(registerSignal.fail(action.payload, error));
  }
}

export default function* remoconSaga() {
  yield all([
    takeLatest(RemoconActionTypes.INITIALIZE_START, runInitialization),
    takeEvery(RemoconActionTypes.SEND_SIGNAL_START, runSendingSignal),
    takeEvery(RemoconActionTypes.RECEIVE_SIGNAL_START, runReceivingSignal),
    takeEvery(RemoconActionTypes.REGISTER_SIGNAL_START, runRegistrationSignal),
  ]);
}
