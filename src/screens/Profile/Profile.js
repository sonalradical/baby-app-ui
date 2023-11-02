import React from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';

import MMContentContainer from '../../components/common/ContentContainer';

export default function Profile({ route }) {

    return (
        <>
            <MMContentContainer>
            </MMContentContainer>
        </>
    );
}

Profile.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};