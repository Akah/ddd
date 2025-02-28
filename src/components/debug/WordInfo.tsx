import React from 'react';

import { Words } from '../../model/model';
import { Text } from '../Text';

export const WordInfo: React.FC<{word: Words}> = (props) => {
    return (
        <>
            <Text>Id: {props.word.id}</Text>
            <Text>Seen: {props.word.seen}</Text>
            <Text>Correct: {props.word.correct}</Text>
            <Text>Ending: -{props.word.ending}</Text>
            <Text>Freq: {props.word.frequency}</Text>
            <Text>Last: {props.word.lastSeen}</Text>
            <Text>Gender: {props.word.gender}</Text>
        </>
    );
};
