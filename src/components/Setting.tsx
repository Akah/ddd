import React, { ChangeEvent } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Modal } from './Modal';
import { Surface as DefaultSurface } from './Surface';
import { Button as DefaultButton } from './Button';

const style = StyleSheet.create({
    group: {
        marginBottom: 16,
    },
    surface: {
        paddingVertical: 8,
    },
    setting: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 4,
    },
    label: {
        color: 'grey',
        fontSize: 16
    },
    button: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: 'grey',
        fontSize: 16
    },
    header: {
        color: 'grey',
        fontWeight: 'bold',
        marginBottom: 4,
        paddingLeft: 10,
        fontSize: 18
    },
    toggle: {
        marginRight: -4,
    },
    buton: {
        width: '100%',
    }
});

interface SettingProps<T> {
    label: string;
    value: T;
    set?: (value: T) => Promise<void>;
}

interface StringProps extends SettingProps<string>{
    options: Array<{key: string, value: string}>;
}

const String: React.FC<StringProps> = (props: StringProps) => {
    const [ open, setOpen ] = React.useState<boolean>(false);

    function onOpen() {
        setOpen(true);
    }

    function onClose() {
        setOpen(false);
    }

    function setValue(value: string) {
        console.debug(value);
        props.set?.(value);
    }

    return (
        <>
            <View style={style.setting}>
                <Text style={style.label}>{props.label}</Text>
                <TouchableOpacity onPress={onOpen}>
                    <Text style={style.button}>{props.value}</Text>
                </TouchableOpacity>
            </View>
            <Modal visible={open} onRequestClose={onClose}>
                {props.options.map((option: {key: string, value: string}) => (
                    <TouchableOpacity
                        key={option.key}
                        onPress={() => setValue(option.key)}
                        style={{
                            padding: 8,
                        }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'stretch',
                        }}>
                            <Text style={style.button}>{option.value}</Text>
                            {props.value === option.key ?
                             <FontAwesome name="check" size={18} color="grey"  /> :
                             <View style={{width: 18, marginLeft: 16}} />
                            }
                        </View>
                    </TouchableOpacity>
                ))}
            </Modal>
        </>
    );
};

type BooleanProps = SettingProps<boolean>

const Boolean: React.FC<BooleanProps> = (props: BooleanProps) => {
    return (
        <View style={style.setting}>
            <Text style={style.label}>{props.label}</Text>
            <Switch style={style.toggle} onValueChange={props.set} value={props.value} />
        </View>
    );
};

interface GroupProps extends React.PropsWithChildren {
    label: string,
}

const Group: React.FC<GroupProps> = (props: GroupProps) => {
    return (
        <View style={style.group}>
            <Text style={style.header}>{props.label}</Text>
            {props.children}
        </View>
    );
}

interface ButtonProps {
    label: string;
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    return (
        <DefaultButton
            color={'white'}
            borderColor={'lightgrey'}
            textStyles={{color: 'grey', fontWeight: 'bold', textShadowRadius: 0}}
            style={{width: '100%', marginTop: 4, marginBottom: 0}}
            onPress={() => {}}
        >
            {props.label}
        </DefaultButton>
    );
}

const Surface: React.FC<React.PropsWithChildren> = (props: React.PropsWithChildren) => {
    return (
        <DefaultSurface style={{backgroundColor: 'white'}}>
            {props.children}
        </DefaultSurface>
    );
}

export const Setting = {
    String,
    Boolean,
    Button,
    Group,
    Surface,
};
