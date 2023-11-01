import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Dimensions, Image, ScrollView, Keyboard } from 'react-native';
import { Appbar, Badge, Card, Chip, Text } from 'react-native-paper';
import CircularProgress, {
    CircularProgressWithChild,
} from 'react-native-circular-progress-indicator';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';


import MMStyles from '../../helpers/Styles';
import MMUtils from '../../helpers/Utils';
import MMColors from '../../helpers/Colors';
import MMConstants from '../../helpers/Constants';

import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMNoRecordsFound from '../../components/common/NoRecordsFound';
import MMContentContainer from '../../components/common/ContentContainer';

export default function ChapterList({ route }) {
    const selectedBabyId = useSelector((state) => state.AppReducer.selectedBaby);
    const navigation = useNavigation();
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);
    const [babyId, setBabyId] = useState();
    const [state, setState] = useState({
        query: '',
        filteredChapter: [],
        chapterList: [],
        selectedChapterType: 'all'
    });

    useEffect(() => {
        const loadChapterList = async () => {
            const babyId = selectedBabyId || (await MMUtils.getItemFromStorage(MMConstants.storage.selectedBaby));
            setBabyId(babyId);
            if (babyId) {
                try {
                    console.log(babyId, 'babyId')
                    setIsOverlayLoading(true);
                    const response = await MMApiService.getChapterList(babyId, 'chapter');
                    if (response.data) {
                        const chapters = response.data.chapterDetail
                        setState({
                            ...state,
                            query: '',
                            chapterList: chapters,
                        });
                        setIsOverlayLoading(false);
                    }
                } catch (error) {
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
        loadChapterList();
    }, [selectedBabyId, MMConstants.storage.selectedBaby]);


    const renderView = () => {
        return (
            <>
                <Text style={[MMStyles.cardHeaderText, MMStyles.mb10, { flex: 1 }]}>Chapters</Text>
                {_.map(state.chapterList, (chapter) => {
                    const iconData = MMConstants.chapters.find((ch) => ch.value === chapter.icon);
                    return (
                        <Card style={styles.whiteBg} key={chapter._id}
                            onPress={() => navigation.navigate('Quiz', { babyId: babyId, chapterId: chapter._id })}>
                            <View style={[MMStyles.m10, { flexDirection: 'row' }]}>
                                <View style={styles.imageView}>
                                    <Image
                                        textAlign="center"
                                        resizeMode="contain"
                                        source={iconData.url}
                                        style={styles.image}
                                    />
                                </View>
                                <View style={[MMStyles.m15, MMStyles.flex1]}>
                                    <Text style={[MMStyles.labelTitle, MMStyles.h3]} numberOfLines={1} ellipsizeMode='tail'>
                                        {chapter.title}</Text>
                                    <Text style={[MMStyles.labelTitle, MMStyles.h7]} numberOfLines={1} ellipsizeMode='tail'>
                                        {'You’ve grown and learnt'}</Text>
                                </View>
                                <View style={MMStyles.mt10}>
                                    <CircularProgress value={chapter.totalAnswers}
                                        title={`${chapter.totalAnswers} / ${chapter.totalQuestions}`}
                                        radius={30}
                                        titleStyle={[MMStyles.labelTitle, MMStyles.h6]}
                                        activeStrokeWidth={5}
                                        inActiveStrokeWidth={5}
                                        activeStrokeColor={iconData.color}
                                        showProgressValue={false}
                                        maxValue={chapter.totalQuestions}
                                    />
                                </View>
                            </View>
                        </Card>
                    )
                })}
            </>
        );
    };

    return (
        <>
            <MMContentContainer>
                <MMScrollView>
                    {!_.isEmpty(state.chapterList) ? renderView() : <MMNoRecordsFound title={'No Chapter Found'} />}
                </MMScrollView>
                <MMOverlaySpinner visible={isOverlayLoading} />
            </MMContentContainer>
        </>
    );
}

ChapterList.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = StyleSheet.create({
    addButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    card: {
        backgroundColor: MMColors.white
    },
    chip: {
        borderRadius: 20,
        padding: 5,
    },
    whiteBg: {
        flex: 0,
        borderWidth: 0,
        shadowColor: MMColors.black,
        shadowOpacity: 0.15,
        shadowRadius: 50,
        marginBottom: 20,
        elevation: 10,
        borderRadius: 30,
        position: 'relative',
        backgroundColor: MMColors.white
    },
    image: {
        width: Dimensions.get('window').width / 8,
        height: Dimensions.get('window').height / 15,
        borderRadius: 50,
    },
    imageView: {
        borderRadius: 50,
        backgroundColor: MMColors.backgroundColor,
        width: Dimensions.get('window').width / 8 + 10,
        height: Dimensions.get('window').height / 15 + 10,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5
    }
});