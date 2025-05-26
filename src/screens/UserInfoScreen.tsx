import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';

type UserInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserInfo'>;

const UserInfoScreen = () => {
  const navigation = useNavigation<UserInfoScreenNavigationProp>();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activity, setActivity] = useState('');
  const [goal, setGoal] = useState('');
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [mealPrepTime, setMealPrepTime] = useState(30);
  const [eatingOutFrequency, setEatingOutFrequency] = useState('3-4');

  const commonDiseases = [
    '당뇨병',
    '고혈압',
    '고지혈증',
    '위장질환',
    '관절염',
    '갑상선질환',
  ];

  const toggleDisease = (disease: string) => {
    if (selectedDiseases.includes(disease)) {
      setSelectedDiseases(selectedDiseases.filter(d => d !== disease));
    } else {
      setSelectedDiseases([...selectedDiseases, disease]);
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

  const handleSave = () => {
    navigation.navigate('MainTabs');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>프로필 설정</Text>
        </View>
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
                  onChangeText={setAge}
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
                    gender === 'male' && styles.selectedGenderButton,
                  ]}
                  onPress={() => setGender('male')}
                >
                  <Text style={styles.genderIcon}>👨</Text>
                  <Text style={styles.genderText}>남성</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'female' && styles.selectedGenderButton,
                  ]}
                  onPress={() => setGender('female')}
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
                value: 'high',
                icon: '🏃',
                title: '높음',
                description: '주 5-7일 운동, 활발한 생활 패턴',
              },
              {
                value: 'medium',
                icon: '🚶',
                title: '중간',
                description: '주 3-4일 운동, 보통의 활동량',
              },
              {
                value: 'low',
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
                value: 'weight_loss',
                icon: '⚖️',
                title: '체중 감량',
                description: '건강한 식습관과 운동으로 체중 감소',
              },
              {
                value: 'muscle_gain',
                icon: '💪',
                title: '근육량 증가',
                description: '단백질 섭취와 근력 운동으로 근육 발달',
              },
              {
                value: 'maintain',
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
                placeholder="질병을 검색하세요"
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
          <View style={styles.card}>
            <View style={styles.lifestyleGroup}>
              <Text style={styles.label}>식사 준비 가능 시간</Text>
              <Slider
                style={styles.slider}
                minimumValue={5}
                maximumValue={60}
                step={5}
                value={mealPrepTime}
                onValueChange={setMealPrepTime}
                minimumTrackTintColor="#4F46E5"
                maximumTrackTintColor="#e2e8f0"
                thumbTintColor="#4F46E5"
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>5분</Text>
                <Text style={styles.sliderValue}>{mealPrepTime}분</Text>
                <Text style={styles.sliderLabel}>60분</Text>
              </View>
            </View>

            <View style={styles.lifestyleGroup}>
              <Text style={styles.label}>주간 외식 빈도</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={eatingOutFrequency}
                  onValueChange={setEatingOutFrequency}
                  style={styles.picker}
                >
                  <Picker.Item label="거의 없음" value="0" />
                  <Picker.Item label="주 1-2회" value="1-2" />
                  <Picker.Item label="주 3-4회" value="3-4" />
                  <Picker.Item label="주 5-6회" value="5-6" />
                  <Picker.Item label="매일" value="7+" />
                </Picker>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomButton}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText} onPress={handleSave}>프로필 저장하기</Text>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#4b5563',
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
    height: 48,
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