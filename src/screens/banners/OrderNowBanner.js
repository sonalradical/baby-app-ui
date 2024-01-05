import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMSurface from '../../components/common/Surface';
import { MMButton } from '../../components/common/Button';

const OrderNowBanner = ({ onPress }) => {
    const theme = useTheme();

    return (
        <View style={{ marginVertical: MMConstants.marginLarge }}>
            <MMSurface padding={[0, 0, 0, 0]}
                style={{
                    borderRadius: 10,
                    backgroundColor: '#e8e4fb',
                    flexDirection: 'row'
                }}
                margin={[0, 0, 0, 0]}>
                <View style={{
                    backgroundColor: theme.colors.primary,
                    paddingHorizontal: 5,
                    //paddingVertical: 20,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    alignItems: 'center',
                    borderTopEndRadius: 90,
                    borderBottomEndRadius: 10
                }}>
                    <Image
                        resizeMode="contain"
                        source={require('../../assets/images/order_banner.png')}
                        style={styles(theme).image}
                    />
                </View>
                <View style={{ justifyContent: 'center', paddingStart: 20, marginTop: MMConstants.marginLarge }}>
                    <Text style={[theme.fonts.titleMedium,]}>Your Joyful Moments!</Text>
                    <Text style={[theme.fonts.bodySmall, { fontWeight: 700 }]}>Order for cherished memories</Text>
                    <MMButton width={'auto'} mode="contained" label={'Order Now'} onPress={onPress} />
                </View>
            </MMSurface>
        </View>
    );
}
const styles = (theme) => StyleSheet.create({
    image: {
        width: Dimensions.get('window').width / 2.7,
        height: Dimensions.get('window').height / 5.5,
    },
});

export default OrderNowBanner;
