import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { useTheme, Text } from 'react-native-paper';

import MMInput from './Input';

const MMInputMultiline = ({ name, label, placeholder, errorText, ...props }) => {
	const theme = useTheme();

	return (
		<View style={styles(theme).container}>
			<Text style={theme.fonts.titleMedium}>{label}</Text>
			<MMInput
				name={name}
				placeholder={placeholder}
				multiline={true}
				numberOfLines={8}
				maxLength={255}
				autoCapitalize='sentences'
				keyboardType='default'
				errorText={errorText}
				style={styles(theme).textMultiline}
				{...props}
			/>
		</View>
	)
};

const styles = (theme) => StyleSheet.create({
	container: {
		width: '100%',
	},
	textMultiline: {
		height: 200,
		textAlignVertical: 'top',
		marginTop: 5,
		backgroundColor: theme.colors.secondaryContainer,
	},
});

MMInputMultiline.propTypes = {
	name: PropTypes.string,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	errorText: PropTypes.string,
};

export default MMInputMultiline;
