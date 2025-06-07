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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';
import Header from '../components/header';
import { getItem } from '../store/useStore';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type Meal = {
  id: string;
  title: string;
  dish_name: string;
  image: string;
  items: string[];
}

export const HomeScreen = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [purpose, setPurpose] = useState('');
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [meals, setMeals] = useState<Meal[]>([]);

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

  const initMeal = async () => {
    const token = await getItem("token");
    const response = await fetch("http://10.0.2.2:8000/api/v1/meal/recommend", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }).then(res => res.json());
    setMeals(response);
  };

  useFocusEffect(
    React.useCallback(() => {
      initPurpose();
      initMeal();
    }, [])
  );

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
          <Text style={styles.dateSubtitle}>오늘의 추천 식단</Text>
          <Text style={styles.dateTitle}>{purpose}</Text>
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
                  <Text style={styles.mealDishName}>{meal.dish_name}</Text>
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
});

export default HomeScreen;