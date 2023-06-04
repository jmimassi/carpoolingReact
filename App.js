import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Text } from 'react-native';
import PublishIttinariesPages from './app/pages/PublishItinariesPages';
import SigninPages from './app/pages/SigninPages';
import SignupPages from './app/pages/SignupPages';
import ItinariesPages from './app/pages/ItinariesPages';
import MyItinariesPages from './app/pages/MyItinariesPages';


const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props}
        activeTintColor="black" // Définit la couleur du bouton actif
        inactiveTintColor="black" // Définit la couleur des boutons inactifs
      />
    </DrawerContentScrollView>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Signin" drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          // Définit le style global du Drawer Navigator
          drawerActiveTintColor: 'black', // Définit la couleur du bouton actif
          drawerInactiveTintColor: 'black', // Définit la couleur des boutons inactifs
          drawerLabelStyle: { color: 'black' }, // Définit la couleur du texte des boutons
        }}
      >
        <Drawer.Screen
          name="SignIn"
          component={SigninPages}
          options={{ unmountOnBlur: true }} // Désactive la mise en cache pour l'écran SignIn
        />
        <Drawer.Screen
          name="PublishIttinaries"
          component={PublishIttinariesPages}
          options={{ unmountOnBlur: true }} // Désactive la mise en cache pour l'écran PublishIttinaries
        />
        <Drawer.Screen
          name="SignUp"
          component={SignupPages}
          options={{ unmountOnBlur: true }} // Désactive la mise en cache pour l'écran SignUp
        />
        <Drawer.Screen
          name="Itinaries"
          component={ItinariesPages}
          options={{ unmountOnBlur: true }} // Désactive la mise en cache pour l'écran Itinaries
        />
        <Drawer.Screen
          name="MyItinaries"
          component={MyItinariesPages}
          options={{ unmountOnBlur: true }} // Désactive la mise en cache pour l'écran MyItinaries
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
