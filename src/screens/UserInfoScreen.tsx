import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';
import { getItem } from '../store/useStore';
import { Alert } from 'react-native';

type UserInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserInfo'>;

const UserInfoScreen = () => {
  const navigation = useNavigation<UserInfoScreenNavigationProp>();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState(-1); // 0: 남성, 1: 여성
  const [activity, setActivity] = useState(-1); // 0: 낮음, 1: 중간, 2: 높음
  const [goal, setGoal] = useState('');
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [eatingOutFrequency, setEatingOutFrequency] = useState('-1');
  const [searchDisease, setSearchDisease] = useState('');

  const commonDiseases = [
    '당뇨병',
    '고혈압',
    '고지혈증',
    '위장질환',
    '관절염',
    '갑상선질환',
  ];

  useEffect(() => {
    const initUserInfo = async () => {
      const token = await getItem("token");
      const result = await fetch("http://10.0.2.2:8000/api/v1/users/user-check", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }).then(res => res.json());

      if (result.status === "setting") {
        const response = await fetch("http://10.0.2.2:8000/api/v1/users/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }).then(res => res.json());

        setAge(response.age.toString());
        setGender(response.sex);
        setActivity(response.activity_level);
        setGoal(response.purpose);
        setEatingOutFrequency(response.lifestyle);
        setSelectedDiseases(response.disease.split(','));
      }
    };
    initUserInfo();
  }, [])

  const toggleDisease = (disease: string) => {
    if (selectedDiseases.includes(disease)) {
      setSelectedDiseases(selectedDiseases.filter(d => d !== disease));
    } else {
      setSelectedDiseases([...selectedDiseases, disease]);
    }
  };

  const handleAddDisease = (disease: string) => {
    if (disease.trim() && !selectedDiseases.includes(disease.trim())) {
      setSelectedDiseases([...selectedDiseases, disease.trim()]);
      setSearchDisease('');
    }
  };

  const renderDiseaseChip = (disease: string) => (
    <TouchableOpacity
      key={disease}
      style={[
        styles.diseaseChip,
        selectedDiseases.includes(disease) && styles.selectedDiseaseChip,
      ]}
      onPress={() => toggleDisease(disease)}
    >
      <Text
        style={[
          styles.diseaseChipText,
          selectedDiseases.includes(disease) && styles.selectedDiseaseChipText,
        ]}
      >
        {disease}
      </Text>
    </TouchableOpacity>
  );

  const handleSave = async () => {
    if (age === '') {
      Alert.alert("나이를 입력하세요.");
      return ;
    }
    if (gender === -1) {
      Alert.alert("성별을 선택해주세요.");
      return ;
    }
    if (activity === -1) {
      Alert.alert("활동량을 선택해주세요.");
      return ;
    }
    if (goal === '') {
      Alert.alert("목표를 설정해주세요.");
      return ;
    }
    if (eatingOutFrequency === '-1') {
      Alert.alert("외식 빈도를 선택해주세요.");
      return ;
    }
    try {
      const token = await getItem('token');
      const response = await fetch("http://10.0.2.2:8000/api/v1/users/user-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          sex: gender,
          age: parseInt(age),
          activity_level: activity,
          purpose: goal,
          lifestyle: eatingOutFrequency,
          disease: selectedDiseases
        })
      });
      if (response.ok) {
        Alert.alert("유저 정보가 업데이트 되었습니다.");
        navigation.navigate("MainTabs");
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>초기 정보 설정</Text>
      </View>
      <ScrollView style={styles.content}>
        {/* 기본 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기본 정보</Text>
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                나이 <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.ageInputContainer}>
                <TextInput
                  style={styles.ageInput}
                  value={age}
                  onChangeText={(text) => setAge(text)}
                  keyboardType="numeric"
                  placeholder="나이를 입력해주세요"
                />
                <Text style={styles.ageUnit}>세</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                성별 <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 0 && styles.selectedGenderButton,
                  ]}
                  onPress={() => setGender(0)}
                >
                  <Text style={styles.genderIcon}>👨</Text>
                  <Text style={styles.genderText}>남성</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 1 && styles.selectedGenderButton,
                  ]}
                  onPress={() => setGender(1)}
                >
                  <Text style={styles.genderIcon}>👩</Text>
                  <Text style={styles.genderText}>여성</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* 활동량 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            활동량 <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.activityContainer}>
            {[
              {
                value: 2,
                icon: '🏃',
                title: '높음',
                description: '주 5-7일 운동, 활발한 생활 패턴',
              },
              {
                value: 1,
                icon: '🚶',
                title: '중간',
                description: '주 3-4일 운동, 보통의 활동량',
              },
              {
                value: 0,
                icon: '🪑',
                title: '낮음',
                description: '주 0-2일 운동, 좌식 생활 위주',
              },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.activityCard,
                  activity === item.value && styles.selectedActivityCard,
                ]}
                onPress={() => setActivity(item.value)}
              >
                <View style={styles.activityIconContainer}>
                  <Text style={styles.activityIcon}>{item.icon}</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activityDescription}>
                    {item.description}
                  </Text>
                </View>
                {activity === item.value && (
                  <View style={styles.checkIcon}>
                    <Text style={styles.checkIconText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 목표 설정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            목표 설정 <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.goalContainer}>
            {[
              {
                value: '체중 감량',
                icon: '⚖️',
                title: '체중 감량',
                description: '건강한 식습관과 운동으로 체중 감소',
              },
              {
                value: '근육량 증가',
                icon: '💪',
                title: '근육량 증가',
                description: '단백질 섭취와 근력 운동으로 근육 발달',
              },
              {
                value: '체형 유지',
                icon: '❤️',
                title: '체형 유지',
                description: '현재 체형을 유지하며 건강 관리',
              },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.goalCard,
                  goal === item.value && styles.selectedGoalCard,
                ]}
                onPress={() => setGoal(item.value)}
              >
                <View style={styles.goalIconContainer}>
                  <Text style={styles.goalIcon}>{item.icon}</Text>
                </View>
                <View style={styles.goalContent}>
                  <Text style={styles.goalTitle}>{item.title}</Text>
                  <Text style={styles.goalDescription}>
                    {item.description}
                  </Text>
                </View>
                {goal === item.value && (
                  <View style={styles.checkIcon}>
                    <Text style={styles.checkIconText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 질병 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>질병 정보</Text>
          <View style={styles.card}>
            <Text style={styles.diseaseDescription}>
              관련 질병이 있다면 선택해주세요. 맞춤 식단 추천에 활용됩니다.
            </Text>
            <View style={styles.diseaseSearchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.diseaseSearch}
                placeholder="질병을 입력하세요"
                value={searchDisease}
                onChangeText={setSearchDisease}
                onSubmitEditing={() => handleAddDisease(searchDisease)}
                returnKeyType="done"
              />
            </View>
            <View style={styles.selectedDiseasesContainer}>
              {selectedDiseases.map((disease) => (
                <View key={disease} style={styles.selectedDiseaseChip}>
                  <Text style={styles.selectedDiseaseChipText}>{disease}</Text>
                  <TouchableOpacity
                    onPress={() => toggleDisease(disease)}
                    style={styles.removeDiseaseButton}
                  >
                    <Text style={styles.removeDiseaseIcon}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <Text style={styles.commonDiseasesTitle}>일반적인 질병</Text>
            <View style={styles.diseaseChipsContainer}>
              {commonDiseases.map(renderDiseaseChip)}
            </View>
          </View>
        </View>

        {/* 라이프스타일 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>라이프스타일</Text>
            <View style={styles.lifestyleGroup}>
              <Text style={styles.label}>주간 외식 빈도</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={eatingOutFrequency}
                  onValueChange={setEatingOutFrequency}
                  style={styles.picker}
                >
                  <Picker.Item label="선택해주세요." value="-1" />
                  <Picker.Item label="거의 없음" value="0" />
                  <Picker.Item label="주 1-2회" value="1-2" />
                  <Picker.Item label="주 3-4회" value="3-4" />
                  <Picker.Item label="주 5-6회" value="5-6" />
                  <Picker.Item label="매일" value="7+" />
                </Picker>
              </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomButton}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>프로필 저장하기</Text>
        </TouchableOpacity>
      </View>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  logo: {
    fontSize: 20,
    fontFamily: 'Pacifico',
    color: '#4F46E5',
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
    fontWeight: '600',
    marginBottom: 16,
  },
  required: {
    color: '#ef4444',
  },
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  ageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  ageUnit: {
    position: 'absolute',
    right: 16,
    color: '#6b7280',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  genderButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  selectedGenderButton: {
    borderColor: '#4F46E5',
    backgroundColor: 'rgba(79, 70, 229, 0.05)',
  },
  genderIcon: {
    fontSize: 20,
  },
  genderText: {
    fontSize: 16,
  },
  activityContainer: {
    gap: 12,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  selectedActivityCard: {
    borderColor: '#4F46E5',
    backgroundColor: 'rgba(79, 70, 229, 0.05)',
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityIcon: {
    fontSize: 24,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIconText: {
    color: '#ffffff',
    fontSize: 16,
  },
  goalContainer: {
    gap: 12,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  selectedGoalCard: {
    borderColor: '#4F46E5',
    backgroundColor: 'rgba(79, 70, 229, 0.05)',
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalIcon: {
    fontSize: 24,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  diseaseDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  diseaseSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  diseaseSearch: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  selectedDiseasesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  selectedDiseaseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedDiseaseChipText: {
    color: '#4F46E5',
    fontSize: 14,
  },
  removeDiseaseButton: {
    marginLeft: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeDiseaseIcon: {
    color: '#4F46E5',
    fontSize: 12,
  },
  commonDiseasesTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  diseaseChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  diseaseChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  diseaseChipText: {
    fontSize: 14,
    color: '#374151',
  },
  lifestyleGroup: {
    marginBottom: 24,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  sliderValue: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  picker: {
    height: 55,
  },
  bottomButton: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default UserInfoScreen; 