import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';
import Header from '../components/header';
import { getItem, removeItem } from '../store/useStore';
import AccountInfoModal from '../components/AccountInfoModal';

type SettingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setting'>;

const SettingScreen = () => {
  const navigation = useNavigation<SettingScreenNavigationProp>();
  const [time, setTime] = useState('');
  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);

  useEffect(() => {
    const initUserInfo = async () => {
      const token = await getItem('token');
      const response = await fetch("http://10.0.2.2:8000/api/v1/users/set-time", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTime(data.reset_time);
    }
    initUserInfo();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Header />,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await removeItem('token');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
    }
  };
  
  const handleWithdrawal = async () => {
    const token = await getItem('token');
    const response = await fetch("http://10.0.2.2:8000/api/v1/users/withdrawal", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to withdrawal');
    }
    Alert.alert('회원탈퇴가 완료되었습니다.');
    await removeItem('token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  const handleTimeChange = async () => {
    const token = await getItem('token');
    const response = await fetch("http://10.0.2.2:8000/api/v1/users/set-time", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        reset_time: time,
      })
    });
    if (!response.ok) {
      throw new Error('Failed to update time');
    }
    Alert.alert('시간 설정이 완료되었습니다.');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>설정</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.subTitle}>계정 설정</Text>
          <View style={styles.profileContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileIcon}>👤</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsAccountModalVisible(true)}>
              <Text style={styles.editButtonText}>계정 정보 수정</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subTitle}>갱신 시간 설정</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.label}>하루 식단 갱신 시간</Text>
            <TextInput
              style={styles.timeInput}
              value={time}
              onChangeText={setTime}
            />
          </View>
          <View style={styles.saveButtonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleTimeChange}>
              <Text style={styles.saveButtonText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UserInfo')}>
            <Text style={styles.menuText}>회원정보</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>이용약관</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>개인정보처리방침</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text style={[styles.menuText, styles.logoutText]}>로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {
              Alert.alert('회원탈퇴', '정말 회원탈퇴를 진행하시겠습니까?', [
                {
                  text: '취소',
                  style: 'cancel',
                },
                {
                  text: '회원탈퇴',
                  onPress: () => {
                    handleWithdrawal();
                  },
                }
              ])
            }
          }>
            <Text style={[styles.menuText, styles.logoutText]}>회원탈퇴</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AccountInfoModal
        visible={isAccountModalVisible}
        onClose={() => setIsAccountModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
  logo: {
    fontSize: 20,
    fontFamily: 'Pacifico',
    color: '#000000',
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: '#4b5563',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 64,
    height: 64,
    backgroundColor: '#e5e7eb',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 24,
    color: '#9ca3af',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#000000',
  },
  weightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#4b5563',
  },
  weightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weightInput: {
    width: 80,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    textAlign: 'right',
  },
  unit: {
    color: '#4b5563',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeInput: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuText: {
    fontSize: 16,
    color: '#1f2937',
  },
  logoutText: {
    color: '#ef4444',
  },
  saveButtonContainer: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#000000',
  },
});

export default SettingScreen;