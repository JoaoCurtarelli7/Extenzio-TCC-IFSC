import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeAlunos from '../pages/HomeAlunos'
import InitialRefs from '../pages/InitialRefs'
import Comunidade from '../pages/Comunidade'
import TopicsAdd from '../pages/TopicsAdd'
import Profile from '../pages/Profile'
import SettingsPage from '../pages/SettingsPage'
import PersonProfile from '../pages/PersonProfile'
import FullProject from '../pages/FullProject'
import FullTopic from '../pages/FullTopic'
import MyProjects from '../pages/MyProjects';

import Ionicons from 'react-native-vector-icons/Ionicons';


const AuthStack = createBottomTabNavigator()
const Stack = createStackNavigator()

function HomeRoute() {
    return (
        <Stack.Navigator
            screenOptions={{
                initialRouteName: 'HomeAlunos',
                headerShown: false
            }}>
            <Stack.Screen name="HomeAlunos" component={HomeAlunos} />
            <Stack.Screen name="InitialRefs" component={InitialRefs} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="PersonProfile" component={PersonProfile} />
            <Stack.Screen name="FullProject" component={FullProject} />


        </Stack.Navigator>
    )
}

function communityRoutes() {
    return (
        <Stack.Navigator
            screenOptions={{
                initialRouteName: 'Comunidade',
                headerShown: false
            }}>
            <Stack.Screen name="Comunidade" component={Comunidade} />
            <Stack.Screen name="TopicsAdd" component={TopicsAdd} />
            <Stack.Screen name="FullTopic" component={FullTopic} />
            <Stack.Screen name="PersonProfile" component={PersonProfile} />
        </Stack.Navigator>
    )
}

function ProfileRoutes() {
    return(

    <Stack.Navigator
        screenOptions={{
            initialRouteName: 'Profile',
            headerShown: false
        }}>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="MyProjects" component={MyProjects} />

    </Stack.Navigator>
    )
}

function PaginasAlunos() {
    return (

        <AuthStack.Navigator
            initialRouteName="HomeAlunos"
            tabBarOptions={{
                keyboardHidesTabBar: true,
                showLabel: false,
                style: {
                    backgroundColor: '#5e35b1',
                    borderTopWidth: 1,
                    borderTopColor: '#FFFFFF'
                },
                activeTintColor: '#FFFFFF'
            }}
        >
            <AuthStack.Screen
                name="Comunidade"
                component={communityRoutes}
                options={{
                    headerShown: false, tabBarIcon: ({ color, size }) => {
                        return <Ionicons name="bulb-outline" color={color} size={35} />
                    }
                }}
            />
            <AuthStack.Screen
                name="HomeAlunos"
                component={HomeRoute}
                options={{
                    headerShown: false, tabBarIcon: ({ color, size }) => {
                        return <Ionicons name="home-outline" color={color} size={35} />
                    }
                }}
            />
            <AuthStack.Screen
                name="Profile"
                component={ProfileRoutes}
                options={{
                    headerShown: false, tabBarIcon: ({ color, size }) => {
                        return <Ionicons name="person-outline" color={color} size={35} />
                    }
                }}
            />
            <AuthStack.Screen
                name="SettingsPage"
                component={SettingsPage}
                options={{
                    headerShown: false, tabBarIcon: ({ color, size }) => {
                        return <Ionicons name="cog-outline" color={color} size={35} />
                    }
                }}
            />


        </AuthStack.Navigator>
    );
}

export default PaginasAlunos;