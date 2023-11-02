import React, { useEffect, useState } from 'react';
import { Card, Text, Title } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';

import MMStyles from '../../helpers/Styles';
import MMUtils from '../../helpers/Utils';
import MMApiService from '../../services/ApiService';
import MMContentContainer from '../../components/common/ContentContainer';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';
import MMConstants from '../../helpers/Constants';
import MMColors from '../../helpers/Colors';

export default function MilestoneList({ navigation, route }) {
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);
    const [milestones, setMilestones] = useState();

    useEffect(() => {
        const loadMilestoneList = async () => {
            try {
                setIsOverlayLoading(true);
                const response = await MMApiService.getMilestoneList();
                if (response.data) {
                    const milestone = response.data;
                    setMilestones(milestone);
                    setIsOverlayLoading(false);
                }
            } catch (error) {
                setMilestones();
                const serverError = MMUtils.apiErrorMessage(error);
                if (serverError) {
                    MMUtils.showToastMessage(serverError);
                }
                setIsOverlayLoading(false);
            }
        }
        loadMilestoneList();
    }, []);

    const renderMilestone = ({ item }) => {
        const milestoneImage = MMConstants.milestones[item.icon];
        return (
            <View style={{ flexDirection: 'column' }}>
                <View style={styles.imageView}>
                    <Image
                        textAlign="center"
                        resizeMode="contain"
                        source={milestoneImage}
                        style={styles.image}
                    />
                </View>
                <Text style={[MMStyles.labelTitle, MMStyles.h6, MMStyles.mt5, { width: 80, textAlign: 'center' }]} numberOfLines={1} ellipsizeMode='tail'>
                    {item.title}</Text>
            </View>
        );
    };

    const renderView = () => {
        return (
            <FlatList
                data={milestones}
                columnWrapperStyle={{ justifyContent: 'space-between', margin: 20 }}
                ListHeaderComponent={<Text style={[MMStyles.cardHeaderText, { marginTop: 10 }]}>My first</Text>}
                renderItem={renderMilestone}
                keyExtractor={(item) => item._id}
                numColumns={3} // This sets the number of columns
            />
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

MilestoneList.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').width / 6,
        height: Dimensions.get('window').height / 12,
        borderRadius: 50,
    },
    imageView: {
        borderRadius: 50,
        backgroundColor: MMColors.white,
        width: Dimensions.get('window').width / 6 + 10,
        height: Dimensions.get('window').height / 12 + 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
});