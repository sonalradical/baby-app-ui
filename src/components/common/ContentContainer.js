import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const MMContentContainer = ({ paddingStyle = 'medium', children }) => {
	const theme = useTheme();

	switch (paddingStyle) {
		case 'none':
			return (
				<View style={styles(theme).containerNone}>
					{children}
				</View>
			);
		case 'small':
			return (
				<View style={styles(theme).containerSmall}>
					{children}
				</View>
			);
		default:
			return (
				<View style={styles(theme).containerMedium}>
					{children}
				</View>
			);
	}
};

const styles = (theme) => StyleSheet.create({
	containerNone: {
		flex: 1,
		padding: 0,
		backgroundColor: theme.colors.background
	},
	containerSmall: {
		flex: 1,
		paddingHorizontal: 6,
		paddingVertical: 4,
		backgroundColor: theme.colors.background
	},
	containerMedium: {
		flex: 1,
		paddingHorizontal: 12,
		paddingVertical: 8,
		backgroundColor: theme.colors.background
	},
});

MMContentContainer.propTypes = {
	paddingStyle: PropTypes.oneOf(['none', 'small', 'medium']),
};

export default MMContentContainer;