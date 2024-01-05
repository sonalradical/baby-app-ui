import React from 'react';
import { useTheme } from 'react-native-paper';
import { View, Text, TouchableOpacity } from 'react-native';

import _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMEnums from '../../helpers/Enums';
import MMIcon from '../../components/common/Icon';

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
                    <MMIcon
                        iconName={'create-outline'}
                        iconSize={20}
                        iconColor={theme.colors.primary}
                        style={{ paddingTop: 2, width: 20 }}
                        onPress={() => navigation.navigate('AddAddress', { addressId: item._id, isDisable })}
                    />
                )}
            </View>
        </View>
    );
};

export default AddressView;
