import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Avatar, Divider, Text, useTheme } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { setBaby } from '../../redux/Slice/AppSlice';
import { MMButton } from '../../components/common/Button';
import MMSpinner from '../../components/common/Spinner';
import MMIcon from '../../components/common/Icon';

import { isEmpty, first, filter } from 'lodash';
import MMUtils from '../../helpers/Utils';
import MMEnums from '../../helpers/Enums';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';

const MMBabyProfileModal = ({ isModalOpen, setIsModalOpen, selectedBaby }) => {
	const dispatch = useDispatch();
	const theme = useTheme();
	const navigation = useNavigation();
	const { userDetail } = useSelector((state) => state.AuthReducer.auth);
	const [isLoading, setLoading] = useState(true);
	const [selectedBabyDetail, setSelectedBabyDetail] = useState(null);
	const [babyList, setBabyList] = useState();

	useEffect(() => {
		if (isModalOpen) {
			init();
		}
	}, [isModalOpen]);

	async function init() {
		try {
			setLoading(true);
			const { data } = await MMApiService.babyList();
			if (data) {
				if (selectedBaby) {
					const selectedIndex = data.findIndex((profile) => profile._id === selectedBaby._id);
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
			setLoading(false);
		} catch (error) {
			setBabyList([]);
			setSelectedBabyDetail();
			setLoading(false);
			const serverError = MMUtils.apiErrorMessage(error);
			if (serverError) {
				MMUtils.showToastMessage(serverError);
			}
		}
	}

	const onAddBaby = () => {
		setIsModalOpen(false);
		navigation.navigate(MMConstants.screens.addEditBaby);
	};

	const onBabyEdit = (babyId) => {
		setIsModalOpen(false);
		navigation.navigate(MMConstants.screens.addEditBaby, { babyId: babyId, babyListSize: babyList?.length || 0 });
	};

	const onSelectProfile = (babyDetail) => {
		setIsModalOpen(false);
		setSelectedBabyDetail(babyDetail);
		MMUtils.setItemToStorage(MMEnums.storage.selectedBaby, JSON.stringify(babyDetail));
		dispatch(setBaby(babyDetail));
		navigation.navigate(MMConstants.screens.home, { babyId: babyDetail._id });
	};

	const ProfileCardItem = ({ item }) => (
		<TouchableOpacity
			style={{ flexDirection: 'row', paddingVertical: MMConstants.paddingLarge, paddingHorizontal: 20 }}
			onPress={() => onSelectProfile(item)}
		>
			{item.isBorn === 'Yes' ? (
				isEmpty(item.picture) ? (
					<Avatar.Text size={40} label={first(item.name)} />
				) : (
					<Avatar.Image size={40} source={{ uri: MMUtils.getImagePath(item.picture) }} />
				)
			) : (
				<Avatar.Image size={40} source={require('../../assets/images/pregnant-lady.jpg')} />
			)}
			<View style={{ flexDirection: 'column', paddingLeft: 20, width: '78%' }}>
				<Text style={[theme.fonts.titleMedium]}>{item.isBorn === 'Yes' ? item.name : 'Little One'}</Text>
				<Text style={[theme.fonts.labelMedium]}>Created By {MMConstants.unicode.bull} {userDetail.name}</Text>
			</View>
			<View style={{ alignSelf: 'flex-end' }}>
				<MMIcon iconName={'chevron-forward'} iconSize={28} iconColor={theme.colors.primary} />
			</View>
		</TouchableOpacity>
	);

	const ProfileCard = () => {
		if (!babyList || isEmpty(babyList)) return null;
		const firstLetter = selectedBabyDetail && isEmpty(selectedBabyDetail.picture) ? first(selectedBabyDetail.name) : null;

		return (
			<>
				<Text style={[theme.fonts.headlineMedium, { paddingBottom: MMConstants.paddingLarge, textAlign: 'center' }]}>
					{selectedBabyDetail?.isBorn === 'Yes' ? selectedBabyDetail.name : 'Awaiting Little One'}
				</Text>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<View style={{ flex: 1, height: 1, backgroundColor: theme.colors.surfaceDisabled, marginTop: MMConstants.marginMedium }} />
					<View>
						{selectedBabyDetail?.isBorn === 'Yes' ? (
							firstLetter ? (
								<Avatar.Text size={75} label={firstLetter} style={{ borderWidth: 1 }} />
							) : (
								<Avatar.Image size={75} source={{ uri: MMUtils.getImagePath(selectedBabyDetail.picture) }} />
							)
						) : (
							<Avatar.Image size={75} source={require('../../assets/images/pregnant-lady.jpg')} />
						)}
						<TouchableOpacity onPress={() => onBabyEdit(selectedBabyDetail?._id)} style={{ position: 'absolute', right: -5, bottom: 5 }}>
							<Avatar.Icon size={25} icon="pencil" color={theme.colors.secondaryContainer} />
						</TouchableOpacity>
					</View>
					<View style={{ flex: 1, height: 1, backgroundColor: theme.colors.surfaceDisabled, marginTop: MMConstants.marginMedium }} />
				</View>
				<View style={{ marginTop: MMConstants.marginLarge }}>
					<FlatList
						data={filter(babyList, (item) => item._id !== selectedBabyDetail?._id)}
						keyExtractor={(item) => item._id.toString()}
						renderItem={({ item, index }) => <ProfileCardItem key={index} item={item} />}
						ItemSeparatorComponent={() => <Divider />}
					/>
				</View>
				<View style={{ paddingHorizontal: 20, marginVertical: MMConstants.marginSmall }}>
					<MMButton label={'Add New Baby'} onPress={() => onAddBaby()} />
				</View>
			</>
		);
	};

	return (
		<Modal animationType="slide" transparent={true} visible={isModalOpen}>
			<View style={styles(theme).centeredView}>
				<View style={styles(theme).card}>
					<TouchableOpacity style={{ alignSelf: 'flex-end', paddingRight: MMConstants.paddingMedium, top: 12, right: 12 }}
						onPress={() => setIsModalOpen(false)}>
						<MMIcon iconName={'close'} />
					</TouchableOpacity>
					{isLoading ? (
						<View style={{ height: 40 }}>
							<MMSpinner />
						</View>
					) : (
						<ProfileCard />
					)}
				</View>
			</View>
		</Modal>
	);
};

const styles = (theme) =>
	StyleSheet.create({
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
