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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';
import Header from '../components/header';
import { getItem } from '../store/useStore';

type RecordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Record'>;

const RecordScreen = () => {
  const navigation = useNavigation<RecordScreenNavigationProp>();
  const [records, setRecords] = useState<any[]>([]);

  const initRecord = async () => {
    const token = await getItem("token");
    const response = await fetch("http://10.0.2.2:8000/api/v1/meal/history", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }).then(res => res.json());
    setRecords(response);
  };

  useFocusEffect(
    React.useCallback(() => {
      initRecord();
    }, [])
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
        {records.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>기록이 없습니다</Text>
          </View>
        ) : (
          records.map((record, index) => {
            return (
              <View style={styles.dateSection} key={index}>
                <View style={styles.dateHeader}>
                  <Text style={styles.dateText}>{record.date}</Text>
                  <View style={styles.calorieTag}>
                    <Text style={styles.calorieText}>{record.kcal.reduce((acc: number, cur: string) => {return acc += parseInt(cur)}, 0).toLocaleString()} kcal</Text>
                  </View>
                </View>
                {record.morning_list.length > 0 ? (
                  <>
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
                          {record.morning_list.map((meal: any, index: number) => {
                            return (
                              <Text key={`morning-${index}`} style={styles.mealDetail}>{meal}</Text>
                            )
                          })}
                        </View>
                        <View style={styles.mealInfo}>
                          <Text style={styles.mealKcal}>총 칼로리</Text>
                          <Text style={styles.mealKcal}>{parseInt(record.kcal[0]).toLocaleString()} kcal</Text>
                        </View>
                      </View>
                    </View>
                  </>
                ) : (
                  <View style={styles.emptyMealCard}>
                    <Text style={styles.emptyMealText}>식사를 하지 않음</Text>
                  </View>
                )}
                {record.afternoon_list.length > 0 ? (
                  <>
                    <Text style={styles.mealTimeText}>점심</Text>
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
                          {record.afternoon_list.map((meal: any, index: number) => {
                            return (
                              <Text key={`afternoon-${index}`} style={styles.mealDetail}>{meal}</Text>
                            )
                          })}
                        </View>
                        <View style={styles.mealInfo}>
                          <Text style={styles.mealKcal}>총 칼로리</Text>
                          <Text style={styles.mealKcal}>{parseInt(record.kcal[1]).toLocaleString()} kcal</Text>
                        </View>
                      </View>
                    </View>
                  </>
                ) : (
                  <View style={styles.emptyMealCard}>
                    <Text style={styles.emptyMealText}>식사를 하지 않음</Text>
                  </View>
                )}
                {record.evening_list.length > 0 ? (
                  <>
                    <Text style={styles.mealTimeText}>저녁</Text>
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
                          {record.evening_list.map((meal: any, index: number) => {
                            return (
                              <Text key={`evening-${index}`} style={styles.mealDetail}>{meal}</Text>
                            )
                          })}
                        </View>
                        <View style={styles.mealInfo}>
                          <Text style={styles.mealKcal}>총 칼로리</Text>
                          <Text style={styles.mealKcal}>{parseInt(record.kcal[2]).toLocaleString()} kcal</Text>
                        </View>
                      </View>
                    </View>
                  </>
                ) : (
                  <View style={styles.emptyMealCard}>
                    <Text style={styles.emptyMealText}>식사를 하지 않음</Text>
                  </View>
                )}
                
              </View>
            )
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
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
  mealDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
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
  mealKcal: {
    fontSize: 14,
    color: '#000000',
    marginTop: 4,
    fontWeight: 'semibold',
  },
});

export default RecordScreen;