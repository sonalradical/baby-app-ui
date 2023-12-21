import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
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
import { useNavigation } from '@react-navigation/native';

export default function MilestoneList({ route, updateFooterVisibility }) {
    const navigation = useNavigation();
    const { milestoneId } = route.params || '';
    const theme = useTheme();
    const flatListRef = useRef(null);
    const selectedBaby = useSelector((state) => state.AppReducer.baby);
    const [isLoading, setLoading] = useState(true);
    const [milestones, setMilestones] = useState([]);
    const [isScrollingUp, setIsScrollingUp] = useState(true);

    useEffect(() => {
        loadMilestoneList();
    }, [selectedBaby]);

    const handleScroll = (event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const previousOffset = flatListRef.current ? flatListRef.current : 0;
        setIsScrollingUp(currentOffset <= previousOffset);
        flatListRef.current = currentOffset;
    };

    const handleScrollEndDrag = () => {
        updateFooterVisibility(isScrollingUp);
    };

    const loadMilestoneList = async () => {
        setLoading(true);
        if (selectedBaby) {
            try {
                const response = await MMApiService.getTypeList(selectedBaby._id, 'milestone');
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
            <TouchableOpacity style={{ flexDirection: 'column', paddingHorizontal: 22, marginVertical: MMConstants.marginMedium }}
                onPress={() => navigation.navigate('MilestoneQuiz', { babyId: selectedBaby._id, milestoneId: item._id })}>
                <Image
                    textAlign="center"
                    resizeMode="contain"
                    source={milestoneImage}
                    style={styles(theme).image}
                />
                <Text style={[theme.fonts.default, styles(theme).milestone]} numberOfLines={undefined} ellipsizeMode='tail'>
                    {item.title}</Text>
            </TouchableOpacity>
        );
    };

    const renderView = () => {
        return (
            <FlatList
                ref={flatListRef}
                data={milestones}
                ListHeaderComponent={<MMPageTitle title='My First' />}
                renderItem={renderMilestone}
                keyExtractor={(item) => item._id}
                numColumns={3}
                onScroll={handleScroll}
                onScrollEndDrag={handleScrollEndDrag}
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
        textAlign: 'center',
        width: 80,
        marginTop: MMConstants.marginSmall
    },
    image: {
        width: Dimensions.get('window').width / 5,
        height: Dimensions.get('window').height / 10,
        borderRadius: 50,
        alignSelf: 'center'
    },
});