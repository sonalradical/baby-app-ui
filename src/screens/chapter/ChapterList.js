import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import _ from 'lodash';
import { useSelector } from 'react-redux';
import CircularProgress, {
    CircularProgressWithChild,
} from 'react-native-circular-progress-indicator';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';

import MMApiService from '../../services/ApiService';
import MMSpinner from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMContentContainer from '../../components/common/ContentContainer';
import MMPageTitle from '../../components/common/PageTitle';

export default function ChapterList() {
    const theme = useTheme();
    const navigation = useNavigation();
    const selectedBaby = useSelector((state) => state.AppReducer.baby);
    const reloadChapterList = useSelector((state) => state.AppReducer.reloadChapterList);
    const [isLoading, setLoading] = useState(true);
    const [chapterList, setChapterList] = useState([]);

    useEffect(() => {
        loadChapterList();
    }, [selectedBaby, reloadChapterList]);

    const loadChapterList = async () => {
        setLoading(true);
        if (selectedBaby || reloadChapterList) {
            try {
                const response = await MMApiService.getTypeList(selectedBaby._id, 'chapter');
                if (response.data) {
                    setChapterList(response.data.chapterDetail);
                }
            } catch (error) {
                setChapterList();
                const serverError = MMUtils.apiErrorMessage(error);
                if (serverError) {
                    MMUtils.showToastMessage(serverError);
                }
            }
            setLoading(false);
        }
        else {
            setChapterList();
            setLoading(false);
        }
    }


    const renderView = () => {
        return (
            <>
                <MMPageTitle title='Chapters' />
                {_.map(chapterList, (chapter) => {
                    const chapterImage = MMConstants.chapters[chapter.icon];
                    return (
                        <Card style={styles(theme).whiteBg} key={chapter._id}
                            onPress={() => navigation.navigate('ChapterQuiz', {
                                babyId: selectedBaby._id, chapterId: chapter._id,
                                chapter: chapter, chapterImage: chapterImage
                            })}>
                            <View style={{ flexDirection: 'row', padding: MMConstants.paddingMedium, justifyContent: 'space-between' }}>
                                <Image
                                    textAlign="center"
                                    resizeMode="contain"
                                    source={chapterImage}
                                    style={styles(theme).image}
                                />
                                <View style={[MMUtils.isPlatformAndroid() ? { paddingVertical: 22 } : { paddingVertical: 25 }]}>
                                    <Text style={[theme.fonts.labelLarge, { width: 150 }]} numberOfLines={1} ellipsizeMode='tail'>
                                        {chapter.title}</Text>
                                    <Text style={theme.fonts.labelMedium} numberOfLines={1} ellipsizeMode='tail'>
                                        {'You’ve grown and learnt'}</Text>
                                </View>
                                <View style={{ padding: MMConstants.paddingLarge }}>
                                    <CircularProgress value={chapter.totalAnswers}
                                        title={`${chapter.totalAnswers} / ${chapter.totalQuestions}`}
                                        radius={30}
                                        titleStyle={theme.fonts.labelMedium}
                                        activeStrokeWidth={5}
                                        inActiveStrokeWidth={5}
                                        activeStrokeColor={chapter.color}
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
        <MMContentContainer>
            <MMScrollView>
                {isLoading ? <MMSpinner /> : renderView()}
            </MMScrollView>
        </MMContentContainer>
    );
}

const styles = (theme) => StyleSheet.create({
    whiteBg: {
        flex: 0,
        borderWidth: 0,
        shadowColor: MMUtils.isPlatformAndroid() ? theme.colors.shadow : null,
        shadowOpacity: MMUtils.isPlatformAndroid() ? 0.15 : 0,
        shadowRadius: MMUtils.isPlatformAndroid() ? 50 : 0,
        marginBottom: MMConstants.marginLarge,
        elevation: 10,
        borderRadius: 30,
        position: 'relative',
        backgroundColor: theme.colors.secondaryContainer
    },
    image: {
        width: Dimensions.get('window').width / 7,
        height: Dimensions.get('window').height / 10,
        borderRadius: 50,
        marginLeft: MMConstants.marginMedium
    },
});