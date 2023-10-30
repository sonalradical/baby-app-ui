import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import MMStyles from '../../helpers/Styles';

const MMContentContainer = ({ children }) => {

	return (
		<View style={MMStyles.container}>
			{children}
		</View>
	);
};


export default MMContentContainer;
