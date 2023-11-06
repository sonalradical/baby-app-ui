import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text, Title } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import MMStyles from '../../helpers/Styles';
import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMColors from '../../helpers/Colors';
import MMApiService from '../../services/ApiService';
import MMContentContainer from '../../components/common/ContentContainer';
import MMNoRecordsFound from '../../components/common/NoRecordsFound';
import { MMOverlaySpinner } from '../../components/common/Spinner';

export default function MilestoneList({ navigation, route }) {
    const selectedBabyId = useSelector((state) => state.AppReducer.selectedBaby);
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);
    const [babyId, setBabyId] = useState();
    const [milestones, setMilestones] = useState();

    useEffect(() => {
        const loadMilestoneList = async () => {
            const babyId = selectedBabyId || (await MMUtils.getItemFromStorage(MMConstants.storage.selectedBaby));
            if (babyId) {
                try {
                    setIsOverlayLoading(true);
                    setBabyId(babyId);
                    const response = await MMApiService.getTypeList(babyId, 'milestone');
                    if (response.data) {
                        const milestone = response.data.milestoneList;
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
            else {
                MMUtils.showToastMessage('No Data found')
            }
        }
        loadMilestoneList();
    }, []);

    const renderMilestone = ({ item }) => {
        const milestoneImage = MMConstants.milestones[item.icon];
        return (
            <TouchableOpacity style={{ flexDirection: 'column' }} onPress={() => navigation.navigate('MilestoneQuiz', { babyId: babyId, milestoneId: item._id })}>
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
            </TouchableOpacity>
        );
    };

    const renderView = () => {
        return (
            <FlatList
                data={milestones}
                columnWrapperStyle={[MMStyles.m20, { justifyContent: 'space-between' }]}
                ListHeaderComponent={<Text style={[MMStyles.cardHeaderText, MMStyles.mt10]}>My first</Text>}
                renderItem={renderMilestone}
                keyExtractor={(item) => item._id}
                numColumns={3}
            />
        );
    };

    return (
        <>
            <MMContentContainer>
                {!_.isEmpty(milestones) ? renderView() : <MMNoRecordsFound title={'No Milestone Found.'} />}
            </MMContentContainer>
            <MMOverlaySpinner visible={isOverlayLoading} />
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