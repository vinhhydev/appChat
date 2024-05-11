import { createDrawerNavigator, DrawerContentScrollView,DrawerItemList } from '@react-navigation/drawer';
import React from 'react'
import TabNavigator from './TabNavigator';
import { View, Text } from 'react-native';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props : any) =>{
    return (
        <DrawerContentScrollView {...props}>
            <Text>
                Drawer View
            </Text>
        </DrawerContentScrollView>
    )
}

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
    <Drawer.Screen name="TabScreen" component={TabNavigator} />
  </Drawer.Navigator>
  )
}


export default DrawerNavigator