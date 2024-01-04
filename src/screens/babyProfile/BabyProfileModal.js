import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Card, Divider, Text, useTheme } from 'react-native-paper';

import _ from 'lodash';

import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather';

import { setBaby } from '../../redux/Slice/AppSlice';

import MMUtils from '../../helpers/Utils';
import MMEnums from '../../helpers/Enums';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import { MMButton, MMTransparentButton } from '../../components/common/Button';
import MMSpinner from '../../components/common/Spinner';
import MMIcon from '../../components/common/Icon';

const MMBabyProfileModal = ({ isModalOpen, setIsModalOpen, selectedBaby }) => {
	const dispatch = useDispatch();
	const theme = useTheme();
	const navigation = useNavigation();
	const { userDetail } = useSelector((state) => state.AuthReducer.auth);
	const [isLoading, setLoding] = useState(true);
	const [selectedBabyDetail, setSelectedBabyDetail] = useState(null);
	const [babyList, setBabyList] = useState();

	useEffect(() => {
		if (isModalOpen) {
			Init();
		}
	}, [isModalOpen]);

	async function Init() {
		try {
			setLoding(true);
			const { data } = await MMApiService.babyList();
			if (data) {
				if (selectedBaby) {
					const selectedIndex = data.findIndex(profile => profile._id === selectedBaby._id);
					if (selectedIndex !== -1) {
						data.splice(selectedIndex, 1);
						data.unshift(selectedBaby);
					}
					setSelectedBabyDetail(selectedBaby);
				} else {
					setSelectedBabyDetail();
				}
				setBabyList(data);
			}
			setLoding(false);
		} catch (error) {
			setBabyList([]);
			setSelectedBabyDetail();
			setLoding(false);
			const serverError = MMUtils.apiErrorMessage(error);
			if (serverError) {
				MMUtils.showToastMessage(serverError);
			}
		}
	}

	const onAddBaby = () => {
		setIsModalOpen(false);
		navigation.navigate('AddEditBaby');
	};

	const onBabyEdit = (babyId) => {
		setIsModalOpen(false);
		navigation.navigate('AddEditBaby', { babyId: babyId, babyListSize: _.size(babyList) })
	}

	const onSelectProfile = (babyDetail) => {
		setIsModalOpen(false);
		setSelectedBabyDetail(babyDetail);
		MMUtils.setItemToStorage(MMEnums.storage.selectedBaby, JSON.stringify(babyDetail));
		dispatch(setBaby(babyDetail));
		navigation.navigate('Home', { babyId: babyDetail._id })
	}

	const ProfileCard = () => {
		const filterBabyDetail = babyList.filter(item => item._id !== selectedBabyDetail._id);
		return (
			<>
				< >
					<Text style={[theme.fonts.headlineMedium, { paddingBottom: MMConstants.paddingLarge, textAlign: 'center' }]}>
						{selectedBabyDetail.isBorn === 'Yes' ? selectedBabyDetail.name : 'Mini Baby'}</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<View style={{ flex: 1, height: 1, backgroundColor: theme.colors.surfaceDisabled, marginTop: MMConstants.marginMedium }} />
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Avatar.Image size={75}
								source={selectedBabyDetail.isBorn === 'Yes' ? { uri: MMUtils.getImagePath(selectedBabyDetail.picture) } :
									require('../../assets/images/parenthood.jpg')} />
							<TouchableOpacity onPress={() => onBabyEdit(selectedBabyDetail._id)} style={{ position: 'absolute', right: -5, bottom: 5 }}>
								<Avatar.Icon size={25} icon="pencil" color={theme.colors.secondaryContainer} />
							</TouchableOpacity>
						</View>
						<View style={{ flex: 1, height: 1, backgroundColor: theme.colors.surfaceDisabled, marginTop: MMConstants.marginMedium }} />
					</View>
				</>
				<View style={{ paddingHorizontal: MMConstants.paddingLarge, paddingVertical: MMConstants.paddingMedium }}>
					{filterBabyDetail && filterBabyDetail.map((item, index) => (
						<React.Fragment key={index}>
							<TouchableOpacity style={{ flexDirection: 'row', padding: MMConstants.paddingMedium }} key={index}
								onPress={() => onSelectProfile(item)}>
								<Avatar.Image
									size={40}
									source={item.isBorn === 'Yes' ?
										{ uri: MMUtils.getImagePath(item.picture) } : require('../../assets/images/parenthood.jpg')}
								/>
								<View style={{ flexDirection: 'column', paddingLeft: 20 }}>
									<Text style={[theme.fonts.bodyLarge]}>{item.isBorn === 'Yes' ? item.name : 'Mini Baby'}</Text>
									<Text style={[theme.fonts.labelSmall]}>Created By {MMConstants.unicode.bull} {userDetail.name}</Text>
								</View>
							</TouchableOpacity>
							{index < _.size(filterBabyDetail) - 1 && <Divider />}
						</React.Fragment>
					))}
					<MMButton label={'Add New Baby'} onPress={() => onAddBaby()} style={{ margin: MMConstants.marginMedium }} />
				</View>
			</>
		);
	}

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={isModalOpen}>
			<View style={styles(theme).centeredView}>
				<View style={styles(theme).card}>
					<View style={{ alignSelf: 'flex-end', paddingRight: MMConstants.paddingMedium, top: 12, right: 12, }}>
						<MMIcon iconName={'close'} onPress={() => setIsModalOpen(false)} />
					</View>
					{isLoading ? (
						<View style={{ height: 40 }}>
							<MMSpinner /></View>
					) : <ProfileCard />}
				</View>
			</View>
		</Modal>
	);
};

const styles = (theme) => StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	card: {
		backgroundColor: theme.colors.secondaryContainer,
		borderRadius: 20,
		elevation: 10,
		margin: 40,
		shadowColor: theme.colors.shadow,
		shadowOpacity: 0.4,
		shadowRadius: 2,
		shadowOffset: {
			height: 1,
			width: 1,
		},
	},
});

export default MMBabyProfileModal;