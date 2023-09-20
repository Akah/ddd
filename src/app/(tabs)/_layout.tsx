import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ProtectedLayout() {
    return (
        <Tabs screenOptions={{ tabBarStyle: style.tabBar }}>
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    headerStyle: style.header,
                    headerTitleStyle: style.text,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="search" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'Favorites',
                    headerStyle: style.header,
                    headerTitleStyle: style.text,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="favorite" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Start a quiz',
                    headerStyle: style.header,
                    headerTitleStyle: style.text,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    headerStyle: style.header,
                    headerTitleStyle: style.text,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}

const style = StyleSheet.create({
    header: {
        backgroundColor: 'white',
        borderColor: 'lightgrey',
        borderBottomWidth: 2,
    },
    tabBar: {
        backgroundColor: 'white',
        borderColor: 'lightgrey',
        borderTopWidth: 2,
    },
    text: {
        paddingHorizontal: 8,
        color: 'grey',
        fontWeight: 'bold',
        fontSize: 20,
    },
});
