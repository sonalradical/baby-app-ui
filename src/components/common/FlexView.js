import * as React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import _ from 'lodash';

const defaultSetting = {
	alignItems: 'flex-start',
}

const MMFlexView = ({ alignItems, children, ...props }) => {
	return (
		<View style={flexViewStyle(alignItems)} {...props}>
			{children}
		</View>
	)
};

const flexViewStyle = function (alignItems) {
	const alignItemsValue = (_.isNil(alignItems) ? defaultSetting.alignItems : alignItems);

	return {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: alignItemsValue,
	}
};

MMFlexView.propTypes = {
	alignItems: PropTypes.string,
};

export default MMFlexView;
