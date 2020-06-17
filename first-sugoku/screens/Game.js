import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Modal, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, setLoading } from '../store/Actions/boardAction';

export default ({ navigation: { navigate }, route }) => {

    let keyboard = [];
    for (let i = 1; i < 10; i++) {
        keyboard.push(i.toString());
    }

    const dispatch = useDispatch();

    const board = useSelector(state => state.boardReducer.board);
    // console.log(board);
    // const [board, setBoard] = useState([]);
    const [solveBoard, setSolveBoard] = useState([]);
    const modalVisible = useSelector(state => state.boardReducer.loadingStatus);
    // const [modalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState(-1);

    useEffect(() => {
        fetchNewBoard();
    }, [])

    useEffect(() => {
        let temp = [];
        for (let i in board) {
            let temp2 = [];
            for (let j in board[i]) {
                temp2.push(board[i][j]);
            }
            temp.push(temp2);
        }
        setSolveBoard(temp);
    }, [board])

    const solving = () => {
        dispatch(setLoading(true));
        const encodeBoard = (boards) => boards.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === boards.length - 1 ? '' : '%2C'}`, '')

        const encodeParams = (params) =>
            Object.keys(params)
                .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
                .join('&');

        fetch('https://sugoku.herokuapp.com/solve', {
            method: 'POST',
            body: encodeParams({ board }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(response => response.json())
            .then(response => {
                setSolveBoard(response.solution);
                dispatch(setLoading(false));
            })
            .catch(console.log)
    }

    const validate = () => {
        dispatch(setLoading(true));
        const encodeBoard = (boards) => boards.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === boards.length - 1 ? '' : '%2C'}`, '')

        const encodeParams = (params) =>
            Object.keys(params)
                .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
                .join('&');

        fetch('https://sugoku.herokuapp.com/validate', {
            method: 'POST',
            body: encodeParams({ board: solveBoard }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(response => response.json())
            .then(response => {
                // alert(response.status === 'solve');
                if(response.status === 'solve') navigate('Finish')
                // else alert(response.status);
                dispatch(setLoading(false));
            })
            .catch(console.log)
    }

    const fetchNewBoard = () => {
        dispatch(setLoading(true));
        dispatch(fetchData(route.params.difficult));
        setSelectedValue(-1);
    }

    const setSelected = (x, y) => {
        if (board[x][y] === 0) setSelectedValue([x, y]);
        else setSelectedValue(-1);
    }

    const setNumber = (num) => {
        if (selectedValue !== -1) {
            solveBoard[selectedValue[0]][selectedValue[1]] = Number(num);
            setSelectedValue(-1);
            setSolveBoard(solveBoard);
            // alert(JSON.stringify(board));
        }
    }

    const deleteField = () => {
        if (selectedValue !== -1) {
            solveBoard[selectedValue[0]][selectedValue[1]] = 0;
            setSelectedValue(-1);
            setSolveBoard(solveBoard);
        }
    }

    return (
        <>
            <StatusBar hidden={true} />
            <View style={styles.header}>
                <Text style={styles.headerText}>SUGOKU</Text>
            </View>
            <Text>Difficult { route.params.difficult }</Text>
            <View style={styles.body}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Loading...</Text>
                        </View>
                    </View>
                </Modal>
                {solveBoard.map((big, x) => {
                    return (<View style={styles.sudokuBigBox} key={x}>
                        {big.map((small, y) => {
                            return (<TouchableOpacity onPress={() => setSelected(x, y)} style={[styles.sudokuSmallBox, { backgroundColor: (selectedValue[0] === x && selectedValue[1] === y) ? '#a3f57a' : 'white' }]} key={y}>
                                <Text style={[styles.keyText, { color: board[x][y] !== 0 ? 'red' : 'black' }]}>{small !== 0 && small}</Text>
                            </TouchableOpacity>)
                        })}
                    </View>)
                })}
            </View>
            <View style={styles.keyboard}>
                {keyboard.map((num, i) => {
                    return (<TouchableOpacity onPress={() => setNumber(num)} style={styles.keyButton} key={i}>
                        <Text style={styles.keyText}>{num}</Text>
                    </TouchableOpacity>)
                })}
                <TouchableOpacity onPress={deleteField} style={styles.delButton}>
                    <Text style={styles.keyText}>Delete</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.submit}>
                <Button onPress={fetchNewBoard} title="New Board" color="green"></Button>
                <Button onPress={solving} title="Solving" color="orange"></Button>
                <Button onPress={validate} title="Validate"></Button>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "#292e2a",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: "white",
    },
    header: {
        flex: 1.5,
        backgroundColor: '#292e2a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 38,
        fontFamily: 'monospace'
    },
    body: {
        flex: 7,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    sudokuBigBox: {
        borderWidth: 3,
        width: 120,
        height: 120,
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    sudokuSmallBox: {
        borderWidth: 1,
        width: 38,
        height: 38,
    },
    sudokuSmallBox2: {
        borderWidth: 1,
        width: 38,
        height: 38,
        backgroundColor: 'red',
    },
    keyboard: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
        paddingLeft: 10,
        flex: 2,
        flexWrap: 'wrap',
        display: 'flex',
        flexDirection: "row",
        backgroundColor: '#dedede',
        alignItems: 'center',
        alignContent: 'space-around',
        // justifyContent: 'space-evenly',
    },
    keyButton: {
        width: 50,
        height: 50,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'green',
        backgroundColor: 'white',
        marginRight: 6,
    },
    delButton: {
        width: 100,
        height: 50,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'green',
        backgroundColor: 'red',
        marginRight: 6,
    },
    keyText: {
        textAlign: "center",
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    submit: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: '#292e2a',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
