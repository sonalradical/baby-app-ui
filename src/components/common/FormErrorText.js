import React from 'react';
import { Text } from 'react-native';

import PropTypes from 'prop-types';

import Styles from '../../helpers/Styles';
import MMStyles from '../../helpers/Styles';


export default function MMFormErrorText(props) {
    const { errorText, optionalStyle } = props;

    if (errorText) {
        return (
            <Text numberOfLines={2} style={[Styles.errorText, optionalStyle, MMStyles.h6]}>{errorText}</Text>
        );
    }
    return null;
}

MMFormErrorText.propTypes = {
    errorText: PropTypes.any,
    optionalStyle: PropTypes.object,
};
