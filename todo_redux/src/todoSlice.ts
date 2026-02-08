import * as API from './api';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AppThunk } from './store';

export enum Priority {
  High = 1,
  Mid = 2,
  Low = 3,
}

export const isPriority = (arg: any): arg is Priority =>
  Object.values(Priority).includes(arg);

export interface Todo {
  id: string;
  title: string;
  priority: Priority;
}

interface TodoState {
  todoList: Todo[];
}

const initialState: TodoState = {
  todoList: [],
};

export const todoSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Todo>) => {
      state.todoList.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      state.todoList = state.todoList.filter(
        (todo) => todo.id !== action.payload.id
      );
    },
  },
});

export const { addItem, removeItem } = todoSlice.actions;

export const addItemAsync = ({
  title,
  priority,
}: {
  title: string;
  priority: Priority;
}): AppThunk => (dispatch) => {
  API.registerTodoItem({ title, priority }).then((todo) => {
    dispatch(addItem(todo));
  });
};

export default todoSlice.reducer;
