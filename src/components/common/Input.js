import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import MMColors from '../../helpers/Colors';
import MMConstants from '../../helpers/Constants';
import MMFormErrorText from './FormErrorText';

const MMInput = ({ label, description, errorText, mode = 'outlined', ...props }) => {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <Text style={theme.fonts.titleMedium}>{label}</Text>
            <TextInput
                style={styles(theme).input}
                mode={mode}
                outlineColor={theme.colors.outline}
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
    },
    input: {
        height: 43,
        lineHeight: 20,
        backgroundColor: theme.colors.onPrimary,
        borderRadius: 10,
        marginBottom: 10
    },
});

MMInput.propTypes = {
    label: PropTypes.string,
    description: PropTypes.string,
    errorText: PropTypes.string,
};

export default MMInput;
