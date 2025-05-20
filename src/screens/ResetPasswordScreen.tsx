import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';

type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = () => {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timer, setTimer] = useState(300); // 5분
  const [step, setStep] = useState(1); // 1: ID/Email, 2: Verification, 3: New Password
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (step === 1) {
      // ID, 이메일 확인 후 인증번호 발송
      setStep(2);
      setTimer(300);
    } else if (step === 2) {
      // 인증번호 확인 후 비밀번호 변경 단계로
      setStep(3);
    } else if (step === 3) {
      // 비밀번호 변경 완료
      setShowResult(true);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerifyCode = () => {
    // 인증번호 확인 로직
    setStep(3);
  };

  const handleGoToLogin = () => {
    navigation.navigate('Login');
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
          <Text style={styles.title}>비밀번호 재설정</Text>
        </View>

        <ScrollView style={styles.content}>
          {!showResult ? (
            <View style={styles.formContainer}>
              {step === 1 && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>아이디</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="아이디를 입력해주세요"
                      value={id}
                      onChangeText={setId}
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>이메일</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="이메일을 입력해주세요"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </>
              )}

              {step === 2 && (
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
                    <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyCode}>
                      <Text style={styles.verifyButtonText}>확인</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.timerText}>
                    남은 시간: {formatTime(timer)}
                  </Text>
                </View>
              )}

              {step === 3 && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>새 비밀번호</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="새 비밀번호를 입력해주세요"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry
                    />
                    <Text style={styles.helperText}>
                      영문, 숫자, 특수문자 조합 8-20자
                    </Text>
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>새 비밀번호 확인</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="새 비밀번호를 다시 입력해주세요"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                    />
                  </View>
                </>
              )}

              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
              >
                <Text style={styles.nextButtonText}>
                  {step === 1 ? '인증번호 받기' : step === 2 ? '다음' : '비밀번호 변경'}
                </Text>
              </TouchableOpacity>







            </View>
          ) : (
            <View style={styles.resultContainer}>
              <View style={styles.successIcon}>
                <Text style={styles.successIconText}>✓</Text>
              </View>
              <Text style={styles.resultTitle}>비밀번호 변경 완료</Text>
              <Text style={styles.resultDescription}>
                새로운 비밀번호로 로그인해주세요.
              </Text>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleGoToLogin}
              >
                <Text style={styles.loginButtonText}>로그인하기</Text>
              </TouchableOpacity>
            </View>
          )}
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
  formContainer: {
    flex: 1,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
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
  verificationContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  verificationInput: {
    flex: 1,
  },
  verifyButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  verifyButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  timerText: {
    marginTop: 8,
    fontSize: 12,
    color: '#6b7280',
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  nextButton: {
    backgroundColor: '#000000',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#6b7280',
    fontSize: 14,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 32,
    color: '#000000',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: '#000000',
    width: '100%',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ResetPasswordScreen;