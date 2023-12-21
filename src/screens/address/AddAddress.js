import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Text, useTheme } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { validateAll } from 'indicative/validator';

import MMUtils from '../../helpers/Utils';
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
import MMPlacesAutocomplete from './PlacesAutocomplete';
import MMEnums from '../../helpers/Enums';

export default function AddAddress({ navigation, route }) {
    const theme = useTheme();
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
                                navigation.navigate('Address');
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

    const renderView = () => {
        return (
            <View style={{ paddingTop: MMConstants.paddingMedium }}>
                <Text style={theme.fonts.titleMedium}>Save address as *</Text>
                <View style={{ paddingTop: MMConstants.paddingMedium, flexDirection: 'row' }}>
                    <Chip
                        mode='outlined'
                        onPress={() => onInputChange('addressType', MMEnums.addressType.home)}
                        selected={state.addressType === MMEnums.addressType.home}
                        selectedColor={theme.colors.primary}
                        style={[styles(theme).chip,
                        {
                            borderColor: state.addressType === MMEnums.addressType.home ? theme.colors.primary : theme.colors.outline,
                            borderWidth: state.addressType === MMEnums.addressType.home ? 2 : 1
                        }]}
                        textStyle={theme.fonts.default}> Home </Chip>
                    <Chip
                        mode='outlined'
                        onPress={() => onInputChange('addressType', MMEnums.addressType.work)}
                        style={[styles(theme).chip, {
                            borderColor: state.addressType === MMEnums.addressType.work ? theme.colors.primary : theme.colors.outline,
                            borderWidth: state.addressType === MMEnums.addressType.work ? 2 : 1
                        }]}
                        selectedColor={theme.colors.primary}
                        selected={state.addressType === MMEnums.addressType.work}
                        textStyle={theme.fonts.default}> Work</Chip>
                    <Chip
                        mode='outlined'
                        onPress={() => onInputChange('addressType', MMEnums.addressType.other)}
                        selectedColor={theme.colors.primary}
                        style={[styles(theme).chip, {
                            borderColor: state.addressType === MMEnums.addressType.other ? theme.colors.primary : theme.colors.outline,
                            borderWidth: state.addressType === MMEnums.addressType.other ? 2 : 1
                        }]}
                        selected={state.addressType === MMEnums.addressType.other}
                        textStyle={theme.fonts.default} >Other</Chip>

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
                                        //onPress={() => onConfirm()}
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