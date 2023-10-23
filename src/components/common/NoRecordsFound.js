import * as React from 'react';
import PropTypes from 'prop-types';
import { List, Surface } from 'react-native-paper';

const MMNoRecordsFound = ({ title, withIcon = false, padding = [0, 0, 0, 0], margin = [0, 0, 0, 0], ...props }) => {
	if (withIcon) {
		return (
			<Surface>
				<List.Item
					title={title}
					titleNumberOfLines={2}
					left={props => <List.Icon {...props} icon='sticker-remove' />}
					{...props}
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
