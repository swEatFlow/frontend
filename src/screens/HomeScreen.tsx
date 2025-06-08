import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';
import Header from '../components/header';
import { getItem } from '../store/useStore';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type Meal = {
  meal: string;
  dish_name: string;
  items: string[];
}

type TodayMeal = {
  morning_list: string[];
  afternoon_list: string[];
  evening_list: string[];
  kcal: string[];
  date: string;
}

type MealResponse = {
  status: "success" | "failed";
  meals: Meal[];
}

type MealInput = {
  meal: string;
  dish_name: string;
  items: string[];
}

export const HomeScreen = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [purpose, setPurpose] = useState('');
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMealInput, setShowMealInput] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [mealInput, setMealInput] = useState<MealInput>({
    meal: '',
    dish_name: '',
    items: []
  });
  const [currentItem, setCurrentItem] = useState('');

  const initPurpose = async () => {
    const token = await getItem("token");
    const response = await fetch("http://10.0.2.2:8000/api/v1/users/my", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }).then(res => res.json());
    setPurpose(response.purpose);
  };

  const convertTodayMealToMeal = (todayMeal: TodayMeal): Meal[] => {
    const convertedMeals: Meal[] = [];
    
    if (todayMeal.morning_list.length > 0) {
      convertedMeals.push({
        meal: '아침',
        dish_name: todayMeal.morning_list[0],
        items: todayMeal.morning_list
      });
    }
    
    if (todayMeal.afternoon_list.length > 0) {
      convertedMeals.push({
        meal: '점심',
        dish_name: todayMeal.afternoon_list[0],
        items: todayMeal.afternoon_list
      });
    }
    
    if (todayMeal.evening_list.length > 0) {
      convertedMeals.push({
        meal: '저녁',
        dish_name: todayMeal.evening_list[0],
        items: todayMeal.evening_list
      });
    }
    
    return convertedMeals;
  };

  const checkMealHistory = async (): Promise<MealResponse> => {
    const token = await getItem("token");
    const response = await fetch("http://10.0.2.2:8000/api/v1/meal/history/today", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }).then(res => res.json());
    console.log('Today response:', response);
    
    if (response && response.length > 0) {
      return {
        status: "success",
        meals: convertTodayMealToMeal(response[0])
      };
    }
    return { status: "failed", meals: [] };
  };

  const initMeal = async () => {
    const token = await getItem("token");
    const response = await fetch("http://10.0.2.2:8000/api/v1/meal/recommend", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }).then(res => res.json());
    console.log(response);
    setMeals(response);
  };

  const updateMealHistory = async (meal: Meal) => {
    try {
      const token = await getItem("token");
      const response = await fetch("http://10.0.2.2:8000/api/v1/meal/history", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          meal: meal.meal,
          dish_name: meal.dish_name,
          items: meal.items
        })
      });
      
      if (response.ok) {
        Alert.alert("성공", "실제 식단이 기록되었습니다.");
        // 업데이트 후 오늘의 식사 기록 다시 불러오기
        const history = await checkMealHistory();
        if (history.status !== "failed") {
          setMeals(history.meals);
        }
      } else {
        Alert.alert("실패", "식단 기록에 실패했습니다.");
      }
    } catch (error) {
      console.error('Error updating meal history:', error);
      Alert.alert("오류", "식단 기록 중 오류가 발생했습니다.");
    }
  };

  const handleAddItem = () => {
    if (currentItem.trim()) {
      setMealInput(prev => ({
        ...prev,
        items: [...prev.items, currentItem.trim()]
      }));
      setCurrentItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setMealInput(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSaveMeal = async () => {
    if (!mealInput.dish_name || mealInput.items.length === 0) {
      Alert.alert("입력 오류", "음식 이름과 재료를 입력해주세요.");
      return;
    }

    await updateMealHistory(mealInput);
    setShowMealInput(false);
    setMealInput({
      meal: '',
      dish_name: '',
      items: []
    });
  };

  const MealInputModal = () => (
    <Modal
      visible={showMealInput}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedMealType} 식사 입력</Text>
          
          <Text style={styles.inputLabel}>음식 이름</Text>
          <TextInput
            style={styles.input}
            value={mealInput.dish_name}
            onChangeText={(text) => setMealInput(prev => ({ ...prev, dish_name: text }))}
            placeholder="예: 된장찌개"
          />

          <Text style={styles.inputLabel}>재료</Text>
          <View style={styles.itemInputContainer}>
            <TextInput
              style={styles.itemInput}
              value={currentItem}
              onChangeText={setCurrentItem}
              placeholder="재료 입력 후 + 버튼을 눌러주세요"
              onSubmitEditing={handleAddItem}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.itemsList}>
            {mealInput.items.map((item, index) => (
              <View key={index} style={styles.itemChip}>
                <Text style={styles.itemChipText}>{item}</Text>
                <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                  <Text style={styles.removeItemText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => setShowMealInput(false)}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]} 
              onPress={handleSaveMeal}
            >
              <Text style={styles.saveButtonText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await initPurpose();
        const history = await checkMealHistory();
        if (history.status === "failed") {
          await initMeal();
        } else {
          setMeals(history.meals);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveSlide(Math.round(index));
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
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <ScrollView style={styles.mainContent}>
        <View style={styles.dateSection}>
          <Text style={styles.dateSubtitle}>오늘의 추천 식단</Text>
          <Text style={styles.dateTitle}>목표: {purpose}</Text>
        </View>

        {/* Meal Slider */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.slider}
        >
          {meals.map((meal) => (
            <View key={meal.meal} style={styles.slide}>
              <View style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTitle}>{meal.meal}</Text>
                  <Text style={styles.mealDishName}>{meal.dish_name}</Text>
                </View>
                <View style={styles.mealContent}>
                  <View style={styles.mealItems}>
                    {meal.items.map((item, index) => (
                      <Text key={index} style={styles.mealItem}>
                        • {item}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Slider Dots */}
        <View style={styles.dotsContainer}>
          {meals.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeSlide && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* Meal Input Buttons */}
        <View style={styles.mealInputButtons}>
          {['아침', '점심', '저녁'].map((mealType) => (
            <TouchableOpacity
              key={mealType}
              style={styles.mealInputButton}
              onPress={() => {
                setSelectedMealType(mealType);
                setMealInput(prev => ({ ...prev, meal: mealType }));
                setShowMealInput(true);
              }}
            >
              <Text style={styles.mealInputButtonText}>{mealType} 식사 입력</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <MealInputModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  dateSection: {
    paddingVertical: 16,
  },
  dateSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  dateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  slider: {
    marginBottom: 32,
  },
  slide: {
    width: width - 32,
    height: width * 1.2,
  },
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: '100%',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealDishName: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  mealContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  mealImage: {
    width: 144,
    height: 144,
    borderRadius: 8,
  },
  mealItems: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 16,
  },
  mealItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#999',
  },
  activeNavText: {
    color: '#000',
  },
  settingIcon: {
    fontSize: 24,
    color: '#000',
    marginRight: 16,
  },
  updateButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  itemInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  itemInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4F46E5',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  itemsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  itemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  itemChipText: {
    color: '#374151',
    marginRight: 4,
  },
  removeItemText: {
    color: '#6B7280',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  mealInputButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  mealInputButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  mealInputButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HomeScreen;