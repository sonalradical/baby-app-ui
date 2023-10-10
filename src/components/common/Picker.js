import React, { useState } from 'react';
import { View } from 'react-native';

import * as _ from 'lodash';
import PropTypes from 'prop-types';
import DropDown from 'react-native-paper-dropdown';

import MMStyles from '../../helpers/Styles';
import MMFormErrorText from './FormErrorText';

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
    value: PropTypes.any,
    items: PropTypes.any,
    onValueChange: PropTypes.func,
    errorMessage: PropTypes.any,
    optionalStyle: PropTypes.object,
};

export default MMPicker;