import React from 'react';
import { TextInput, ScrollView, StyleSheet } from 'react-native';

import { Setting } from '../../../components/Setting';
import { useTheme } from '../../../colors';
import { colors } from '../../../constants';

const style = StyleSheet.create({
    input: {
        margin: -8,
        padding: 8,
    },
    large: {
        height: 200,
        textAlignVertical: 'top',
    }
})

export default function Feedback() {
    const theme = useTheme();
    const [validated, setValidated] = React.useState<boolean>();
    const [name, setName] = React.useState<string|undefined>();
    const [email, setEmail] = React.useState<string | undefined>();
    const [description, setDescription] = React.useState<string | undefined>();

    function getColor(value: string | undefined) {
        if (!validated) {
            return theme.border;
        }
        if (value == null) {
            return colors.red.background;
        }
        return colors.green.background;
    }

    return (
        <ScrollView style={{ padding: 16 }}>
            <Setting.Group label="Name (required)">
                <Setting.Surface borderColor={getColor(name)}>
                    <TextInput
                        onFocus={(e) => console.debug(e.nativeEvent)}
                        style={style.input}
                        value={name}
                        onChange={(e) => setName(e.nativeEvent.text)}
                        placeholder='Your Name'
                    />
                </Setting.Surface>
            </Setting.Group>
            <Setting.Group label="Email (required)">
                <Setting.Surface borderColor={getColor(email)}>
                    <TextInput
                        style={style.input}
                        value={email}
                        onChange={(e) => setEmail(e.nativeEvent.text)}
                        placeholder='your.email@example.com'
                        inputMode="email"
                    />
                </Setting.Surface>
            </Setting.Group>
            <Setting.Group label="Description (required)">
                <Setting.Surface borderColor={getColor(description)}>
                    <TextInput
                        style={[style.input, style.large]}
                        value={description}
                        onChange={(e) => setDescription(e.nativeEvent.text)}
                        placeholder='Found a bug? Have some feedback? Tell us here...'
                        multiline={true}
                    />
                </Setting.Surface>
            </Setting.Group>
            <Setting.Button label="Send feedback" onPress={() => setValidated(!validated)} />
        </ScrollView>
    );
}
