import React from 'react';
import { StyleSheet, View, Text, LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, clamp, useAnimatedProps, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    root: {
        width: '100%',
        backgroundColor: 'red',
        flexDirection: 'row',
    },
    track: {
        backgroundColor: 'lightgrey',
        width: '100%',
        height: 10,
        position: 'absolute',
    },
    trackActive: {
        backgroundColor: 'lightgreen',
        height: 10,
    },
    handle: {
    },
});

// assuming array is already sorted
function findNearest(arr: Array<number>, target: number): number {
    let start = 0;
    let end = arr.length - 1;
    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        if (arr[mid] === target) return arr[mid];
        if (arr[mid] < target) start = mid + 1;
        else end = mid - 1;
    }
    const closest = (target - arr[end] <= arr[start] - target) ? arr[end] : arr[start];
    return closest;
};

export const Slider: React.FC = React.memo(() => {
    const position = useSharedValue(0);
    const [ layout, setLayout ] = React.useState({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
    });
    function onLayout(event: LayoutChangeEvent): void {
        setLayout(event.nativeEvent.layout);
    }

    const pan = Gesture.Pan()
        .onChange((event) => {
            position.value += event.changeX
        })
        .onFinalize(() => {
            position.value = withSpring(findNearest([0, 20, 40, 60, 80, 100], position.value));
        })
    ;

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: clamp(position.value, 0, layout.width) }
        ],
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderColor: 'lightgrey',
        borderWidth: 2,
        backgroundColor: 'white',
    }));

    const textProps = useAnimatedProps(() => ({
        children: Math.round(position.value),
    }));

    return (
        <GestureDetector gesture={pan}>
            <View style={styles.root} onLayout={onLayout}>
                <View style={[styles.track, { top: (layout.height / 2) - 5 }]}>
                    <View style={[styles.trackActive, { width: `${position.value * 100}%` }]} />
                </View>
                <Animated.View style={
                    animatedStyle
                }>
                    <Animated.Text {...textProps}/>
                </Animated.View>
            </View>
        </GestureDetector>
    );
});
