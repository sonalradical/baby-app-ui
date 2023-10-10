import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import * as _ from 'lodash';
import PropTypes from 'prop-types';

import MMStyles from '../../helpers/Styles';
import MMColors from '../../helpers/Colors';
import MMFormErrorText from './FormErrorText';
import DropDown from 'react-native-paper-dropdown';
import { IconButton } from 'react-native-paper';


function MMPicker(props) {
    const [visible, setVisible] = useState(false);
    const {
        label, value, items, optionalStyle, onValueChange, errorMessage
    } = props;

    return (
        <View style={[MMStyles.mb5, MMStyles.mt5, optionalStyle]}>
            <DropDown
                label={label}
                visible={visible}
                onDismiss={() => setVisible(false)}
                showDropDown={() => setVisible(true)}
                mode="outlined"
                value={value}
                setValue={onValueChange}
                list={items}
            />
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

export default MMPicker;