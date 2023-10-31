import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { useTheme, Text, TextInput } from 'react-native-paper';
import MMColors from '../../helpers/Colors';
import MMConstants from '../../helpers/Constants';
import MMFormErrorText from './FormErrorText';

const MMInput = ({ label, description, errorText, mode = 'outlined', ...props }) => {
    const theme = useTheme();

    return (
        <View style={styles(theme).container}>
            <Text style={styles(theme).label}>{label}</Text>
            <TextInput
                style={styles(theme).input}
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

const styles = (theme) => StyleSheet.create({
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
