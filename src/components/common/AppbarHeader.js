import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import MMStyles from '../../helpers/Styles';
import MMUtils from '../../helpers/Utils';
import MMIcon from './Icon';
import MMColors from '../../helpers/Colors';

const MMAppbarHeader = ({ babyDetail, onAvatarPress }) => {

	return (
		<View>
			<Appbar.Header>
				<TouchableOpacity onPress={onAvatarPress} style={MMStyles.ml10}>
					<Avatar.Image
						size={50}
						source={babyDetail ? require('../../assets/images/girl.jpeg') : require('../../assets/images/girl.jpeg')}
					/>
					{
						!babyDetail ? <MMIcon iconName='plus-circle' style={styles.addButton} iconSize={20} iconColor={MMColors.orange} /> : null
					}
				</TouchableOpacity>
				<Appbar.Content title={babyDetail ? babyDetail.name : 'Baby'} style={{ alignItems: 'center' }} />
				<Appbar.Action icon="bell" onPress={() => console.log('Bell pressed')} />
				<Appbar.Action icon="cart" onPress={() => console.log('cart pressed')} />
			</Appbar.Header>
		</View>
	);
};

const styles = StyleSheet.create({
	defaultAvatar: {
		backgroundColor: 'lightgray',
	},
	addButton: {
		position: 'absolute',
		top: 30,
		right: 0,
	},
});

export default MMAppbarHeader;
