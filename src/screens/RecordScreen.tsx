import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';
import Header from '../components/header';

type MealTime = '아침' | '점심' | '저녁';

type RecordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Record'>;

const RecordScreen = () => {
  const navigation = useNavigation<RecordScreenNavigationProp>();

  const renderMealItem = (name: string, calories: string, isRecommended: boolean = true) => (
    <View style={styles.mealItem}>
      <View>
        <Text style={[styles.mealName, !isRecommended && styles.redText]}>{name}</Text>
        <Text style={[styles.calories, !isRecommended && styles.redText]}>{calories} kcal</Text>
      </View>
      {isRecommended && (
        <TouchableOpacity style={styles.changeButton}>
          <Text style={styles.changeButtonText}>변경</Text>
        </TouchableOpacity>
      )}
    </View>
  );

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
      <ScrollView style={styles.scrollView}>
        {/* 2024.02.15 */}
        <View style={styles.dateSection}>
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>2024.02.15</Text>
            <View style={styles.calorieTag}>
              <Text style={styles.calorieText}>총 1,200 kcal</Text>
            </View>
          </View>

          {/* 아침 식사 */}
          <Text style={styles.mealTimeText}>아침</Text>
          <View style={styles.mealCard}>
            <View style={styles.mealContent}>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: 'https://readdy.ai/api/search-image?query=Korean%20brown%20rice%20bowl%20with%20doenjang%20jjigae%20soup%2C%20traditional%20Korean%20meal%20with%20side%20dishes%2C%20egg%2C%20vegetables%2C%20and%20soup%2C%20food%20photography%20style%2C%20isolated%20on%20white%20background%2C%20centered%20composition&width=200&height=200&seq=1&orientation=squarish'
                  }}
                  style={styles.mealImage}
                />
              </View>
              <View style={styles.mealInfo}>
                <Text style={styles.mealTitle}>현미밥과 된장찌개</Text>
                <Text style={styles.mealDetail}>아침 | 550 kcal</Text>
                <Text style={styles.mealDetail}>현미밥, 된장찌개, 구운 김</Text>
              </View>
            </View>
          </View>

          <Text style={styles.mealTimeText}>점심</Text>
          <View style={styles.mealCard}>
            <View style={styles.mealContent}>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: 'https://readdy.ai/api/search-image?query=Korean%20salmon%20rice%20bowl%20with%20fresh%20vegetables%2C%20grilled%20salmon%20on%20top%20of%20white%20rice%20with%20cucumber%20and%20carrot%20slices%2C%20food%20photography%20style%2C%20isolated%20on%20white%20background%2C%20centered%20composition&width=200&height=200&seq=2&orientation=squarish'
                  }}
                  style={styles.mealImage}
                />
              </View>
              <View style={styles.mealInfo}>
                <Text style={styles.mealTitle}>연어 덮밥</Text>
                <Text style={styles.mealDetail}>점심 | 650 kcal</Text>
                <Text style={styles.mealDetail}>현미밥, 구운 연어, 채소</Text>
              </View>
            </View>
          </View>

          <Text style={styles.mealTimeText}>저녁</Text>
          <View style={styles.emptyMealCard}>
            <Text style={styles.emptyMealText}>식사를 하지 않음</Text>
          </View>
        </View>

        {/* 2024.02.14 */}
        <View style={styles.dateSection}>
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>2024.02.14</Text>
            <View style={styles.calorieTag}>
              <Text style={styles.calorieText}>총 1,750 kcal</Text>
            </View>
          </View>

          <Text style={styles.mealTimeText}>아침</Text>
          <View style={styles.mealCard}>
            <View style={styles.mealContent}>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: 'https://readdy.ai/api/search-image?query=Oatmeal%20breakfast%20bowl%20with%20fresh%20fruits%2C%20blueberries%2C%20strawberries%20and%20banana%20slices%2C%20healthy%20morning%20meal%20in%20a%20ceramic%20bowl%2C%20food%20photography%20style%2C%20isolated%20on%20white%20background%2C%20centered%20composition&width=200&height=200&seq=3&orientation=squarish'
                  }}
                  style={styles.mealImage}
                />
              </View>
              <View style={styles.mealInfo}>
                <Text style={styles.mealTitle}>오트밀 과일볼</Text>
                <Text style={styles.mealDetail}>아침 | 450 kcal</Text>
                <Text style={styles.mealDetail}>오트밀, 계절과일, 꿀</Text>
              </View>
            </View>
          </View>

          <Text style={styles.mealTimeText}>점심</Text>
          <View style={styles.mealCard}>
            <View style={styles.mealContent}>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: 'https://readdy.ai/api/search-image?query=Quinoa%20salad%20with%20mixed%20vegetables%2C%20cherry%20tomatoes%2C%20cucumber%2C%20bell%20peppers%20in%20a%20wooden%20bowl%2C%20healthy%20lunch%20option%2C%20food%20photography%20style%2C%20isolated%20on%20white%20background%2C%20centered%20composition&width=200&height=200&seq=4&orientation=squarish'
                  }}
                  style={styles.mealImage}
                />
              </View>
              <View style={styles.mealInfo}>
                <Text style={styles.mealTitle}>퀴노아 샐러드</Text>
                <Text style={styles.mealDetail}>점심 | 550 kcal</Text>
                <Text style={styles.mealDetail}>퀴노아, 닭가슴살, 채소</Text>
              </View>
            </View>
          </View>

          <Text style={styles.mealTimeText}>저녁</Text>
          <View style={styles.mealCard}>
            <View style={styles.mealContent}>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: 'https://readdy.ai/api/search-image?query=Grilled%20beef%20steak%20with%20roasted%20vegetables%20on%20a%20white%20plate%2C%20medium%20rare%20steak%20with%20asparagus%20and%20potatoes%2C%20dinner%20meal%2C%20food%20photography%20style%2C%20isolated%20on%20white%20background%2C%20centered%20composition&width=200&height=200&seq=5&orientation=squarish'
                  }}
                  style={styles.mealImage}
                />
              </View>
              <View style={styles.mealInfo}>
                <Text style={styles.mealTitle}>두부 스테이크</Text>
                <Text style={styles.mealDetail}>저녁 | 750 kcal</Text>
                <Text style={styles.mealDetail}>두부 스테이크, 구운 채소</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  calorieTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  calorieText: {
    fontSize: 14,
    color: '#000000',
  },
  mealTimeText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  mealContent: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  mealInfo: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  mealDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  emptyMealCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  emptyMealText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  settingIcon: {
    fontSize: 24,
    color: '#000',
    marginRight: 16,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
  },
  calories: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  redText: {
    color: '#ff4444',
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  changeButtonText: {
    fontSize: 14,
    color: '#666',
  },
});

export default RecordScreen;