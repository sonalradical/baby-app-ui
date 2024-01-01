import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';

const MMActionButtons = ({ type, children }) => {
	const theme = useTheme();

	if (type === 'bottomFixed') {
		return (
			<View style={styles(theme).bottomWrap}>
				<View style={styles(theme).buttons}>
					{children}
				</View>
			</View>
		);
	}

	return (
		<View style={styles(theme).buttons}>
			{children}
		</View>
	);
};

const styles = (theme) => StyleSheet.create({
	buttons: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: 12,
		paddingBottom: 4,
		paddingHorizontal: 1,
	},
	bottomWrap: {
		paddingHorizontal: 12,
		paddingVertical: 10,
		backgroundColor: theme.colors.background
	},
});

MMActionButtons.propTypes = {
	type: PropTypes.string,
};

export default MMActionButtons;
