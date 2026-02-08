import { AxiosError } from 'axios';
import { Remocon, Signal } from '../interfaces/entities';
import {
  RemoconAction,
  RemoconActionTypes as actionTypes,
} from '../actions/remocon';

/** State */
export interface RemoconState {
  remocon?: Remocon;
  signals: Signal[];
  receivedCode?: number[];
  isLoading: boolean;
  isWaitingSignal: boolean;
  isOpenAddDialog: boolean;
  error?: AxiosError;
}

/** 初期値 */
export const initialState: RemoconState = {
  signals: [],
  isLoading: false,
  isWaitingSignal: false,
  isOpenAddDialog: false,
};

/** Reducer */
export const remoconReducer = (
  state = initialState,
  action: RemoconAction
): RemoconState => {
  switch (action.type) {
    case actionTypes.CLOSE_ADD_DIALOG: {
      return {
        ...state,
        isOpenAddDialog: false,
      };
    }
    case actionTypes.INITIALIZE_START: {
      return {
        ...initialState,
        isLoading: true,
      };
    }
    case actionTypes.SEND_SIGNAL_START: {
      return { ...state };
    }
    case actionTypes.RECEIVE_SIGNAL_START: {
      return {
        ...state,
        isWaitingSignal: true,
      };
    }
    case actionTypes.INITIALIZE_SUCCEED: {
      return {
        ...state,
        remocon: action.payload.result.remocon,
        signals: [...action.payload.result.signals],
        isLoading: false,
      };
    }
    case actionTypes.SEND_SIGNAL_SUCCEED: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actionTypes.RECEIVE_SIGNAL_SUCCEED: {
      return {
        ...state,
        receivedCode: [...action.payload.result.code],
        isWaitingSignal: false,
        isOpenAddDialog: true,
        isLoading: false,
      };
    }
    case actionTypes.REGISTER_SIGNAL_SUCCEED: {
      return {
        ...state,
        signals: [...state.signals, action.payload.result.signal],
        isLoading: false,
      };
    }
    // 標準のstart
    case actionTypes.REGISTER_SIGNAL_START: {
      return {
        ...state,
        isLoading: true,
      };
    }
    // 標準のfail
    case actionTypes.INITIALIZE_FAIL:
    case actionTypes.SEND_SIGNAL_FAIL:
    case actionTypes.RECEIVE_SIGNAL_FAIL:
    case actionTypes.REGISTER_SIGNAL_FAIL: {
      return {
        ...state,
        isLoading: false,
        isWaitingSignal: false,
        error: action.payload.error,
      };
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _: never = action;
      return state;
    }
  }
};
