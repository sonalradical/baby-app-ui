import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMEnums from '../../helpers/Enums';
import MMApiService from '../../services/ApiService';
import MMContentContainer from '../../components/common/ContentContainer';
import MMSpinner from '../../components/common/Spinner';
import MMPageTitle from '../../components/common/PageTitle';

export default function MilestoneList({ navigation, route }) {
    const { milestoneId } = route.params || '';
    const theme = useTheme();
    const selectedBabyId = useSelector((state) => state.AppReducer.baby);
    const [isLoading, setLoading] = useState(false);
    const [babyId, setBabyId] = useState();
    const [milestones, setMilestones] = useState([]);

    useEffect(() => {
        loadMilestoneList();
    }, [selectedBabyId]);

    const loadMilestoneList = async () => {
        setLoading(true);
        const babyId = selectedBabyId || (await MMUtils.getItemFromStorage(MMEnums.storage.selectedBaby));
        if (babyId) {
            try {
                setBabyId(babyId);
                const response = await MMApiService.getTypeList(babyId, 'milestone');
                setMilestones(response.data.milestoneList);

            } catch (error) {
                setMilestones([]);
                const serverError = MMUtils.apiErrorMessage(error);
                if (serverError) {
                    MMUtils.showToastMessage(serverError);
                }
            }
            setLoading(false);
        }
        else {
            setMilestones([]);
            setLoading(false);
        }
    }

    useEffect(() => { // call on click milestoneQuiz onSave button
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
            <TouchableOpacity style={{ flexDirection: 'column', paddingHorizontal: 22, marginVertical: 10 }} onPress={() => navigation.navigate('MilestoneQuiz', { babyId: babyId, milestoneId: item._id })}>
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
                columnWrapperStyle={{ alignContent: 'center' }}
                ListHeaderComponent={<MMPageTitle title='My First' />}
                renderItem={renderMilestone}
                keyExtractor={(item) => item._id}
                numColumns={3}
            />
        );
    };

    return (
        <MMContentContainer>
            {isLoading ? <MMSpinner /> : renderView()}
        </MMContentContainer>
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
        backgroundColor: theme.colors.secondaryContainer,
        width: Dimensions.get('window').width / 6 + 10,
        height: Dimensions.get('window').height / 12 + 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
});