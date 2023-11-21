import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Card, Text, useTheme } from 'react-native-paper';

import _ from 'lodash';

import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { setBaby } from '../../redux/Slice/AppSlice';

import MMUtils from '../../helpers/Utils';
import MMEnums from '../../helpers/Enums';
import MMApiService from '../../services/ApiService';
import { MMTransparentButton } from '../../components/common/Button';
import MMSpinner from '../../components/common/Spinner';
import MMIcon from '../../components/common/Icon';

const MMBabyProfileModal = ({ isModalOpen, setIsModalOpen, selectedBaby }) => {
	const dispatch = useDispatch();
	const theme = useTheme();
	const navigation = useNavigation();
	const [isLoading, setIsLoding] = useState(false);
	const [selectedBabyDetail, setSelectedBabyDetail] = useState(null);
	const [babyList, setBabyList] = useState();

	useEffect(() => {
		if (isModalOpen) {
			Init();
		}
	}, [isModalOpen]);

	async function Init() {
		try {
			setIsLoding(true);
			console.log('Loading baby profile list...');
			const response = await MMApiService.babyList();
			if (response.data) {
				const babyProfiles = response.data;
				if (selectedBaby) {
					const selectedIndex = babyProfiles.findIndex(profile => profile._id === selectedBaby._id);
					if (selectedIndex !== -1) {
						babyProfiles.splice(selectedIndex, 1);
						babyProfiles.unshift(selectedBaby);
					}
					setSelectedBabyDetail(selectedBaby);
				} else {
					setSelectedBabyDetail();
				}
				setBabyList(babyProfiles);
			}
			setIsLoding(false);
		} catch (error) {
			setBabyList([]);
			setSelectedBabyDetail();
			setIsLoding(false);
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
		dispatch(setBaby(babyDetail._id));
		MMUtils.setItemToStorage(MMEnums.storage.selectedBaby, babyDetail._id);
		navigation.navigate('Home', { babyId: babyDetail._id })
	}

	const ProfileCard = ({ profileData, index }) => {
		const isSelected = selectedBabyDetail && selectedBabyDetail._id === profileData._id;
		return (
			<TouchableOpacity
				onPress={() => onSelectProfile(profileData)}
				key={index}
			>
				<Card style={{
					shadowColor: isSelected ? 'blue' : 'transparent',
					shadowOpacity: isSelected ? 1 : 0,
					shadowRadius: isSelected ? 2 : 0,
					opacity: isSelected ? 1 : 0.5,
					marginBottom: 10
				}}>
					<Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Avatar.Image
							size={56}
							source={profileData.isBorn === 'Yes' ?
								{ uri: MMUtils.getImagePath(profileData.picture) } : require('../../assets/images/parenthood.jpg')}
						/>
						<Card.Title title={profileData.isBorn === 'Yes' ? profileData.name : 'Mini Baby'}
							subtitle={profileData.gender}
							style={{ width: 100, marginLeft: 10 }} titleStyle={theme.fonts.headlineMedium} subtitleStyle={theme.fonts.labelMedium} />
						<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
							{isSelected ? <MMIcon
								iconName="edit"
								iconColor={theme.colors.primary}
								onPress={() => onBabyEdit(profileData._id)}
							/> : null}
						</View>
					</Card.Content>
				</Card>
			</TouchableOpacity>
		);
	}

	return (
		<>
			<Modal
				animationType="slide"
				transparent={true}
				visible={isModalOpen}>
				<View style={styles(theme).centeredView}>
					<View style={styles(theme).card}>
						<View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
							<Text style={[theme.fonts.headlineMedium, { flex: 1, textAlign: 'center' }]}>Minimemoirs</Text>
							<View style={{ alignSelf: 'flex-end', marginBottom: 5 }}>
								<MMIcon iconName={'close'} onPress={() => setIsModalOpen(false)} />
							</View>
						</View>
						{
							_.isEmpty(selectedBabyDetail) && !_.isEmpty(babyList) ?
								<Text style={[theme.fonts.default, { textAlign: 'center', marginBottom: 10 }]}>Please Select Baby</Text> : null
						}
						{isLoading ? (
							<View style={{ height: 40 }}>
								<MMSpinner /></View>
						) : (
							babyList && babyList.map((item, index) => (
								<ProfileCard key={index.toString()} profileData={item} index={index} />
							))
						)}
						{_.isEmpty(babyList) ?
							<Text style={[theme.fonts.default, { textAlign: 'center', marginBottom: 10 }]}>No Babies Found Please Add New Baby</Text> : null}
						<MMTransparentButton label='Add New Baby' icon='plus' onPress={() => onAddBaby()} />
					</View>
				</View>
			</Modal>
		</>
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
		padding: 10,
		borderRadius: 20,
		elevation: 10,
		margin: 20,
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