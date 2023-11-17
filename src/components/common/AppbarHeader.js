import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Avatar, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import MMUtils from '../../helpers/Utils';
import MMIcon from './Icon';

const MMAppbarHeader = ({ babyDetail, onAvatarPress }) => {
	const theme = useTheme();

	return (
		<Appbar.Header style={styles(theme).appBarHeader}>
			{babyDetail ?
				<>
					<TouchableOpacity onPress={onAvatarPress} style={{ marginLeft: 10 }}>
						<Avatar.Image
							size={50}
							source={babyDetail.isBorn === 'Yes' ? { uri: MMUtils.getImagePath(babyDetail.picture) } :
								require('../../assets/images/parenthood.jpg')}
						/>
					</TouchableOpacity>
					<Appbar.Content title={babyDetail.isBorn === 'Yes' ? babyDetail.name : 'Mini Baby'}
						titleStyle={[theme.fonts.headlineMedium, { alignSelf: 'center' }]} /></>
				: <>
					<TouchableOpacity onPress={onAvatarPress} style={{ marginLeft: 10 }}>
						<Avatar.Image
							size={50}
							source={require('../../assets/images/parenthood.jpg')}
						/>
						<MMIcon iconName='plus-circle' style={styles(theme).addButton} iconSize={20} iconColor={theme.colors.secondary} />
					</TouchableOpacity>
					<Appbar.Content title={'Mini Memoirs'}
						titleStyle={[theme.fonts.headlineMedium, { alignSelf: 'center' }]} />
				</>
			}
			<Appbar.Action icon="bell" onPress={() => console.log('Bell pressed')} />
			<Appbar.Action icon="cart" onPress={() => console.log('cart pressed')} />
		</Appbar.Header>
	);
};

const styles = (theme) => StyleSheet.create({
	appBarHeader: {
		backgroundColor: theme.colors.secondaryContainer,
		borderBottomRightRadius: 20,
		borderBottomLeftRadius: 20,
		marginBottom: 10
	},
	addButton: {
		position: 'absolute',
		top: 30,
		right: 0,
	},
});

export default MMAppbarHeader;
