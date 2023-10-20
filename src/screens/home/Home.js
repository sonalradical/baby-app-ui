import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import MMStyles from '../../helpers/Styles';
import MMUtils from '../../helpers/Utils';
import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMAppbarHeader from '../../components/common/AppbarHeader';
import MMBabyProfileModal from '../babyProfile/BabyProfileModal';
import MMIcon from '../../components/common/Icon';
import MMConstants from '../../helpers/Constants';


export default function Home({ navigation, route }) {
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [babyDetail, setBabyDetail] = useState();

    useEffect(() => {
        const loadBabyProfileDetail = async () => {
            const babyId = route.params?.babyId || (await MMUtils.getItemFromStorage(MMConstants.storage.selectedBaby));
            if (babyId) {
                try {
                    setIsOverlayLoading(true);
                    const response = await MMApiService.getBabyById(babyId);
                    if (response.data) {
                        setBabyDetail(response.data)
                        setIsOverlayLoading(false);
                    }
                } catch (error) {
                    setBabyDetail();
                    const serverError = MMUtils.apiErrorMessage(error);
                    if (serverError) {
                        MMUtils.showToastMessage(serverError);
                    }
                    setIsOverlayLoading(false);
                }
            }
            else {
                setBabyDetail();
            }
        }
        loadBabyProfileDetail();
    }, [route.params?.babyId, MMConstants.storage.selectedBaby]);

    const onAvatarPress = () => {
        setIsModalOpen(true);
    };

    const renderView = () => {
        return (
            <View style={MMStyles.containerPadding}>
                <MMIcon onPress={() => navigation.navigate('Quiz', { babyId: babyDetail._id, chapterId: '6524f0716499face7b559227' })} iconName='book' />
            </View>
        );
    };

    return (
        <>
            <MMAppbarHeader onAvatarPress={() => onAvatarPress()} babyDetail={babyDetail} />
            <MMBabyProfileModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} selectedBaby={babyDetail} />
            <View style={MMStyles.container}>
                {renderView()}
            </View>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </>
    );
}

Home.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object
};

const styles = StyleSheet.create({
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarIcon: {
        backgroundColor: 'transparent',
    },
});