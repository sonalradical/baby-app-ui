import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import MMColors from '../../helpers/Colors';
import MMConstants from '../../helpers/Constants';
import MMFormErrorText from './FormErrorText';

const MMInput = ({ label, description, errorText, mode = 'outlined', ...props }) => {

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                mode={mode}
                outlineColor={MMColors.inputBorder}
                autoCapitalize='none'
                textBreakStrategy='simple'
                label=''
                {...props}
            />
            {errorText ? <MMFormErrorText errorText={errorText} /> : null}
        </View>
    )
};

const styles  = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 10,
    },
    label: {
        marginBottom: 10,
        color: MMColors.black,
        fontFamily: MMConstants.fonts.bold
    },
    input: {
        height: 43,
        lineHeight: 20,
        backgroundColor: MMColors.white,
        borderRadius: 10,
        fontFamily: MMConstants.fonts.book,
        marginBottom: 10
    },
});

MMInput.propTypes = {
    label: PropTypes.string,
    description: PropTypes.string,
    errorText: PropTypes.string,
};

export default MMInput;
