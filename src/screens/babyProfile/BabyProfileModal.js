import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Card, Text, useTheme } from 'react-native-paper';

import _ from 'lodash';

import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { setSelectedBabyId } from '../../redux/Slice/AppSlice';

import MMUtils from '../../helpers/Utils';
import MMStyles from '../../helpers/Styles';
import MMColors from '../../helpers/Colors';
import MMConstants from '../../helpers/Constants';
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
		if (isModalOpen) {
			Init();
		}
	}, [isModalOpen]);

	const onAddBaby = () => {
		setIsModalOpen(false);
		navigation.navigate('AddBaby');
	};

	const onBabyEdit = (babyId) => {
		setIsModalOpen(false);
		navigation.navigate('AddBaby', { babyId: babyId })
	}

	const onSelectProfile = (babyDetail) => {
		setIsModalOpen(false);
		setSelectedBabyDetail(babyDetail);
		dispatch(setSelectedBabyId(babyDetail._id));
		MMUtils.setItemToStorage(MMConstants.storage.selectedBaby, babyDetail._id);
		navigation.navigate('Home', { babyId: babyDetail._id })
	}

	const ProfileCard = ({ profileData, index }) => {
		const isSelected = selectedBabyDetail && selectedBabyDetail._id === profileData._id;
		return (
			<TouchableOpacity
				onPress={() => onSelectProfile(profileData)}
				key={index}
			>
				<Card style={[MMStyles.mb10, {
					shadowColor: isSelected ? 'blue' : 'transparent',
					shadowOpacity: isSelected ? 1 : 0,
					shadowRadius: isSelected ? 2 : 0,
					opacity: isSelected ? 1 : 0.5
				}]}>
					<Card.Content style={MMStyles.rowCenter}>
						<Avatar.Image
							size={56}
							source={profileData ? { uri: MMUtils.getImagePath(profileData.picture) } : require('../../assets/images/parenthood.jpg')}
						/>
						<Card.Title title={profileData.name} subtitle={profileData.gender}
							style={{ width: 100 }} titleStyle={MMStyles.boldText} subtitleStyle={MMStyles.subTitle} />
						<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
							{isSelected ? <MMIcon
								iconName="edit"
								iconColor={theme.colors.primary}
								style={MMStyles.mr10}
								iconSize={24}
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
				<View style={styles.centeredView}>
					<View style={MMStyles.card}>
						<View style={[MMStyles.mb10, { flexDirection: 'row', justifyContent: 'center' }]}>
							<Text style={[MMStyles.cardHeaderText, { flex: 1 }]}>Minimemoirs</Text>
							<View style={{ alignSelf: 'flex-end' }}>
								<MMIcon iconName={'close'} iconSize={24} onPress={() => setIsModalOpen(false)} />
							</View>
						</View>
						{
							_.isEmpty(selectedBabyDetail) && !_.isEmpty(babyList) ?
								<Text style={[MMStyles.cardSubHeaderText, MMStyles.mb10, { textAlign: 'center' }]}>Please Select Baby</Text> : null
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
							<Text style={[MMStyles.cardSubHeaderText, { textAlign: 'center' }]}>No Babies Found Please Add New Baby</Text> : null}
						<MMTransparentButton label='Add New Baby' icon='plus' onPress={() => onAddBaby()} />
					</View>
				</View>
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)'
	},
});

export default MMBabyProfileModal;