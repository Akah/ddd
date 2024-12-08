import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Modal } from '../Modal';

const style = StyleSheet.create({
    text: {
        color: 'grey',
        fontSize: 18,
        fontWeight: 'bold',
    },
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

export const MoreButton: React.FC = () => {
    const [visible, setVisible] = React.useState(false);

    function open() {
        setVisible(true);
    }

    function close() {
        setVisible(false);
    }

    return (
        <>
            <MaterialIcons name="more-horiz" size={24} color="grey" onPress={open} />
            <Modal visible={visible} onRequestClose={close}>
                <View style={style.listItem}>
                    <Text style={style.text}>Report a problem</Text>
                    <MaterialIcons style={style.icon} name="flag" size={24} color="grey" />
                </View>
                <View style={style.listItem}>
                    <Text style={style.text}>Set favorite</Text>
                    <MaterialIcons style={style.icon} name="favorite-outline" size={24} color="grey" />
                </View>
                <View style={style.listItem}>
                    <Text style={style.text}>Share</Text>
                    <MaterialIcons style={style.icon} name="share" size={24} color="grey" />
                </View>
            </Modal>
        </>
    );
}
