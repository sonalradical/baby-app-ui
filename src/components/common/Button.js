import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'native-base';

import PropTypes from 'prop-types';

import MMStyles from '../../helpers/Styles';
import MMColors from '../../helpers/Colors';

//import MMIcon from './icon';

export default function MMSubmitButton(props) {
    const {
        label, optionalStyle, textColor, optionalTextStyle,
    } = props;
    return (
        <Button block style={optionalStyle ? [MMStyles.buttonPrimary, optionalStyle] : MMStyles.buttonPrimary} {...props}>
            <Text uppercase style={[MMStyles.buttonPrimaryText, MMStyles.h6, textColor || null, optionalTextStyle]}>{label}</Text>
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
            <View style={{ alignItems: 'center' }}>
                {/* <MMIcon style={{ paddingHorizontal: 5 }} iconName={iconName} iconSize={16} iconColor={iconColor || MMColors.white} /> */}
                <Text style={[MMStyles.buttonText, MMStyles.mr20, MMStyles.h6, optionalTextStyle]}>{label}</Text>
            </View>
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
            <Text uppercase={false} style={getStyle()}>{label}</Text>
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
