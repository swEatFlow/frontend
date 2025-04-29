import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const ResetPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Basic validation
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
    // TODO: Implement actual password reset logic
    console.log('Password reset attempt with:', { email, newPassword });
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={commonStyles.keyboardAvoidingView}
    >
      <View style={commonStyles.container}>
        <View style={styles.content}>
          <Input
            label="이메일"
            value={email}
            onChangeText={setEmail}
            placeholder="가입 시 사용한 이메일을 입력해주세요"
            keyboardType="email-address"
            error={emailError}
          />
          <Input
            label="새 비밀번호"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="새 비밀번호를 입력해주세요"
            secureTextEntry
            error={passwordError}
          />
          <Input
            label="새 비밀번호 확인"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="새 비밀번호를 다시 입력해주세요"
            secureTextEntry
            error={confirmPasswordError}
          />
          <Button
            title="비밀번호 재설정"
            onPress={handleResetPassword}
            variant="primary"
            size="large"
            loading={isLoading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
}); 