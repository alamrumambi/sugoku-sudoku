import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, StatusBar, BackHandler } from 'react-native';
import { useSelector } from 'react-redux';

export default ({ navigation: { navigate } }) => {

    const name = useSelector(state => state.userReducer.user);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            toHome
        );
        return () => backHandler.remove();
    }, []);

    const toHome = () => {
        navigate('Home');
        return true;
    }

    return (
        <>
            <StatusBar hidden={true} />
            <View style={styles.input}>
                <Text style={styles.textLabel}>Congratulations</Text>
                <Text style={styles.textLabel}>{name}</Text>
                <Text style={styles.text}>Sudoku has been solved</Text>
                <Button onPress={toHome} title="Back To Home"></Button>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#292e2a",
    },
    textLabel: {
        color: "white",
        fontSize: 40,
    },
    text: {
        color: "white",
        marginBottom: 20
    }
});
