import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Modal, StatusBar, BackHandler, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, setLoading } from '../store/Actions/boardAction';

export default ({ navigation: { navigate }, route }) => {

    let keyboard = [];
    for (let i = 1; i < 10; i++) {
        keyboard.push(i.toString());
    }

    const dispatch = useDispatch();

    const board = useSelector(state => state.boardReducer.board);
    const [solveBoard, setSolveBoard] = useState([]);
    const modalVisible = useSelector(state => state.boardReducer.loadingStatus);
    const [selectedValue, setSelectedValue] = useState(-1);

    useEffect(() => {
        fetchNewBoard();
    }, [])

    useEffect(() => {
        resetBoard();
    }, [board])

    useEffect(() => {
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want to leave game?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "YES", onPress: () => navigate('Home') }
            ]);
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, []);

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
                if (response.status === 'solved') navigate('Finish')
                else alert(response.status);
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
        }
    }

    const deleteField = () => {
        if (selectedValue !== -1) {
            solveBoard[selectedValue[0]][selectedValue[1]] = 0;
            setSelectedValue(-1);
            setSolveBoard(solveBoard);
        }
    }

    const resetBoard = () => {
        let temp = [];
        for (let i in board) {
            let temp2 = [];
            for (let j in board[i]) {
                temp2.push(board[i][j]);
            }
            temp.push(temp2);
        }
        setSolveBoard(temp);
    }

    return (
        <>
            <StatusBar hidden={true} />
            <View style={styles.header}>
                <Text style={styles.headerText}>SUGOKU</Text>
            </View>
            <Text>Difficult {route.params.difficult}</Text>
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
                {solveBoard.map((row, x) => {
                    return (<View style={styles.sudokuBigBox} key={x}>
                        {row.map((col, y) => {
                            return (<TouchableOpacity onPress={() => setSelected(x, y)} style={[styles.sudokuSmallBox,
                            {
                                backgroundColor: (selectedValue[0] === x && selectedValue[1] === y) ? '#a3f57a': 'white',
                                borderTopWidth: (Number(x) % 3 === 0) ? 4 : 1,
                                borderLeftWidth: (Number(y) % 3 === 0) ? 4 : 1,
                                borderBottomWidth: (x === 8) ? 4 : 1,
                                borderRightWidth: (y === 8) ? 4 : 1,
                            }]}
                                key={y}>
                                <Text style={[styles.keyText, {color: board[x][y] !== 0 ? 'red' : 'black',}]}>{col !== 0 && col}</Text>
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
                <TouchableOpacity onPress={resetBoard} style={styles.resetButton}>
                    <Text style={styles.keyText}>Reset Board</Text>
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
        alignContent: 'flex-start',
        // flexWrap: 'wrap',
        // flexDirection: 'row',
    },
    sudokuBigBox: {
        height: 38,
        flexDirection: 'row',
    },
    sudokuSmallBox: {
        borderWidth: 1,
        width: 38,
        height: 38,
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
        justifyContent: 'space-evenly',
    },
    keyButton: {
        width: 50,
        height: 50,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'green',
        backgroundColor: 'white',
    },
    delButton: {
        width: 77,
        height: 50,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'green',
        backgroundColor: 'red',
    },
    resetButton: {
        width: 77,
        height: 50,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'green',
        backgroundColor: '#f0cf92',
    },
    keyText: {
        textAlign: "center",
        marginTop: 'auto',
        marginBottom: 'auto',
        fontWeight: "bold",
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
