import React from 'react';
import { Text } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';

import MMScrollView from '../../components/common/ScrollView';
import MMContentContainer from '../../components/common/ContentContainer';

export default function Milestone({ navigation, route }) {

    return (
        <>
            <MMContentContainer>
                <MMScrollView>
                    <Text>hello</Text>
                </MMScrollView>
            </MMContentContainer>
        </>
    );
}

Milestone.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};
