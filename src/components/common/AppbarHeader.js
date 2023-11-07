import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Avatar, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import MMStyles from '../../helpers/Styles';
import MMColors from '../../helpers/Colors';
import MMUtils from '../../helpers/Utils';
import MMIcon from './Icon';

const MMAppbarHeader = ({ babyDetail, onAvatarPress }) => {
	const theme = useTheme();
	const headerTitle = useSelector((state) => state.AppReducer.headerTitle);

	return (
		<Appbar.Header style={styles.appBarHeader}>
			<TouchableOpacity onPress={onAvatarPress} style={MMStyles.ml10}>
				<Avatar.Image
					size={50}
					source={babyDetail ? { uri: MMUtils.getImagePath(babyDetail.picture) } : require('../../assets/images/parenthood.jpg')}
				/>
				{
					!babyDetail ? <MMIcon iconName='plus-circle' style={styles.addButton} iconSize={20} iconColor={theme.colors.primary} /> : null
				}
			</TouchableOpacity>
			{
				headerTitle ? <Appbar.Content title={headerTitle} titleStyle={[MMStyles.mediumText, { alignSelf: 'center' }]} /> :
					<Appbar.Content title={babyDetail ? babyDetail.name : 'Mini Memoirs'}
						titleStyle={[MMStyles.mediumText, { alignSelf: 'center' }]} />
			}

			<Appbar.Action icon="bell" onPress={() => console.log('Bell pressed')} />
			<Appbar.Action icon="cart" onPress={() => console.log('cart pressed')} />
		</Appbar.Header>
	);
};

const styles = StyleSheet.create({
	appBarHeader: {
		backgroundColor: MMColors.white,
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
