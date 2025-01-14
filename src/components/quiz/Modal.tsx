import React from 'react';

import { Modal } from "../Modal";
import { QuizBar } from "./Bar";
import { QuizController } from "./Controller";
import { QuizSurface } from "./Surface";
import { Gender, Words } from '../../model/model';

interface Props {
    words: Array<Words> | null;
    open: boolean;
    onClose: () => void;
    onAnswer: () => void;
    infinite: boolean;
}

function calculateProgress(position: number, total: number): number {
    // start at 10% then add 90% on top
    return ((position / total) * 94) + 6;
}

export const QuizModal: React.FC<Props> = (props: Props) => {
    const [ revealed, setRevealed ] = React.useState(false);
    const [ answer, setAnswer ] = React.useState<Gender|null>(null);
    const [ position, setPosition ] = React.useState(0);

    const word = props.words?.[position];
    const total = props.words?.length;
    const correct = answer === word?.gender;

    React.useEffect(
        () => {
            setRevealed(false);
            setAnswer(null);
            setPosition(0);
        },
        [ props.open ]
    );

    React.useEffect(
        () => {
            if (word == null) {
                props.onClose();
            }
        },
        [ word ]
    );

    if (word == null) {
        return null;
    }

    const progress = props.infinite ? -1 : calculateProgress(position, total!);

    function onContinue(): void {
        setRevealed(false);
        setAnswer(null);
        setPosition(position + 1);
    }

    function onClose(): void {
        setRevealed(false);
        setAnswer(null);
        setPosition(0);
        props.onClose();
    }

    function buildAction(gender: Gender): () => void {
        return () => {
            setRevealed(true);
            setAnswer(gender);
            props.onAnswer();
        };
    }

    const onDer = buildAction('m');
    const onDie = buildAction('f');
    const onDas = buildAction('n');

    return (
        <Modal visible={props.open} fullscreen={true}>
            <QuizBar progress={progress} onBack={onClose} />
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
