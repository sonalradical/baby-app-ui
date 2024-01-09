import React from 'react';
import { Text, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import MMConstants from '../../helpers/Constants';


export default function MMFormErrorText(props) {
    const theme = useTheme();
    const { errorText } = props;

    if (errorText) {
        return (
            <Text style={{ color: theme.colors.error, paddingBottom: MMConstants.paddingMedium }}>{errorText}</Text>
        )
    }

    return null;
}

MMFormErrorText.propTypes = {
    errorText: PropTypes.any
};
