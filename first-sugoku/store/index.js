import { createStore, combineReducers, applyMiddleware } from 'redux';
import boardReducer from './Reducers/boardReducer';
import userReducer from './Reducers/userReducer';
import thunk from 'redux-thunk';

const reducer = combineReducers({
    boardReducer,
    userReducer
})

const store = createStore(reducer, applyMiddleware(thunk));

export default store;