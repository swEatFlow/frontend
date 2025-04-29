import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';
import { commonStyles } from '../styles/commonStyles';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

type FindIdScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FindId'>;

const { width } = Dimensions.get('window');

const FindIdScreen: React.FC = () => {
  const navigation = useNavigation<FindIdScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [showClearButton, setShowClearButton] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isEmailStep, setIsEmailStep] = useState(true);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [timer, setTimer] = useState(0); // 초기값 0으로 설정
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const inputRefs = useRef<TextInput[]>([]);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false); // 타이머 활성화 상태 추가
  const [isLoading, setIsLoading] = useState(false);

  // 이메일 유효성 검사
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // 이메일 마스킹 처리
  const maskEmail = (email: string): string => {
    const parts = email.split('@');
    if (parts.length !== 2) return email;

    const name = parts[0];
    const domain = parts[1];

    let maskedName = name;
    if (name.length > 3) {
      maskedName = name.substring(0, 3) + '*'.repeat(name.length - 3);
    }

    return maskedName + '@' + domain;
  };

  // 타이머 설정
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timer > 0 && !isEmailVerified) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, isEmailVerified, isTimerActive]);

  // 이메일 입력 처리
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setShowClearButton(text.length > 0);
    setEmailError(validateEmail(text) ? '' : '올바른 이메일 형식이 아닙니다.');
  };

  // 인증번호 입력 처리
  const handleVerificationCodeChange = (text: string) => {
    setVerificationCode(text);
  };

  // 인증번호 요청
  const handleRequestVerification = () => {
    if (validateEmail(email)) {
      setIsEmailStep(false);
      setTimer(180);
      setVerificationError('');
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  };

  // 인증번호 재발송
  const handleResendVerification = () => {
    setVerificationCode('');
    setTimer(180);
    setVerificationError('');
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  // 뒤로가기
  const handleBack = () => {
    if (isEmailStep) {
      navigation.goBack();
    } else {
      setIsEmailStep(true);
      setVerificationCode('');
      setVerificationError('');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
        setTimer(180); // 3분 타이머 설정
        setIsTimerActive(true); // 타이머 활성화
      } else {
        Alert.alert('오류', '인증코드 발송에 실패했습니다.');
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

  const handleFindId = () => {
    // Reset errors
    setEmailError('');

    // Basic validation
    if (!email) {
      setEmailError('이메일을 입력해주세요');
      return;
    }

    setIsLoading(true);
    // TODO: Implement actual find ID logic
    console.log('Find ID attempt with:', { email });
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={commonStyles.keyboardAvoidingView}
      >
        <View style={commonStyles.header}>
          <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
            <Text style={commonStyles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={commonStyles.title}>아이디 찾기</Text>
        </View>

        <ScrollView style={commonStyles.content}>
          <View style={commonStyles.section}>
            <Text style={commonStyles.sectionTitle}>이메일 인증</Text>
            <View style={commonStyles.inputGroup}>
              <Text style={commonStyles.label}>이메일</Text>
              <View style={commonStyles.emailInputContainer}>
                <Input
                  label="이메일"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="가입 시 사용한 이메일을 입력해주세요"
                  keyboardType="email-address"
                  error={emailError}
                />
                <TouchableOpacity 
                  style={commonStyles.verifyButton} 
                  onPress={sendVerificationCode}
                >
                  <Text style={commonStyles.verifyButtonText}>인증번호 발송</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={commonStyles.inputGroup}>
              <Text style={commonStyles.label}>인증번호</Text>
              <View style={commonStyles.verificationContainer}>
                <TextInput
                  style={[commonStyles.input, commonStyles.verificationInput]}
                  placeholder="인증번호를 입력해주세요"
                  value={verificationCode}
                  onChangeText={handleVerificationCodeChange}
                  keyboardType="number-pad"
                />
                <TouchableOpacity 
                  style={commonStyles.verifyButton} 
                  onPress={verifyEmail}
                >
                  <Text style={commonStyles.verifyButtonText}>인증하기</Text>
                </TouchableOpacity>
              </View>
              {isTimerActive && timer > 0 && !isEmailVerified && (
                <Text style={commonStyles.timerText}>남은 시간: {formatTime(timer)}</Text>
              )}
            </View>

            {isEmailVerified && (
              <Button
                title="아이디 찾기"
                onPress={handleFindId}
                variant="primary"
                size="large"
                loading={isLoading}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 성공 모달 */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={commonStyles.modalOverlay}>
          <View style={commonStyles.modalContent}>
            <View style={commonStyles.successIconContainer}>
              <Text style={commonStyles.successIcon}>✓</Text>
            </View>
            <Text style={commonStyles.modalTitle}>인증 성공</Text>
            <Text style={commonStyles.modalDescription}>
              아이디 찾기가 완료되었습니다.
            </Text>

            <View style={commonStyles.idContainer}>
              <Text style={commonStyles.idLabel}>회원님의 아이디</Text>
              <Text style={commonStyles.idValue}>user1234</Text>
            </View>

            <TouchableOpacity
              style={commonStyles.modalButton}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('Login');
              }}
            >
              <Text style={commonStyles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
});

export default FindIdScreen; 