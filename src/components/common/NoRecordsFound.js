import * as React from 'react';
import PropTypes from 'prop-types';
import { List, Surface } from 'react-native-paper';
import MMColors from '../../helpers/Colors';
import MMStyles from '../../helpers/Styles';

const MMNoRecordsFound = ({ title, withIcon = false, padding = [0, 0, 0, 0], margin = [0, 0, 0, 0], ...props }) => {
	if (withIcon) {
		return (
			<Surface style={{ backgroundColor: MMColors.white }}>
				<List.Item
					title={title}
					titleNumberOfLines={2}
					left={props => <List.Icon {...props} icon='sticker-remove' />}
					{...props}
					style={MMStyles.subTitle}
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
