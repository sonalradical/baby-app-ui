import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Select, Text } from 'native-base';

import * as _ from 'lodash';
import PropTypes from 'prop-types';

import MMStyles from '../../helpers/Styles';
import MMColors from '../../helpers/Colors';
import MMIcon from './Icon';
import MMUtils from '../../helpers/Utils';
import MMFormErrorText from './FormErrorText';
import MMConstants from '../../helpers/Constants';

const defaultEnabled = true;
const defaultLabelValuePair = true;

const getIconStyle = (isError, enabled) => {
    if (isError) {
        return [styles.pickerIcon, MMStyles.h4];
    } if (enabled) {
        return [styles.pickerIcon, MMStyles.h4];
    }
    return [styles.pickerIcon, MMStyles.h4, styles.pickerIconDisabled];
};

function DropDownAndroidIcon(props) {
    const { isError, enabled } = props;
    if (MMUtils.isPlatformAndroid()) {
        return <MMIcon name="keyboard-arrow-down" style={getIconStyle(isError, enabled)} />;
    }
    return null;
}

DropDownAndroidIcon.propTypes = {
    isError: PropTypes.bool,
    enabled: PropTypes.bool,
};

function DropDownIosIcon(props) {
    const { isError, enabled } = props;
    return <MMIcon name="keyboard-arrow-down" type="MaterialIcons" style={getIconStyle(isError, enabled)} />;
}

DropDownIosIcon.propTypes = {
    isError: PropTypes.bool,
    enabled: PropTypes.bool,
};

export default function MMPicker(props) {
    const {
        label, placeholder, value, items, optionalStyle,
        labelValuePair, optionalStyleText, labelParameter,
        valueParameter, onValueChange, errorMessage, enabled, selectedItem
    } = props;
    const isError = !!errorMessage;
    const isEnabled = _.isNil(enabled) ? defaultEnabled : enabled;
    const isLabelValuePair = _.isNil(labelValuePair) ? defaultLabelValuePair : labelValuePair;

    return (
        <View style={[MMStyles.mb5, MMStyles.mt5, optionalStyle]}>
            {
                label ? <Text style={[MMStyles.formItemLabel, MMStyles.h6, optionalStyleText]}>{label}</Text> : null
            }
            <Select
                note
                mode="dropdown"
                fontFamily={MMConstants.fonts.regular}
                iosIcon={<DropDownIosIcon isError={isError} enabled={isEnabled} />}
                style={styles.picker}
                size='md'
                variant='rounded'
                _selectedItem={selectedItem}
                placeholder={placeholder}
                selectedValue={value}
                onValueChange={onValueChange}
                isDisabled={!isEnabled}
            >
                <Select.Item isDisabled={true} label={placeholder} value={null} />
                {
                    _.map(items, (item, index) => {
                        if (isLabelValuePair) {
                            return <Select.Item key={index} label={item[labelParameter]} value={item[valueParameter]} />;
                        }
                        return <Select.Item key={index} label={item} value={item} />;
                    })
                }
            </Select>
            <MMFormErrorText errorText={errorMessage} />
        </View>
    );
}

MMPicker.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    items: PropTypes.any,
    labelValuePair: PropTypes.bool,
    labelParameter: PropTypes.string,
    valueParameter: PropTypes.string,
    onValueChange: PropTypes.func,
    errorMessage: PropTypes.any,
    enabled: PropTypes.bool,
    optionalStyle: PropTypes.object,
    optionalStyleText: PropTypes.object,
    selectedItem: PropTypes.any
};

const styles = StyleSheet.create({
    picker: {
        width: '100%',
        color: MMColors.label,
        paddingLeft: 40
    },
    pickerIcon: {
        color: MMColors.orange,
        position: 'absolute',
        bottom: 16,
        zIndex: 999,
        right: 10,
        backgroundColor: MMColors.white,
    },
    pickerIconDisabled: {
        color: MMColors.disabled,
    },
});

export {
    DropDownAndroidIcon,
    DropDownIosIcon,
};
