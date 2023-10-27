import React, { useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { setHeaderTitle } from '../../redux/Slice/AppSlice';

import MMStyles from '../../helpers/Styles';

export default function Home({ navigation, route }) {
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            dispatch(setHeaderTitle(''));
        }, [dispatch])
    );

    const renderView = () => {
        return (
            <View style={MMStyles.containerPadding}>
            </View>
        );
    };

    return (
        <>
            <View style={MMStyles.container}>
                {renderView()}
            </View>
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