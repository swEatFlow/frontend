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
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';

const { width } = Dimensions.get('window');

export const FindIdScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'FindId'>>();
  const [email, setEmail] = useState('');
  const [showClearButton, setShowClearButton] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isEmailStep, setIsEmailStep] = useState(true);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [timer, setTimer] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const inputRefs = useRef<TextInput[]>([]);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
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
        setTimer(180);
        setIsTimerActive(true);
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
    setEmailError('');

    if (!email) {
      setEmailError('이메일을 입력해주세요');
      return;
    }

    setIsLoading(true);
    console.log('Find ID attempt with:', { email });
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>아이디 찾기</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>이메일 인증</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일</Text>
              <View style={styles.emailInputContainer}>
                <TextInput
                  style={[styles.input, emailError ? styles.inputError : null]}
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="가입 시 사용한 이메일을 입력해주세요"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.verifyButton} 
                  onPress={sendVerificationCode}
                >
                  <Text style={styles.verifyButtonText}>인증번호 발송</Text>
                </TouchableOpacity>
              </View>
              {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>인증번호</Text>
              <View style={styles.verificationContainer}>
                <TextInput
                  style={[styles.input, styles.verificationInput]}
                  placeholder="인증번호를 입력해주세요"
                  value={verificationCode}
                  onChangeText={handleVerificationCodeChange}
                  keyboardType="number-pad"
                />
                <TouchableOpacity 
                  style={styles.verifyButton} 
                  onPress={verifyEmail}
                >
                  <Text style={styles.verifyButtonText}>인증하기</Text>
                </TouchableOpacity>
              </View>
              {isTimerActive && timer > 0 && !isEmailVerified && (
                <Text style={styles.timerText}>남은 시간: {formatTime(timer)}</Text>
              )}
            </View>

            {isEmailVerified && (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleFindId}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>아이디 찾기</Text>
                )}
              </TouchableOpacity>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.modalTitle}>인증 성공</Text>
            <Text style={styles.modalDescription}>
              아이디 찾기가 완료되었습니다.
            </Text>

            <View style={styles.idContainer}>
              <Text style={styles.idLabel}>회원님의 아이디</Text>
              <Text style={styles.idValue}>user1234</Text>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('Login');
              }}
            >
              <Text style={styles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  section: {
    marginTop: 24,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
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
  verifyButton: {
    marginLeft: 8,
    backgroundColor: '#4f8cff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    color: '#f00',
    fontSize: 12,
    marginTop: 4,
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationInput: {
    flex: 1,
    marginRight: 8,
  },
  timerText: {
    color: '#4f8cff',
    fontSize: 13,
    marginTop: 6,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '80%',
  },
  successIconContainer: {
    backgroundColor: '#4f8cff',
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIcon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 15,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  idContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  idLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  idValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#4f8cff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FindIdScreen; 