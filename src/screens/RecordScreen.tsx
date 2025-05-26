import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';
import Header from '../components/header';

type MealTime = '아침' | '점심' | '저녁';

type RecordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Record'>;

const RecordScreen = () => {
  const navigation = useNavigation<RecordScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<MealTime>('아침');

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
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(['아침', '점심', '저녁'] as MealTime[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText,
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Recommended Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>추천 식단</Text>
          <View style={styles.card}>
            {renderMealItem('현미밥', '210')}
            {renderMealItem('된장국', '85')}
            {renderMealItem('고등어구이', '245')}
          </View>
        </View>

        {/* Actual Intake */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>실제 섭취</Text>
          <View style={styles.card}>
            {renderMealItem('현미밥', '210', false)}
            {renderMealItem('된장국', '85', false)}
            {renderMealItem('치킨', '850', false)}
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  dateText: {
    marginLeft: 8,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
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
    fontWeight: '500',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  bottomTab: {
    alignItems: 'center',
  },
  bottomTabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#000',
  },
  inactiveText: {
    color: '#666',
  },
  settingIcon: {
    fontSize: 24,
    color: '#000',
    marginRight: 16,
  },
});

export default RecordScreen;