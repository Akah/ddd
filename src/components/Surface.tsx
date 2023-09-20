import React from "react";
import { ColorValue, View, ViewProps, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    root: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        overflow: 'hidden',
    },
});

export interface SurfaceProps extends ViewProps {
    borderColor?: ColorValue;
}

export const Surface: React.FC<SurfaceProps> = (props: SurfaceProps) => {
    return (
        <View style={[styles.root, props.style, { borderColor: props.borderColor ?? 'lightgrey'}]}>
            {props.children}
        </View>
    );
};
