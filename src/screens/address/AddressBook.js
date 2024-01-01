import React from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import MMContentContainer from '../../components/common/ContentContainer';
import MMPageTitle from '../../components/common/PageTitle';
import Address from '../orders/Address';

export default function AddressBook() {

    return (
        <MMContentContainer>
            <MMPageTitle title={'Address book'} />
            <Address isDisable={true} />
        </MMContentContainer>
    );
}

AddressBook.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};