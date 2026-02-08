import { AxiosError } from 'axios';
import { Remocon } from '../interfaces/entities';

/** Actionの種類 */
export enum TopActionTypes {
  OPEN_ADD_DIALOG = 'TOP/OPEN_ADD_DIALOG',
  CLOSE_ADD_DIALOG = 'TOP/CLOSE_ADD_DIALOG',
  INITIALIZE_START = 'TOP/INITIALIZE_START',
  INITIALIZE_SUCCEED = 'TOP/INITIALIZE_SUCCEED',
  INITIALIZE_FAIL = 'TOP/INITIALIZE_FAIL',
  REGISTER_START = 'TOP/REGISTER_START',
  REGISTER_SUCCEED = 'TOP/REGISTER_SUCCEED',
  REGISTER_FAIL = 'TOP/REGISTER_FAIL',
  DISCARD_START = 'TOP/DISCARD_START',
  DISCARD_SUCCEED = 'TOP/DISCARD_SUCCEED',
  DISCARD_FAIL = 'TOP/DISCARD_FAIL',
}

/** 追加ダイアログを開く */
export const openAddDialog = () => ({
  type: TopActionTypes.OPEN_ADD_DIALOG as typeof TopActionTypes.OPEN_ADD_DIALOG,
});

/** 追加ダイアログを閉じる */
export const closeAddDialog = () => ({
  type: TopActionTypes.CLOSE_ADD_DIALOG as typeof TopActionTypes.CLOSE_ADD_DIALOG,
});

/** 初期化のResult */
interface InitializeResult {
  remocons: Remocon[];
}

/** 初期化 */
export const initialize = {
  start: () => ({
    type: TopActionTypes.INITIALIZE_START as typeof TopActionTypes.INITIALIZE_START,
  }),
  succeed: (result: InitializeResult) => ({
    type: TopActionTypes.INITIALIZE_SUCCEED as typeof TopActionTypes.INITIALIZE_SUCCEED,
    payload: { result },
  }),
  fail: (error: AxiosError) => ({
    type: TopActionTypes.INITIALIZE_FAIL as typeof TopActionTypes.INITIALIZE_FAIL,
    payload: { error },
  }),
};

/** 登録のPrams */
interface RegisterParams {
  name: string;
}

/** 登録のResult */
interface RegisterResult {
  remocon: Remocon;
}

/** 登録 */
export const register = {
  start: (params: RegisterParams) => ({
    type: TopActionTypes.REGISTER_START as typeof TopActionTypes.REGISTER_START,
    payload: params,
  }),
  succeed: (params: RegisterParams, result: RegisterResult) => ({
    type: TopActionTypes.REGISTER_SUCCEED as typeof TopActionTypes.REGISTER_SUCCEED,
    payload: { params, result },
  }),
  fail: (params: RegisterParams, error: AxiosError) => ({
    type: TopActionTypes.REGISTER_FAIL as typeof TopActionTypes.REGISTER_FAIL,
    payload: { params, error },
  }),
};

/** 削除のPrams */
interface DiscardParams {
  id: string;
}

/** 削除 */
export const discard = {
  start: (params: DiscardParams) => ({
    type: TopActionTypes.DISCARD_START as typeof TopActionTypes.DISCARD_START,
    payload: params,
  }),
  succeed: (params: DiscardParams) => ({
    type: TopActionTypes.DISCARD_SUCCEED as typeof TopActionTypes.DISCARD_SUCCEED,
    payload: { params },
  }),
  fail: (params: DiscardParams, error: AxiosError) => ({
    type: TopActionTypes.DISCARD_FAIL as typeof TopActionTypes.DISCARD_FAIL,
    payload: { params, error },
  }),
};

/** アクション一覧 */
export type TopAction =
  | ReturnType<typeof openAddDialog>
  | ReturnType<typeof closeAddDialog>
  | ReturnType<typeof initialize.start>
  | ReturnType<typeof initialize.succeed>
  | ReturnType<typeof initialize.fail>
  | ReturnType<typeof register.start>
  | ReturnType<typeof register.succeed>
  | ReturnType<typeof register.fail>
  | ReturnType<typeof discard.start>
  | ReturnType<typeof discard.succeed>
  | ReturnType<typeof discard.fail>;
