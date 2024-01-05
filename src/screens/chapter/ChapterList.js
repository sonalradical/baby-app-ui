import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import _ from 'lodash';
import { useSelector } from 'react-redux';
import CircularProgress, {
    CircularProgressWithChild,
} from 'react-native-circular-progress-indicator';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';

import MMApiService from '../../services/ApiService';
import MMSpinner from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMPageTitle from '../../components/common/PageTitle';
import MMPicture from '../../components/common/Picture';

export default function ChapterList() {
    const theme = useTheme();
    const navigation = useNavigation();
    const selectedBaby = useSelector((state) => state.AppReducer.baby);
    const reloadChapterList = useSelector((state) => state.AppReducer.reloadChapterList);
    const [isLoading, setLoading] = useState(true);
    const [chapterList, setChapterList] = useState([]);

    useEffect(() => {
        getTypeList();
    }, [selectedBaby, reloadChapterList]);

    const getTypeList = async () => {
        setLoading(true);
        if (selectedBaby || reloadChapterList) {
            try {
                const { data } = await MMApiService.getTypeList(selectedBaby._id, 'chapter');
                if (data) {
                    setChapterList(data.chapterDetail);
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
            setChapterList([]);
            setLoading(false);
        }
    }

    const whiteBg = styles(theme).whiteBg;
    const image = styles(theme).image;

    const paddingVertical = MMUtils.isPlatformAndroid() ? 22 : 25;

    const renderView = () => {
        return (
            <>
                <MMPageTitle title='Chapters' />
                {_.map(chapterList, (chapter) => {
                    const chapterImage = MMUtils.getImagePath(`Chapter/${chapter.icon}.png`);
                    return (
                        <Card style={whiteBg} key={chapter._id}
                            onPress={() => navigation.navigate(MMConstants.screens.chapterQuiz, {
                                babyId: selectedBaby._id, chapterId: chapter._id,
                                chapterTitle: chapter.title, chapterImage: chapterImage
                            })}>
                            <View style={{ flexDirection: 'row', padding: MMConstants.paddingMedium, justifyContent: 'space-between' }}>
                                <MMPicture
                                    textAlign="center"
                                    resizeMode="contain"
                                    pictureUri={chapterImage}
                                    style={image}
                                />
                                <View style={{ paddingVertical }}>
                                    <Text style={[theme.fonts.labelLarge, { width: 150 }]} numberOfLines={1} ellipsizeMode='tail'>
                                        {chapter.title}</Text>
                                    <Text style={theme.fonts.labelMedium} numberOfLines={1} ellipsizeMode='tail'>
                                        {`You've grown and learnt`}</Text>
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
        <MMScrollView>
            {isLoading ? <MMSpinner /> : renderView()}
        </MMScrollView>
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