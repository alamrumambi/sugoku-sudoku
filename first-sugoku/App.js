import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Home from './screens/Home';
import Game from './screens/Game';
import Finish from './screens/Finish';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default App = () => {

    const Stack = createStackNavigator();
    console.disableYellowBox = true;

    return (
        <NavigationContainer>
            <Provider store={store}>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={ Home } options={{headerShown: false}}></Stack.Screen>
                    <Stack.Screen name="Game" component={ Game } options={{headerShown: false}}></Stack.Screen>
                    <Stack.Screen name="Finish" component={ Finish } options={{headerShown: false}}></Stack.Screen>
                </Stack.Navigator>
            </Provider>
        </NavigationContainer>
    );
}
