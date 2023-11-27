import * as React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import _ from 'lodash';

const defaultSetting = {
	alignItems: 'flex-start',
}

const MMFlexView = ({ alignItems, paddingTop = 0, children, ...props }) => {
	return (
		<View style={flexViewStyle(alignItems, paddingTop)} {...props}>
			{children}
		</View>
	)
};

const flexViewStyle = function (alignItems, paddingTop) {
	const alignItemsValue = (_.isNil(alignItems) ? defaultSetting.alignItems : alignItems);

	return {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: alignItemsValue,
		paddingTop: paddingTop
	}
};

MMFlexView.propTypes = {
	alignItems: PropTypes.string,
};

export default MMFlexView;
