import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, ScrollView, Keyboard } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MMStyles from '../../helpers/Styles';
import MMUtils from '../../helpers/Utils';
import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import { Appbar, Badge, Button, Card, Chip, Divider, IconButton, Paragraph, Text, Title } from 'react-native-paper';
import MMColors from '../../helpers/Colors';
import MMSearchbar from '../../components/common/Searchbar';
import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';
import MMButton from '../../components/common/Button';

export default function ChapterList({ navigation, route }) {
    const { babyId } = route.params;

    const [isOverlayLoading, setIsOverlayLoading] = useState(false);
    const [state, setState] = useState({
        query: '',
        filteredChapter: [],
        chapterList: [],
        selectedChapterType: 'all'
    });

    const imageMapping = {
        pregnancy: require('../../assets/images/pregnancy.png'),
        adoption: require('../../assets/images/adoption.png'),
        surrogacy: require('../../assets/images/surrogacy.png'),
        WelcomeToTheWorld: require('../../assets/images/WelcomeToTheWorld.png'),
        oneMonth: require('../../assets/images/oneMonth.png'),
        twoMonth: require('../../assets/images/twoMonth.png'),
    };

    useEffect(() => {
        const loadChapterList = async () => {
            if (babyId) {
                try {
                    setIsOverlayLoading(true);
                    const response = await MMApiService.getChapterList(babyId);
                    if (response.data) {
                        const chapters = response.data.chapterDetail;
                        setState({
                            ...state,
                            query: '',
                            filteredChapter: chapters,
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
        }
        loadChapterList();
    }, [babyId]);


    const onChangeSearch = (query) => {
        if (_.isEmpty(query)) {
            setState({
                ...state,
                query: '',
                filteredChapter: state.chapterList,
                selectedChapterType: ''
            });
        } else {
            const filterQuery = {
                'title': query,
            }
            const filteredValues = MMUtils.filterDataByQuery(state.chapterList, filterQuery);

            setState({
                ...state,
                query: query,
                filteredChapter: filteredValues,
                selectedChapterType: ''
            });
        }
        return true;
    };

    const onChipPress = (chapterType) => {
        Keyboard.dismiss();
        let filteredChapter;

        if (chapterType === 'all') {
            filteredChapter = state.chapterList;
        } else {
            filteredChapter = state.chapterList.filter((chapter) => chapter.chapterType === chapterType);
        }
        setState({ ...state, query: '', filteredChapter, selectedChapterType: chapterType });
    };

    const renderView = () => {
        return (
            <View style={MMStyles.containerPadding}>
                {_.map(state.filteredChapter, (chapter) => {
                    const localImage = imageMapping[chapter.icon];
                    return (
                        <Card key={chapter._id} style={styles.card}>
                            <Image
                                textAlign="center"
                                resizeMode="contain"
                                style={[MMStyles.responsiveImage, { height: Dimensions.get('window').height / 6, }]}
                                source={localImage}
                            />
                            {
                                chapter.totalPages > 0 ?
                                    <Badge style={styles.addButton}>{chapter.totalPages}</Badge> :
                                    <MMIcon iconName='plus' iconSize={20} style={styles.addButton} />
                            }
                            <Divider />
                            <Card.Content>
                                <Title>{chapter.title}</Title>
                                <Paragraph>{chapter.description}</Paragraph>
                                <Button mode='outlined' style={{ width: '40%' }} onPress={() => navigation.navigate('Quiz')}>Quiz</Button>
                            </Card.Content>
                        </Card>
                    )
                })}
            </View>
        );
    };

    const renderSearchbar = () => {
        return (
            <View>
                <MMSearchbar value={state.query} onChangeText={onChangeSearch} />
            </View>
        );
    };


    const renderScreenHeader = () => {
        return (
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Content title='Milestones' />
            </Appbar.Header>
        );
    };

    const renderChipScrollView = () => {
        return (
            <View style={MMStyles.mb10}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {MMConstants.chapterChip.map((chapter, index) => (
                        <Chip
                            key={chapter.value}
                            style={[styles.chip, { marginLeft: 10 }]}
                            onPress={() => onChipPress(chapter.value)}
                            selected={chapter.value === state.selectedChapterType}
                        >
                            {chapter.label}
                        </Chip>
                    ))}
                </ScrollView>
            </View>
        )
    }

    return (
        <>
            {renderScreenHeader()}
            <View style={MMStyles.container}>
                <MMScrollView>
                    {renderChipScrollView()}
                    {renderSearchbar()}
                    {renderView()}
                </MMScrollView>
                <MMOverlaySpinner visible={isOverlayLoading} />
            </View>
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
        margin: 10,
        backgroundColor: MMColors.white
    },
    chip: {
        borderRadius: 20,
        padding: 5,
    },
});