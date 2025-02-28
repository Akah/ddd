import React from 'react';
import { Pressable, View, StyleSheet, ColorValue } from 'react-native';

import { Text, Header } from './Text';
import { Modal, ModalProps } from './Modal';

interface Action {
    label: string;
    callback: () => void;
    color?: ColorValue;
}

interface DialogProps extends ModalProps {
    title: string;
    subtitle?: string;
    actions?: Array<Action>;
}

const style = StyleSheet.create({
    root: {
        margin: 32,
        maxWidth: 500,
    },
    title: {
        marginBottom: 16,
    },
    subtitle: {
        marginBottom: 16,
    },
    action: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginLeft: 16,
    },
    actionContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'flex-end',
    }
});

function renderAction(action: Action, index: number): React.ReactNode {
    return (
        <Pressable onPress={action.callback} key={`dialog-action-${index}`}>
            <Text style={[style.action, action.color ? {color: action.color} : undefined]}>
                {action.label}
            </Text>
        </Pressable>
    );
}

export const Dialog: React.FC<DialogProps> = (props: DialogProps) => {
    return (
        <Modal visible={props.visible} surfaceProps={{ style: style.root }}>
            <Header style={style.title}>{props.title}</Header>
            {props.subtitle &&
                <Text style={style.subtitle}>{props.subtitle}</Text>
            }
                {props.children}
            {props.actions && props.actions?.length !== 0 &&
                <View style={style.actionContainer}>
                    {props.actions.map(renderAction)}
                </View>
            }
        </Modal>
    );
};
