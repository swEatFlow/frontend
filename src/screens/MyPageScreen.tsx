import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';
import Header from '../components/header';
import { getItem } from '../store/useStore';

type MyPageScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MyPage'>;

const MyPageScreen = () => {
  const navigation = useNavigation<MyPageScreenNavigationProp>();
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    age: '',
    sex: -1,
    activity_level: -1,
    purpose: '',
    lifestyle: '',
    disease: '',
    allergies: ''
  });
  const [processedDiseases, setProcessedDiseases] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await getItem("token");
        const response = await fetch("http://10.0.2.2:8000/api/v1/users/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        setUserInfo(data);
        // Process disease string into array
        if (data.disease) {
          const diseases = data.disease.split(',').map((disease: string) => disease.trim());
          setProcessedDiseases(diseases);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  const getGenderText = (sex: number) => {
    return sex === 0 ? '남성' : sex === 1 ? '여성' : '미설정';
  };

  const getActivityLevelText = (level: number) => {
    switch (level) {
      case 0: return '낮음 (주 0-2일 운동)';
      case 1: return '중간 (주 3-4일 운동)';
      case 2: return '높음 (주 5-7일 운동)';
      default: return '미설정';
    }
  };

  const getLifestyleText = (lifestyle: string) => {
    switch (lifestyle) {
      case '0': return '거의 없음';
      case '1-2': return '주 1-2회';
      case '3-4': return '주 3-4회';
      case '5-6': return '주 5-6회';
      case '7+': return '매일';
      default: return '미설정';
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Header />,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
          <Text style={styles.settingIcon}>⚙️</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userInfo.username}</Text>
            <Text style={styles.profileEmail}>{userInfo.email}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>기본 정보</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>나이</Text>
              <Text style={styles.infoValue}>{userInfo.age}세</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>성별</Text>
              <Text style={styles.infoValue}>{getGenderText(userInfo.sex)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>활동량</Text>
              <Text style={styles.infoValue}>{getActivityLevelText(userInfo.activity_level)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>목표 및 생활패턴</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>목표</Text>
              <Text style={styles.infoValue}>{userInfo.purpose || '미설정'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>외식 빈도</Text>
              <Text style={styles.infoValue}>{getLifestyleText(userInfo.lifestyle)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>관련 질병</Text>
          <View style={styles.infoCard}>
            {processedDiseases.length > 0 ? (
              <View style={styles.diseaseContainer}>
                {processedDiseases.map((disease: string, index: number) => (
                  <View key={index} style={styles.diseaseChip}>
                    <Text style={styles.diseaseText}>{disease}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noDiseaseText}>등록된 질병이 없습니다.</Text>
            )}
          </View>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>알레르기</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoValue}>{userInfo.allergies}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  infoSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: 16,
    color: '#4B5563',
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  diseaseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  diseaseChip: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  diseaseText: {
    fontSize: 14,
    color: '#374151',
  },
  noDiseaseText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  settingIcon: {
    fontSize: 24,
    color: '#000',
    marginRight: 16,
  },
});

export default MyPageScreen;