import * as React from 'react';
import { Text, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

const MMPageTitle = ({ title, optionalStyle, textAlign = 'center', paddingBottom = 8 }) => {
    const theme = useTheme();

    return (
        <Text style={[theme.fonts.headlineMedium, { textAlign: textAlign, paddingBottom: paddingBottom, ...optionalStyle }]}>{title}</Text>
    );
};

MMPageTitle.ropTypes = {
    title: PropTypes.isRequired,
};

export default MMPageTitle;