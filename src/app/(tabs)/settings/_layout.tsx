import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLayoutStyle } from '../_layout';
import { useTheme } from '../../../colors';
import { useTranslation } from 'react-i18next';

const CustomHeader = (props: any) => {
    const style = useLayoutStyle();
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const router = useRouter()
    return (
        <View style={{
            ...style.header,
            paddingTop: insets.top + 2,
            paddingLeft: 16,
            height: 90,
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            {props.back &&
                <Pressable onPress={router.back} >
                    <MaterialIcons name="arrow-back" size={24} color={theme.text} />
                </Pressable>
            }
            <Text style={{...style.text}}>{props.options.title}</Text>
        </View>
    );
};

export default function Layout() {
    const { t } = useTranslation();
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    presentation: undefined,
                    title: t('Settings'),
                    header: CustomHeader,
                }}
            />
            <Stack.Screen
                name="feedback"
                options={{
                    presentation: 'modal',
                    title: t('Feedback'),
                    header: CustomHeader,
                }}
            />
        </Stack>
    );
}
