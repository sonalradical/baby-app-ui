import * as React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import _ from 'lodash';

const defaultSetting = {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
}

const MMListView = ({ alignItems, justifyContent, children, ...props }) => {
    return (
        <View style={flexViewStyle(alignItems, justifyContent)} {...props}>
            {children}
        </View>
    )
};

const flexViewStyle = function (alignItems, justifyContent) {
    const alignItemsValue = (_.isNil(alignItems) ? defaultSetting.alignItems : alignItems);
    const justifyContentValue = (_.isNil(justifyContent) ? defaultSetting.justifyContent : justifyContent);

    return {
        flex: 1,
        flexDirection: 'row',
        justifyContent: justifyContentValue,
        alignItems: alignItemsValue,
    }
};

MMListView.propTypes = {
    alignItems: PropTypes.string,
    justifyContent: PropTypes.string,
};

export default MMListView;