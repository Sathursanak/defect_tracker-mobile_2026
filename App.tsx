import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './src/pages/Welcome';
import LoginPage from './src/pages/LoginPage';
import ForgotPasswordPage from './src/pages/ForgotPasswordPage';
import Dashboard from './src/pages/Dashboard';
import ProjectDetails from './src/pages/ProjectDetails';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="ProjectDetails" component={ProjectDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
