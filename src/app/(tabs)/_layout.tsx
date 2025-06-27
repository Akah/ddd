import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Text, ViewStyle, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchBar } from '../../components/SearchBar';
import { useTheme } from '../../colors';
import { useTranslation } from 'react-i18next';

const searchStyle = StyleSheet.create({
    root: {
        width: '100%',
    },
    title: {
        flexDirection: 'row',
        flexGrow: 1,
        width: '100%',
        justifyContent: 'flex-start',
        paddingLeft: Platform.OS === 'android' ? 16 : undefined,
    },
    search: {
        position: 'absolute',
        right: 8,
    },
});

const SearchHeader: React.FC<BottomTabHeaderProps> = (props: BottomTabHeaderProps) => {
    const style = useLayoutStyle();
    return (
        <View
            style={[
                style.header,
                searchStyle.root,
                props.options.headerStyle as ViewStyle,
            ]}
        >
            <View style={searchStyle.title}>
                <Text style={style.text}>{props.options.title}</Text>
                <View style={searchStyle.search}>
                    <MaterialIcons name='filter-list' size={24} color='grey' />
                </View>
            </View>
            <SearchBar />
        </View>
    );
};

export default function ProtectedLayout() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const style = useLayoutStyle();
    return (
        <Tabs
            screenOptions={{ tabBarStyle: style.tabBar, tabBarHideOnKeyboard: false }}
            sceneContainerStyle={{ backgroundColor: theme.wallpaper}}
        >
            <Tabs.Screen
                name='search'
                options={{
                    title: t('Search'),
                    header: (headerOptions) => <SearchHeader {...headerOptions}/>,
                    headerStyle: { ...style.header, paddingTop: insets.top },
                    headerTitleStyle: style.text,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name='search' size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='favorites'
                options={{
                    title: t('Favorites'),
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
                    title: t('Home'),
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
                    headerShown: false,
                    title: t('Settings'),
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

export const useLayoutStyle = () => {
    const theme = useTheme();
    return StyleSheet.create({
        header: {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
            borderBottomWidth: 2,
        },
        tabBar: {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
            borderTopWidth: 2,
        },
        text: {
            paddingHorizontal: 8,
            color: theme.text,
            fontWeight: 'bold',
            fontSize: 20,
        },
    });
};
