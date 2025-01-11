import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Surface } from '../Surface';
import { MoreButton } from './MoreButton';
import { genderToArticle } from '../WordsList';
import { Gender, Words } from '../../model/model';
import { colors } from '../../constants';
import { database } from '../../model/database';
import { withObservables } from '@nozbe/watermelondb/react';
import { endingToGenderString } from '../../app/_layout';

const style = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'grey',
        fontSize: 18,
        fontWeight: 'bold',
    },
    container: {
        flexDirection: 'column',
        width: '90%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleRow: {
        marginBottom: 24,
    },
    notice: {
        marginTop: 24,
    },
    bold: {
        fontWeight: '900',
    },
    small: {
        fontSize: 14,
        fontStyle: 'italic',
    },
});

interface Props {
    revealed: boolean;
    correct: boolean;
    word: Words;
}

const QuizSurfaceComponent: React.FC<Props> = (props: Props) => {
    function borderColor() {
        if (props.revealed) {
            return props.correct ? colors.green.background : colors.red.background;
        }
        return 'lightgrey';
    }

    // TODO: extract into global function
    async function toggleFavorite(): Promise<void> {
        await database.write(async () => {
            await props.word.update(() => (
                props.word.favorite = !props.word.favorite
            ));
        });
    }

    function getNotice(): React.ReactNode {
        return props.revealed && props.word.ending != null && (
            <>
                <View style={style.notice}>
                    <Text style={[style.text, style.small]}>Note:</Text>
                    <Text style={[style.text, style.small]}>
                        Words ending with <Text style={style.bold}>-{props.word.ending}</Text> are always <Text style={style.bold}>{endingToGenderString(props.word.ending)}</Text>.
                    </Text>
                </View>
            </>
        );
    }

    return (
        <View style={style.main}>
            <Surface style={[style.container]} borderColor={borderColor()}>
                {props.revealed &&
                    <View style={[style.row, style.titleRow]}>
                        <Text style={[style.text, { fontSize: 20 }]}>{props.correct ? 'Correct' : 'Incorrect'} !</Text>
                        <MoreButton word={props.word} />
                    </View>
                }
                <View style={style.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={style.text}>{props.revealed ? genderToArticle(props.word.gender as Gender) : '___'}</Text>
                        <Text style={style.text}>{' '}{props.word.noun}</Text>
                    </View>
                    <MaterialIcons
                        name={props.word.favorite ? 'favorite' : 'favorite-outline'}
                        color={'grey'}
                        size={24}
                        onPress={toggleFavorite}
                    />
                </View>
                {getNotice()}
            </Surface>
        </View>
    );
}

export const QuizSurface = withObservables(['word'], (props: Props) => ({
    word: props.word.observe(),
}))(QuizSurfaceComponent);
