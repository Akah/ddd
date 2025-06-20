import React from 'react';
import { View, Text, Button as RNButton, ColorValue, ViewStyle, TextStyle, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { useTheme } from '../colors';

type Position = 'left' | 'right' | 'bottom' | 'top' | 'middle';

const borderRadius: number = 16;
const borderWidth: number = 2;

const useStyles = (position: Position | undefined, color?: ColorValue, borderColor?: ColorValue) => {
    const theme = useTheme();
    return StyleSheet.create({
        border: {
            borderWidth,
            borderColor: borderColor ?? theme.border,
            borderBottomWidth: borderWidth * 2,
            borderTopLeftRadius: position === 'left' || position === 'top' ? borderRadius : 0,
            borderTopRightRadius: position === 'right' || position === 'top' ? borderRadius : 0,
            borderBottomLeftRadius: position === 'left' || position === 'bottom' ? borderRadius : 0,
            borderBottomRightRadius: position === 'right' || position === 'bottom' ? borderRadius : 0,
        },
        rounded: {
            borderRadius: borderRadius,
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
        },
        // eslint-disable-next-line react-native/no-unused-styles
        button: {
            backgroundColor: color ?? theme.background,
        },
        text: {
            textAlign: 'center',
            textTransform: 'uppercase',
            paddingVertical: 8,
            paddingHorizontal: 16,
            color: theme.text,
            fontWeight: 'bold',
        },
    });
};

export interface ButtonProps extends React.PropsWithChildren {
    onPress: () => void;
    position?: Position;
    color?: ColorValue;
    borderColor?: ColorValue;
    style?: ViewStyle | Array<ViewStyle>;
    textStyles?: TextStyle;
    buttonStyle?: ViewStyle | Array<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = (props) => {
    const styles = useStyles(props.position, props.color, props.borderColor);
    const [ pressed, setPressed ] = React.useState<boolean>(false);

    const onPressIn = () => setPressed(true);
    const onPressOut = () => setPressed(false);

    return (
        <View style={props.style}>
            <View style={{ marginTop: pressed ? 4 : 2 }}>
            <Pressable
                style={[
                    styles.button,
                    styles.border,
                    pressed ? { borderBottomWidth: 2 } : undefined,
                    props.position === undefined ? styles.rounded : undefined,
                    props.buttonStyle,
                ]}
                onPress={props.onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                <Text style={[styles.text, props.textStyles]}>
                    {props.children?.toString()}
                </Text>
            </Pressable>
        </View>
        </View >
    );
};
