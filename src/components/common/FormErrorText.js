import React from 'react';
import { Text } from 'native-base';

import PropTypes from 'prop-types';

import MMStyles from '../../helpers/Styles';

export default function MMFormErrorText(props) {
    const { errorText } = props;

    if (errorText) {
        return (
            <Text style={MMStyles.errorText}>{errorText}</Text>
        )
    }

    return null;
}

MMFormErrorText.propTypes = {
    errorText: PropTypes.any
};
