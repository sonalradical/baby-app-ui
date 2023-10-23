import React from 'react';
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import * as _ from 'lodash';
import PropTypes from 'prop-types';

import MMStyles from '../../helpers/Styles';
import MMConstants from '../../helpers/Constants';
import MMColor from '../../helpers/Colors';
import MMFormErrorText from './FormErrorText';
import MMIcon from './Icon';

const leftIcon = (iconName, iconColor, optionalIconSize) => {

    return (
        <View>
            <MMIcon iconName={iconName} iconSize={optionalIconSize ?? 26} iconColor={[MMColor.darkBlack, iconColor]} style={MMStyles.ml20} />
        </View>
    );
};

function MMInput(props) {
    const {
        label, errorMessage, isDisabled, iconName, optionalStyle, inputOptionalStyle, iconColor, optionalIconSize,
    } = props;
    return (
        <View>
            {
                label ? <Text style={[MMStyles.formItemLabel]}>{label}</Text> : null
            }
            <View style={[MMStyles.formItemInput, optionalStyle]}>
                <TextInput
                    mode='outlined'
                    label=''
                    left={iconName ? <TextInput.Icon icon={iconName} /> : null}
                    keyboardType="default"
                    style={[MMStyles.formInput, inputOptionalStyle]}
                    autoCapitalize='none'
                    textBreakStrategy='simple'
                    {...props}
                />
            </View>
            <MMFormErrorText errorText={errorMessage} />
        </View>
    );
}

MMInput.propTypes = {
    label: PropTypes.string,
    iconName: PropTypes.string,
    iconColor: PropTypes.string,
    iconType: PropTypes.string,
    errorMessage: PropTypes.any,
    optionalStyle: PropTypes.any,
    inputOptionalStyle: PropTypes.object,
    optionalIconSize: PropTypes.any,
    isDisabled: PropTypes.bool
};

export default MMInput;
