import React, { useState } from 'react';
import { View, Text, Keyboard, StyleSheet, Image } from 'react-native';
import { RadioButton, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { validateAll } from 'indicative/validator';
import { useDispatch, useSelector } from 'react-redux';

import { setBaby } from '../../redux/Slice/AppSlice';
import { setLogin } from '../../redux/Slice/AuthSlice';

import MMEnums from '../../helpers/Enums';
import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import MMInput from '../../components/common/Input';
import MMScrollView from '../../components/common/ScrollView';
import { MMButton } from '../../components/common/Button';
import MMDateTimePicker from '../../components/common/DateTimePicker';
import MMFormErrorText from '../../components/common/FormErrorText';
import MMContentContainer from '../../components/common/ContentContainer';
import MMPageTitle from '../../components/common/PageTitle';
import MMImageBackground from '../../components/common/ImageBackground';
import MMSurface from '../../components/common/Surface';

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
        babyAge: '',
        numberOfBaby: '',
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

    const onInputChange = (field, value) => {
        setState({
            ...state,
            [field]: value,
            errors: {
                ...state.errors,
                [field]: '',
            },
        });
    };

    const onAddBabyCount = (text) => {
        const sanitizedText = text.replace(/\s/g, '');
        if (_.isInteger(_.toNumber(sanitizedText)) && _.toNumber(sanitizedText) > 0) {
            setState({
                ...state,
                numberOfBaby: sanitizedText,
                errors: {
                    ...state.errors,
                    numberOfBaby: '',
                },
            });
        }
        else {
            setState({
                ...state,
                numberOfBaby: '',
                errors: {
                    ...state.errors,
                    numberOfBaby: '',
                },
            });
        }
    };

    const onClickButton = () => {
        if (isOverlayLoading) {
            return;
        }
        const rules = state.situation === MMEnums.situation.currentlyPregnant ? {
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
                    childCount: state.numberOfBaby ? _.parseInt(state.numberOfBaby) : 1,
                };
                const { data } = await MMApiService.updateInItProfile(apiData)
                if (data) {
                    MMUtils.setItemToStorage(MMEnums.storage.userDetail, JSON.stringify(data.userDetail));
                    dispatch(setLogin({ userDetail: data.userDetail, accessToken: accessToken }));
                    if (state.situation == MMEnums.situation.currentlyPregnant) {
                        MMUtils.setItemToStorage(MMEnums.storage.selectedBaby, JSON.stringify(data.babyDetail));
                        dispatch(setBaby(data.babyDetail));
                        navigation.navigate('Footer');
                    } else {
                        navigation.navigate('AddEditBaby');
                    }
                }
                setOverlayLoading(false);
            })
            .catch((errors) => {
                setState({
                    ...state,
                    errors: MMUtils.clientErrorMessages(errors)
                });
                setOverlayLoading(false);
            });
    };

    const renderView = () => {
        return (
            <MMSurface margin={[0, 0, 0, 0]} style={styles(theme).surface}>
                <View style={{ padding: MMConstants.paddingMedium }}>
                    <MMPageTitle title='Tell us a bit about yourself' paddingBottom={20} />
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
                    <View style={{ marginTop: MMConstants.marginMedium }}>
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
                            state.situation === MMEnums.situation.currentlyPregnant ?
                                <View style={{ marginTop: MMConstants.marginMedium }}>
                                    <>
                                        <MMInput
                                            label='3. What is your due date?'
                                            name='dueDate'
                                            placeholder='Date of Due'
                                            value={_.isNil(state.dueDate) ? '' : MMUtils.displayDate(state.dueDate)}
                                            errorText={state.errors.dueDate}
                                            onPressIn={onPressDueDate}
                                            onKeyPress={onPressDueDate}
                                            leftIcon='calendar-range'
                                            onPress={onPressDueDate}
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
                                </View> :
                                <>{state.situation == MMEnums.situation.mumToMultiple ?
                                    <MMInput
                                        label='3. How many bubs do you have?'
                                        maxLength={50}
                                        value={state.numberOfBaby}
                                        onChangeText={onAddBabyCount}
                                        placeholder="Enter How Many Baby You have"
                                        errorText={state.errors.numberOfBaby}
                                        keyboardType="numeric"

                                    /> :
                                    <MMInput
                                        label='3. How old is your bub?'
                                        maxLength={20}
                                        value={state.babyAge}
                                        onChangeText={(value) => onInputChange('babyAge', value)}
                                        placeholder="Enter Your Bub Age"
                                        errorText={state.errors.babyAge}
                                    />}
                                    <MMButton label='+  Add New Baby' onPress={() => onClickButton()} /></>
                            : null
                    }
                </View>
            </MMSurface>
        );
    };

    return (
        <MMImageBackground imgSource={require('../../assets/images/initial.jpg')}>
            <MMScrollView>
                {renderView()}
            </MMScrollView>
        </MMImageBackground>
    );
}

InitialSetup.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = (theme) => StyleSheet.create({
    surface: {
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        bottom: 0,
        position: 'absolute',
        backgroundColor: theme.colors.background
    }
});
