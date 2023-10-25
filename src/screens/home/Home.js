import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import MMStyles from '../../helpers/Styles';
import { Button } from 'react-native-paper';


export default function Home({ navigation, route }) {



    const renderView = () => {
        return (
            <View style={MMStyles.containerPadding}>
                <Button onPress={() => navigation.navigate('Logout')}>click</Button>
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