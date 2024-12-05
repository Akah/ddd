import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { useDebounceValue } from 'usehooks-ts';

const style = StyleSheet.create({
    root: {
        borderColor: 'lightgrey',
        borderWidth: 2,
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#eee',
        borderRadius: 999,
        margin: 8,
    },
    input: {
        flexGrow: 1,
    },
    close: {
        borderRadius: 999,
    },
});

export const SearchBar: React.FC = () => {
    const [value, setValue] = React.useState('');
    const [debounced, setDebounced] = useDebounceValue('', 300);

    function reset(): void {
        setValue('');
    }

    React.useEffect(() => {
        setDebounced(value);
    }, [value]);

    React.useEffect(() => {
        router.setParams({ search: debounced });
    }, [debounced]);

    return (
        <View style={style.root}>
            <MaterialIcons name='search' size={24} color='grey' />
            <TextInput
                placeholder='Search words...'
                style={style.input}
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
