import React from 'react';
import { View, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, NativeSyntheticEvent, TextInputTextInputEventData, TextInputChangeEventData } from 'react-native';

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
    const [name, setName] = React.useState<string | undefined>();
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

    function setValue(setter: React.Dispatch<React.SetStateAction<string | undefined>>) {
        return (event: NativeSyntheticEvent<TextInputChangeEventData>) => setter(event.nativeEvent.text);
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled keyboardVerticalOffset={100}>
            <ScrollView style={{ padding: 16 }}>
                <Setting.Group label="Name (required)">
                    <Setting.Surface borderColor={getColor(name)}>
                        <TextInput
                            style={style.input}
                            value={name}
                            onChange={setValue(setName)}
                            placeholder='Your Name'
                        />
                    </Setting.Surface>
                </Setting.Group>
                <Setting.Group label="Email (required)">
                    <Setting.Surface borderColor={getColor(email)}>
                        <TextInput
                            style={style.input}
                            value={email}
                            onChange={setValue(setEmail)}
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
                            onChange={setValue(setDescription)}
                            placeholder='Found a bug? Have some feedback? Tell us here...'
                            multiline={true}
                        />
                    </Setting.Surface>
                </Setting.Group>
                <Setting.Button label="Send feedback" onPress={() => setValidated(!validated)} />
                <View style={{padding: 16}} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
