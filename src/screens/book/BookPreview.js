import React from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';

import MMContentContainer from '../../components/common/ContentContainer';
import MMSurface from '../../components/common/Surface';

export default function BookPreview({ route }) {

    const renderView = () => {
        return (
            <MMSurface>

            </MMSurface>
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

BookPreview.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};