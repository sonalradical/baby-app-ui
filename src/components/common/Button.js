import React from 'react';
import { Button, Text, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import _ from 'lodash';

import MMConstants from '../../helpers/Constants';

//import MMIcon from './icon';

const defaultSetting = {
    width: '100%',
}

function MMButton({ label, bgColor, width, onPress, style, icon = null, marginVertical = MMConstants.marginMedium, borderRadius, ...props }) {
    const theme = useTheme();
    const backgroundColor = bgColor || theme.colors.primary;

    return (
        <Button mode="contained" onPress={onPress} icon={icon}
            style={[buttonStyle(width, borderRadius, marginVertical), { ...style }]} backgroundColor={backgroundColor} {...props}>
            <Text style={{ color: theme.colors.secondaryContainer }}>{label}</Text>
        </Button>
    );
}

const buttonStyle = function (width, borderRadius = 10, marginVertical) {
    const widthValue = (_.isNil(width) ? defaultSetting.width : width);

    return {
        width: widthValue,
        borderRadius: borderRadius,
        marginVertical: marginVertical,
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
        <Button variant="none" transparent {...props} style={[style, { marginLeft: -5 }]}>
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
    const { label, onPress, disabled = false, width } = props;

    return (
        <Button
            mode="outlined"
            textColor={theme.colors.primary}
            onPress={onPress}
            disabled={disabled}
            style={buttonStyle(width)}
        >
            <Text style={{ color: theme.colors.primary }}>{label}</Text>
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
