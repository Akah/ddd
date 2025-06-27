import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { withObservables } from '@nozbe/watermelondb/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { endingToGenderString, translatedGender } from '../../app/_layout';
import { colors } from '../../constants';
import { database } from '../../model/database';
import { Gender, Words } from '../../model/model';
import { Surface } from '../Surface';
import { Text, Header } from '../Text';
import { genderToArticle } from '../WordsList';
import { WordInfo } from '../debug/WordInfo';
import { MoreButton } from './MoreButton';

const style = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    response: {
        fontSize: 20,
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
        fontWeight: 'bold',
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
    const { t, i18n } = useTranslation();
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
                    <Text style={style.small}>Note:</Text>
                    <Text style={style.small}>
                        Words ending with <Text style={[style.small, style.bold]}>-{props.word.ending}</Text> are always <Text style={[style.small, style.bold]}>{endingToGenderString(props.word.ending)}</Text>.
                        {t('Words ending with {{suffix}} are always {{gender}}.', {
                            suffix: '-' + props.word.ending,
                            gender: t(endingToGenderString(props.word.ending)),
                        })}
                    </Text>
                </View>
            </>
        );
    }

    return (
        <View style={style.main}>
            <Surface style={style.container} borderColor={borderColor()}>
                {props.revealed &&
                    <View style={[style.row, style.titleRow]}>
                        <Header style={[style.response, { fontSize: 20 }]}>{(props.correct ? 'Correct' : 'Incorrect') + '!'}</Header>
                        <MoreButton word={props.word} />
                    </View>
                }
                <View style={style.row}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Header>{props.revealed ? genderToArticle(props.word.gender as Gender) : '___'}</Header>
                            <Header>{' ' + props.word.noun}</Header>
                        </View>
                    </View>
                    <MaterialIcons
                        name={props.word.favorite ? 'favorite' : 'favorite-outline'}
                        color={'grey'}
                        size={24}
                        onPress={toggleFavorite}
                    />
                </View>
                {getNotice()}
                {__DEV__ && <WordInfo word={props.word}/>}
            </Surface>
        </View>
    );
}

export const QuizSurface = withObservables(['word'], (props: Props) => ({
    word: props.word.observe(),
}))(QuizSurfaceComponent);
