import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

import MMUtils from '../../helpers/Utils';
import MMApiService from '../../services/ApiService';
import MMSpinner, { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMContentContainer from '../../components/common/ContentContainer';
import MMPageTitle from '../../components/common/PageTitle';
import MMSurface from '../../components/common/Surface';
import { useNavigation } from '@react-navigation/native';
import MMConstants from '../../helpers/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { setAddressId } from '../../redux/Slice/AppSlice';
import MMFormErrorText from '../../components/common/FormErrorText';

export default function Address({ validStep, clickStep }) {
    const theme = useTheme();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { addressId } = useSelector((state) => state.AppReducer.addressId);
    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [addressList, setAddressList] = useState([]);

    useEffect(() => {
        loadAddressList();
    }, []);

    const loadAddressList = async () => {
        setLoading(true);
        try {
            const response = await MMApiService.getAddressList();
            if (response.data) {
                setAddressList(response.data);
            }
        } catch (error) {
            const serverError = MMUtils.apiErrorMessage(error);
            if (serverError) {
                MMUtils.showToastMessage(serverError);
            }
        }
        setLoading(false);
    };

    const onSelectAddress = (addressId) => {
        dispatch(setAddressId({ addressId }))
    };

    const renderAddressDetail = (item) => {
        const address = `${item.addressLine1}, ${item.addressLine2 ? `${item.addressLine2},` : ''}${item.suburb}, \n${item.state}, ${item.postcode}, ${item.country}`
        return (
            <TouchableOpacity onPress={() => onSelectAddress(item._id)} >
                <MMSurface >
                    {isLoading ? <MMSpinner /> :
                        <>
                            <View style={{ flexDirection: 'row' }}>
                                {item.addressType === 'home' ? <Feather name={'home'} size={30} color={theme.colors.primary} /> :
                                    item.addressType === 'work' ? <Ionicons name={'business-outline'} size={30} color={theme.colors.primary} /> :
                                        <Ionicons name={'location-outline'} size={30} color={theme.colors.primary} />}
                                <View style={{ paddingLeft: MMConstants.paddingLarge }}>
                                    <Text style={[theme.fonts.labelLarge]} numberOfLines={1}>
                                        {_.capitalize(item.addressType)}</Text>
                                    <Text style={[theme.fonts.default, { lineHeight: 20 }]} numberOfLines={4} >{address} </Text>
                                    <Feather name={'edit'} size={18} color={theme.colors.primary} style={{ paddingTop: 2 }}
                                        onPress={() => navigation.navigate('AddAddress', { addressId: item._id })} />
                                </View>
                            </View>
                        </>
                    }
                </MMSurface>
            </TouchableOpacity>
        )
    };

    const renderAddressList = () => {
        if (!addressList || addressList.length === 0) return null;
        return (
            <FlatList
                data={addressList}
                renderItem={({ item, index }) => {
                    return renderAddressDetail(item, index);
                }}
                contentContainerStyle={{ padding: MMConstants.paddingMedium }}
                keyExtractor={(item, index) => {
                    return item._id;
                }}
                onMomentumScrollBegin={Keyboard.dismiss}
                keyboardShouldPersistTaps={'handled'}
                enableEmptySections={true}
            />
        )
    };

    const renderView = () => {
        return (
            <View>
                <MMPageTitle title={'Select an address'} />
                <TouchableOpacity onPress={() => navigation.navigate('AddAddress')}>
                    <MMSurface padding={[8, 8, 8, 10]} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name={'add'} size={30} color={theme.colors.primary} />
                            <Text style={[theme.fonts.displayMedium, { marginTop: 2, marginLeft: 10 }]}>Add Address</Text>
                        </View>
                        <Ionicons name={'chevron-forward'} size={28} color={theme.colors.outline} style={{ marginTop: 3 }} />
                    </MMSurface>
                </TouchableOpacity>
                {(validStep === 1 && clickStep >= 2) && <MMFormErrorText errorText={'Please Select an Address'} />}
                {addressList.length > 0 ? <Text style={[{ margin: MMConstants.marginSmall }]}>Your saved address</Text> : null}
            </View>
        );
    };

    return (
        <MMContentContainer>
            {renderView()}
            {renderAddressList()}
            <MMOverlaySpinner visible={isOverlayLoading} />
        </MMContentContainer>
    );
}

Address.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};