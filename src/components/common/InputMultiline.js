import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme, TextInput } from 'react-native-paper';

const MMInputMultiline = ({ name, label, placeholder, maxLength, mode, errorText, ...props }) => {
	const theme = useTheme();

	return (
		<View style={styles(theme).container}>
			<TextInput
				name={name}
				placeholder={placeholder}
				multiline={true}
				numberOfLines={20}
				maxLength={maxLength}
				autoCapitalize='sentences'
				keyboardType='default'
				errorText={errorText}
				mode={mode}
				outlineColor={theme.colors.outline}
				textBreakStrategy='simple'
				label=''
				{...props}
				style={styles(theme).textMultiline}
				{...props}
			/>
		</View>
	)
};

const styles = (theme) => StyleSheet.create({
	container: {
		width: '100%',
		height: Dimensions.get('window').height / 3,
	},
	textMultiline: {
		backgroundColor: theme.colors.secondaryContainer,
		marginBottom: 10,
		marginTop: 6
	},
});

MMInputMultiline.propTypes = {
	name: PropTypes.string,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	errorText: PropTypes.string,
};

export default MMInputMultiline;
