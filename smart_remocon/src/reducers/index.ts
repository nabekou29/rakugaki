import { FormStateMap, reducer as reduxFormReducer } from 'redux-form';
import { Reducer, combineReducers } from 'redux';
import { RemoconState, remoconReducer } from './remocon';
import { TopState, topReducer } from './top';

export type AppState = {
  form: FormStateMap;
  top: TopState;
  remocon: RemoconState;
};

/** 全てのリデューサを集約したリデューサ */
const reducer: Reducer<AppState> = combineReducers<AppState>({
  form: reduxFormReducer,
  top: topReducer,
  remocon: remoconReducer,
});

export default reducer;
