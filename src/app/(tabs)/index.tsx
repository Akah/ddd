import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { ButtonPanel } from '../../components/ButtonPanel';
import { colors } from '../../constants';
import { Surface } from '../../components/Surface';
import { Article, genderToArticle } from '../../components/WordsList';
import { Gender } from '../../model/model';

const style = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bar: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    //
    progress: {
        height: 18,
        marginLeft: 16,
        flexGrow: 1,
        backgroundColor: 'lightgrey',
        borderRadius: 16,
        overflow: 'hidden',
    },
    progressMain: {
        flex: 1,
        borderRadius: 16,
        backgroundColor: colors.green.background,
    },
    //
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
    //
    listItem: {
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});

function calculateProgress(position: number, total: number): number {
    // start at 10% then add 90% on top
    return ((position / total) * 94) + 6;
}

const word = {
    noun: 'Möglichkeit',
    gender: 'f',
    favorite: false,
}

export default function Favorites() {
    const [open, setOpen] = React.useState(false);
    const [more, setMore] = React.useState(false);
    const position = 1;
    const total = 20;
    const progress = calculateProgress(position, total);
    const [ revealed, setRevealed ] = React.useState(false);
    const [ answer, setAnswer ] = React.useState<Gender|null>(null);

    const correct = answer === word.gender;

    function borderColor() {
        if (revealed) {
            return correct ? colors.green.background : colors.red.background;
        }
        return 'lightgrey';
    }

    function onDer(): void {
        setRevealed(true);
        setAnswer('m');
    }

    function onDie(): void {
        setRevealed(true);
        setAnswer('f');
    }

    function onDas(): void {
        setRevealed(true);
        setAnswer('n');
    }

    function onContinue(): void {
        setRevealed(false);
        setAnswer(null);
    }

    return (
        <>
            <View style={style.root}>
                <Button onPress={() => setOpen(true)} color="white" borderColor="lightgrey" textStyles={{ color: 'grey' }}>start</Button>
                <Modal animationType='slide' fullscreen={true} visible={open}>
                    <View style={style.bar}>
                        <MaterialIcons name="close" size={24} color="grey" onPress={() => setOpen(false)} />
                        <View style={style.progress}>
                            <View style={[style.progressMain, { width: `${progress}%` }]} />
                        </View>
                    </View>
                    <View style={style.main}>
                        <Surface style={[style.container]} borderColor={borderColor()}>
                            {revealed &&
                                <View style={[style.row, style.titleRow]}>
                                    <Text style={[style.text, { fontSize: 20 }]}>{correct ? 'Correct' : 'Incorrect'} !</Text>
                                    <MaterialIcons name="more-horiz" size={24} color="grey" onPress={()=>setMore(true)} />
                                </View>
                            }
                            <View style={style.row}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={style.text}>{revealed ? genderToArticle(word.gender as Gender) : '___'}</Text>
                                    <Text style={style.text}> {word.noun}</Text>
                                </View>
                                <MaterialIcons
                                    name={word.favorite ? 'favorite' : 'favorite-outline'}
                                    color={'grey'}
                                    size={24}
                                />
                            </View>
                            {revealed && (
                                <>
                                    <View style={style.notice}>
                                        <Text style={[style.text, style.small]}>Note:</Text>
                                        <Text style={[style.text, style.small]}>
                                            Words ending with <Text style={style.bold}>-keit</Text> are always <Text style={style.bold}>feminine</Text>.
                                        </Text>
                                    </View>
                                </>
                            )}
                        </Surface>
                    </View>
                    {revealed ?
                        <Button
                            onPress={onContinue}
                            color={colors[correct ? 'green' : 'red'].background}
                            borderColor={colors[correct ? 'green' : 'red'].border}
                        >
                            continue
                        </Button> :
                     <ButtonPanel
                         actions={[
                             onDer,
                             onDie,
                             onDas,
                         ]}
                     />
                    }
                </Modal>
                <Modal visible={more}>
                    <View style={style.listItem}>
                        <Text>Report mistake</Text>
                        <MaterialIcons name="flag" size={24} color="grey"/>
                    </View>
                </Modal>
            </View >
        </>
    )
};
