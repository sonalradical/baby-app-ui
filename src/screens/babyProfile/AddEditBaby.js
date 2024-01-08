import React, { useEffect, useState } from 'react';
import { View, Keyboard, StyleSheet } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { validateAll } from 'indicative/validator';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { reloadPage, setBaby } from '../../redux/Slice/AppSlice';

import MMEnums from '../../helpers/Enums';
import MMUtils from '../../helpers/Utils'
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMInput from '../../components/common/Input';
import MMScrollView from '../../components/common/ScrollView';
import { MMOutlineButton, MMButton } from '../../components/common/Button';
import MMProfileAvatar from '../../components/common/ProfileAvatar';
import MMDateTimePicker from '../../components/common/DateTimePicker';
import MMFlexView from '../../components/common/FlexView';
import MMContentContainer from '../../components/common/ContentContainer';
import MMConfirmDialog from '../../components/common/ConfirmDialog';
import MMPageTitle from '../../components/common/PageTitle';
import MMRadioButton from '../../components/common/RadioButton';
import MMIcon from '../../components/common/Icon';

export default function AddEditBaby({ route }) {
    const { babyId, babyListSize } = route.params || '';
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const lookupData = useSelector((state) => state.AuthReducer.lookupData);
    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const [imageSource, setImageSource] = useState();

    const initState = {
        name: '',
        picture: '',
        birthDate: undefined,
        birthPlace: '',
        gender: '',
        showBirthDate: false,
        errors: {},
    };
    const [state, setState] = useState(initState);

    useEffect(() => {
        if (babyId) {
            getBabyById();
        }
    }, [babyId]);

    const getBabyById = async () => {
        setOverlayLoading(true);
        if (babyId) {
            const { data } = await MMApiService.getBabyById(babyId);
            if (data) {
                setState({
                    ...state,
                    ...data
                });
                if (data.picture) {
                    imageSourceUri = MMUtils.getImagePath(data.picture);
                    setImageSource(imageSourceUri);
                }
            }
        }
        setOverlayLoading(false);
    }

    const setImageUri = async (imageData) => {
        const photo = imageData.assets[0];
        let storageFileKeys = [];
        try {
            setOverlayLoading(true);
            const { data } = await MMApiService.getPreSignedUrl(photo.fileName);
            if (data) {
                const result = MMUtils.uploadPicture(photo, data.preSignedUrl);
                if (result) {
                    MMUtils.showToastMessage(`Uploading picture completed.`);
                    setState({
                        ...state,
                        picture: data.storageFileKey
                    })
                    setImageSource(photo.uri);
                    storageFileKeys.push({ storageFileKey: data.storageFileKey });
                } else {
                    MMUtils.showToastMessage(`Uploading picture failed...`);
                }
                setOverlayLoading(false);
            } else {
                MMUtils.showToastMessage(`Getting presigned url for uploading picture failed. Error: ${data.message}`);
            }
            setOverlayLoading(false);
        } catch (err) {
            setOverlayLoading(false);
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

    const messages = {
        'name.required': 'Please enter name.',
        'birthDate.required': 'Please enter birth date.',
        'gender.required': 'Please select gender',
    };

    const onSave = () => {
        if (isOverlayLoading) {
            return;
        }

        const rules = {
            name: 'required|string',
            birthDate: 'required',
            gender: 'required',
        };

        validateAll(state, rules, messages)
            .then(async () => {
                setOverlayLoading(true);
                try {
                    const apiData = {
                        babyId: babyId ? babyId : '',
                        name: state.name,
                        birthDate: state.birthDate,
                        birthPlace: state.birthPlace,
                        gender: state.gender,
                        picture: state.picture,
                    };
                    const { data } = await MMApiService.saveBaby(apiData);
                    if (data) {
                        dispatch(setBaby(data));
                        if (babyId) {
                            dispatch(reloadPage({ reloadPage: true }));
                        }
                        MMUtils.setItemToStorage(MMEnums.storage.selectedBaby, JSON.stringify(data));
                        navigation.navigate('Footer');
                    }
                } catch (err) {
                    MMUtils.consoleError(err);
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

    async function onBabyDelete() {
        try {
            setOverlayLoading(true);
            const { data } = await MMApiService.deleteBaby(babyId);
            if (data) {
                MMUtils.showToastMessage('Baby deleted successfully.')
                MMUtils.removeItemFromStorage(MMEnums.storage.selectedBaby);
                dispatch(setBaby(null));
                setOverlayLoading(false);
                dispatch(reloadPage(false));
                navigation.navigate('Footer');
                setIsModalOpen(false);
            }
        } catch (error) {
            const serverError = MMUtils.apiErrorMessage(error);
            if (serverError) {
                MMUtils.showToastMessage(serverError);
            }
            setOverlayLoading(false);
        }
    }

    const onConfirm = () => {
        MMConfirmDialog({
            message: "Are you sure you want to delete this baby?",
            onConfirm: onBabyDelete
        });
    };

    const onPressBirthDate = () => {
        Keyboard.dismiss();
        setState({
            ...state,
            showBirthDate: true
        });
    };

    const renderView = () => {
        return (
            <View style={{ padding: MMConstants.paddingLarge, marginTop: MMConstants.marginMedium }}>
                <MMPageTitle title='Baby profile' textAlign='left' paddingBottom={0} />
                <Text style={[theme.fonts.labelMedium, { paddingBottom: 20 }]} >To begin, please share some basic
                    information about your little one.
                    Don’t worry, you can add more
                    details and edit later.</Text>
                <MMProfileAvatar image={imageSource}
                    source={{ uri: imageSource ? imageSource : null }}
                    label='Upload Baby photo'
                    onImageChange={(imageUri) => setImageUri(imageUri)} />
                <MMInput
                    label='Name *'
                    name='name'
                    placeholder='Enter Name'
                    value={state.name === '--' ? '' : state.name}
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
                        leftIcon='calendar-range'
                        onPress={onPressBirthDate}
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
                <MMInput
                    label='Birth Place'
                    name='birthPlace'
                    placeholder='Enter Birth Place'
                    value={state.birthPlace}
                    errorText={state.errors.birthPlace}
                    onChangeText={(value) => onInputChange('birthPlace', value)}
                    maxLength={50}
                />
                <MMRadioButton
                    label='Gender *'
                    options={lookupData.babyGender}
                    selectedValue={state.gender}
                    onValueChange={onGenderSelect}
                    errorText={state.errors.gender}
                />
                {
                    babyId ?
                        <MMFlexView>
                            {babyListSize > 1 ?
                                <MMOutlineButton
                                    label="Delete"
                                    onPress={() => onConfirm()}
                                    width='45%'
                                /> : <MMOutlineButton
                                    label="Cancel"
                                    onPress={() => navigation.goBack()}
                                    width='45%'
                                />}
                            <MMButton
                                label="Save"
                                onPress={() => onSave()}
                                width={'45%'}
                            />
                        </MMFlexView> :
                        <MMFlexView>
                            <MMOutlineButton
                                label="Cancel"
                                onPress={() => navigation.goBack()}
                                width='45%'
                            />
                            <MMButton
                                label="Save"
                                onPress={() => onSave()}
                                width='45%'
                            />
                        </MMFlexView>
                }
            </View>
        );
    };

    const renderScreenHeader = () => {
        return (
            <Appbar.Header style={styles(theme).appBarHeader} mode='small'
                statusBarHeight={0}>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Text style={[theme.fonts.headlineMedium, { alignSelf: 'center' }]}>
                    {'Minimemoirs'}</Text>
                <MMIcon iconName="notifications-outline" iconSize={28} iconColor={theme.colors.text.secondary}
                    style={{ paddingRight: MMConstants.paddingLarge }}
                    onPress={() => console.log('Bell pressed')} />
            </Appbar.Header>
        );
    };

    return (
        <>
            <MMContentContainer paddingStyle='none'>
                {renderScreenHeader()}
                <MMScrollView>
                    {renderView()}
                </MMScrollView>
                <MMOverlaySpinner visible={isOverlayLoading} />
            </MMContentContainer>
        </>
    );
}

AddEditBaby.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = (theme) => StyleSheet.create({
    appBarHeader: {
        backgroundColor: theme.colors.secondaryContainer,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        elevation: 10,
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: -2, height: 4 },
        justifyContent: 'space-between'
    }
});
