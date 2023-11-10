import React, { useState } from 'react';
import { View, Text, Keyboard, Alert } from 'react-native';
import { RadioButton, TextInput, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMUtils from '../../helpers/Utils'
import MMInput from '../../components/common/Input';
import MMScrollView from '../../components/common/ScrollView';
import { MMButton } from '../../components/common/Button';
import MMDateTimePicker from '../../components/common/DateTimePicker';
import MMFormErrorText from '../../components/common/FormErrorText';
import MMContentContainer from '../../components/common/ContentContainer';

export default function InitialSetup({ route, navigation }) {
    const theme = useTheme();
    const initState = {
        birth: '',
        situation: '',
        dueDate: undefined,
        showDueDate: false,
        errors: {},
    };
    const [state, setState] = useState(initState);


    const onSelectBirth = (value) => {
        setState({
            ...state,
            birth: value,
            errors: {
                ...state.errors,
                birth: '',
            },
        });
    };

    const onSelectSituation = (value) => {
        setState({
            ...state,
            situation: value,
            errors: {
                ...state.errors,
                situation: '',
            },
        });
    };

    const onPressDueDate = () => {
        Keyboard.dismiss();
        setState({
            ...state,
            showDueDate: true
        });
    };

    const onAddBaby = () => {
        navigation.navigate('AppStackNavigator', {
            screen: 'AddEditBaby',
            params: {}
        });
    };

    const renderView = () => {
        return (
            <View style={{ margin: 10 }}>
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                    <Text style={[theme.fonts.headlineMedium, { textAlign: 'center', marginBottom: 10 }]}>TELL US A BIT ABOUT YOURSELF</Text>
                </View>
                <View>
                    <Text style={theme.fonts.titleMedium}>1. Are you the birthing Parent?</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <RadioButton.Android
                            value="Yes"
                            status={state.birth === 'Yes' ? 'checked' : 'unchecked'}
                            onPress={() => onSelectBirth('Yes')}
                        />
                        <Text style={[theme.fonts.default, { marginTop: 8 }]} onPress={() => onSelectBirth('Yes')}>Yes</Text>
                        <RadioButton.Android
                            value="No"
                            status={state.birth === 'No' ? 'checked' : 'unchecked'}
                            onPress={() => onSelectBirth('No')}
                        />
                        <Text style={[theme.fonts.default, { marginTop: 8 }]} onPress={() => onSelectBirth('No')}>No</Text>
                    </View>
                    <MMFormErrorText errorText={state.errors.birth} />
                </View>
                <View style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={theme.fonts.titleMedium}>2. </Text>
                        <Text style={[theme.fonts.titleMedium]} numberOfLines={2}>Which of these best describes your situation?</Text>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        {MMConstants.situation.map((option) => (
                            <View key={option.value} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton.Android
                                    value={option.value}
                                    status={state.situation === option.value ? 'checked' : 'unchecked'}
                                    onPress={() => onSelectSituation(option.value)}
                                />
                                <Text style={theme.fonts.default} onPress={() => onSelectSituation(option.value)}>{option.label}</Text>
                            </View>
                        ))}
                    </View>
                    <MMFormErrorText errorText={state.errors.situation} />
                </View>
                {
                    !_.isNil(state.situation) && state.situation === 'currentlyPregnant' ?
                        <View style={{ marginTop: 10 }}>
                            <MMInput
                                label='3. what is your due date?'
                                name='dueDate'
                                placeholder='Date of Due'
                                value={_.isNil(state.dueDate) ? '' : MMUtils.displayDate(state.dueDate)}
                                errorText={state.errors.dueDate}
                                onPressIn={onPressDueDate}
                                onKeyPress={onPressDueDate}
                                left={<TextInput.Icon
                                    icon='calendar-range'
                                    forceTextInputFocus={false}
                                    onPress={onPressDueDate}
                                />}
                            />
                            {
                                state.showDueDate &&
                                <MMDateTimePicker
                                    name='dueDate'
                                    mode='date'
                                    display={MMUtils.isPlatformIos() ? 'inline' : 'default'}
                                    date={_.isNil(state.dueDate) ? new Date() : new Date(state.dueDate)}
                                    maximumDate={new Date()}
                                    onConfirm={(date) => {
                                        setState({
                                            ...state,
                                            dueDate: new Date(date),
                                            showDueDate: false,
                                            errors: {
                                                ...state.errors,
                                                dueDate: ''
                                            }
                                        })
                                    }}
                                    onCancel={() => {
                                        setState({
                                            ...state,
                                            showDueDate: false
                                        })
                                    }}
                                />
                            }
                        </View> : !_.isNil(state.situation) && <MMButton label='+  Add New Baby' onPress={() => onAddBaby()} />
                }
            </View>
        );
    };

    return (
        <MMContentContainer>
            <MMScrollView>
                {renderView()}
            </MMScrollView>
        </MMContentContainer>
    );
}

InitialSetup.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = (theme) => StyleSheet.create({
    milestone: {
        color: theme.colors.text.primary,
        width: 80,
        textAlign: 'center',
        marginTop: 5
    },
    image: {
        width: Dimensions.get('window').width / 6,
        height: Dimensions.get('window').height / 12,
        borderRadius: 50,
    },
    imageView: {
        borderRadius: 50,
        backgroundColor: theme.colors.secondaryContainer,
        width: Dimensions.get('window').width / 6 + 10,
        height: Dimensions.get('window').height / 12 + 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
});