import * as React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import _ from 'lodash';

const defaultSetting = {
	alignItems: 'flex-start',
}

const MMFlexView = ({ alignItems, paddingTop = 0, padding = 0, children, ...props }) => {
	return (
		<View style={flexViewStyle(alignItems, paddingTop, padding)} {...props}>
			{children}
		</View>
	)
};

const flexViewStyle = function (alignItems, paddingTop, padding) {
	const alignItemsValue = (_.isNil(alignItems) ? defaultSetting.alignItems : alignItems);

	return {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: alignItemsValue,
		paddingTop: paddingTop,
		padding: padding
	}
};

MMFlexView.propTypes = {
	alignItems: PropTypes.string,
};

export default MMFlexView;
