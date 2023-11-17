import React, { useState } from 'react';
import { View, Text, Keyboard, Alert } from 'react-native';
import { RadioButton, TextInput, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { validateAll } from 'indicative/validator';
import { useDispatch, useSelector } from 'react-redux';

import { setBaby } from '../../redux/Slice/AppSlice';
import { setLogin } from '../../redux/Slice/AuthSlice';

import MMEnums from '../../helpers/Enums';
import MMUtils from '../../helpers/Utils'
import MMApiService from '../../services/ApiService';
import MMInput from '../../components/common/Input';
import MMScrollView from '../../components/common/ScrollView';
import { MMButton } from '../../components/common/Button';
import MMDateTimePicker from '../../components/common/DateTimePicker';
import MMFormErrorText from '../../components/common/FormErrorText';
import MMContentContainer from '../../components/common/ContentContainer';

export default function InitialSetup({ route, navigation }) {
    const theme = useTheme();
    const dispatch = useDispatch();

    const lookupData = useSelector((state) => state.AuthReducer.lookupData);
    const { accessToken } = useSelector((state) => state.AuthReducer.auth);

    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const initState = {
        birthingParent: '',
        situation: null,
        dueDate: undefined,
        showDueDate: false,
        errors: {},
    };
    const [state, setState] = useState(initState);

    const messages = {
        'birthingParent.required': 'Please answer the question.',
        'situation.required': 'Please select situation.',
        'dueDate.required': 'Please select due date.',
    };

    const onSelectBirthingParent = (value) => {
        setState({
            ...state,
            birthingParent: value,
            errors: {
                ...state.errors,
                birthingParent: '',
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

    const onClickButton = () => {
        if (isOverlayLoading) {
            return;
        }
        const rules = state.situation === 'currentlyPregnant' ? {
            birthingParent: 'required',
            situation: 'required',
            dueDate: 'required'
        } : {
            birthingParent: 'required',
            situation: 'required',
        };
        validateAll(state, rules, messages)
            .then(async () => {
                setOverlayLoading(true);
                const apiData = {
                    birthingParent: state.birthingParent,
                    situation: state.situation,
                    dueDate: state.dueDate,
                    childCount: 1
                };

                await MMApiService.updateInItProfile(apiData)
                    .then(function (response) {
                        if (response) {
                            dispatch(setLogin({ userDetail: response.data, accessToken: accessToken }));
                            MMUtils.setItemToStorage(MMEnums.storage.userDetail, JSON.stringify(response.data));
                            if (state.situation === 'currentlyPregnant') {
                                MMApiService.addInit().then(function (responseData) {
                                    if (responseData) {
                                        dispatch(setBaby(responseData.data._id));
                                        navigation.navigate('Footer');
                                    }
                                });
                            } else {
                                navigation.navigate('AddEditBaby');
                            }
                        }

                    })
                    .catch(function (error) {
                        setState({
                            ...state,
                            errors: MMUtils.apiErrorParamMessages(error)
                        });
                    });
                setOverlayLoading(false);
            })
            .catch((errors) => {
                console.log("Validation Errors:", errors);
                setState({
                    ...state,
                    errors: MMUtils.clientErrorMessages(errors)
                });
                setOverlayLoading(false);
            });
    };

    const renderView = () => {
        return (
            <>
                <View style={{ margin: 10 }}>
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <Text style={[theme.fonts.headlineMedium, { textAlign: 'center', marginBottom: 10 }]}>TELL US A BIT ABOUT YOURSELF</Text>
                    </View>
                    <View>
                        <Text style={theme.fonts.titleMedium}>1. Are you the birthing Parent?</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <RadioButton.Android
                                value="Yes"
                                status={state.birthingParent === 'Yes' ? 'checked' : 'unchecked'}
                                onPress={() => onSelectBirthingParent('Yes')}
                            />
                            <Text style={[theme.fonts.default, { marginTop: 8 }]} onPress={() => onSelectBirthingParent('Yes')}>Yes</Text>
                            <RadioButton.Android
                                value="No"
                                status={state.birthingParent === 'No' ? 'checked' : 'unchecked'}
                                onPress={() => onSelectBirthingParent('No')}
                            />
                            <Text style={[theme.fonts.default, { marginTop: 8 }]} onPress={() => onSelectBirthingParent('No')}>No</Text>
                        </View>
                        <MMFormErrorText errorText={state.errors.birthingParent} />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={theme.fonts.titleMedium}>2. </Text>
                            <Text style={[theme.fonts.titleMedium]} numberOfLines={2}>Which of these best describes your situation?</Text>
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            {lookupData.situations.map((option) => (
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
                        !_.isNil(state.situation) ?
                            state.situation === 'currentlyPregnant' ?
                                <View style={{ marginTop: 10 }}>
                                    <>
                                        <MMInput
                                            label='3. What is your due date?'
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
                                        <MMButton label='Get Started' onPress={() => onClickButton()} />
                                    </>
                                    {
                                        state.showDueDate &&
                                        <MMDateTimePicker
                                            name='dueDate'
                                            mode='date'
                                            display={MMUtils.isPlatformIos() ? 'inline' : 'default'}
                                            date={_.isNil(state.dueDate) ? new Date() : new Date(state.dueDate)}
                                            minimumDate={new Date()}
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
                                </View> : <MMButton label='+  Add New Baby' onPress={() => onClickButton()} />
                            : null
                    }
                </View>
            </>
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