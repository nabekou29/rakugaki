import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';

import todoReducer from './todoSlice';

export const store = configureStore({
  reducer: { todo: todoReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
