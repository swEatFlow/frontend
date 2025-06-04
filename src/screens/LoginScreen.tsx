import React, { useState } from 'react';
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TextInput,
  Image,
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';
import { getItem, setItem } from '../store/useStore';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
        Alert.alert("아이디나 비밀번호를 입력해주세요.");
        return;
    }

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    const response = await fetch("http://10.0.2.2:8000/api/v1/users/login", {
      method: "POST",
      headers: {
          "Content-type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    });
    const data = await response.json()
    if (response.ok) {
      await setItem("token", data.access_token);
      const token = await getItem("token");
      const result = await fetch("http://10.0.2.2:8000/api/v1/users/user-check", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .catch(() => console.log("오류 발생"))

      if (result.status === "setting") {
        navigation.navigate("MainTabs")
      } else {
        navigation.navigate('UserInfo');
      }
    } else if (response.status === 401) {
        Alert.alert(data.detail);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/favicon.png')} style={styles.logo} />
            <Text style={styles.logoText}>EatFlow</Text>
          </View>
          <Text style={styles.subtitle}>건강한 식단 관리</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="아이디를 입력해주세요"
            value={username}
            onChangeText={setUsername}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>

          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('FindId')}>
              <Text style={styles.linkText}>아이디 찾기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
              <Text style={styles.linkText}>비밀번호 재설정</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.linkText}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>버전 1.0.0</Text>
        <Text style={styles.footerText}>
          © 2024 건강한 식단 관리. All rights reserved.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 50,
    height: 50,
  },
  logoText: {
    fontSize: 36,
    color: '#000000',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#4b5563',
    marginTop: 16,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: width - 48,
    alignSelf: 'center',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  loginButton: {
    backgroundColor: '#000000',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  linkText: {
    color: '#4b5563',
    fontSize: 14,
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#6b7280',
    fontSize: 12,
  },
});

export default LoginScreen;