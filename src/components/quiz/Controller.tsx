import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Button } from '../Button';
import { colors } from '../../constants';
import { ButtonPanel } from '../ButtonPanel';

interface Props {
    revealed: boolean;
    correct:  boolean;
    onContinue: () => void;
    actions: Array<(() => void)>;
}

const style = StyleSheet.create({
    root: {
        marginBottom: 16,
    },
})

export const QuizController: React.FC<Props> = (props: Props) => {
    const { revealed, correct, onContinue, actions } = props;
    
    return (
        <View style={style.root}>
            {revealed ? (
                <Button
                    onPress={onContinue}
                    color={colors[correct ? 'green' : 'red'].background
                    }
                    borderColor={colors[correct ? 'green' : 'red'].border}
                >
                    continue
                </Button >
            ) : (
                <ButtonPanel actions={actions} />
            )}
        </View>
    );
};
