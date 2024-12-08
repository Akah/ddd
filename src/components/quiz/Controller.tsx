import React from 'react';
import { Button } from '../Button';
import { colors } from '../../constants';
import { ButtonPanel } from '../ButtonPanel';

interface Props {
    revealed: boolean;
    correct:  boolean;
    onContinue: () => void;
    actions: Array<(() => void)>;
}

export const QuizController: React.FC<Props> = (props: Props) => {
    const { revealed, correct, onContinue, actions } = props;
    
    return revealed ?
        (
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
        );
};
