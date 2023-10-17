import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import MMStyles from '../../helpers/Styles';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMAppbarHeader from '../../components/common/AppbarHeader';
import MMBabyProfileModal from '../babyProfile/BabyProfileModal';


export default function Home({ navigation, route }) {
    const { babyDetail } = route.params || '';
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onAvatarPress = () => {
        setIsModalOpen(true);

    };

    const renderView = () => {
        return (
            <View style={MMStyles.containerPadding}>
            </View>
        );
    };

    return (
        <>
            <MMAppbarHeader onAvatarPress={() => onAvatarPress()} babyDetail={babyDetail} />
            <MMBabyProfileModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} selectedBaby={babyDetail} />
            <View style={MMStyles.container}>
                {renderView()}
                <MMOverlaySpinner visible={isOverlayLoading} />
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