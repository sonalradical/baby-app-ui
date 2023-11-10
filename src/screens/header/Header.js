import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import MMUtils from '../../helpers/Utils';
import MMEnums from '../../helpers/Enums';
import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMAppbarHeader from '../../components/common/AppbarHeader';
import MMBabyProfileModal from '../babyProfile/BabyProfileModal';

export default function Header({ navigation, route }) {
    const selectedBabyId = useSelector((state) => state.AppReducer.baby);
    const reloadPage = useSelector((state) => state.AppReducer.reloadPage)
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [babyDetail, setBabyDetail] = useState();

    useEffect(() => {
        const loadBabyProfileDetail = async () => {
            const babyId = selectedBabyId || (await MMUtils.getItemFromStorage(MMEnums.storage.selectedBaby));
            if (babyId || reloadPage) {
                try {
                    setIsOverlayLoading(true);
                    const response = await MMApiService.getBabyById(babyId);
                    if (response.data) {
                        setBabyDetail(response.data)
                        setIsOverlayLoading(false);
                    }
                } catch (error) {
                    setBabyDetail();
                    setIsOverlayLoading(false);
                    const serverError = MMUtils.apiErrorMessage(error);
                    if (serverError) {
                        MMUtils.showToastMessage(serverError);
                    }
                }
            }
            else {
                setBabyDetail();
                setIsOverlayLoading(false);
            }
        }
        loadBabyProfileDetail();
    }, [selectedBabyId, reloadPage]);

    const onAvatarPress = () => {
        setIsModalOpen(true);
    };


    return (
        <>
            <MMAppbarHeader onAvatarPress={() => onAvatarPress()} babyDetail={babyDetail} />
            <MMBabyProfileModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} selectedBaby={babyDetail} />
            <MMOverlaySpinner visible={isOverlayLoading} />
        </>
    );
}

Header.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object
};
