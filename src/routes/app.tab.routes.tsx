import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Platform } from 'react-native';

// import { Home } from '../screens/Home';
import { MyCars } from '../screens/MyCars';

import { AppStackRoutes } from './app.stack.routes';

import HomeSvg from '../assets/home.svg'
import CarSvg from '../assets/car.svg'
import PeaopleSvg from '../assets/people.svg'
import { useTheme } from 'styled-components';

const { Navigator, Screen } = createBottomTabNavigator()

export function AppTabRoutes(){
  const theme = useTheme()

  return (
    <Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: theme.colors.main.primary,
        tabBarInactiveTintColor: theme.colors.text.detail,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
          height: 65,
          backgroundColor: theme.colors.background.primary
        }
      }} 
    >
      <Screen 
        name="Home"
        component={AppStackRoutes}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg width={24} height={24} fill={color}  />
          )
        }}
      />     

      <Screen 
        name="MyCars"
        component={MyCars}
        options={{
          tabBarIcon: ({ color }) => (
            <CarSvg width={24} height={24} fill={color} />
          )
        }}
      />  

       <Screen 
        name="Profile"
        component={AppStackRoutes}
        options={{
          tabBarIcon: ({ color }) => (
            <PeaopleSvg width={24} height={24} fill={color} />
          )
        }}
      />   

    </Navigator>
  )
}