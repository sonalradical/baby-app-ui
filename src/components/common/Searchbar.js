import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import MMColors from '../../helpers/Colors';

const MMSearchbar = ({ placeholder = 'Search below...', ...props }) => {

	return (
		<Searchbar
			placeholder={placeholder}
			placeholderTextColor={MMColors.label}
			elevation={1}
			autoCapitalize='none'
			inputStyle={styles.searchbarInput}
			style={styles.searchbar}
			{...props}
		/>
	);
};

const styles = StyleSheet.create({
	searchbar: {
		marginBottom: 8,
		backgroundColor: MMColors.white,
		borderRadius: 25,
	},
	searchbarInput: {
		paddingLeft: 8,
	},
});

export default MMSearchbar;
