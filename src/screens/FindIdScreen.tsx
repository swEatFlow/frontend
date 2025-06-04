import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';


type FindIdScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FindId'>;

const { width } = Dimensions.get('window');

const FindIdScreen = () => {
  const navigation = useNavigation<FindIdScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [showClearButton, setShowClearButton] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isEmailStep, setIsEmailStep] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [timer, setTimer] = useState(180); // 3분
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [id, setId] = useState<string | null>('');

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

  // 타이머 시작
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (!isEmailStep && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setVerificationError('인증 시간이 만료되었습니다. 인증번호를 재발송해주세요.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEmailStep, timer]);

  // 이메일 입력 처리
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setShowClearButton(text.length > 0);
    setEmailError(validateEmail(text) ? '' : '올바른 이메일 형식이 아닙니다.');
  };

  const handleVerificationCode = (code: string) => {
    setVerificationCode(code);
  }

  // 인증번호 요청
  const handleRequestVerification = async () => {
    if (validateEmail(email)) {
      setIsEmailStep(false);
      setTimer(180);
      setVerificationError('');
      const response = await fetch("http://10.0.2.2:8000/api/v1/users/send-verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      }).then(res => res.json());
      Alert.alert(response.detail.toString());
    }
  };

  // 인증번호 재발송
  const handleResendVerification = () => {
    setVerificationCode('');
    setTimer(180);
    setVerificationError('');
  }

  // 인증 확인
  const handleVerify = async () => {
    try {
      const response = await fetch("http://10.0.2.2:8000/api/v1/users/verify-email-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, code: verificationCode })
      });
      if (response.ok) {
        const result: { id: string } = await fetch("http://10.0.2.2:8000/api/v1/users/find-id", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        }).then(res => res.json());
        if (result.id) {
          setId(result.id);
          setShowSuccessModal(true);
        } else {
          Alert.alert("회원가입이 되어있지 않습니다.");
        }
      } else {
        Alert.alert("인증코드가 일치하지 않습니다.")
        const error = await response.json();
        console.log(error);
      }
    } catch (e) {
      console.log(e);
      Alert.alert("전송중 오류가 발생했습니다.")
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

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 네비게이션 바 */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>아이디 찾기</Text>
      </View>

      {/* 메인 컨텐츠 */}
      <View style={styles.content}>
        {isEmailStep ? (
          // 이메일 입력 단계
          <View style={styles.stepContainer}>
            <View style={styles.header}>
              <Text style={styles.stepTitle}>이메일 주소를 입력해주세요</Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.emailInputWrapper}>
                <TextInput
                  style={styles.emailInput}
                  placeholder="example@email.com"
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {showClearButton && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => {
                      setEmail('');
                      setShowClearButton(false);
                      setEmailError('');
                    }}
                  >
                    <Text style={styles.clearIcon}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                !validateEmail(email) && styles.buttonDisabled,
              ]}
              onPress={handleRequestVerification}
              disabled={!validateEmail(email)}
            >
              <Text style={styles.buttonText}>인증번호 받기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // 인증번호 입력 단계
          <View style={styles.stepContainer}>
            <View style={styles.header}>
              <Text style={styles.stepTitle}>인증번호를 입력해주세요</Text>
              <Text style={styles.stepDescription}>
                {maskEmail(email)}로 전송된 6자리 인증번호를 입력해주세요.
              </Text>
            </View>

            <View style={styles.verificationContainer}>
                <TextInput
                  style={styles.verificationInput}
                  value={verificationCode}
                  onChangeText={handleVerificationCode}
                  keyboardType='number-pad'
                />

              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>
                  남은 시간: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </Text>
                <TouchableOpacity onPress={handleResendVerification}>
                  <Text style={styles.resendText}>인증번호 재발송</Text>
                </TouchableOpacity>
              </View>

              {verificationError ? (
                <Text style={styles.errorText}>{verificationError}</Text>
              ) : null}
            </View>
          </View>
        )}
      </View>

      {/* 하단 버튼 (인증 단계에서만 표시) */}
      {!isEmailStep && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[
              styles.button
            ]}
            onPress={handleVerify}
          >
            <Text style={styles.buttonText}>인증하기</Text>
          </TouchableOpacity>
        </View>
      )}

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
              <Text style={styles.idValue}>{id}</Text>
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
    backgroundColor: '#ffffff',
  },
  navBar: {
    height: 100,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingTop: 30,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 40,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  stepContainer: {
    flex: 1,
  },
  header: {
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  inputContainer: {
    marginBottom: 24,
  },
  emailInputWrapper: {
    position: 'relative',
  },
  emailInput: {
    height: 48,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    fontSize: 20,
    color: '#9ca3af',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#4f46e5',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  verificationContainer: {
    marginBottom: 24,
  },
  verificationInput: {
    height: 48,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timerText: {
    color: '#6b7280',
    fontSize: 14,
  },
  resendText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: width - 48,
    padding: 24,
  },
  successIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 32,
    color: '#4f46e5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  idContainer: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  idLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  idValue: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 4,
  },
  modalButton: {
    backgroundColor: '#4f46e5',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FindIdScreen;