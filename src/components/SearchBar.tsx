import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useRootNavigationState } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { useDebounceValue } from 'usehooks-ts';
import { useTheme } from '../colors';

const style = StyleSheet.create({
    root: {
        borderWidth: 2,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        margin: 8,
    },
    input: {
        flexGrow: 1,
        paddingLeft: 8,
    },
    close: {
        borderRadius: 999,
    },
});

export const SearchBar: React.FC = () => {
    const theme = useTheme();
    const [value, setValue] = React.useState('');
    const [debounced, setDebounced] = useDebounceValue('', 300);
    const rootNavigationState = useRootNavigationState();

    function reset(): void {
        setValue('');
    }

    React.useEffect(
        () => {
            console.debug('a');
            setDebounced(value);
        },
        [value]
    );

    React.useEffect(
        () => {
            console.debug('b');
            if (rootNavigationState) {
                router.setParams({ search: debounced });
            }
        },
        [debounced]
    );

    return (
        <View style={[style.root, {backgroundColor: theme.background, borderColor: theme.border}]}>
            <MaterialIcons name='search' size={24} color={theme.text} />
            <TextInput
                placeholder='Search words...'
                placeholderTextColor={theme.text} // TODO: different color?
                style={[style.input, { color: theme.text }]}
                value={value}
                onChangeText={setValue}
            />
            {Boolean(value.length) && (
                <TouchableOpacity onPress={reset}>
                    <MaterialIcons
                        name='close'
                        size={24}
                        color='grey'
                        style={style.close}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};
