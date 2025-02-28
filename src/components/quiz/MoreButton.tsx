import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, TouchableOpacity, Linking } from 'react-native';

import { Modal } from '../Modal';
import { Header } from '../Text';
import { withObservables } from '@nozbe/watermelondb/react';
import { Words } from '../../model/model';
import { database } from '../../model/database';
import { useTheme } from '../../colors';

const style = StyleSheet.create({
    listItem: {
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 32,
    }
})

const MoreButtonComponent: React.FC<Props> = (props: Props) => {
    const theme = useTheme();
    const [visible, setVisible] = React.useState(false);

    function open() {
        setVisible(true);
    }

    function close() {
        setVisible(false);
    }

        // TODO: extract into global function
    async function toggleFavorite(): Promise<void> {
        await database.write(async () => {
            await props.word.update(() => (
                props.word.favorite = !props.word.favorite
            ));
        });
    }

    async function openDefinition(): Promise<void> {
        const lang = 'de';
        await Linking.openURL(`https://${lang}.m.wiktionary.org/wiki/${props.word.noun}`);
    }

    return (
        <>
            <MaterialIcons name="more-horiz" size={24} color={theme.text} onPress={open} />
            <Modal visible={visible} onRequestClose={close}>
                <TouchableOpacity style={style.listItem} onPress={() => {}}>
                    <>
                        <Header>Report an issue</Header>
                        <MaterialIcons style={style.icon} name="flag" size={24} color={theme.text} />
                    </>
                </TouchableOpacity >
                <TouchableOpacity style={style.listItem} onPress={() => {}}>
                    <>
                        <Header>Definition</Header>
                        <MaterialIcons
                            style={style.icon}
                            name="open-in-new"
                            size={24}
                            color="grey"
                            onPress={openDefinition}
                        />
                    </>
                </TouchableOpacity>
                <TouchableOpacity style={style.listItem} onPress={() => {}}>
                    <>
                        <Header>Favorite</Header>
                        <MaterialIcons
                            style={style.icon}
                            name={props.word.favorite ? 'favorite' : 'favorite-outline'}
                            size={24}
                            color="grey"
                            onPress={toggleFavorite}
                        />
                    </>
                </TouchableOpacity>
                <TouchableOpacity style={style.listItem} onPress={() => {}}>
                    <>
                        <Header>Share</Header>
                        <MaterialIcons style={style.icon} name="share" size={24} color="grey" />
                    </>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

interface Props {
    word: Words;
}

export const MoreButton = withObservables(['word'], (props: Props) => ({
    word: props.word.observe(),
}))(MoreButtonComponent);
