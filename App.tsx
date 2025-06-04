import React, { useState, useEffect } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomBar from './src/components/bottomBar';
import {
  LoginScreen,
  FindIdScreen,
  SignUpScreen,
  ResetPasswordScreen,
  UserInfoScreen,
  SettingScreen
} from './src/index';
import { RootStackParamList } from './src/utils/navigator';
import { getItem } from './src/store/useStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const access_token = await getItem('token');
        setIsAuthenticated(!!access_token);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="FindId" component={FindIdScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="MainTabs" component={BottomBar} />
            <Stack.Screen name="UserInfo" component={UserInfoScreen} />
            <Stack.Screen name="Setting" component={SettingScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default App;