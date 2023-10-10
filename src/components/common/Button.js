import React from 'react';
import { Button } from 'react-native-paper';

import PropTypes from 'prop-types';

import MMStyles from '../../helpers/Styles';
import MMColors from '../../helpers/Colors';

//import MMIcon from './icon';

export default function MMSubmitButton(props) {
    const {
        label, optionalStyle, textColor, optionalTextStyle,
    } = props;
    return (
        <Button style={optionalStyle ? [MMStyles.buttonPrimary, optionalStyle] : MMStyles.buttonPrimary} {...props}>
            {label}
        </Button>
    );
}
MMSubmitButton.propTypes = {
    label: PropTypes.string.isRequired,
    optionalStyle: PropTypes.any,
    optionalTextStyle: PropTypes.any,
    textColor: PropTypes.any
};

function MMRoundButton(props) {
    const {
        label, bgColor, optionalStyle, iconName, iconColor, optionalTextStyle,
    } = props;
    const backgroundColor = bgColor || MMColors.orange;

    const getStyle = () => {
        return {
            ...MMStyles.roundButton,
            backgroundColor: backgroundColor,
        };
    };
    return (
        <Button style={optionalStyle ? [getStyle(), optionalStyle] : getStyle()} size="xs" {...props}>
            {label}
        </Button>
    );
}

MMRoundButton.propTypes = {
    label: PropTypes.string.isRequired,
    bgColor: PropTypes.string,
    optionalStyle: PropTypes.any,
    optionalTextStyle: PropTypes.any,
    //iconName: PropTypes.string.isRequired,
    iconColor: PropTypes.string,
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

export {
    MMSubmitButton,
    MMRoundButton,
    MMTransparentButton,
};
