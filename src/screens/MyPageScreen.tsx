import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/navigator';
import Header from '../components/header';

const { width } = Dimensions.get('window');

type MyPageScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MyPage'>;

const MyPageScreen = () => {
  const navigation = useNavigation<MyPageScreenNavigationProp>();

  const chartData = {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    datasets: [
      {
        data: [63, 62.5, 62, 61.8, 61.5, 61.2, 61],
        color: () => '#4A90E2',
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    style: {
      borderRadius: 16,
    },
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
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: 'https://creatie.ai/ai/api/search-image?query=professional portrait photo of a young asian woman with a friendly smile, clean background, high quality, natural lighting&width=100&height=100&orientation=squarish&flag=b996e1ae-5d62-4ca8-9e1d-242b696de04b&flag=8bcd0ba7-5b15-4b2d-b697-538da6c4da30&flag=c21b257a-d306-451a-b63b-34c013098c84',
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Icon name="camera" size={12} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>김지현</Text>
            <Text style={styles.profileGoal}>목표 체중까지 2kg 남았어요!</Text>
          </View>
        </View>

        <View style={styles.weightSection}>
          <View style={styles.weightHeader}>
            <Text style={styles.weightTitle}>체중 변화</Text>
            <View style={styles.weightButtons}>
              <TouchableOpacity style={styles.activeButton}>
                <Text style={styles.activeButtonText}>주간</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inactiveButton}>
                <Text style={styles.inactiveButtonText}>월간</Text>
              </TouchableOpacity>
            </View>
          </View>
          <LineChart
            data={chartData}
            width={width - 32}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>식단 히스토리</Text>
          
          <View style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyDate}>2024.02.15</Text>
              <View style={styles.calorieTag}>
                <Text style={styles.calorieText}>총 1,850 kcal</Text>
              </View>
            </View>

            <View style={styles.mealItem}>
              <Image
                source={{
                  uri: 'https://creatie.ai/ai/api/search-image?query=healthy korean breakfast with rice, soup, and side dishes&width=80&height=80&flag=795ffce5-c050-405c-af6e-1aad7fe8cae0',
                }}
                style={styles.mealImage}
              />
              <View style={styles.mealInfo}>
                <Text style={styles.mealTitle}>현미밥과 된장찌개</Text>
                <Text style={styles.mealDescription}>
                  아침 | 550 kcal{'\n'}현미밥, 된장찌개, 구운 김
                </Text>
              </View>
            </View>

            <View style={styles.mealItem}>
              <Image
                source={{
                  uri: 'https://creatie.ai/ai/api/search-image?query=healthy korean lunch bowl with rice, grilled salmon, vegetables&width=80&height=80&flag=5e308c69-6797-4c8d-8e73-d872e69d7676',
                }}
                style={styles.mealImage}
              />
              <View style={styles.mealInfo}>
                <Text style={styles.mealTitle}>연어 덮밥</Text>
                <Text style={styles.mealDescription}>
                  점심 | 650 kcal{'\n'}현미밥, 구운 연어, 채소
                </Text>
              </View>
            </View>

            <View style={styles.mealItem}>
              <Image
                source={{
                  uri: 'https://creatie.ai/ai/api/search-image?query=healthy korean dinner with grilled chicken breast and vegetables&width=80&height=80&flag=eeceea2f-b8ef-4c0e-9ca3-69bec2d841b6',
                }}
                style={styles.mealImage}
              />
              <View style={styles.mealInfo}>
                <Text style={styles.mealTitle}>닭가슴살 샐러드</Text>
                <Text style={styles.mealDescription}>
                  저녁 | 650 kcal{'\n'}닭가슴살, 채소, 견과류
                </Text>
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 6,
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
  },
  profileGoal: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  weightSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
  },
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weightTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  weightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  activeButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 16,
  },
  activeButtonText: {
    color: '#000000',
    fontSize: 12,
  },
  inactiveButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  inactiveButtonText: {
    color: '#6B7280',
    fontSize: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  historySection: {
    backgroundColor: '#ffffff',
    padding: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  historyCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  calorieTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  calorieText: {
    fontSize: 12,
    color: '#000000',
  },
  mealItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  mealInfo: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  mealDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  settingIcon: {
    fontSize: 24,
    color: '#000',
    marginRight: 16,
  },
});

export default MyPageScreen; 