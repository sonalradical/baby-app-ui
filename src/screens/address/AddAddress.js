import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Text, useTheme } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { validateAll } from 'indicative/validator';
import { useDispatch } from 'react-redux';

import MMUtils from '../../helpers/Utils';
import MMEnums from '../../helpers/Enums';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import MMInput from '../../components/common/Input';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMContentContainer from '../../components/common/ContentContainer';
import { MMButton, MMOutlineButton } from '../../components/common/Button';
import MMPageTitle from '../../components/common/PageTitle';
import MMFormErrorText from '../../components/common/FormErrorText';
import MMFlexView from '../../components/common/FlexView';
import MMConfirmDialog from '../../components/common/ConfirmDialog';
import MMPlacesAutocomplete from './PlacesAutocomplete';
import { reloadAddressPage } from '../../redux/Slice/AppSlice';

export default function AddAddress({ navigation, route }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { addressId } = route.params || '';
    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const [isVisible, setVisible] = useState(false);
    const initState = {
        latitude: 0.0,
        longitude: 0.0,
        addressLine1: '',
        addressLine2: '',
        suburb: '',
        state: '',
        postcode: '',
        country: '',
        addressType: '',
        errors: {},
    };
    const [state, setState] = useState(initState);

    useEffect(() => {
        if (addressId) {
            loadAddressById();
            setVisible(true);
        }
    }, [addressId]);

    const loadAddressById = async () => {
        try {
            setOverlayLoading(true);
            const response = await MMApiService.getAddressById(addressId);
            if (response.data) {
                const addressDetail = response.data
                setState({
                    ...state,
                    addressLine1: addressDetail.addressLine1,
                    addressLine2: addressDetail.addressLine2,
                    addressType: addressDetail.addressType,
                    country: addressDetail.country,
                    latitude: addressDetail.latitude,
                    longitude: addressDetail.longitude,
                    postcode: addressDetail.postcode,
                    state: addressDetail.state,
                    suburb: addressDetail.suburb
                })
            }
            setOverlayLoading(false);
        } catch (error) {
            const serverError = MMUtils.apiErrorMessage(error);
            if (serverError) {
                MMUtils.showToastMessage(serverError);
            }
            setOverlayLoading(false);
        }
    };

    const onAutoSuggestChange = (data) => {
        setState({
            ...state,
            ...data,
            errors: {
                ...state.errors,
                addressLine1: '',
                state: '',
                suburb: '',
                postcode: ''
            }
        });
        setVisible(data ? true : false);
    }

    const onInputChange = (field, value) => {
        setState({
            ...state,
            [field]: value,
            errors: {
                ...state.errors,
                [field]: '',
            },
        });
    }

    const onDeleteAddress = async () => {
        setOverlayLoading(true);
        const response = await MMApiService.deleteAddress(addressId);
        if (response) {
            dispatch(reloadAddressPage({ reloadAddressPage: true }));
            navigation.navigate('Order');
        }
        setOverlayLoading(false);
    }

    const onSave = () => {
        if (isOverlayLoading) {
            return;
        }

        const messages = {
            'addressLine1.required': 'Please address line 1.',
            'addressType.required': 'Please select address type.',
        };

        const rules = {
            addressLine1: 'required',
            addressType: 'required'
        };

        validateAll(state, rules, messages)
            .then(async () => {
                setOverlayLoading(true);
                try {
                    const apiData = {
                        addressId: addressId ? addressId : '',
                        addressLine1: state.addressLine1,
                        addressLine2: state.addressLine2,
                        addressType: state.addressType,
                        country: state.country,
                        latitude: state.latitude,
                        longitude: state.longitude,
                        postcode: state.postcode,
                        state: state.state,
                        suburb: state.suburb,
                        isDeleted: false
                    };
                    await MMApiService.saveAddress(apiData)
                        .then(function (response) {
                            if (response) {
                                dispatch(reloadAddressPage({ reloadAddressPage: true }));
                                navigation.navigate('Order');
                            }
                        })
                        .catch(function (error) {
                            setState({
                                ...state,
                                errors: MMUtils.apiErrorParamMessages(error)
                            });
                        });
                } catch (err) {
                    MMUtils.consoleError(err);
                }
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

    const renderChip = (type, label) => {
        const isSelected = state.addressType === type;
        return (
            <Chip
                mode='outlined'
                onPress={() => onInputChange('addressType', type)}
                selected={isSelected}
                selectedColor={theme.colors.primary}
                style={[
                    styles(theme).chip,
                    {
                        borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
                        borderWidth: isSelected ? 2 : 1,
                    },
                ]}
                textStyle={theme.fonts.default}
            > {label} </Chip>
        );
    };

    const renderView = () => {
        return (
            <View style={{ paddingTop: MMConstants.paddingMedium }}>
                <Text style={theme.fonts.titleMedium}>Save address as *</Text>
                <View style={{ paddingTop: MMConstants.paddingMedium, flexDirection: 'row' }}>
                    {renderChip(MMEnums.addressType.home, 'Home')}
                    {renderChip(MMEnums.addressType.work, 'Work')}
                    {renderChip(MMEnums.addressType.other, 'Other')}
                </View>
                <MMFormErrorText errorText={state.errors.addressType} />
                {isVisible ?
                    <>
                        <View style={{ paddingTop: MMConstants.paddingMedium }}>
                            <MMInput
                                label='Line 1'
                                name='addressLine1'
                                placeholder='Enter Address Line 1'
                                value={state.addressLine1}
                                errorText={state.errors.addressLine1}
                                onChangeText={(value) => onInputChange('addressLine1', value)}
                                maxLength={100}
                            />
                        </View>
                        <View style={{ paddingTop: MMConstants.paddingMedium }}>
                            <MMInput
                                label='Line 2'
                                name='addressLine2'
                                placeholder='Enter Address Line 2'
                                value={state.addressLine2}
                                errorText={state.errors.addressLine2}
                                onChangeText={(value) => onInputChange('addressLine2', value)}
                                maxLength={100}
                            />
                        </View>
                        <View>
                            <MMInput
                                label='City / Suburb'
                                name='suburb'
                                placeholder='City'
                                value={state.suburb}
                                editable={false}
                                maxLength={50}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ width: '60%' }}>
                                <MMInput
                                    label="State"
                                    name='state'
                                    placeholder='State'
                                    value={state.state}
                                    editable={false}
                                    maxLength={50}
                                />
                            </View>
                            <View style={{ width: '30%' }}>
                                <MMInput
                                    label="Post Code"
                                    name='postcode'
                                    placeholder='Post Code'
                                    value={state.postcode}
                                    editable={false}
                                    maxLength={5}
                                />
                            </View>
                        </View>
                        <View>
                            <MMInput
                                label='Country'
                                name='country'
                                placeholder='Country'
                                value={state.country}
                                editable={false}
                                maxLength={50}
                            />
                        </View>
                        {
                            addressId ?
                                <MMFlexView>
                                    <MMOutlineButton
                                        label="Delete"
                                        onPress={() => MMConfirmDialog({
                                            message: "Are you sure you want to delete this Address?",
                                            onConfirm: onDeleteAddress
                                        })}
                                        width='45%'
                                    />
                                    <MMButton
                                        label="Save"
                                        onPress={() => onSave()}
                                        width='45%'
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
                    </> : null}
            </View>
        );
    };

    return (
        <MMContentContainer>
            <MMPageTitle title={'Select address'} />
            <View style={{ paddingTop: MMConstants.paddingMedium }}>
                <MMPlacesAutocomplete
                    placeholder='Search Area, Location'
                    updatedLatLong={(data) => onAutoSuggestChange(data)}
                    onInputChange={(value) => onInputChange('addressLine1', value)}
                    defaultValue={state.addressLine1}
                />
            </View>
            <MMScrollView>
                {renderView()}
            </MMScrollView>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </MMContentContainer>
    );
}

AddAddress.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = (theme) => StyleSheet.create({
    chip: {
        margin: 4,
        height: 35,
        backgroundColor: theme.colors.secondaryContainer,
    }
});