import React from 'react';
import { View, ModalBaseProps, Pressable, Modal as RNModal, StyleSheet, useWindowDimensions } from 'react-native';

import { Surface, SurfaceProps } from './Surface';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ModalProps extends React.PropsWithChildren<ModalBaseProps> {
    visible: boolean;
    onRequestClose?: (() => void) | (() => Promise<void>);
    surfaceProps?: SurfaceProps;
    fullscreen?: boolean;
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
    fullscreen: {
        flex: 1,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomWidth: 0,
    }
});

export const Modal: React.FC<ModalProps> = (props: ModalProps) => {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    if (props.fullscreen) {
        return (
            <>
                {/* <View>
                    <RNModal transparent={true} visible={props.visible} key={'test'}>
                        <Pressable onPress={props.onRequestClose} style={style.background}>
                            <View style={{ height: 10, width: 10, backgroundColor: 'blue' }} />
                        </Pressable>
                    </RNModal>
                </View> */}
                <RNModal transparent={true} visible={props.visible} statusBarTranslucent={true}>
                    <Pressable style={style.background} onPress={props.onRequestClose}>
                        <Pressable>
                            <Surface
                                {...props.surfaceProps}
                                style={[
                                    style.surface,
                                    style.fullscreen,
                                    {
                                        marginTop: insets.top,
                                        paddingBottom: insets.bottom,
                                        width: width
                                    },
                                    props.surfaceProps?.style,
                                ]}
                            >
                                {props.children}
                            </Surface>
                        </Pressable>
                    </Pressable>
                </RNModal>
            </>
        );
    }

    return (
        <RNModal transparent={true} visible={props.visible} >
            <Pressable style={style.background} onPress={props.onRequestClose}>
                <Pressable>
                    <Surface
                        {...props.surfaceProps}
                        style={[
                            style.surface,
                            props.surfaceProps?.style,
                        ]}
                    >
                        {props.children}
                    </Surface>
                </Pressable>
            </Pressable>
        </RNModal>
    );
};
