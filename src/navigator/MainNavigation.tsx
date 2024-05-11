import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName={"Login"} screenOptions={{
        headerShown:false
    }}>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="DrawerScreen" component={DrawerNavigator}/>
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default MainNavigation