import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PublishIttinariesPages from './app/pages/PublishItinariesPages';
import SigninPages from './app/pages/SigninPages';
import SignupPages from './app/pages/SignupPages';
import ItinariesPages from './app/pages/ItinariesPages';
import MyItinariesPages from './app/pages/MyItinariesPages';

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Signin">
        <Drawer.Screen name="SignIn" component={SigninPages} />
        <Drawer.Screen name="PublishIttinaries" component={PublishIttinariesPages} />
        <Drawer.Screen name="SignUp" component={SignupPages} />
        <Drawer.Screen name="Itinaries" component={ItinariesPages} />
        <Drawer.Screen name="MyItinaries" component={MyItinariesPages} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
