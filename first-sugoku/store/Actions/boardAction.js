export const fetchData = (value) => {
    // console.log('sampai di action');
    return (dispatch) => {
        // setModalVisible(true);
        fetch(`https://sugoku.herokuapp.com/board?difficulty=${value}`)
            .then((res) => res.json())
            .then((data) => {
                // console.log('dapat data >> ', data);
                dispatch({
                    type: 'FETCH_BOARD',
                    payload: data.board
                });
                dispatch({
                    type: 'SET_LOADING',
                    payload: false
                });

                // console.log(data.board);
                // setBoard(data.board);


                // dispatch(fetchData(data));
            })
            .catch(console.log);
    }
}

export const setLoading = (val) => {
    return ({
        type: 'SET_LOADING',
        payload: val
    })
}