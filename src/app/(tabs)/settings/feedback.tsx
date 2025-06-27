import React from 'react';
import { View, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';

import { Setting } from '../../../components/Setting';
import { useTheme } from '../../../colors';
import { colors } from '../../../constants';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
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
                <Setting.Group label={`${t('Name')} (${t('required')})`}>
                    <Setting.Surface borderColor={getColor(name)}>
                        <TextInput
                            style={style.input}
                            value={name}
                            onChange={setValue(setName)}
                            placeholder='Your Name'
                        />
                    </Setting.Surface>
                </Setting.Group>
                <Setting.Group label={`${t('Email')} (${t('required')})`}>
                    <Setting.Surface borderColor={getColor(email)}>
                        <TextInput
                            style={style.input}
                            value={email}
                            onChange={setValue(setEmail)}
                            placeholder={t('your.email@example.com')}
                            inputMode="email"
                        />
                    </Setting.Surface>
                </Setting.Group>
                <Setting.Group label={`${t('Description')} (${t('required')})`}>
                    <Setting.Surface borderColor={getColor(description)}>
                        <TextInput
                            style={[style.input, style.large]}
                            value={description}
                            onChange={setValue(setDescription)}
                            placeholder={t('Found a bug? Have some feedback? Tell us here...')}
                            multiline={true}
                        />
                    </Setting.Surface>
                </Setting.Group>
                <Setting.Button label={t('Send feedback')} onPress={() => setValidated(!validated)} />
                <View style={{ padding: 16 }} />
            </ScrollView>
        </KeyboardAvoidingView >
    );
}
