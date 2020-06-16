import { createStore, combineReducers } from 'redux';
import boardReducer from './Reducers/boardReducer';

const reducer = combineReducers({
    boardReducer
})

const store = createStore(reducer);

export default store;