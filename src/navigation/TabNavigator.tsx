import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text } from 'react-native'
import { TabParamList } from '../types'
import NovoAchadoScreen from '../screens/NovoAchadoScreen'
import AlbumScreen from '../screens/AlbumScreen'
import { colors } from '../theme'

const Tab = createBottomTabNavigator<TabParamList>()

const ICONS: Record<keyof TabParamList, string> = {
    Novo: '📝',
    Album: '📚',
}

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.muted,
                tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
                tabBarIcon: ({ focused }) => (
                    <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.5 }}>
                        {ICONS[route.name]}
                    </Text>
                ),
            })}
        >
            <Tab.Screen name="Novo" component={NovoAchadoScreen} options={{ title: 'Novo achado' }} />
            <Tab.Screen name="Album" component={AlbumScreen} options={{ title: 'Meu álbum' }} />
        </Tab.Navigator>
    )
}
