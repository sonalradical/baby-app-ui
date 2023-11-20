import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';

import MMContentContainer from '../../components/common/ContentContainer';
import ChapterList from '../chapter/ChapterList';

export default function Home() {

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            BackHandler.exitApp();
        });
        return () => { backHandler.remove() };
    }, []);

    return (
        <>
            <MMContentContainer>
                <ChapterList />
            </MMContentContainer>
        </>
    );
}

