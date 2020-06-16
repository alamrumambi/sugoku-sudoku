const initialState = {
    board: [],
    selectedBoard: {i: 0, j:0}
}

export default (state = initialState, action) => {
    switch(action.type) {
        case 'FETCH_BOARD':
            return { ...state, board: action.payload };
        default: return state;
    }
}