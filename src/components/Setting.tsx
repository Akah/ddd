import React from 'react';
import { View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Header, Text } from './Text';
import { Modal } from './Modal';
import { Surface as DefaultSurface } from './Surface';
import { Button as DefaultButton } from './Button';
import DefaultSlider from '@react-native-community/slider';
import { useTheme } from '../colors';

const style = StyleSheet.create({
    group: {
        marginBottom: 16,
    },
    setting: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 4,
    },
    button: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    header: {
        marginBottom: 4,
        paddingLeft: 10,
        fontSize: 18
    },
    toggle: {
        marginRight: -4,
    },
    sliderView: {
        alignItems: 'stretch',
        flexDirection: 'column',
        marginBottom: -4,
    },
    slider: {
        marginLeft: -10,
        height: 32,
    }
});

interface SettingProps<T> {
    label: string;
    value: T;
    set?: (value: T) => Promise<void> | void;
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
        props.set?.(value);
    }

    return (
        <>
            <View style={style.setting}>
                <Text>{props.label}</Text>
                <TouchableOpacity onPress={onOpen}>
                    <Text style={style.button}>{props.value}</Text>
                </TouchableOpacity>
            </View>
            <Modal visible={open} onRequestClose={onClose}>
                {props.options.map((option: {key: string, value: string}) => (
                    <TouchableOpacity
                        key={option.key}
                        onPress={() => setValue(option.key)}
                        style={{ padding: 8 }}
                    >
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

type BooleanProps = SettingProps<boolean>;

const Boolean: React.FC<BooleanProps> = (props: BooleanProps) => {
    return (
        <View style={style.setting}>
            <Text>{props.label}</Text>
            <Switch style={style.toggle} onValueChange={props.set} value={props.value} />
        </View>
    );
};

interface SliderProps extends SettingProps<number> {
    step: number;
    min: number;
    max: number;
}

const Slider: React.FC<SliderProps> = (props: SliderProps) => {
    return (
        <View style={[style.setting, style.sliderView]}>
            <Text>{props.label}</Text>
            <DefaultSlider
                style={style.slider}
                onValueChange={props.set}
                step={props.step}
                minimumValue={props.min}
                maximumValue={props.max}
            />
        </View>
    );
}

interface GroupProps extends React.PropsWithChildren {
    label: string,
}

const Group: React.FC<GroupProps> = (props: GroupProps) => {
    return (
        <View style={style.group}>
            <Header style={style.header}>{props.label}</Header>
            {props.children}
        </View>
    );
}

interface ButtonProps {
    label: string;
    onPress?: () => void;
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    const style = {
        // width: '100%',
        marginTop: 4,
        marginBottom: 0,
    };
    return (
        <DefaultButton
            textStyles={{ fontWeight: 'bold', textShadowRadius: 0 }}
            style={style}
            onPress={props.onPress ?? (() => {})}
        >
            {props.label}
        </DefaultButton>
    );
}

const Surface: React.FC<React.PropsWithChildren> = (props: React.PropsWithChildren) => {
    return (
        <DefaultSurface>
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
    Slider,
} as const;
