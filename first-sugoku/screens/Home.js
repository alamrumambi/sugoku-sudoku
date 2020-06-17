import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, StatusBar, TextInput, BackHandler, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/Actions/userAction';

export default ({ navigation: { navigate } }) => {

    useEffect(() => {
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want to exit?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "YES", onPress: () => BackHandler.exitApp() }
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    const [inputText, setInputText] = useState('');
    const dispatch = useDispatch();

    const toGame = (difficult) => {
        if (inputText === '') alert('Input Your Name');
        else {
            dispatch(setUser(inputText));
            navigate('Game', { difficult });
        }
    }

    return (
        <>
            <StatusBar hidden={true} />
            <View style={styles.header}>
                <Text style={styles.titleText}>SUGOKU</Text>
            </View>
            <View style={styles.input}>
                <Text style={styles.inputLabel}>Input Your Name</Text>
                <TextInput style={styles.inputBox} onChangeText={text => setInputText(text)} value={inputText} placeholder="Your Name"></TextInput>
            </View>
            <View style={styles.chTxDiv}>
                <Text style={styles.chooseText}>Choose Difficulty</Text>
            </View>
            <View style={styles.button}>
                <Button onPress={() => toGame('easy')} title="EASY"></Button>
                <Button onPress={() => toGame('medium')} title="MEDIUM" color="orange"></Button>
                <Button onPress={() => toGame('hard')} title="HARD" color="red"></Button>
                <Button onPress={() => toGame('random')} title="RANDOM" color="brown"></Button>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#292e2a',
    },
    titleText: {
        color: 'white',
        fontSize: 68,
        fontFamily: 'monospace'
    },
    input: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#dedede",
    },
    inputLabel: {
        fontSize: 30,
    },
    inputBox: {
        padding: 4,
        textAlign: "center",
        width: 200,
        borderWidth: 1,
        borderColor: "black",
        marginTop: 10,
        fontSize: 25,
        borderRadius: 4,
    },
    chTxDiv: {
        flex: 0.5,
        backgroundColor: '#292e2a',
        justifyContent: "center",
        alignItems: "center",
    },
    chooseText: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: "center",
        // alignItems: "center",
        // flex: 0.2,
        fontSize: 20,
        color: "white",
    },
    button: {
        flex: 1,
        alignItems: "flex-start",
        flexDirection: "row",
        justifyContent: "space-evenly",
        backgroundColor: '#292e2a',
    },
});
