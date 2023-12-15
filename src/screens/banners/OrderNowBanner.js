import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMSurface from '../../components/common/Surface';
import { MMButton } from '../../components/common/Button';

const OrderNowBanner = ({ onPress }) => {
    const theme = useTheme();

    return (
        <View style={{ marginHorizontal: MMConstants.marginLarge, marginVertical: MMConstants.marginMedium }}>
            <MMSurface style={{ alignItems: 'center', borderRadius: 20 }} margin={[0, 0, 0, 0]}>
                <Text style={theme.fonts.headlineMedium}>Order your book now.</Text>
                <MMButton mode="contained" label={'Order Now'} onPress={onPress} />
            </MMSurface>
        </View>
    );
}
export default OrderNowBanner;
