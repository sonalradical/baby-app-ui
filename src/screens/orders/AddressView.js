import React from 'react';
import { useTheme } from 'react-native-paper';
import { View, Text, TouchableOpacity } from 'react-native';

import _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMEnums from '../../helpers/Enums';
import MMIcon from '../../components/common/Icon';
import { MMButton } from '../../components/common/Button';

const AddressView = ({ item, navigation, address, isDisable }) => {
    const theme = useTheme();

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
        <View style={{ flexDirection: 'row' }}>
            {getAddressIcon()}
            {!isDisable &&
                <View style={{ flexDirection: 'row', position: 'absolute', right: 1 }}>
                    <TouchableOpacity style={{ alignSelf: 'flex-end' }}
                        onPress={() => navigation.navigate('AddAddress', { addressId: item._id, isDisable })}>
                        <View style={{ backgroundColor: theme.colors.primary, padding: MMConstants.paddingMedium, borderRadius: 10 }}>
                            <Text style={{ color: theme.colors.secondaryContainer }}>Edit</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingLeft: MMConstants.paddingMedium }}>
                        <MMIcon iconName={'trash-outline'} iconColor={theme.colors.error} />
                    </TouchableOpacity>
                </View>}
            <View style={{ paddingLeft: MMConstants.paddingLarge }}>
                {item.addressType ? (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[theme.fonts.titleMedium]} numberOfLines={1}>
                            {_.capitalize(item.addressType)}
                        </Text>
                    </View>
                ) : null}
                <Text style={[theme.fonts.default, { lineHeight: 20, paddingTop: MMConstants.paddingMedium }]} numberOfLines={4}>
                    {address}
                </Text>
            </View>
        </View>
    );
};

export default AddressView;
