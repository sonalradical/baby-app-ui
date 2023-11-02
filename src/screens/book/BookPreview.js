import React from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';

import MMContentContainer from '../../components/common/ContentContainer';

export default function BookPreview({ route }) {

    return (
        <>
            <MMContentContainer>
            </MMContentContainer>
        </>
    );
}

BookPreview.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};