import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const MMContentContainer = ({ children }) => {
	const theme = useTheme();

	return (
		<View style={styles(theme).container}>
			{children}
		</View>
	);
};

const styles = (theme) => StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
});

export default MMContentContainer;
