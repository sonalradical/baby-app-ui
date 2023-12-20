import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons'

import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMContentContainer from '../../components/common/ContentContainer';
import MMPageTitle from '../../components/common/PageTitle';
import MMSurface from '../../components/common/Surface';
import { useNavigation } from '@react-navigation/native';

export default function Address() {
    const theme = useTheme();
    const navigation = useNavigation();
    const [isOverlayLoading, setOverlayLoading] = useState(false);

    const renderAddressDetail = () => {
        return (
            <MMSurface>

            </MMSurface>
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
                            <Text style={[theme.fonts.headlineSmall, { marginTop: 2, marginLeft: 10 }]}>Add Address</Text>
                        </View>
                        <Ionicons name={'chevron-forward'} size={28} color={theme.colors.outline} style={{ marginTop: 3 }} />
                    </MMSurface>
                </TouchableOpacity>
                <Text style={[{ marginTop: 10 }]}>Your saved address</Text>
                {/* {renderAddressDetail()} */}
            </View>
        );
    };

    return (
        <MMContentContainer>
            <MMScrollView>
                {renderView()}
            </MMScrollView>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </MMContentContainer>
    );
}

Address.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};