import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import MMFormErrorText from './FormErrorText';

const MMInput = ({ label, description, errorText, leftIcon, rightIcon, onPress, mode = 'outlined', ...props }) => {
    const theme = useTheme();

    return (
        <View style={styles(theme).container}>
            {label ? <Text style={theme.fonts.titleMedium}>{label}</Text> : null}
            <TextInput
                style={styles(theme).input}
                mode={mode}
                outlineColor={theme.colors.outline}
                autoCapitalize='none'
                textBreakStrategy='simple'
                label=''
                {...props}
                left={leftIcon ? <TextInput.Icon
                    icon={leftIcon}
                    forceTextInputFocus={false}
                    onPress={onPress}
                /> : null}
                right={rightIcon ? (
                    <TextInput.Icon
                        color={theme.colors.primary}
                        icon={rightIcon}
                        onPress={onPress}
                    />
                ) : null}

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
        backgroundColor: theme.colors.secondaryContainer,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 6

    },
});

MMInput.propTypes = {
    label: PropTypes.string,
    description: PropTypes.string,
    errorText: PropTypes.string,
};

export default MMInput;
