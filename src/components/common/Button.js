import React from 'react';
import { Button, Text } from 'react-native-paper';

import PropTypes from 'prop-types';
import _ from 'lodash';

import MMStyles from '../../helpers/Styles';
import MMColors from '../../helpers/Colors';
import MMConstants from '../../helpers/Constants';

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

const defaultSetting = {
    width: '100%',
}

function MMRoundButton(props) {
    const {
        label, bgColor, width, onPress
    } = props;
    const backgroundColor = bgColor || MMColors.orange;

    return (
        <Button mode="contained" onPress={onPress} style={buttonStyle(width)} backgroundColor={backgroundColor}>
            <Text style={{ fontFamily: MMConstants.fonts.book, color: MMColors.white }}>{label}</Text>
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
    const { label, onPress, color, disabled = false, width } = props;
    return (
        <Button
            mode="outlined"
            textColor={color}
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
    MMRoundButton,
    MMTransparentButton,
    MMOutlineButton
};
