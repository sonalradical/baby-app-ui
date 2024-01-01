import React, { useState } from 'react';
import { Text, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';

import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMContentContainer from '../../components/common/ContentContainer';

const Payment = () => {
    const theme = useTheme();
    const [isOverlayLoading, setOverlayLoading] = useState(false);

    return (
        <MMContentContainer>
            <MMScrollView>
                <Text>Payment</Text>
            </MMScrollView>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </MMContentContainer>
    );
}

Payment.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

export default Payment;