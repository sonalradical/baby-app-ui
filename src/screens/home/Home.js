import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import PropTypes from 'prop-types';

import MMContentContainer from '../../components/common/ContentContainer';
import ChapterList from '../chapter/ChapterList';

export default function Home() {

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

const styles = StyleSheet.create({
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarIcon: {
        backgroundColor: 'transparent',
    },
});