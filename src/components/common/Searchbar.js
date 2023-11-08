import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';

const MMSearchbar = ({ placeholder = 'Search below...', ...props }) => {
	const theme = useTheme()

	return (
		<Searchbar
			placeholder={placeholder}
			placeholderTextColor={theme.colors.text.primary}
			elevation={1}
			autoCapitalize='none'
			inputStyle={styles(theme).searchbarInput}
			style={styles(theme).searchbar}
			{...props}
		/>
	);
};

const styles = (theme) => StyleSheet.create({
	searchbar: {
		marginBottom: 8,
		backgroundColor: theme.colors.onPrimary,
		borderRadius: 10,
	},
	searchbarInput: {
		paddingLeft: 8,
	},
});

export default MMSearchbar;
