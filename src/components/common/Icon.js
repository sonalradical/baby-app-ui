import React from 'react';

import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

function MMIcon(props) {
    const { iconColor, iconName, iconSize = 24 } = props;
    return (
        <Icon name={iconName} size={iconSize} color={iconColor} {...props} />
    );
}

MMIcon.propTypes = {
    iconColor: PropTypes.any,
    iconName: PropTypes.any,
    iconSize: PropTypes.number,
};

export default MMIcon;
