import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import epics from './epics/index';
import reducer from './reducers/index';

const initStore = (initialState) => {
  const epicMiddleware = createEpicMiddleware(epics);

  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers =
    (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const enhancer = composeEnhancers(applyMiddleware(epicMiddleware));

  return createStore(reducer, initialState, enhancer);
};

export default initStore;
