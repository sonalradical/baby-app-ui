import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme, Surface } from 'react-native-paper';
import _ from 'lodash';

const defaultSetting = {
	padding: [18, 18, 18, 18],
	margin: [0, 0, 12, 0],
	width: '100%',
}

const MMSurface = ({ padding, margin, width, children, ...props }) => {
	const theme = useTheme();

	const paddingValue = (_.isNil(padding) ? defaultSetting.padding : padding);
	const marginValue = (_.isNil(margin) ? defaultSetting.margin : margin);
	const widthValue = (_.isNil(width) ? defaultSetting.width : width);

	return (
		<Surface
			style={surfaceStyle(theme, paddingValue, marginValue, widthValue)}
			elevation={1}
			{...props}
		>
			{children}
		</Surface>
	);
};

const surfaceStyle = function (theme, paddingValue, marginValue, widthValue) {
	return {
		backgroundColor: theme.colors.surface,
		paddingTop: paddingValue[0],
		paddingRight: paddingValue[1],
		paddingBottom: paddingValue[2],
		paddingLeft: paddingValue[3],
		marginTop: marginValue[0],
		marginRight: marginValue[1],
		marginBottom: marginValue[2],
		marginLeft: marginValue[3],
		width: widthValue,
		borderRadius: 4,
	}
};

MMSurface.propTypes = {
	padding: PropTypes.array,
	margin: PropTypes.array,
	width: PropTypes.string,
};

export default MMSurface;
