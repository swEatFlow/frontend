import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';
import Header from '../components/header';

const { width } = Dimensions.get('window');

const meals = [
  {
    id: '1',
    title: '아침',
    calories: '400 kcal',
    image: 'https://creatie.ai/ai/api/search-image?query=A healthy breakfast with eggs, avocado toast, and fresh fruits arranged on a white plate with a clean, minimalist background. The lighting is bright and natural, creating an appetizing presentation.&width=80&height=80&orientation=squarish',
    items: ['계란 스크램블', '통밀 토스트', '아보카도'],
  },
  {
    id: '2',
    title: '점심',
    calories: '450 kcal',
    image: 'https://creatie.ai/ai/api/search-image?query=A healthy lunch bowl featuring grilled chicken, quinoa, fresh vegetables, and a light vinaigrette dressing. The presentation is clean and appetizing on a white background with natural lighting.&width=80&height=80&orientation=squarish',
    items: ['닭가슴살 샐러드', '퀴노아', '채소 믹스'],
  },
  {
    id: '3',
    title: '저녁',
    calories: '350 kcal',
    image: 'https://creatie.ai/ai/api/search-image?query=A light and healthy dinner plate with grilled salmon, steamed vegetables, and brown rice. The food is arranged beautifully on a white plate with clean, minimalist styling and natural lighting.&width=80&height=80&orientation=squarish',
    items: ['연어구이', '현미밥', '찐 채소'],
  },
];

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigation = useNavigation<HomeScreenNavigationProp>();

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
      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        <View style={styles.dateSection}>
          <Text style={styles.dateSubtitle}>목표 설정 후</Text>
          <Text style={styles.dateTitle}>D+15일차</Text>
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
            <View key={meal.id} style={styles.slide}>
              <View style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTitle}>{meal.title}</Text>
                  <Text style={styles.mealCalories}>{meal.calories}</Text>
                </View>
                <View style={styles.mealContent}>
                  <Image
                    source={{ uri: meal.image }}
                    style={styles.mealImage}
                    resizeMode="cover"
                  />
                  <View style={styles.mealItems}>
                    {meal.items.map((item, index) => (
                      <Text key={index} style={styles.mealItem}>
                        {item}
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
      </ScrollView>
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
  mealCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
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
    alignItems: 'center',
  },
  mealItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
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
});

export default HomeScreen;