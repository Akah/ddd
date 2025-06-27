import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, FlatList, StyleSheet, TouchableOpacity, ListRenderItemInfo } from 'react-native';

import { database } from '../model/database';
import { Gender, Words } from '../model/model';
import { Modal } from './Modal';
import { LIST_RENDER_BATCH } from '../constants';
import { WordInfo } from './debug/WordInfo';
import { Text } from './Text';
import { useTheme } from '../colors';

interface Props {
    words: Array<Words>;
    setOffset: () => void;
}

export type Article = 'der' | 'die' | 'das';

const lookup = new Map<Gender, Article>([
    ['m', 'der'],
    ['f', 'die'],
    ['n', 'das'],
])

// TODO:  move to Gender class
export function genderToArticle(gender: Gender): Article {
    return lookup.get(gender) ?? 'der';
}

const style = StyleSheet.create({
    list: {
        padding: 8
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        padding: 8,
        paddingHorizontal: 12,
        overflow: 'hidden',
    },
    top: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderTopWidth: 2,
    },
    bottom: {
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderBottomWidth: 2,
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        marginRight: 32,
    }
});

interface ItemProps {
    word: Words,
    index: number,
    length: number,
}

const Item: React.FC<ItemProps> = (props: ItemProps) => {
    const theme = useTheme();
    const itemStyle = [
        style.item,
        props.index === 0 ? style.top : undefined,
        props.length === props.index + 1 ? style.bottom : undefined,
        {
            borderColor: theme.border,
            backgroundColor: theme.background,
        },
    ];
    const [modal, setModal] = React.useState(false);
    const [showInfo, setShowInfo] = React.useState(false);

    async function toggleFavorite(): Promise<void> {
        await database.write(async () => {
            await props.word.update(() => (
                props.word.favorite = !props.word.favorite
            ));
        });
    }

    function toggleShowInfo(): void {
        setShowInfo(!showInfo);
    }

    return (
        <TouchableOpacity style={itemStyle} onPress={() => setModal(true)}>
            <View>
                <Text style={style.text}>{`${genderToArticle(props.word.gender)} ${props.word.noun}`}</Text>
            </View>
            <Modal visible={modal} onRequestClose={() => setModal(false)}>
                <Text style={style.text}>{`${genderToArticle(props.word.gender)} ${props.word.noun}`}</Text>
                <TouchableOpacity style={style.modalItem} onPress={toggleFavorite}>
                    <Text style={style.text}>Favorite</Text>
                    <MaterialIcons
                        name={props.word.favorite ? 'favorite' : 'favorite-outline'}
                        size={24}
                        color='grey'
                    />
                </TouchableOpacity>
                <View style={style.modalItem}>
                    <Text style={style.text}>Translate</Text>
                    <MaterialIcons name={'translate'} size={24} color='grey' />
                </View>
                {__DEV__ && <>
                    <TouchableOpacity style={style.modalItem} onPress={toggleShowInfo}>
                        <Text style={style.text}>Info...</Text>
                    </TouchableOpacity>
                    {showInfo && <WordInfo word={props.word}/> }
                </>}
            </Modal>
        </TouchableOpacity>
    );
}

const Component: React.FC<Props> = (props: Props) => {
    const { t } = useTranslation();
    function renderItem(info: ListRenderItemInfo<Words>) {
        return (<Item word={info.item} index={info.index} length={props.words.length} />);
    }

    if (props.words.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>
                    {t('You currently have no favorites')}
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            contentContainerStyle={style.list}
            data={props.words}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onEndReached={props.setOffset}
            onEndReachedThreshold={3}
            maxToRenderPerBatch={LIST_RENDER_BATCH}
        />
    );
};

interface WordsListProps {
    offset: number,
    setOffset: () => void,
    search?: string,
}

export const WordsList = withObservables(['setOffset', 'search'], (props: WordsListProps) => ({
    words: database
        .get<Words>('words')
            .query(
                Q.where('noun', Q.like(`%${Q.sanitizeLikeString(props.search ?? '')}%`)),
                Q.sortBy('noun'),
                Q.take(LIST_RENDER_BATCH + props.offset))
        .observeWithColumns(['favorite']),
}))(Component);

export const Favorites = withObservables(['setOffset'], (props: WordsListProps) => ({
    words: database
        .get<Words>('words')
            .query(
                Q.sortBy('noun'),
                Q.take(40 + props.offset),
                Q.where('favorite', true)
            )
        .observeWithColumns(['favorite'])
}))(Component);
