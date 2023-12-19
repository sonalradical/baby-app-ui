import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, RadioButton, Text, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMContentContainer from '../../components/common/ContentContainer';
import MMListView from '../../components/common/ListView';
import MMPageTitle from '../../components/common/PageTitle';
import MMInput from '../../components/common/Input';
import MMSurface from '../../components/common/Surface';

const Address = () => {
    const theme = useTheme();
    const [isOverlayLoading, setOverlayLoading] = useState(false);

    const renderView = () => {
        return (
            <View style={{ padding: MMConstants.paddingLarge }}>
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

export default Address;