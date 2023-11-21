import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import * as _ from 'lodash';

import { useDispatch, useSelector } from 'react-redux';

import { setBaby } from '../../redux/Slice/AppSlice';

import MMUtils from '../../helpers/Utils';
import MMApiService from '../../services/ApiService';
import MMContentContainer from '../../components/common/ContentContainer';
import ChapterList from '../chapter/ChapterList';

export default function Home() {
    const selectedBabyId = useSelector((state) => state.AppReducer.baby);
    const dispatch = useDispatch();

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            BackHandler.exitApp();
        });
        return () => { backHandler.remove() };
    }, []);

    useEffect(() => { //  when there is no selectedBabyId set 1st baby
        if (_.isEmpty(selectedBabyId)) {
            Init();
        }
    }, [selectedBabyId]);

    async function Init() {
        const response = await MMApiService.babyList();
        if (response.data) {
            const babyProfiles = response.data;
            MMUtils.setItemToStorage(MMEnums.storage.selectedBaby, babyProfiles[0]._id);
            dispatch(setBaby(babyProfiles[0]._id));
        }
    }

    return (
        <>
            <MMContentContainer>
                <ChapterList />
            </MMContentContainer>
        </>
    );
}

