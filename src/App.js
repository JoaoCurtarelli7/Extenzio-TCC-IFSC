import 'react-native-gesture-handler';
import React from 'react';
import { LogBox, StatusBar } from 'react-native';
import AuthProvider from './contexts/auth';
import Routes from './routes/index';
import { NavigationContainer } from '@react-navigation/native';

LogBox.ignoreAllLogs()

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
         {/* <StatusBar backgroundColor='white' barStyle="light-content" /> */}
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}

