import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchBar } from '../../components/SearchBar';

const searchStyle = StyleSheet.create({
    root: {
        width: '100%',
    },
    title: {
        flexDirection: 'row',
        flexGrow: 1,
        width: '100%',
        justifyContent: 'center',
    },
    search: {
        position: 'absolute',
        right: 8,
    },
});

const SearchHeader: React.FC<BottomTabHeaderProps> = (props: BottomTabHeaderProps) => {
    return (
        <View
            style={[
                style.header,
                searchStyle.root,
                props.options.headerStyle as ViewStyle,
            ]}
        >
            <View style={searchStyle.title}>
                <Text style={style.text}>Search</Text>
                <View style={searchStyle.search}>
                    <MaterialIcons name='filter-list' size={24} color='grey' />
                </View>
            </View>
            <SearchBar />
        </View>
    );
};

export default function ProtectedLayout() {
    const insets = useSafeAreaInsets();
    return (
        <Tabs screenOptions={{ tabBarStyle: style.tabBar }}>
            <Tabs.Screen
                name='search'
                options={{
                    title: 'Search',
                    header: SearchHeader,
                    headerStyle: { ...style.header, paddingTop: insets.top },
                    // headerTitleStyle: style.text,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name='search' size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='favorites'
                options={{
                    title: 'Favorites',
                    headerStyle: style.header,
                    headerTitleStyle: style.text,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons
                            name='favorite'
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Start a quiz',
                    headerStyle: style.header,
                    headerTitleStyle: style.text,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name='home' size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='settings'
                options={{
                    title: 'Settings',
                    headerStyle: style.header,
                    headerTitleStyle: style.text,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons
                            name='settings'
                            size={24}
                            color={color}
                        />
                    ),
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
