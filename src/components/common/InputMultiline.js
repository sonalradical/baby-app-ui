import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme, TextInput } from 'react-native-paper';
import MMConstants from '../../helpers/Constants';

const MMInputMultiline = ({ name, placeholder, maxLength, mode, errorText, ...props }) => {
	const theme = useTheme();

	return (
		<TextInput
			name={name}
			placeholder={placeholder}
			multiline={true}
			numberOfLines={20}
			maxLength={maxLength}
			autoCapitalize='sentences'
			keyboardType='default'
			errorText={errorText}
			mode={'outlined'}
			{...props}
			outlineStyle={{ borderColor: theme.colors.onPrimary, borderBottomColor: theme.colors.outline }}
			style={styles(theme).textMultiline}
			{...props}
		/>
	)
};

const styles = (theme) => StyleSheet.create({

	textMultiline: {
		backgroundColor: theme.colors.secondaryContainer,
		marginBottom: MMConstants.marginMedium,
		marginTop: MMConstants.marginSmall,
		height: Dimensions.get('window').height / 3,

	},
});

MMInputMultiline.propTypes = {
	name: PropTypes.string,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	errorText: PropTypes.string,
};

export default MMInputMultiline;
