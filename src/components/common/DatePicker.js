import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Label, Icon, Text } from 'native-base';

import PropTypes from 'prop-types';
import DateTimePicker from '@react-native-community/datetimepicker';

import MMStyles from '../../helpers/Styles';
import MMUtils from '../../helpers/Utils';
import MMColors from '../../helpers/Colors';
import MMFormErrorText from './FormErrorText';

export default function MMDatePicker(props) {
    const { label, errorMessage, setShowDate, placeholder, visible, testID, value, minimumDate, maximumDate, onChange } = props;
    return (
        <View style={MMStyles.formItemView}>
            {
                label ? <Label style={MMStyles.formItemLabel}>{label}</Label> : null
            }
            <View style={MMStyles.formItemView}>
                <Pressable style={errorMessage ? [styles.dateView, styles.dateViewError] : styles.dateView} onPress={() => setShowDate(true)}>
                    <Text style={errorMessage ? styles.dateTextError : styles.dateText}>{placeholder}</Text>
                    <Icon name='calendar' style={errorMessage ? [styles.calendarIcon, styles.calendarIconError] : styles.calendarIcon} />
                </Pressable>
                <MMFormErrorText errorText={errorMessage} />
                {
                    visible && (
                        <DateTimePicker
                            testID={testID}
                            value={value}
                            minimumDate={minimumDate}
                            maximumDate={maximumDate}
                            mode='date'
                            display={MMUtils.isPlatformAndroid() ? 'default' : 'spinner'}
                            style={MMStyles.mr20}
                            onChange={onChange}
                        />
                    )
                }
            </View>
        </View>
    )
}

MMDatePicker.propTypes = {
    label: PropTypes.string,
    testID: PropTypes.string,
    value: PropTypes.object,
    onChange: PropTypes.func,
    errorMessage: PropTypes.string,
    visible: PropTypes.bool,
    placeholder: PropTypes.any,
    minimumDate: PropTypes.any,
    maximumDate: PropTypes.any,
    setShowDate: PropTypes.func
};

const styles = StyleSheet.create({
    calendarIcon: {
        color: MMColors.menuContents,
        fontSize: 20,
        paddingBottom: 5
    },
    calendarIconError: {
        color: MMColors.error
    },
    dateView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: MMColors.menuTopBackground
    },
    dateText: {
        color: MMColors.label,
        marginLeft: 10
    },
    dateTextError: {
        color: MMColors.error
    },
    dateViewError: {
        borderBottomColor: MMColors.error
    }
});