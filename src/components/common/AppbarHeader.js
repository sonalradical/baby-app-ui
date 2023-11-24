import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Avatar, useTheme } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';

import MMConstants from '../../helpers/Constants';
import MMUtils from '../../helpers/Utils';
import MMIcon from './Icon';

const MMAppbarHeader = ({ babyDetail, onAvatarPress, showHome = false }) => {
	const navigation = useNavigation();
	const theme = useTheme();

	return (
		<Appbar.Header style={styles(theme).appBarHeader}>
			{babyDetail ?
				<>
					<TouchableOpacity onPress={onAvatarPress} style={{ paddingLeft: MMConstants.paddingLarge }}>
						<Avatar.Image
							size={50}
							source={babyDetail.isBorn === 'Yes' ? { uri: MMUtils.getImagePath(babyDetail.picture) } :
								require('../../assets/images/parenthood.jpg')}
						/>
					</TouchableOpacity>
					<Appbar.Content title={babyDetail.isBorn === 'Yes' ? babyDetail.name : 'Mini Baby'}
						titleStyle={[theme.fonts.headlineMedium, { alignSelf: 'center' }]} /></>
				: <>
					<TouchableOpacity onPress={onAvatarPress} style={{ paddingLeft: MMConstants.paddingLarge }}>
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
			{showHome ? <Appbar.Action icon="home" onPress={() => navigation.navigate('Home')} /> :
				<Appbar.Action icon="bell" onPress={() => console.log('Bell pressed')} />}
		</Appbar.Header>
	);
};

const styles = (theme) => StyleSheet.create({
	appBarHeader: {
		backgroundColor: theme.colors.secondaryContainer,
		borderBottomRightRadius: 20,
		borderBottomLeftRadius: 20,
		marginBottom: MMConstants.marginMedium
	},
	addButton: {
		position: 'absolute',
		top: 30,
		right: 0,
	},
});

export default MMAppbarHeader;
