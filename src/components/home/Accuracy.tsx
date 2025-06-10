import { withObservables } from '@nozbe/watermelondb/react';
import * as React from 'react';

import { Text } from '../Text';
import { Gender, Words } from '../../model/model';
import { database } from '../../model/database';
import { Q } from '@nozbe/watermelondb';

interface Props {
    words: Array<Words> | null;
};

function getAverage(words: Array<Words>): string {
    if (words.length === 0) {
        return '0';
    }
    const decimal = words
        .map((word) => word.correct / word.seen)
        .reduce((sum, value) => sum + value) / words.length;
    const percentage = decimal * 100;
    return percentage.toFixed(2);
}

function filterGender(words: Array<Words>, gender: Gender): Array<Words> {
    return words.filter((word) => word.gender === gender);
}

const genders: Array<Gender> = ['m', 'f', 'n'];

const _Accuracy: React.FC<Props> = (props: Props) => {
    const values: Array<string> = React.useMemo(
        () => {
            if (props.words == null) {
                return [];
            }
            // TODO: (maybe) change algorithm to pop checked words
            return [
                getAverage(props.words),
                ...genders.map((gender) => getAverage(filterGender(props.words!, gender)))
            ];
        },
        [ props.words?.length ]
    );

    return (
        <>
            <Text>Total: {values[0]}%</Text>
            <Text>Der: {values[1]}%</Text>
            <Text>Die: {values[2]}%</Text>
            <Text>Das: {values[3]}%</Text>
            <Text>{props.words?.length}</Text>
        </>
    );
};


const queryString = 'SELECT * FROM words WHERE seen > 0 ORDER BY (correct/seen) ASC';
export const Accuracy = withObservables(['words'], () => ({
    words: database
        .get<Words>('words')
        .query(Q.unsafeSqlQuery(queryString))
        .observeWithColumns(['seen'])
}))(_Accuracy);
