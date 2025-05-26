import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RecordScreen, HomeScreen, MyPageScreen } from '../index';

const Tab = createBottomTabNavigator();

const BottomBar = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                    paddingVertical: 8,
                },
                tabBarActiveTintColor: '#000000',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarLabelStyle: {
                    fontSize: 14,
                    fontWeight: '500',
                },
            }}
            initialRouteName="Home"
        >
            <Tab.Screen
                name="Record"
                component={RecordScreen}
                options={{
                    tabBarLabel: '기록',
                    tabBarLabelStyle: {
                        fontSize: 14,
                        fontWeight: '500',
                    },
                    tabBarIcon: ({ focused }) => (
                        <Icon name="history" size={20} color={focused ? '#000000' : '#999'} />
                    ),
                }
            }
            />
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: '홈',
                    tabBarLabelStyle: {
                        fontSize: 14,
                        fontWeight: '500',
                    },
                    tabBarIcon: ({ focused }) => (
                        <Icon name="home" size={20} color={focused ? '#000000' : '#999'} />
                    ),
                }
            }
            />
            <Tab.Screen
                name="My"
                component={MyPageScreen}
                options={{
                    tabBarLabel: '마이',
                    tabBarLabelStyle: {
                        fontSize: 14,
                        fontWeight: '500',
                    },
                    tabBarIcon: ({ focused }) => (
                        <Icon name="user" size={20} color={focused ? '#000000' : '#999'} />
                    ),
                }
            }
            />
        </Tab.Navigator>
    );
}

export default BottomBar;