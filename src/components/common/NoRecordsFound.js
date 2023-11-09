import * as React from 'react';
import { List, Surface, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';

const MMNoRecordsFound = ({ title, withIcon = false, padding = [0, 0, 0, 0], margin = [0, 0, 0, 0], ...props }) => {
	const theme = useTheme();

	if (withIcon) {
		return (
			<Surface style={{ backgroundColor: theme.colors.secondaryContainer }}>
				<List.Item
					title={title}
					titleNumberOfLines={2}
					left={props => <List.Icon {...props} icon='sticker-remove' />}
					{...props}
					style={theme.fonts.default}
				>
				</List.Item>
			</Surface>
		);
	}

	return (
		<Surface>
			<List.Item
				title={title}
				titleNumberOfLines={2}
				{...props}
			>
			</List.Item>
		</Surface>
	);
};

MMNoRecordsFound.propTypes = {
	title: PropTypes.string,
	withIcon: PropTypes.bool,
	padding: PropTypes.array,
	margin: PropTypes.array,
};

export default MMNoRecordsFound;
