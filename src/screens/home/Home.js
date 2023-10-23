import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import MMStyles from '../../helpers/Styles';


export default function Home({ navigation, route }) {



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