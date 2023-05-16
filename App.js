import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ClimbOnBoardPages from './app/pages/ClimbOnBoardPages';
import HomePages from './app/pages/HomePages';
import ModifiedMyItinariesPages from './app/pages/ModifiedMyItinariesPages';
import PublishIttinariesPages from './app/pages/PublishItinariesPages';
import RequestPages from './app/pages/RequestPages';
import SigninPages from './app/pages/SigninPages';
import SignupPages from './app/pages/SignupPages';
import ItinariesPages from './app/pages/ItinariesPages';

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="ClimbOnBoard" component={ClimbOnBoardPages} />
        <Drawer.Screen name="Home" component={HomePages} />
        <Drawer.Screen name="ModifiedMyItinaries" component={ModifiedMyItinariesPages} />
        <Drawer.Screen name="PublishIttinaries" component={PublishIttinariesPages} />
        <Drawer.Screen name="Request" component={RequestPages} />
        <Drawer.Screen name="SignIn" component={SigninPages} />
        <Drawer.Screen name="SignUp" component={SignupPages} />
        <Drawer.Screen name="Itinaries" component={ItinariesPages} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
