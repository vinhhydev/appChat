import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import ChatScreen from '../screens/ChatScreen';
import StoryScreen from '../screens/StoryScreen';
import FriendsScreen from '../screens/FriendsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="ChatScreen" component={ChatScreen} />
      <Tab.Screen name="StoryScreen" component={StoryScreen} />
      <Tab.Screen name="FriendsScreen" component={FriendsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
