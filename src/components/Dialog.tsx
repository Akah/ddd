import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Modal, ModalProps } from './Modal';

interface Action {
    label: string;
    callback: () => void;
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
        fontSize: 22,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 16,
    },
    action: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: 'grey',
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
            <Text style={style.action} >
                {action.label}
            </Text>
        </Pressable>
    );
}

export const Dialog: React.FC<DialogProps> = (props: DialogProps) => {
    return (
        <Modal visible={props.visible} surfaceProps={{ style: style.root }}>
            <Text style={style.title}>{props.title}</Text>
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
