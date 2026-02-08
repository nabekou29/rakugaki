import { Middleware, Store, applyMiddleware, createStore } from 'redux';
import createSagaMiddleware, { Task } from 'redux-saga';
import reducer, { AppState } from './reducers';

import rootSaga from './middleware/saga';

// reduxのmiddlewareの設定

const bindMiddleware = (...middleware: Middleware[]) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension'); // eslint-disable-line
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const configureStore = (initialState: AppState): Store & { sagaTask: Task } => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    reducer,
    initialState,
    bindMiddleware(sagaMiddleware)
  );

  return { ...store, sagaTask: sagaMiddleware.run(rootSaga) };
};

export default configureStore;
