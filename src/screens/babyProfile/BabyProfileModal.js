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
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMIcon from '../../components/common/Icon';

const MMBabyProfileModal = ({ isModalOpen, setIsModalOpen, selectedBaby }) => {
	const [isOverlayLoading, setIsOverlayLoading] = useState(false);
	const [babyList, setBabyList] = useState();
	const navigation = useNavigation();

	useEffect(() => {
		async function Init() {
			try {
				setIsOverlayLoading(true);
				console.log('Loading baby profile list...');

				const response = await MMApiService.babyList();
				if (response.data) {
					setBabyList(response.data);
				}
				setIsOverlayLoading(false);
			} catch (error) {
				setIsOverlayLoading(false);
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
		navigation.navigate('Home', babyDetail = { babyDetail })
	}

	const ProfileCard = ({ profileData, index }) => {
		return (
			<TouchableOpacity onPress={() => onSelectProfile(profileData)} key={index}>
				<Card style={MMStyles.mb10}>
					<Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Avatar.Image
							size={56}
							source={require('../../assets/images/girl.jpeg')}
						/>
						<Card.Title title={profileData.name} subtitle={profileData.gender} style={{ width: 100 }} />
						<MMIcon
							iconName="edit"
							iconColor={MMColors.orange}
							iconSize={24}
							onPress={() => onBabyEdit(profileData._id)}
						/>
						<MMIcon
							iconName="trash-o"
							style={MMStyles.ml5}
							iconColor={MMColors.orange}
							iconSize={24}
							onPress={() => onBabyDelete(profileData._id)}
						/>
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
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<Text style={{ alignSelf: 'center' }}>Minimemoirs</Text>
								<TouchableOpacity onPress={() => setIsModalOpen(false)}>
									<MMIcon iconName={'close'} iconSize={25} />
								</TouchableOpacity>
							</View>
							{babyList ? (
								_.map(babyList, (item, index) => {
									return <ProfileCard key={index.toString()} profileData={item} index={index} />
								}
								)
							) : null}
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