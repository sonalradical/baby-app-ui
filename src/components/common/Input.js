import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { useTheme, Text, TextInput } from 'react-native-paper';
import MMColors from '../../helpers/Colors';

const MMInput = ({ label, description, errorText, mode = 'outlined', ...props }) => {
    const theme = useTheme();

    return (
        <View style={styles(theme).container}>
            <Text style={styles(theme).label}>{label}</Text>
            <TextInput
                style={styles(theme).input}
                mode={mode}
                autoCapitalize='none'
                textBreakStrategy='simple'
                label=''
                {...props}
            />
            {errorText ? <Text style={styles(theme).error}>{errorText}</Text> : null}
        </View>
    )
};

const styles = (theme) => StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 5,
    },
    label: {
        marginBottom: 3,
    },
    input: {
        height: 43,
        lineHeight: 20,
        backgroundColor: MMColors.white,
    },
    error: {
        fontSize: 13,
        paddingTop: 2,
        paddingLeft: 2,
        color: theme.colors.error,
    },
});

MMInput.propTypes = {
    label: PropTypes.string,
    description: PropTypes.string,
    errorText: PropTypes.string,
};

export default MMInput;
