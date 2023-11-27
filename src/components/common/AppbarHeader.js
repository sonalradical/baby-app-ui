import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Avatar, Text, useTheme } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'

import MMConstants from '../../helpers/Constants';
import MMUtils from '../../helpers/Utils';
import MMIcon from './Icon';

const MMAppbarHeader = ({ babyDetail, onAvatarPress, showHome = false }) => {
	const navigation = useNavigation();
	const theme = useTheme();
	const birthRelativeTime = babyDetail?.birthDate ? MMUtils.displayFromNow(babyDetail.birthDate) : null;

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
					<Appbar.Content
						title={
							<View
								style={{ flexDirection: 'column' }}>
								<Text style={[theme.fonts.headlineMedium, { alignSelf: 'center' }]}>
									{babyDetail.isBorn === 'Yes' ? babyDetail.name : 'Mini Baby'}</Text>
								<Text style={[theme.fonts.labelMedium, { alignSelf: 'center' }]}>
									{babyDetail.isBorn === 'Yes' ? `${birthRelativeTime} of joy` : null}</Text>
							</View>
						}
					// Update with this style will solve the issue
					/>
				</>
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
				<Ionicons name="notifications-outline" size={28} color={theme.colors.text.secondary} style={{ paddingRight: 10 }}
					onPress={() => console.log('Bell pressed')} />}
		</Appbar.Header>
	);
};

const styles = (theme) => StyleSheet.create({
	appBarHeader: {
		backgroundColor: theme.colors.secondaryContainer,
		borderBottomRightRadius: 20,
		borderBottomLeftRadius: 20,
		elevation: 5
	},
	addButton: {
		position: 'absolute',
		top: 30,
		right: 0,
	},
});

export default MMAppbarHeader;
