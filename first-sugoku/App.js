import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Modal, StatusBar } from 'react-native';

export default function App() {

  let keyboard = [];
  for (let i = 1; i < 10; i++) {
    keyboard.push(i.toString());
  }

  const [board, setBoard] = useState([]);
  const [solveBoard, setSolveBoard] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchNewBoard();
  }, [])

  const solving = () => {
    setModalVisible(true);
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
        // setBoard(response.solution);
        setSolveBoard(response.solution);
        setModalVisible(false);
      })
      .catch(console.log)
  }

  const validate = () => {
    setModalVisible(true);
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
        // setBoard(response.solution);
        alert(response.status);
        // setSolveBoard(response.solution);
        setModalVisible(false);
      })
      .catch(console.log)
  }

  const fetchNewBoard = () => {
    setModalVisible(true);
    fetch('https://sugoku.herokuapp.com/board?difficulty=easy')
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.board);
        setBoard(data.board);
        setSolveBoard(data.board);
        setModalVisible(false);
        // dispatch(fetchData(data));
      })
      .catch(console.log);
  }

  return (
    <>
      <StatusBar hidden={true}/>
      <View style={styles.header}>
        <Text style={styles.headerText}>SUGOKU</Text>
      </View>
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
              return (<TouchableOpacity style={[styles.sudokuSmallBox, {backgroundColor: board[x][y] !== 0? '#f5be8c': 'white'}]} key={y}>
                <Text style={styles.keyText}>{small !== 0 && small}</Text>
                {/* <TextInput style={styles.keyText} value={small !== 0 && small.toString()}></TextInput> */}
              </TouchableOpacity>)
            })}
          </View>)
        })}
      </View>
      <View style={styles.keyboard}>
        {keyboard.map((num, i) => {
          return (<TouchableOpacity style={styles.keyButton} key={i}>
            <Text style={styles.keyText}>{num}</Text>
          </TouchableOpacity>)
        })}
        <TouchableOpacity style={styles.delButton}>
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
