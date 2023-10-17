import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Card, Text } from 'react-native-paper';

import _ from 'lodash';

import { useNavigation } from '@react-navigation/native';

import MMUtils from '../../helpers/Utils';
import MMStyles from '../../helpers/Styles';
import MMColors from '../../helpers/Colors';
import MMApiService from '../../services/ApiService';
import { MMTransparentButton } from '../../components/common/Button';
import MMSpinner, { MMOverlaySpinner } from '../../components/common/Spinner';
import MMIcon from '../../components/common/Icon';

const MMBabyProfileModal = ({ isModalOpen, setIsModalOpen, selectedBaby }) => {
	const [isOverlayLoading, setIsOverlayLoading] = useState(false);
	const [isLoading, setIsLoding] = useState(false);
	const [selectedBabyDetail, setSelectedBabyDetail] = useState(null);
	const [babyList, setBabyList] = useState();
	const navigation = useNavigation();

	useEffect(() => {
		async function Init() {
			try {
				setIsLoding(true);
				console.log('Loading baby profile list...');
				const response = await MMApiService.babyList();
				if (response.data) {
					// Find the index of the selectedBaby in the profiles array
					const babyProfiles = response.data;
					if (selectedBaby) {
						const selectedIndex = babyProfiles.findIndex(profile => profile._id === selectedBaby._id);
						console.log(selectedIndex, 'selectedIndex')
						if (selectedIndex !== -1) {
							babyProfiles.splice(selectedIndex, 1);
							babyProfiles.unshift(selectedBaby);
						}
					}
					setBabyList(babyProfiles);
				}
				setIsLoding(false);
			} catch (error) {
				setBabyList();
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

	const onBabyDelete = async (babyId) => {
		try {
			setIsOverlayLoading(true);
			console.log('Loading baby profile list...');

			const response = await MMApiService.deleteBaby(babyId);
			if (response) {
				MMUtils.showToastMessage('Baby deleted successfully.')

				navigation.navigate('Home');
				setIsOverlayLoading(false);
				setIsModalOpen(false);
			}
		} catch (error) {
			const serverError = MMUtils.apiErrorMessage(error);
			if (serverError) {
				MMUtils.showToastMessage(serverError);
			}
			setIsOverlayLoading(false);
		}
	}

	const onSelectProfile = (babyDetail) => {
		setIsModalOpen(false);
		setSelectedBabyDetail(babyDetail);
		navigation.navigate('Home', babyDetail = { babyDetail })
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
					<Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Avatar.Image
							size={56}
							source={require('../../assets/images/girl.jpeg')}
						/>
						<Card.Title title={profileData.name} subtitle={profileData.gender} style={{ width: 100 }} />
						{isSelected ? <MMIcon
							iconName="edit"
							iconColor={MMColors.orange}
							iconSize={24}
							onPress={() => onBabyEdit(profileData._id)}
						/> : null}
						{isSelected ? <MMIcon
							iconName="trash-o"
							style={MMStyles.ml5}
							iconColor={MMColors.orange}
							iconSize={24}
							onPress={() => onBabyDelete(profileData._id)}
						/> : null}
					</Card.Content>
				</Card>
			</TouchableOpacity>
		);
	}

	return (
		<>
			<View style={styles.centeredView}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={isModalOpen}>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View style={[MMStyles.mb10, { flexDirection: 'row', justifyContent: 'space-between' }]}>
								<Text style={{ alignSelf: 'center' }}>Minimemoirs</Text>
								<TouchableOpacity onPress={() => setIsModalOpen(false)}>
									<MMIcon iconName={'close'} iconSize={25} />
								</TouchableOpacity>
							</View>
							{isLoading ? (
								<View style={{ height: 40 }}>
									<MMSpinner /></View>
							) : (
								babyList && babyList.map((item, index) => (
									<ProfileCard key={index.toString()} profileData={item} index={index} />
								))
							)}
							<MMTransparentButton label='Add New Baby' icon='plus' onPress={() => onAddBaby()} />
						</View>
					</View>
				</Modal>
			</View>
			<MMOverlaySpinner visible={isOverlayLoading} />
		</>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
});

export default MMBabyProfileModal;