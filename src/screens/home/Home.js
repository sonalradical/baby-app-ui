import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { setHeader } from '../../redux/Slice/AppSlice';

import MMContentContainer from '../../components/common/ContentContainer';
import ChapterList from '../chapter/ChapterList';

export default function Home() {
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            dispatch(setHeader(''));
        }, [dispatch])
    );

    const renderView = () => {
        return (
            <>
                <ChapterList />
            </>
        );
    };

    return (
        <>
            <MMContentContainer>
                {renderView()}
            </MMContentContainer>
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