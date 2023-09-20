import React from 'react';
import { Pressable, Modal as RNModal, StyleSheet } from 'react-native';

import { Surface, SurfaceProps } from './Surface';

export interface ModalProps extends React.PropsWithChildren {
    visible: boolean;
    onRequestClose?: (() => void) | (() => Promise<void>);
    surfaceProps?: SurfaceProps;
}

const style = StyleSheet.create({
    background: {
        top: 0, bottom:0, right: 0, left: 0,
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    surface: {
        backgroundColor: 'white',
    },
});

export const Modal: React.FC<ModalProps> = (props: ModalProps) => {
    return (
        <RNModal transparent={true} visible={props.visible} >
            <Pressable style={style.background} onPress={props.onRequestClose}>
                <Pressable>
                    <Surface {...props.surfaceProps} style={[style.surface, props.surfaceProps?.style]}>
                        {props.children}
                    </Surface>
                </Pressable>
            </Pressable>
        </RNModal>
    );
};
