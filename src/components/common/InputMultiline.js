import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet,Dimensions } from 'react-native';
import { useTheme, Text } from 'react-native-paper';

import MMInput from './Input';

const MMInputMultiline = ({ name, label, placeholder,maxLength, errorText, ...props }) => {
	const theme = useTheme();

	return (
	
		<MMInput
			name={name}
			placeholder={placeholder}
			multiline={true}
			numberOfLines={8}
			maxLength={maxLength}
			autoCapitalize='sentences'
			keyboardType='default'
			errorText={errorText}
			style={styles(theme).textMultiline}
			{...props}
		/>
	)
};

const styles = (theme) => StyleSheet.create({

	textMultiline: {
		height:  Dimensions.get('window').height / 3,
		textAlignVertical: 'top',
		marginTop: 5,
		fontSize:16,
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
