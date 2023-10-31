import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
    isLastFilledCell
} from 'react-native-confirmation-code-field';
import { useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import MMColors from '../../helpers/Colors';

const MMPinTextInput = ({ value, cellCount, setValue, errorText }) => {
    const theme = useTheme();

    const ref = useBlurOnFulfill({ value, cellCount: cellCount });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue
    });

    const renderCell = ({ index, symbol, isFocused }) => {
        let textChild = null;

        if (symbol) {
            textChild = symbol; // Display the symbol directly in the cell.
        } else if (isFocused) {
            textChild = <Cursor />;
        }

        return (
            <Text
                key={index}
                style={[styles(theme).cell, isFocused && styles(theme).focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {textChild}
            </Text>
        );
    }

    return (
        <View style={styles(theme).fieldRow}>
            <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={cellCount}
                keyboardType='number-pad'
                textContentType='oneTimeCode'
                renderCell={renderCell}
            />
            {errorText ? <Text style={styles(theme).error}>{errorText}</Text> : null}
        </View>
    )
};

MMPinTextInput.propTypes = {
    value: PropTypes.any,
    setValue: PropTypes.func,
    cellCount: PropTypes.number,
};

const styles = (theme) => StyleSheet.create({
    cell: {
        width: 42,
        height: 42,
        fontSize: 28,
        borderWidth: 2,
        borderColor: MMColors.disabled,
        borderRadius: 10,
        marginHorizontal: 10,
        marginTop: 20,
        textAlign: 'center',
        color: MMColors.black
    },
    focusCell: {
        borderColor: theme.colors.primary,
        borderWidth: 4
    },
    error: {
        fontSize: 13,
        paddingTop: 4,
        paddingLeft: 4,
        color: theme.colors.error,
    },
    fieldRow: {
        marginVertical: 15,
        alignSelf: 'center',
    },
});

export default MMPinTextInput;