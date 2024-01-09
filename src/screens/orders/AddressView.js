import React from 'react';
import { useTheme } from 'react-native-paper';
import { View, Text, TouchableOpacity } from 'react-native';

import _ from 'lodash';
import { useDispatch } from 'react-redux';

import { reloadAddressPage } from '../../redux/Slice/AppSlice';

import MMConstants from '../../helpers/Constants';
import MMEnums from '../../helpers/Enums';
import MMApiService from '../../services/ApiService';
import MMIcon from '../../components/common/Icon';
import MMConfirmDialog from '../../components/common/ConfirmDialog';

const AddressView = ({ item, navigation, address, isDisable }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const onDeleteAddress = async () => {
        const { data } = await MMApiService.deleteAddress(item._id);
        if (data) {
            dispatch(reloadAddressPage({ reloadAddressPage: true }));
        }
    }

    const getAddressIcon = () => {
        switch (item.addressType) {
            case MMEnums.addressType.home:
                return <MMIcon iconName={'home-outline'} iconSize={30} iconColor={theme.colors.primary} />;
            case MMEnums.addressType.work:
                return <MMIcon iconName={'business-outline'} iconSize={30} iconColor={theme.colors.primary} />;
            default:
                return <MMIcon iconName={'location-outline'} iconSize={30} iconColor={theme.colors.primary} />;
        }
    };

    return (
        <>
            <View style={{ flexDirection: 'row' }}>
                {getAddressIcon()}
                <View style={{ paddingLeft: MMConstants.paddingLarge }}>
                    {item.addressType ? (
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[theme.fonts.titleMedium]} numberOfLines={1}>
                                {_.capitalize(item.addressType)}
                            </Text>
                        </View>
                    ) : null}
                    <View style={{ width: '95%' }}>
                        <Text style={[theme.fonts.default, { lineHeight: 20, paddingTop: MMConstants.paddingMedium }]}>
                            {address}
                        </Text>
                    </View>
                </View>
                {!isDisable &&
                    <>
                        <View style={{ flexDirection: 'row', position: 'absolute', right: 1 }}>
                            <TouchableOpacity style={{ alignSelf: 'flex-end' }}
                                onPress={() => navigation.navigate('AddAddress', { addressId: item._id, isDisable })}>
                                <View style={{ backgroundColor: theme.colors.primary, padding: 3, borderRadius: 10 }}>
                                    <Text style={{ color: theme.colors.secondaryContainer }}>Edit</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ paddingLeft: MMConstants.paddingMedium }}
                                onPress={() => MMConfirmDialog({
                                    message: "Are you sure you want to delete this Address?",
                                    onConfirm: onDeleteAddress
                                })}>
                                <MMIcon iconName={'trash-outline'} iconColor={theme.colors.error} iconSize={20} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignSelf: 'flex-end', position: 'absolute', right: 1, bottom: 10 }} >
                            <MMIcon iconName={'chevron-forward-outline'} iconSize={22} iconColor={theme.colors.primary} />
                        </View>
                    </>
                }
            </View>
        </>
    );
};

export default AddressView;
