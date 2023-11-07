import React from 'react';
import { Text, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';

import MMStyles from '../../helpers/Styles';


export default function MMFormErrorText(props) {
    const theme = useTheme();
    const { errorText } = props;

    if (errorText) {
        return (
            <Text style={{ color: theme.colors.error }}>{errorText}</Text>
        )
    }

    return null;
}

MMFormErrorText.propTypes = {
    errorText: PropTypes.any
};
