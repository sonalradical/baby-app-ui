import * as React from 'react';
import { Text, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

const MMPageTitle = ({ title }) => {
    const theme = useTheme();

    return (
        <Text style={[theme.fonts.headlineMedium, { textAlign: 'center', paddingBottom: 10 }]}>{title}</Text>
    );
};

MMPageTitle.ropTypes = {
    title: PropTypes.isRequired,
};

export default MMPageTitle;