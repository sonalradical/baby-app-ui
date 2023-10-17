import React, { useEffect, useState } from 'react';
import { View, Text, Keyboard } from 'react-native';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { validateAll } from 'indicative/validator';

import MMStyles from '../../helpers/Styles';
import MMConstants from '../../helpers/Constants';
import MMColors from '../../helpers/Colors';
import MMUtils from '../../helpers/Utils'
import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMInput from '../../components/common/Input';
import MMScrollView from '../../components/common/ScrollView';
import { MMRoundButton } from '../../components/common/Button';
//import MMProfileAvatar from '../../components/common/ImagePicker';
import { SegmentedButtons, TextInput } from 'react-native-paper';
import MMPicker from '../../components/common/Picker';
import MMDateTimePicker from '../../components/common/DateTimePicker';
import MMFlexView from '../../components/common/FlexView';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import MMFormErrorText from '../../components/common/FormErrorText';

export default function AddBaby({ route }) {
    const { babyId } = route.params || '';
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);
    const navigation = useNavigation();

    const initState = {
        name: '',
        birthDate: undefined,
        birthTime: undefined,
        birthPlace: '',
        gender: '',
        showBirthDate: false,
        showBirthTime: false,
        errors: {},
    };
    const [state, setState] = useState(initState);
    const [checked, setChecked] = useState(false);

    useEffect(() => {

        const loadBabyProfileDetail = async () => {
            if (babyId) {
                try {
                    setIsOverlayLoading(true);
                    const response = await MMApiService.getBabyById(babyId);
                    if (response.data) {
                        setState({
                            ...state,
                            name: response.data.name,
                            birthDate: response.data.birthDate,
                            birthTime: response.data.birthTime,
                            birthPlace: response.data.birthPlace,
                            gender: response.data.gender,
                        });
                        setIsOverlayLoading(false);
                    }
                } catch (error) {
                    const serverError = MMUtils.apiErrorMessage(error);
                    if (serverError) {
                        MMUtils.showToastMessage(serverError);
                    }
                    setIsOverlayLoading(false);
                }
            }
        }
        loadBabyProfileDetail();
    }, [babyId]);

    const handleImageSelect = (selectedImage) => {
        console.log('Selected Image:', selectedImage);
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

    const onSubmit = () => {
        if (isOverlayLoading) {
            return;
        }

        const messages = {
            'name.required': 'Please enter name.',
            'birthDate.required': 'Plese enter birth date.',
            'birthPlace.required': 'Please enter birth place.',
            'gender.required': 'Please select gender',
        };

        const rules = {
            name: 'required|string',
            birthDate: 'required',
            birthPlace: 'required',
            gender: 'required',
        };

        validateAll(state, rules, messages)
            .then(async () => {
                setIsOverlayLoading(true);
                if (babyId) {
                    onEditBaby();
                }
                else {
                    onAddBaby();
                }
            })
            .catch((errors) => {
                console.log("Validation Errors:", errors);
                setState({
                    ...state,
                    errors: MMUtils.clientErrorMessages(errors)
                });
                setIsOverlayLoading(false);
            });
    };

    async function onAddBaby() {
        try {
            const apiData = {
                name: state.name,
                birthDate: state.birthDate,
                birthTime: state.birthTime,
                birthPlace: state.birthPlace,
                gender: state.gender,
            };

            await MMApiService.addBaby(apiData)
                .then(function (response) {
                    if (response) {
                        navigation.navigate('Home');
                    }
                    setIsOverlayLoading(false);
                })
                .catch(function (error) {
                    setIsOverlayLoading(false);
                    setState({
                        ...state,
                        errors: MMUtils.apiErrorParamMessages(error)
                    });
                });
        } catch (err) {
            MMUtils.consoleError(err);
        }
    }

    async function onEditBaby() {
        try {
            const apiData = {
                name: state.name,
                birthDate: state.birthDate,
                birthTime: state.birthTime,
                birthPlace: state.birthPlace,
                gender: state.gender,
            };
            await MMApiService.updateBaby(apiData, babyId)
                .then(function (response) {
                    if (response) {
                        navigation.navigate('Home');
                    }
                    setIsOverlayLoading(false);
                })
                .catch(function (error) {
                    setIsOverlayLoading(false);
                    setState({
                        ...state,
                        errors: MMUtils.apiErrorParamMessages(error)
                    });
                });
        } catch (err) {
            MMUtils.consoleError(err);
        }
    }

    const onPressBirthDate = () => {
        Keyboard.dismiss();
        setState({
            ...state,
            showBirthDate: true
        });
    };

    const onPressBirthTime = () => {
        Keyboard.dismiss();
        setState({
            ...state,
            showBirthTime: true
        });
    };



    const renderView = () => {
        return (
            <>
                <View style={MMStyles.containerPadding}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[MMStyles.titleText, MMStyles.h2]}>Your Profile</Text>
                    </View>
                    <MMInput
                        maxLength={50}
                        optionalStyle={MMStyles.mt20}
                        value={state.name}
                        onChangeText={(value) => onInputChange('name', value)}
                        placeholder="Name"
                        iconName="account"
                        errorMessage={state.errors.name}
                        optionalIconSize={20}
                    />
                    <View style={MMStyles.mt20}>
                        <MMInput
                            name='birthDate'
                            placeholder='Birth Date'
                            value={_.isNil(state.birthDate) ? '' : MMUtils.displayDate(state.birthDate)}
                            errorMessage={state.errors.birthDate}
                            onPressIn={onPressBirthDate}
                            onKeyPress={onPressBirthDate}
                            left={<TextInput.Icon
                                icon='calendar-range'
                                forceTextInputFocus={false}
                                onPress={onPressBirthDate}
                            />}
                        />
                        {
                            state.showBirthDate &&
                            <MMDateTimePicker
                                name='birthDate'
                                mode='date'
                                display={MMUtils.isPlatformIos() ? 'inline' : 'default'}
                                date={_.isNil(state.birthDate) ? new Date() : new Date(state.birthDate)}
                                maximumDate={new Date()}
                                onConfirm={(date) => {
                                    setState({
                                        ...state,
                                        birthDate: new Date(date),
                                        showBirthDate: false,
                                        errors: {
                                            ...state.errors,
                                            birthDate: ''
                                        }
                                    })
                                }}
                                onCancel={() => {
                                    setState({
                                        ...state,
                                        showBirthDate: false
                                    })
                                }}
                            />
                        }
                    </View>
                    <View style={MMStyles.mt20}>
                        <MMInput
                            name='birthTime'
                            placeholder='Birth Time'
                            value={_.isNil(state.birthTime) ? '' : moment(state.birthTime).format(MMConstants.format.dateTimePickerTime)}
                            errorText={state.errors.birthTime}
                            onPressIn={onPressBirthTime}
                            onKeyPress={onPressBirthTime}
                            left={<TextInput.Icon
                                icon='clock-time-four-outline'
                                forceTextInputFocus={false}
                                onPress={onPressBirthTime}
                            />}
                        />
                        {
                            state.showBirthTime &&
                            <MMDateTimePicker
                                name='birthTime'
                                mode='time'
                                date={_.isNil(state.birthTime) ? new Date() : new Date(state.birthTime)}
                                minimumDate={new Date()}
                                maximumDate={null}
                                onConfirm={(date) => {
                                    setState({
                                        ...state,
                                        birthTime: new Date(date),
                                        showBirthTime: false
                                    })
                                }}
                                onCancel={() => {
                                    setState({
                                        ...state,
                                        showBirthTime: false
                                    })
                                }}
                            />
                        }
                    </View>
                    <MMInput
                        maxLength={50}
                        optionalStyle={MMStyles.mt20}
                        value={state.birthPlace}
                        onChangeText={(value) => onInputChange('birthPlace', value)}
                        placeholder="Birth Place"
                        iconName="account"
                        errorMessage={state.errors.birthPlace}
                        optionalIconSize={20}
                    />
                    <SegmentedButtons
                        value={state.gender}
                        onValueChange={(value) => onInputChange('gender', value)}
                        buttons={MMConstants.gender}
                        style={MMStyles.mt20}
                    />
                    {state.errors.gender && _.size(state.errors.gender) > 0 ?
                        <MMFormErrorText errorText={state.errors.gender} /> : null}
                    {
                        <MMRoundButton
                            optionalTextStyle={[MMStyles.h5]}
                            label="Save"
                            onPress={() => onSubmit()}
                            optionalStyle={[MMStyles.mt20]}
                        />
                    }
                </View>
            </>
        );
    };

    return (
        <View style={MMStyles.container}>
            <MMScrollView>
                {renderView()}

            </MMScrollView>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </View>
    );
}

AddBaby.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};
