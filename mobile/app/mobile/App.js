import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './app/screens/Login';
import Register from './app/screens/Register';
import Home from './app/screens/Home';
import ProfilePage from './app/screens/ProfilePage';
import Radio from './app/screens/Radio';
import Videos from './app/screens/Videos';
import Songs from './app/screens/Songs';
import MusicPage from './app/screens/MusicPage';
import ArtistPage from './app/screens/ArtistPage';
import PlaylistPage from './app/screens/PlaylistPage';
import Search from './app/screens/Search';
import FirstPage from './app/screens/FirstPage';

const Stack = createStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='FirstPage'>

      <Stack.Screen name="FirstPage"
          component={FirstPage}
          options={{ headerShown: false }} />

        <Stack.Screen name="ProfilePage"
          component={ProfilePage}
          options={{ headerShown: false }} />

        <Stack.Screen name="Login"
          component={Login}
          options={{ headerShown: false }} />

        <Stack.Screen name="Radio"
          component={Radio}
          options={{ headerShown: false }} />

        <Stack.Screen name="Videos"
          component={Videos}
          options={{ headerShown: false }} />

        <Stack.Screen name="Register"
          component={Register}
          options={{ headerShown: false }} />

        <Stack.Screen name="Home"
          component={Home}
          options={{ headerShown: false }} />

        <Stack.Screen name="Songs"
          component={Songs}
          options={{ headerShown: false }} />

        <Stack.Screen name="MusicPage"
          component={MusicPage}
          options={{ headerShown: false }} />

        <Stack.Screen name="ArtistPage"
          component={ArtistPage}
          options={{ headerShown: false }} />

        <Stack.Screen name="PlaylistPage"
          component={PlaylistPage}
          options={{ headerShown: false }} />

        <Stack.Screen name="Search"
          component={Search}
          options={{ headerShown: false }} />
          
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;