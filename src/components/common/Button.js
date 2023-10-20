import React from 'react';
import { Button } from 'react-native-paper';

import PropTypes from 'prop-types';

import MMStyles from '../../helpers/Styles';
import MMColors from '../../helpers/Colors';

//import MMIcon from './icon';

export default function MMButton(props) {
    const {
        label, optionalStyle
    } = props;
    return (
        <Button style={optionalStyle ? [MMStyles.buttonPrimary, optionalStyle] : MMStyles.buttonPrimary} {...props}>
            {label}
        </Button>
    );
}
MMButton.propTypes = {
    label: PropTypes.string.isRequired,
    optionalStyle: PropTypes.any,
};

function MMRoundButton(props) {
    const {
        label, bgColor, optionalStyle
    } = props;
    const backgroundColor = bgColor || MMColors.orange;

    const getStyle = () => {
        return {
            ...MMStyles.roundButton,
            backgroundColor: backgroundColor,
        };
    };
    return (
        <Button style={optionalStyle ? [getStyle(), optionalStyle] : getStyle()} size="xs" textColor={MMColors.white} {...props}>
            {label}
        </Button>
    );
}

MMRoundButton.propTypes = {
    label: PropTypes.string.isRequired,
    bgColor: PropTypes.string,
    optionalStyle: PropTypes.any,
};

function MMTransparentButton(props) {
    const { label, textColor } = props;
    const color = textColor || MMColors.disabled;
    const getStyle = () => {
        return {
            ...MMStyles.titleText,
            ...MMStyles.alignSelfCenter,
            ...MMStyles.h5,
            color: color
        };
    };
    return (
        <Button variant="none" transparent {...props}>
            {label}
        </Button>
    );
}

MMTransparentButton.propTypes = {
    label: PropTypes.string.isRequired,
    textColor: PropTypes.string,
};

function MMOutlineButton(props) {
    const { label, onPress, color, disabled = false } = props;
    return (
        <Button
            mode="outlined"
            textColor={color}
            onPress={onPress}
            disabled={disabled}
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
    MMRoundButton,
    MMTransparentButton,
    MMOutlineButton
};
