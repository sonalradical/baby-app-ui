import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

const MMActionButtons = ({ type, children }) => {

	if (type === 'bottomFixed') {
		return (
			<View style={styles.bottomWrap}>
				<View style={styles.buttons}>
					{children}
				</View>
			</View>
		);
	}

	return (
		<View style={styles.buttons}>
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	buttons: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: 12,
		paddingBottom: 4,
		paddingHorizontal: 1,
		borderTopWidth: 1,
	},
	bottomWrap: {
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
});

MMActionButtons.propTypes = {
	type: PropTypes.string,
};

export default MMActionButtons;
