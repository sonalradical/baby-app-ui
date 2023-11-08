import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text, Title, useTheme } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import MMContentContainer from '../../components/common/ContentContainer';
import MMNoRecordsFound from '../../components/common/NoRecordsFound';
import { MMOverlaySpinner } from '../../components/common/Spinner';

export default function MilestoneList({ navigation, route }) {
    const theme = useTheme();
    const selectedBabyId = useSelector((state) => state.AppReducer.selectedBaby);
    const { milestoneId } = route.params || '';
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
                setMilestones();
                setIsOverlayLoading(false);
            }
        }
        loadMilestoneList();
    }, [selectedBabyId, MMConstants.storage.selectedBaby]);

    useEffect(() => {
        if (milestoneId) {
            const updatedMilestones = _.map(milestones, milestone => {
                if (milestone._id === milestoneId) {
                    return { ...milestone, status: 'complete' };
                }
                return milestone;
            });
            setMilestones(updatedMilestones);
        }
    }, [milestoneId]);


    const renderMilestone = ({ item }) => {
        const milestoneImage = MMConstants.milestones[item.icon];
        return (
            <TouchableOpacity style={{ flexDirection: 'column' }} onPress={() => navigation.navigate('MilestoneQuiz', { babyId: babyId, milestoneId: item._id })}>
                <View style={[styles(theme).imageView, item.status === 'complete' ? { opacity: 0.5 } : null]}>
                    <Image
                        textAlign="center"
                        resizeMode="contain"
                        source={milestoneImage}
                        style={styles(theme).image}
                    />
                </View>
                <Text style={[theme.fonts.default, styles(theme).milestone]} numberOfLines={1} ellipsizeMode='tail'>
                    {item.title}</Text>
            </TouchableOpacity>
        );
    };

    const renderView = () => {
        return (
            <FlatList
                data={milestones}
                columnWrapperStyle={{ justifyContent: 'space-between', margin: 20 }}
                ListHeaderComponent={<Text style={[theme.fonts.headlineMedium, { flex: 1, textAlign: 'center', marginBottom: 10 }]}>My first</Text>}
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

const styles = (theme) => StyleSheet.create({
    milestone: {
        color: theme.colors.text.primary,
        width: 80,
        textAlign: 'center',
        marginTop: 5
    },
    image: {
        width: Dimensions.get('window').width / 6,
        height: Dimensions.get('window').height / 12,
        borderRadius: 50,
    },
    imageView: {
        borderRadius: 50,
        backgroundColor: theme.colors.onPrimary,
        width: Dimensions.get('window').width / 6 + 10,
        height: Dimensions.get('window').height / 12 + 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
});