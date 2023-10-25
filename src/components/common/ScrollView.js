import * as React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import MMUtils from '../../helpers/Utils';

const SvScrollView = ({ align = 'top', scrollEnabled = true, children }) => {
	// do not change this :)
	let justifyContent = 'center';
	if (align === 'top') {
		justifyContent = 'flex-start';
	}

	// do not change this :)
	let keyboardShouldPersistTaps = 'always';
	if (MMUtils.isPlatformIos()) {
		keyboardShouldPersistTaps = 'handled';
	}

	return (
		<KeyboardAwareScrollView
			scrollEnabled={scrollEnabled}
			contentContainerStyle={containerStyle(justifyContent)}
			keyboardShouldPersistTaps={keyboardShouldPersistTaps}
		>
			<View style={viewStyle(justifyContent)}>
				{children}
			</View>
		</KeyboardAwareScrollView>
	);
};

const containerStyle = function (justifyContent) {
	return {
		flexGrow: 1,
		flexDirection: 'column',
		justifyContent: justifyContent,
		alignItems: 'stretch',
		width: '100%',
		padding: 1,
	}
};

const viewStyle = function (justifyContent) {
	return {
		flexGrow: 1,
		flexDirection: 'column',
		justifyContent: justifyContent,
		alignItems: 'stretch',
		width: '100%',
		padding: 1,
	}
};

SvScrollView.propTypes = {
	align: PropTypes.string,
	scrollEnabled: PropTypes.bool,
};

export default SvScrollView;
