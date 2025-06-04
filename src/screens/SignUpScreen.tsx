import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const { width } = Dimensions.get('window');

const SignUpScreen = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const checkIdAvailability = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/api/v1/users/verify-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      const data = await response.json();
      setIsIdAvailable(data.available);
      Alert.alert(data.available ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.');
    } catch (error) {
      Alert.alert('오류', '아이디 확인 중 오류가 발생했습니다.');
    }
  };

  const sendVerificationCode = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/api/v1/users/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        Alert.alert('인증코드가 발송되었습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '인증코드 발송 중 오류가 발생했습니다.');
    }
  };

  const verifyEmail = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/api/v1/users/verify-email-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      
      if (response.ok) {
        setIsEmailVerified(true);
        Alert.alert('이메일 인증이 완료되었습니다.');
      } else {
        Alert.alert('인증코드가 일치하지 않습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '이메일 인증 중 오류가 발생했습니다.');
    }
  };

  const handleSignUp = async () => {
    try {
      const jsonData = {
        email: email,
        username: username,
        password: password,
      };
      
      const response = await fetch('http://10.0.2.2:8000/api/v1/users/signup', {
        method: 'POST',
        body: JSON.stringify(jsonData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        Alert.alert('성공', '회원가입이 완료되었습니다.');
        navigation.goBack();
      } else {
        // 서버에서 오는 에러 메시지 처리
        const errorMessage = data.detail?.[0]?.msg || data.message || '회원가입 중 오류가 발생했습니다.';
        Alert.alert('오류', errorMessage);
      }
    } catch (error) {
      Alert.alert('오류', '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>회원가입</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>회원 정보</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>아이디</Text>
              <View style={styles.idInputContainer}>
                <TextInput
                  style={[styles.input, styles.idInput]}
                  placeholder="아이디를 입력해주세요"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.checkButton} 
                  onPress={checkIdAvailability}
                >
                  <Text style={styles.checkButtonText}>중복확인</Text>
                </TouchableOpacity>
              </View>
              {isIdAvailable !== null && (
                <Text style={[
                  styles.availabilityText,
                  isIdAvailable ? styles.available : styles.unavailable
                ]}>
                  {isIdAvailable ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.'}
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일</Text>
              <View style={styles.emailInputContainer}>
                <TextInput
                  style={[styles.input, styles.emailInput]}
                  placeholder="이메일을 입력해주세요"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <TouchableOpacity 
                  style={styles.verifyButton} 
                  onPress={sendVerificationCode}
                >
                  <Text style={styles.verifyButtonText}>인증번호 발송</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>인증번호</Text>
              <View style={styles.verificationContainer}>
                <TextInput
                  style={[styles.input, styles.verificationInput]}
                  placeholder="인증번호를 입력해주세요"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="number-pad"
                />
                <TouchableOpacity 
                  style={styles.verifyButton} 
                  onPress={verifyEmail}
                >
                  <Text style={styles.verifyButtonText}>인증하기</Text>
                </TouchableOpacity>
              </View>
              {isEmailVerified && (
                <Text style={styles.verifiedText}>이메일 인증이 완료되었습니다.</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={styles.input}
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호 확인</Text>
              <TextInput
                style={styles.input}
                placeholder="비밀번호를 다시 입력해주세요"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[
              styles.signUpButton,
              (!isIdAvailable || !isEmailVerified) && styles.disabledButton
            ]} 
            onPress={handleSignUp}
            disabled={!isIdAvailable || !isEmailVerified}
          >
            <Text style={styles.signUpButtonText}>가입하기</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    height: 100,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    top: 40,
    width: 40,
    height: 40,
    fontSize: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profilePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 32,
  },
  uploadButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    color: '#000000',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  idInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idInput: {
    flex: 1,
    marginRight: 8,
  },
  checkButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailInput: {
    flex: 1,
    marginRight: 8,
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationInput: {
    flex: 1,
    marginRight: 8,
  },
  verifyButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  availabilityText: {
    marginTop: 4,
    fontSize: 12,
  },
  available: {
    color: '#10B981',
  },
  unavailable: {
    color: '#EF4444',
  },
  verifiedText: {
    marginTop: 4,
    fontSize: 12,
    color: '#10B981',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  signUpButton: {
    backgroundColor: '#000000',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SignUpScreen; 