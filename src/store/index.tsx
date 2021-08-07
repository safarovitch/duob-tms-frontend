import {applyMiddleware, compose, createStore, Middleware, StoreEnhancer} from "redux";
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from "../reducers";
import { ENABLE_REDUX_LOGGER } from '../config';

const loggerMiddleware = createLogger();

const configureStore = (preloadedState = {}) => {
    const middlewares: [Middleware] = [thunkMiddleware];

    if (ENABLE_REDUX_LOGGER) {
        middlewares.push(loggerMiddleware);
    }

    const middlewareEnhancer = composeWithDevTools(
        applyMiddleware(...middlewares)
    );

    const enhancers = [middlewareEnhancer];
    const composedEnhancers: StoreEnhancer = compose(...enhancers);

    const store = createStore(rootReducer, preloadedState, composedEnhancers);

    return store;
}

export default configureStore;
