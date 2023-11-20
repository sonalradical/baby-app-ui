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
import MMEnums from '../../helpers/Enums';

import MMApiService from '../../services/ApiService';
import MMSpinner from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMContentContainer from '../../components/common/ContentContainer';

export default function ChapterList() {
    const theme = useTheme();
    const navigation = useNavigation();
    const selectedBabyId = useSelector((state) => state.AppReducer.baby);
    const reloadChapterList = useSelector((state) => state.AppReducer.reloadChapterList);
    const [isLoading, setLoading] = useState(false);
    const [babyId, setBabyId] = useState();
    const [chapterList, setChapterList] = useState([]);

    useEffect(() => {
        loadChapterList();
    }, [selectedBabyId, reloadChapterList]);

    const loadChapterList = async () => {
        setLoading(true);
        const babyId = selectedBabyId || (await MMUtils.getItemFromStorage(MMEnums.storage.selectedBaby));
        if (babyId || reloadChapterList) {
            try {
                setBabyId(babyId);
                const response = await MMApiService.getTypeList(babyId, 'chapter');
                if (response.data) {
                    const chapters = _.sortBy(response.data.chapterDetail, 'position');
                    setChapterList(chapters);
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
                <Text style={[theme.fonts.headlineMedium, { textAlign: 'center', paddingBottom: 10 }]}>Chapters</Text>
                {_.map(chapterList, (chapter) => {
                    const chapterImage = MMConstants.chapters[chapter.icon];
                    return (
                        <Card style={styles(theme).whiteBg} key={chapter._id}
                            onPress={() => navigation.navigate('ChapterQuiz', { babyId: babyId, chapterId: chapter._id, title: chapter.title })}>
                            <View style={{ flexDirection: 'row', padding: 5, justifyContent: 'space-between' }}>
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
                                <View style={{ padding: 10 }}>
                                    <CircularProgress value={chapter.totalAnswers}
                                        title={`${chapter.totalAnswers} / ${chapter.totalQuestions}`}
                                        radius={30}
                                        titleStyle={theme.fonts.default}
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
    addButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    card: {
        backgroundColor: theme.colors.secondaryContainer
    },
    chip: {
        borderRadius: 20,
        padding: 5,
    },
    whiteBg: {
        flex: 0,
        borderWidth: 0,
        shadowColor: MMUtils.isPlatformAndroid() ? theme.colors.shadow : null,
        shadowOpacity: MMUtils.isPlatformAndroid() ? 0.15 : 0,
        shadowRadius: MMUtils.isPlatformAndroid() ? 50 : 0,
        marginBottom: 20,
        elevation: 10,
        borderRadius: 30,
        position: 'relative',
        backgroundColor: theme.colors.secondaryContainer
    },
    image: {
        width: Dimensions.get('window').width / 7,
        height: Dimensions.get('window').height / 10,
        borderRadius: 50,
        marginLeft: 10
    },
});