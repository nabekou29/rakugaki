import { AxiosError } from 'axios';
import { Remocon, Signal } from '../interfaces/entities';

/** Actionの種類 */
export enum RemoconActionTypes {
  CLOSE_ADD_DIALOG = 'REMOCON/CLOSE_ADD_DIALOG',
  INITIALIZE_START = 'REMOCON/INITIALIZE_START',
  INITIALIZE_SUCCEED = 'REMOCON/INITIALIZE_SUCCEED',
  INITIALIZE_FAIL = 'REMOCON/INITIALIZE_FAIL',
  SEND_SIGNAL_START = 'REMOCON/SEND_SIGNAL_START',
  SEND_SIGNAL_SUCCEED = 'REMOCON/SEND_SIGNAL_SUCCEED',
  SEND_SIGNAL_FAIL = 'REMOCON/SEND_SIGNAL_FAIL',
  RECEIVE_SIGNAL_START = 'REMOCON/RECEIVE_SIGNAL_START',
  RECEIVE_SIGNAL_SUCCEED = 'REMOCON/RECEIVE_SIGNAL_SUCCEED',
  RECEIVE_SIGNAL_FAIL = 'REMOCON/RECEIVE_SIGNAL_FAIL',
  REGISTER_SIGNAL_START = 'REMOCON/REGISTER_SIGNAL_START',
  REGISTER_SIGNAL_SUCCEED = 'REMOCON/REGISTER_SIGNAL_SUCCEED',
  REGISTER_SIGNAL_FAIL = 'REMOCON/REGISTER_SIGNAL_FAIL',
}

/** 追加ダイアログを閉じる */
export const closeAddDialog = () => ({
  type: RemoconActionTypes.CLOSE_ADD_DIALOG as typeof RemoconActionTypes.CLOSE_ADD_DIALOG,
});

/** 初期化のParams */
interface InitializeParams {
  remoconId: string;
}

/** 初期化のResult */
interface InitializeResult {
  remocon: Remocon;
  signals: Signal[];
}

/** 初期化 */
export const initialize = {
  start: (params: InitializeParams) => ({
    type: RemoconActionTypes.INITIALIZE_START as typeof RemoconActionTypes.INITIALIZE_START,
    payload: params,
  }),
  succeed: (params: InitializeParams, result: InitializeResult) => ({
    type: RemoconActionTypes.INITIALIZE_SUCCEED as typeof RemoconActionTypes.INITIALIZE_SUCCEED,
    payload: { params, result },
  }),
  fail: (params: InitializeParams, error: AxiosError) => ({
    type: RemoconActionTypes.INITIALIZE_FAIL as typeof RemoconActionTypes.INITIALIZE_FAIL,
    payload: { params, error },
  }),
};

/** 信号送信のParams */
interface SendSignalParams {
  signalId: string;
  minutes?: number;
}

/** 信号送信 */
export const sendSignal = {
  start: (params: SendSignalParams) => ({
    type: RemoconActionTypes.SEND_SIGNAL_START as typeof RemoconActionTypes.SEND_SIGNAL_START,
    payload: params,
  }),
  succeed: (params: SendSignalParams) => ({
    type: RemoconActionTypes.SEND_SIGNAL_SUCCEED as typeof RemoconActionTypes.SEND_SIGNAL_SUCCEED,
    payload: { params },
  }),
  fail: (params: SendSignalParams, error: AxiosError) => ({
    type: RemoconActionTypes.SEND_SIGNAL_FAIL as typeof RemoconActionTypes.SEND_SIGNAL_FAIL,
    payload: { params, error },
  }),
};

/** 信号受信のResult */
interface ReceiveSignalResult {
  code: number[];
}

/** 信号受信 */
export const receiveSignal = {
  start: () => ({
    type: RemoconActionTypes.RECEIVE_SIGNAL_START as typeof RemoconActionTypes.RECEIVE_SIGNAL_START,
    payload: {},
  }),
  succeed: (result: ReceiveSignalResult) => ({
    type: RemoconActionTypes.RECEIVE_SIGNAL_SUCCEED as typeof RemoconActionTypes.RECEIVE_SIGNAL_SUCCEED,
    payload: { result },
  }),
  fail: (error: AxiosError) => ({
    type: RemoconActionTypes.RECEIVE_SIGNAL_FAIL as typeof RemoconActionTypes.RECEIVE_SIGNAL_FAIL,
    payload: { error },
  }),
};

/** 信号の登録のParams */
interface RegisterSignalParams {
  remoconId: string;
  name: string;
  code: number[];
}

/** 信号の登録のResult */
interface RegisterSignalResult {
  signal: Signal;
}

/** 信号の登録 */
export const registerSignal = {
  start: (params: RegisterSignalParams) => ({
    type: RemoconActionTypes.REGISTER_SIGNAL_START as typeof RemoconActionTypes.REGISTER_SIGNAL_START,
    payload: params,
  }),
  succeed: (params: RegisterSignalParams, result: RegisterSignalResult) => ({
    type: RemoconActionTypes.REGISTER_SIGNAL_SUCCEED as typeof RemoconActionTypes.REGISTER_SIGNAL_SUCCEED,
    payload: { params, result },
  }),
  fail: (params: RegisterSignalParams, error: AxiosError) => ({
    type: RemoconActionTypes.REGISTER_SIGNAL_FAIL as typeof RemoconActionTypes.REGISTER_SIGNAL_FAIL,
    payload: { params, error },
  }),
};

/** アクション一覧 */
export type RemoconAction =
  | ReturnType<typeof closeAddDialog>
  | ReturnType<typeof initialize.start>
  | ReturnType<typeof initialize.succeed>
  | ReturnType<typeof initialize.fail>
  | ReturnType<typeof sendSignal.start>
  | ReturnType<typeof sendSignal.succeed>
  | ReturnType<typeof sendSignal.fail>
  | ReturnType<typeof receiveSignal.start>
  | ReturnType<typeof receiveSignal.succeed>
  | ReturnType<typeof receiveSignal.fail>
  | ReturnType<typeof registerSignal.start>
  | ReturnType<typeof registerSignal.succeed>
  | ReturnType<typeof registerSignal.fail>;
