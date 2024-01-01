import React from 'react';
import { useTheme } from 'react-native-paper';
import { View, Text, TouchableOpacity } from 'react-native';

import _ from 'lodash';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MMConstants from '../../helpers/Constants';
import MMEnums from '../../helpers/Enums';

const AddressView = ({ item, navigation, address, isDisable }) => {
    const theme = useTheme();

    const getAddressIcon = () => {
        switch (item.addressType) {
            case MMEnums.addressType.home:
                return <Feather name={'home'} size={30} color={theme.colors.primary} />;
            case MMEnums.addressType.work:
                return <Ionicons name={'business-outline'} size={30} color={theme.colors.primary} />;
            default:
                return <Ionicons name={'location-outline'} size={30} color={theme.colors.primary} />;
        }
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            {getAddressIcon()}
            <View style={{ paddingLeft: MMConstants.paddingLarge }}>
                {item.addressType ? (
                    <Text style={[theme.fonts.labelLarge]} numberOfLines={1}>
                        {_.capitalize(item.addressType)}
                    </Text>
                ) : null}
                <Text style={[theme.fonts.default, { lineHeight: 20 }]} numberOfLines={4}>
                    {address}
                </Text>
                {!isDisable && (
                    <Feather
                        name={'edit'}
                        size={18}
                        color={theme.colors.primary}
                        style={{ paddingTop: 2, width: 20 }}
                        onPress={() => navigation.navigate(MMConstants.screens.addAddress, { addressId: item._id, isDisable })}
                    />
                )}
            </View>
        </View>
    );
};

export default AddressView;
