import React from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';

import MMContentContainer from '../../components/common/ContentContainer';
import { MMButton } from '../../components/common/Button';

export default function Profile({ route }) {
    const navigation = useNavigation();

    const renderView = () => {
        return (
            <>
                <MMButton label='Logout' onPress={() => navigation.navigate('Logout')} />
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