import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import SignUpScreen from '../screens/AuthenticationScreen/SignUpScreen';
import SignInScreen from '../screens/AuthenticationScreen/SignInScreen';
import {useAuth} from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  const {isLogin} = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {!isLogin ? (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <Stack.Screen name="DrawerScreen" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
