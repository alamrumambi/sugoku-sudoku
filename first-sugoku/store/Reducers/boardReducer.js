const initialState = {
    board: [],
    loadingStatus: false
}

export default (state = initialState, action) => {
    switch(action.type) {
        case 'FETCH_BOARD':
            // console.log('sampai di reducer>> ', action.payload);
            return { ...state, board: action.payload };
        case 'SET_LOADING':
            return { ...state, loadingStatus: action.payload};
        default: return state;
    }
}