import React from 'react';
import { Button, Text, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import _ from 'lodash';

//import MMIcon from './icon';

const defaultSetting = {
    width: '100%',
}

function MMButton(props) {
    const theme = useTheme();
    const {
        label, bgColor, width, onPress, style
    } = props;
    const backgroundColor = bgColor || theme.colors.primary;

    return (
        <Button mode="contained" onPress={onPress} style={[buttonStyle(width), { ...style }]} backgroundColor={backgroundColor}>
            <Text style={{ color: theme.colors.onPrimary }}>{label}</Text>
        </Button>
    );
}

const buttonStyle = function (width) {
    const widthValue = (_.isNil(width) ? defaultSetting.width : width);

    return {
        width: widthValue,
        borderRadius: 10,
        marginVertical: 10,
        paddingVertical: 2,
        alignSelf: 'center'
    }
};

MMButton.propTypes = {
    label: PropTypes.string.isRequired,
    bgColor: PropTypes.string,
    optionalStyle: PropTypes.any,
};

function MMTransparentButton(props) {
    const theme = useTheme();
    const { label, style } = props;

    return (
        <Button variant="none" transparent {...props} style={style}>
            <Text style={{ color: theme.colors.primary }}>{label}</Text>
        </Button>
    );
}

MMTransparentButton.propTypes = {
    label: PropTypes.string.isRequired,
    textColor: PropTypes.string,
};

function MMOutlineButton(props) {
    const theme = useTheme();
    const { label, onPress, color, disabled = false, width } = props;

    return (
        <Button
            mode="outlined"
            textColor={theme.colors.primary}
            onPress={onPress}
            disabled={disabled}
            style={buttonStyle(width)}
        >
            {label}
        </Button>
    );
};

MMOutlineButton.propTypes = {
    label: PropTypes.string.isRequired,
    textColor: PropTypes.string,
};

export {
    MMButton,
    MMTransparentButton,
    MMOutlineButton
};
