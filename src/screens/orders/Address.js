import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { setAddressDetail } from '../../redux/Slice/AppSlice';

import MMConstants from '../../helpers/Constants';
import MMUtils from '../../helpers/Utils';
import MMApiService from '../../services/ApiService';
import MMFormErrorText from '../../components/common/FormErrorText';
import MMSpinner from '../../components/common/Spinner';
import MMSurface from '../../components/common/Surface';
import AddressView from './AddressView';
import { MMButton } from '../../components/common/Button';

const Address = ({ validStep, clickStep, isDisable = false }) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const addressDetail = useSelector((state) => state.AppReducer.addressDetail);
    const reloadAddressPage = useSelector((state) => state.AppReducer.reloadAddressPage)
    const [isLoading, setLoading] = useState(true);
    const [addressList, setAddressList] = useState([]);

    useEffect(() => {
        if (reloadAddressPage) {
            getAddressList();
        }
    }, [reloadAddressPage]);

    const getAddressList = async () => {
        setLoading(true);
        try {
            const { data } = await MMApiService.getAddressList();
            if (data) {
                setAddressList(data);
            }
        } catch (error) {
            const serverError = MMUtils.apiErrorMessage(error);
            if (serverError) {
                MMUtils.showToastMessage(serverError);
            }
        }
        setLoading(false);
    };

    const onSelectAddress = (address) => {
        dispatch(setAddressDetail(address))
    };

    const renderAddressDetail = (item) => {
        const address = `${item.addressLine1}, ${item.addressLine2 ? `${item.addressLine2}, ` : ''}${item.suburb}, ${item.state}, ${item.postcode}, ${item.country}`;
        return (
            <TouchableOpacity onPress={isDisable ? () => navigation.navigate('AddAddress', { addressId: item._id, isDisable: isDisable }) :
                () => onSelectAddress(item)}>
                <MMSurface style={{
                    borderWidth: !isDisable && item._id === addressDetail._id ? 2 : 0,
                    borderColor: !isDisable && item._id === addressDetail._id ? theme.colors.primary : theme.colors.secondaryContainer
                }} padding={[10, 12, 10, 12]}>
                    {isLoading ? <MMSpinner /> :
                        <AddressView
                            item={item}
                            address={address}
                            isDisable={isDisable}
                            navigation={navigation}
                        />
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
                contentContainerStyle={{ padding: 5 }}
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
                {(validStep === 1 && clickStep >= 2) && <MMFormErrorText errorText={'Please select an address'} />}
                <MMButton label={'Add Address'} onPress={() => navigation.navigate('AddAddress', { isDisable: isDisable })} />
            </View>
        );
    };

    return (
        <>
            {renderAddressList()}
            {renderView()}
        </>
    );
}

Address.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

export default Address;