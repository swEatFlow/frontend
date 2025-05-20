import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';

export const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = () => {
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!email) {
      setEmailError('이메일을 입력해주세요');
      return;
    }
    if (!newPassword) {
      setPasswordError('새 비밀번호를 입력해주세요');
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다');
      return;
    }

    setIsLoading(true);
    console.log('Password reset attempt with:', { email, newPassword });
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>비밀번호 재설정</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              value={email}
              onChangeText={setEmail}
              placeholder="가입 시 사용한 이메일을 입력해주세요"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>새 비밀번호</Text>
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="새 비밀번호를 입력해주세요"
              secureTextEntry
            />
            {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>새 비밀번호 확인</Text>
            <TextInput
              style={[styles.input, confirmPasswordError ? styles.inputError : null]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="새 비밀번호를 다시 입력해주세요"
              secureTextEntry
            />
            {!!confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}
          </View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>비밀번호 재설정</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#f00',
  },
  errorText: {
    color: '#f00',
    fontSize: 12,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: '#4f8cff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ResetPasswordScreen;