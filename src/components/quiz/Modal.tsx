import React from 'react';

import { Modal } from "../Modal";
import { QuizBar } from "./Bar";
import { QuizController } from "./Controller";
import { QuizSurface } from "./Surface";
import { Gender } from '../../model/model';

interface Props {
    open: boolean;
    onClose: () => void;
}

function calculateProgress(position: number, total: number): number {
    // start at 10% then add 90% on top
    return ((position / total) * 94) + 6;
}

const word = {
    noun: 'Möglichkeit',
    gender: 'f' as Gender,
    favorite: false,
}

export const QuizModal: React.FC<Props> = (props: Props) => {
    const position = 1;
    const total = 20;
    const progress = calculateProgress(position, total);
    const [ revealed, setRevealed ] = React.useState(false);
    const [ answer, setAnswer ] = React.useState<Gender|null>(null);

    const correct = answer === word.gender;

    function onContinue(): void {
        setRevealed(false);
        setAnswer(null);
    }

    function buildAction(gender: Gender): () => void {
        return () => {
            setRevealed(true);
            setAnswer(gender);
        };
    }

    const onDer = buildAction('m');
    const onDie = buildAction('f');
    const onDas = buildAction('n');

    return (
        <Modal visible={props.open} fullscreen={true}>
            <QuizBar progress={progress} onBack={props.onClose} />
            <QuizSurface correct={correct} revealed={revealed} word={word} />
            <QuizController
                correct={correct}
                revealed={revealed}
                onContinue={onContinue}
                actions={[onDer, onDie, onDas]}
            />
        </Modal>
    );
};
