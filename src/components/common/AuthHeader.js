import * as React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

const MMAuthHeader = ({ title }) => {
    const theme = useTheme();

    return (
        <View style={{ alignItems: 'center', paddingBottom: 15 }}>
            <Text style={theme.fonts.headlineLarge}>{title}</Text>
        </View>
    );
};

MMAuthHeader.ropTypes = {
    title: PropTypes.isRequired,
};

export default MMAuthHeader;