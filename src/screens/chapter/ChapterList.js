import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, ScrollView, Keyboard } from 'react-native';
import { Appbar, Badge, Card, Chip, Text } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import MMStyles from '../../helpers/Styles';
import MMUtils from '../../helpers/Utils';
import MMColors from '../../helpers/Colors';
import MMConstants from '../../helpers/Constants';

import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMSearchbar from '../../components/common/Searchbar';
import MMIcon from '../../components/common/Icon';
import MMNoRecordsFound from '../../components/common/NoRecordsFound';

export default function ChapterList({ route }) {
    const navigation = useNavigation();
    const selectedBabyId = useSelector((state) => state.AppReducer.selectedBaby);
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);
    const [babyId, setBabyId] = useState();
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
            const babyId = selectedBabyId || (await MMUtils.getItemFromStorage(MMConstants.storage.selectedBaby));
            if (babyId) {
                try {
                    setIsOverlayLoading(true);
                    setBabyId(babyId);
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
            else {
                console.log(state.filteredChapter, 'state.filteredChapter')
                MMUtils.showToastMessage('No Data found')
            }
        }
        loadChapterList();
    }, [selectedBabyId, MMConstants.storage.selectedBaby]);


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
                        <Card style={styles.whiteBg} key={chapter._id}>
                            <Card.Content >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        textAlign="center"
                                        resizeMode="contain"
                                        source={localImage}
                                        style={{ width: Dimensions.get('window').width / 5, height: Dimensions.get('window').height / 8 }}
                                    />
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        <Text style={[MMStyles.cardSubHeaderText, MMStyles.h5]}>{chapter.title}</Text>
                                        <Text>{chapter.description}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-around', height: Dimensions.get('window').height / 8 }}>
                                        <Badge size={30} style={{ backgroundColor: MMColors.orange }}>1</Badge>
                                        <Badge size={30} style={{ backgroundColor: MMColors.orange }}>2</Badge>
                                        <Badge size={30} style={{ backgroundColor: MMColors.orange }} onPress={() => navigation.navigate('Quiz', { babyId: babyId, chapterId: chapter._id })}>
                                            <MMIcon iconName='question' size={24} /></Badge>
                                    </View>
                                </View>
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
                <Appbar.Content title='Milestones' style={{ alignItems: 'center' }} />
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
            {/* {renderScreenHeader()} */}
            <View style={MMStyles.container}>
                <MMScrollView>
                    {renderChipScrollView()}
                    {renderSearchbar()}
                    {!_.isEmpty(state.filteredChapter) ? renderView() : <MMNoRecordsFound title={'No Chapter Found'} />}
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
    whiteBg: {
        flex: 0,
        borderWidth: 0,
        shadowColor: MMColors.black,
        shadowOpacity: 0.15,
        shadowRadius: 50,
        marginBottom: 20,
        elevation: 10,
        borderRadius: 20,
        position: 'relative',
        backgroundColor: MMColors.white
    },
});