import React from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';

import MMContentContainer from '../../components/common/ContentContainer';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function Profile({ route }) {
    const navigation = useNavigation();
    const renderView = () => {
        return (
            <>
                <Button onPress={() => navigation.navigate('Logout')}>click</Button>
            </>
        );
    };

    return (
        <>
            <MMContentContainer>
                {renderView()}
            </MMContentContainer>
        </>
    );
}

Profile.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};