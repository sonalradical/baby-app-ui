import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import NumericInput from 'react-native-numeric-input';
import MMConstants from '../../helpers/Constants';

const MMTextInputNumeric = ({ label, errorText, containerClass = 'container', ...props }) => {
	const theme = useTheme();

	return (
		<View style={styles(theme)[containerClass]}>
			{label ? <Text style={[theme.fonts.titleMedium, { paddingBottom: MMConstants.paddingMedium }]}>{label}</Text> : null}

			<NumericInput
				valueType='integer'
				keyboardType='number-pad'
				step={1}
				minValue={1}
				totalHeight={44}
				separatorWidth={0}
				rounded={true}
				editable={false}
				iconStyle={{ fontSize: 18, color: theme.colors.secondaryContainer }}
				containerStyle={{ width: '100%' }}
				inputStyle={{ minWidth: '52%' }}
				borderColor={theme.colors.outline}
				leftButtonBackgroundColor={theme.colors.primary}
				rightButtonBackgroundColor={theme.colors.primary}
				{...props}
			/>

			{errorText ? <Text style={styles(theme).error}>{errorText}</Text> : null}
		</View>
	)
};

const styles = (theme) => StyleSheet.create({
	container: {
		width: '100%',
		marginBottom: 16,
	},
	containerSmall: {
		width: '100%'
	},
	label: {
		marginBottom: 3,
	},
	error: {
		fontSize: 13,
		paddingTop: 2,
		paddingLeft: 2,
		color: theme.colors.error,
	},
});

MMTextInputNumeric.propTypes = {
	label: PropTypes.string,
	errorText: PropTypes.string,
	containerClass: PropTypes.string,
};

export default MMTextInputNumeric;
