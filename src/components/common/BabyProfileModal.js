import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import _ from 'lodash';
import MMUtils from '../../helpers/Utils';
import MMApiService from '../../services/ApiService';
import MMButton, { MMTransparentButton } from './Button';
import { MMOverlaySpinner } from './Spinner';
import MMIcon from './Icon';
import { useNavigation } from '@react-navigation/native';
import MMProfileCard from './ProfileCard';
import { Text } from 'react-native-paper';

const MMBabyProfileModal = ({ isModalOpen, isModalClose, setIsModalOpen, selectedBaby }) => {
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
					setIsOverlayLoading(false);
				}
			} catch (error) {
				const serverError = MMUtils.apiErrorMessage(error);
				if (serverError) {
					MMUtils.showToastMessage(serverError);
				}
				setIsOverlayLoading(false);
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
								<TouchableOpacity onPress={isModalClose}>
									<MMIcon iconName={'close'} iconSize={25} />
								</TouchableOpacity>
							</View>
							{babyList ? (
								_.map(babyList, (item, index) => (
									<MMProfileCard
										key={index.toString()}
										profileData={item}
										onEdit={() => onBabyEdit(item._id)}
										onDelete={() => onBabyDelete(item._id)}
										onPress={() => onSelectProfile(item)}
									/>
								))
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