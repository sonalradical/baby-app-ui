import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import MMUtils from '../../helpers/Utils';
import MMEnums from '../../helpers/Enums';
import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMAppbarHeader from '../../components/common/AppbarHeader';
import MMBabyProfileModal from '../babyProfile/BabyProfileModal';

export default function Header() {
    const selectedBabyId = useSelector((state) => state.AppReducer.baby);
    const reloadPage = useSelector((state) => state.AppReducer.reloadPage)
    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [babyDetail, setBabyDetail] = useState();

    useEffect(() => {
        loadBabyProfileDetail();
    }, [selectedBabyId, reloadPage]);

    const loadBabyProfileDetail = async () => {
        setOverlayLoading(true);
        const babyId = selectedBabyId || (await MMUtils.getItemFromStorage(MMEnums.storage.selectedBaby));
        if (babyId || reloadPage) {
            try {
                const response = await MMApiService.getBabyById(babyId);
                if (response.data) {
                    setBabyDetail(response.data);
                }
            } catch (error) {
                setBabyDetail();
                const serverError = MMUtils.apiErrorMessage(error);
                if (serverError) {
                    MMUtils.showToastMessage(serverError);
                }
            }
            setOverlayLoading(false);
        }
        else {
            setBabyDetail();
            setOverlayLoading(false);
        }
    }

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

