import { AxiosError } from 'axios';
import { TopAction, TopActionTypes as actionTypes } from '../actions/top';

import { Remocon } from '../interfaces/entities';

/** State */
export interface TopState {
  remocons: Remocon[];
  isLoading: boolean;
  isOpenAddDialog: boolean;
  error?: AxiosError;
}

/** 初期値 */
export const initialState: TopState = {
  remocons: [],
  isLoading: false,
  isOpenAddDialog: false,
};

/** サンプル Reducer */
export const topReducer = (
  state = initialState,
  action: TopAction
): TopState => {
  switch (action.type) {
    case actionTypes.OPEN_ADD_DIALOG: {
      return {
        ...state,
        isOpenAddDialog: true,
      };
    }
    case actionTypes.CLOSE_ADD_DIALOG: {
      return {
        ...state,
        isOpenAddDialog: false,
      };
    }

    case actionTypes.INITIALIZE_SUCCEED: {
      return {
        ...state,
        remocons: [...action.payload.result.remocons],
        isLoading: false,
      };
    }
    case actionTypes.REGISTER_SUCCEED: {
      return {
        ...state,
        remocons: [...state.remocons, action.payload.result.remocon],
        isLoading: false,
      };
    }
    case actionTypes.DISCARD_SUCCEED: {
      return {
        ...state,
        remocons: [
          ...state.remocons.filter(r => r.id != action.payload.params.id),
        ],
        isLoading: false,
      };
    }

    case actionTypes.INITIALIZE_START:
    case actionTypes.REGISTER_START:
    case actionTypes.DISCARD_START: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actionTypes.INITIALIZE_FAIL:
    case actionTypes.REGISTER_FAIL:
    case actionTypes.DISCARD_FAIL: {
      return {
        ...state,
        isLoading: false,
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
