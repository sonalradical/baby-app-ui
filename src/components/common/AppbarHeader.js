import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Avatar, Text, useTheme } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMUtils from '../../helpers/Utils';
import MMIcon from './Icon';

const MMAppbarHeader = ({ babyDetail, onAvatarPress, showHome = false }) => {
	const navigation = useNavigation();
	const theme = useTheme();
	const relativeTime = babyDetail?.birthDate ? MMUtils.displayFromNow(babyDetail.birthDate) : null;
	const [number, time] = relativeTime ? relativeTime.split(' ') : [0, ''];
	const birthRelativeNumber = time === 'day' ? 'one' : MMUtils.numberToWords(_.parseInt(number));
	const firstLetter = babyDetail && _.isEmpty(babyDetail.picture) ? _.first(babyDetail.name) : null;

	return (
		<Appbar.Header style={styles(theme).appBarHeader}>
			{babyDetail ?
				<>{
					babyDetail.isBorn === 'Yes' ?
						<>
							<TouchableOpacity onPress={onAvatarPress} style={{ paddingLeft: MMConstants.paddingLarge }}>
								{firstLetter ?
									<Avatar.Text size={45} label={firstLetter} /> :
									<Avatar.Image
										size={45}
										source={{ uri: MMUtils.getImagePath(babyDetail.picture) }}
									/>
								}
							</TouchableOpacity>
							<Appbar.Content
								title={
									<View
										style={{ flexDirection: 'column' }}>
										<Text style={[theme.fonts.headlineMedium, { alignSelf: 'center' }]}>
											{babyDetail.name}</Text>
										<Text style={[theme.fonts.labelMedium, { alignSelf: 'center' }]}>
											{time === 'minutes' ? 'One Day of joy ' : `${_.startCase(birthRelativeNumber)} ${_.startCase(time)} of joy`}</Text>
									</View>
								}
							/>
						</>
						:
						<>
							<TouchableOpacity onPress={onAvatarPress} style={{ paddingLeft: MMConstants.paddingLarge }}>
								<Avatar.Image
									size={50}
									source={require('../../assets/images/pregnant-lady.jpg')}
								/>
							</TouchableOpacity>
							<Appbar.Content
								title={<Text style={[theme.fonts.headlineMedium, { alignSelf: 'center' }]}>{'Awaiting Little One'}</Text>}
							/>
						</>}
				</>
				: <>
					<TouchableOpacity onPress={onAvatarPress} style={{ paddingLeft: MMConstants.paddingLarge }}>
						<Avatar.Image
							size={50}
							source={require('../../assets/images/parenthood.jpg')}
						/>
						<MMIcon iconName='add-circle-outline' style={styles(theme).addButton} iconSize={20} iconColor={theme.colors.secondary} />
					</TouchableOpacity>
					<Appbar.Content title={'Mini Memoirs'}
						titleStyle={[theme.fonts.headlineMedium, { alignSelf: 'center' }]} />
				</>
			}
			{showHome ? <MMIcon iconName="home-outline" iconSize={28} iconColor={theme.colors.text.secondary} onPress={() => navigation.navigate('Home')}
				style={{ paddingRight: MMConstants.paddingLarge }} /> :
				<MMIcon iconName="notifications-outline" iconSize={28} iconColor={theme.colors.text.secondary}
					style={{ paddingRight: MMConstants.paddingLarge }}
					onPress={() => console.log('Bell pressed')} />}
		</Appbar.Header>
	);
};

const styles = (theme) => StyleSheet.create({
	appBarHeader: {
		backgroundColor: theme.colors.secondaryContainer,
		borderBottomRightRadius: 20,
		borderBottomLeftRadius: 20,
		elevation: 10,
		shadowColor: '#52006A',
		shadowOpacity: 0.2,
		shadowRadius: 4,
		shadowOffset: { width: -2, height: 4 },
	},
	addButton: {
		position: 'absolute',
		top: 30,
		right: 0,
	},
});

export default MMAppbarHeader;
