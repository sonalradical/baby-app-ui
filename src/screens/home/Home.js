import React, { useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { setHeaderTitle } from '../../redux/Slice/AppSlice';

import MMContentContainer from '../../components/common/ContentContainer';
import ChapterList from '../chapter/ChapterList';

export default function Home({ navigation, route }) {
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            dispatch(setHeaderTitle(''));
        }, [dispatch])
    );

    const renderView = () => {
        return (
            <>
                <ChapterList />
                {/* <Button onPress={() => navigation.navigate('Logout')}>click</Button> */}
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