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
        <View style={{ marginVertical: MMConstants.marginMedium }}>
            <MMSurface style={{ borderRadius: 10, backgroundColor: theme.colors.secondary, flexDirection: 'row' }} margin={[0, 0, 0, 0]}>
                <Image
                    resizeMode="contain"
                    source={require('../../assets/images/chapter/banner.png')}
                    style={styles(theme).image}
                />
                <View style={{ paddingLeft: 30 }}>
                    <Text style={[theme.fonts.headlineMedium, { color: theme.colors.secondaryContainer }]}>Order your book now.</Text>
                    <MMButton mode="contained" label={'Order Now'} onPress={onPress} />
                </View>
            </MMSurface>
        </View>
    );
}
const styles = (theme) => StyleSheet.create({
    image: {
        width: Dimensions.get('window').width / 4,
        height: Dimensions.get('window').height / 8,
        padding: 10,
    },
});

export default OrderNowBanner;
