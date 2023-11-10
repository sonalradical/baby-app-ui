import React, { useEffect, useState } from 'react';
import { View, Text, Keyboard, Alert } from 'react-native';
import { RadioButton, TextInput, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { validateAll } from 'indicative/validator';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

import { reloadPage, setBaby } from '../../redux/Slice/AppSlice';

import MMConstants from '../../helpers/Constants';
import MMUtils from '../../helpers/Utils'
import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMInput from '../../components/common/Input';
import MMScrollView from '../../components/common/ScrollView';
import { MMOutlineButton, MMButton } from '../../components/common/Button';
import MMProfileAvatar from '../../components/common/profileAvatar';
import MMDateTimePicker from '../../components/common/DateTimePicker';
import MMFlexView from '../../components/common/FlexView';
import MMFormErrorText from '../../components/common/FormErrorText';
import MMContentContainer from '../../components/common/ContentContainer';
import MMEnums from '../../helpers/Enums';

export default function AddEditBaby({ route }) {
    const { babyId, babyListSize } = route.params || '';
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);
    const [imageSource, setImageSource] = useState();

    const initState = {
        name: '',
        picture: '',
        birthDate: undefined,
        birthTime: undefined,
        birthPlace: '',
        gender: '',
        showBirthDate: false,
        showBirthTime: false,
        errors: {},
    };
    const [state, setState] = useState(initState);

    useEffect(() => {
        loadBabyProfileDetail();
    }, [babyId]);

    const loadBabyProfileDetail = async () => {
        setIsOverlayLoading(true);
        if (babyId) {
            const response = await MMApiService.getBabyById(babyId);
            if (response.data) {
                setState({
                    ...state,
                    name: response.data.name,
                    birthDate: response.data.birthDate,
                    birthTime: response.data.birthTime,
                    birthPlace: response.data.birthPlace,
                    gender: response.data.gender,
                    picture: response.data.picture
                });
                if (response.data.picture) {
                    imageSourceUri = MMUtils.getImagePath(response.data.picture);
                    setImageSource(imageSourceUri);
                }
            }
            setIsOverlayLoading(false);
        }
    }

    const setImageUri = async (imageData) => {
        const photo = imageData.assets[0];
        let storageFileKeys = [];
        try {
            setIsOverlayLoading(true);
            let picIndex = 0;

            for (const pic of imageData.assets) {
                picIndex++;

                await MMApiService.getPreSignedUrl(photo.fileName)
                    .then(function (response) {
                        (async () => {
                            const responseData = response.data;
                            if (responseData) {
                                const result = MMUtils.uploadPicture(pic, responseData.preSignedUrl);
                                if (_.isNil(result)) {
                                    setIsOverlayLoading(false);
                                    MMUtils.showToastMessage(`Uploading picture ${picIndex} failed...`);
                                } else {
                                    setIsOverlayLoading(false);
                                    MMUtils.showToastMessage(`Uploading picture ${picIndex} completed.`);
                                    setState({
                                        ...state,
                                        picture: responseData.storageFileKey
                                    })
                                    setImageSource(photo.uri);
                                    storageFileKeys.push({ storageFileKey: responseData.storageFileKey });
                                }
                            } else {
                                setIsOverlayLoading(false);
                                MMUtils.showToastMessage(`Getting presigned url for uploading picture ${picIndex} failed. Error: ${responseData.message}`);
                            }
                        })();
                    })
                    .catch(function (error) {
                        setIsOverlayLoading(false);
                        setState({
                            ...state,
                            errors: MMUtils.apiErrorParamMessages(error)
                        });

                        const serverError = MMUtils.apiErrorMessage(error);
                        if (serverError) {
                            MMUtils.showToastMessage(serverError);
                        }
                    });
            }
        } catch (err) {
            setIsOverlayLoading(false);
            MMUtils.consoleError(err);
        }

        return storageFileKeys;
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

    const onGenderSelect = (value) => {
        setState({
            ...state,
            gender: value,
            errors: {
                ...state.errors,
                gender: '',
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
                picture: state.picture,
            };

            await MMApiService.addBaby(apiData)
                .then(function (response) {
                    if (response) {
                        dispatch(setBaby(response.data._id));
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
                picture: state.picture
            };
            await MMApiService.updateBaby(apiData, babyId)
                .then(function (response) {
                    if (response) {
                        dispatch(setBaby(response.data._id));
                        dispatch(reloadPage({ reloadPage: true }));
                        navigation.navigate('Home', { babyId: response.data._id });
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

    async function onBabyDelete() {
        try {
            setIsOverlayLoading(true);
            console.log('Loading baby profile list...');

            const response = await MMApiService.deleteBaby(babyId);
            if (response) {
                MMUtils.showToastMessage('Baby deleted successfully.')
                MMUtils.removeItemFromStorage(MMEnums.storage.selectedBaby);
                dispatch(setBaby(null));
                setIsOverlayLoading(false);
                dispatch(reloadPage(false));
                navigation.navigate('Home');
                setIsModalOpen(false);
            }
        } catch (error) {
            const serverError = MMUtils.apiErrorMessage(error);
            if (serverError) {
                MMUtils.showToastMessage(serverError);
            }
            setIsOverlayLoading(false);
        }
    }

    const onDelete = () => {
        return (
            Alert.alert(
                "Alert",
                `Are you sure you want to delete this baby?`,
                [
                    {
                        text: 'No',
                        style: 'cancel'
                    },
                    {
                        text: 'Yes',
                        onPress: () => onBabyDelete()
                    }
                ],
                { cancelable: true }
            )
        );
    };

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
            <View style={{ margin: 10 }}>
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                    <Text style={[theme.fonts.headlineMedium, { textAlign: 'center', marginBottom: 10 }]}>Baby Profile</Text>
                </View>
                <MMProfileAvatar image={imageSource}
                    source={{ uri: imageSource ? imageSource : null }}
                    label='Upload Baby photo'
                    onImageChange={(imageUri) => setImageUri(imageUri)} />
                <MMInput
                    label='Name *'
                    name='name'
                    placeholder='Enter Name'
                    value={state.name}
                    errorText={state.errors.name}
                    onChangeText={(value) => onInputChange('name', value)}
                    maxLength={50}
                />
                <View>
                    <MMInput
                        label='Birth Date *'
                        name='birthDate'
                        placeholder='Enter Birth Date'
                        value={_.isNil(state.birthDate) ? '' : MMUtils.displayDate(state.birthDate)}
                        errorText={state.errors.birthDate}
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
                <View >
                    <MMInput
                        label='Birth Time'
                        name='birthTime'
                        placeholder='Enter Birth Time'
                        value={_.isNil(state.birthTime) ? '' : moment(state.birthTime).format(MMConstants.dateTimePickerTime)}
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
                    label='Birth Place *'
                    name='birthPlace'
                    placeholder='Enter Birth Place'
                    value={state.birthPlace}
                    errorText={state.errors.birthPlace}
                    onChangeText={(value) => onInputChange('birthPlace', value)}
                    maxLength={50}
                />
                <View>
                    <Text style={theme.fonts.titleMedium}>Gender *</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {MMConstants.gender.map((option) => (
                            <View key={option.value} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton.Android
                                    value={option.value}
                                    status={state.gender === option.value ? 'checked' : 'unchecked'}
                                    onPress={() => onGenderSelect(option.value)}
                                />
                                <Text style={theme.fonts.default}>{option.label}</Text>
                            </View>
                        ))}
                    </View>
                    <MMFormErrorText errorText={state.errors.gender} />
                </View>
                {
                    babyId ?
                        <MMFlexView>
                            {babyListSize > 1 ?
                                <MMOutlineButton
                                    label="Delete"
                                    onPress={() => onDelete()}
                                    width='45%'
                                /> : null}
                            <MMButton
                                label="Save"
                                onPress={() => onSubmit()}
                                width={babyListSize > 1 ? '45%' : '100%'}
                            />
                        </MMFlexView> :
                        <MMButton
                            label="Save"
                            onPress={() => onSubmit()}
                        />

                }
            </View>
        );
    };

    return (
        <MMContentContainer>
            <MMScrollView>
                {renderView()}
            </MMScrollView>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </MMContentContainer>
    );
}

AddEditBaby.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};
