import React, { useEffect, useRef, useState } from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import MMUtils from '../../helpers/Utils';
import MMApiService from '../../services/ApiService';
import MMSurface from '../../components/common/Surface';
import MMSpinner from '../../components/common/Spinner';
import { Avatar, List, Text, useTheme } from 'react-native-paper';
import { FlatList, Keyboard, StyleSheet, View } from 'react-native';
import MMConstants from '../../helpers/Constants';
import Icon from 'react-native-vector-icons/Feather';
import CommonTemplate from '../../components/common/CommonTemplate';
import MMContentContainer from '../../components/common/ContentContainer';

export default function BookPreview({ updateFooterVisibility }) {
    const theme = useTheme();
    const navigation = useNavigation();
    const flatListRef = useRef(null);
    const selectedBaby = useSelector((state) => state.AppReducer.baby);
    const reloadBookPage = useSelector((state) => state.AppReducer.reloadBookPage)
    const lookupData = useSelector((state) => state.AuthReducer.lookupData);
    const [isLoading, setLoading] = useState(true);
    const [bookData, setBookData] = useState([]);
    const [isScrollingUp, setIsScrollingUp] = useState(true);

    useEffect(() => {
        if (selectedBaby || reloadBookPage) {
            loadBookPreview();
        }
    }, [selectedBaby, reloadBookPage]);

    const loadBookPreview = async () => {
        setLoading(true);
        try {
            const response = await MMApiService.getBookPreview(selectedBaby._id);
            if (response.data) {
                const filteredData = _.filter(response.data, (item) => {
                    return item?.pageDetails?.[0]?.questionId?.questionType !== 'milestone';
                });
                setBookData(filteredData);
            }
        } catch (error) {
            const serverError = MMUtils.apiErrorMessage(error);
            if (serverError) {
                MMUtils.showToastMessage(serverError);
            }
        }
        setLoading(false);
    };

    const handleScroll = (event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const previousOffset = flatListRef.current ? flatListRef.current : 0;
        setIsScrollingUp(currentOffset <= previousOffset);
        flatListRef.current = currentOffset;
    };

    const handleScrollEndDrag = () => {
        updateFooterVisibility(isScrollingUp);
    };

    const onPressAdd = (currentPosition) => {
        let nextItemPosition = currentPosition + 10;
        const currentIndex = bookData.findIndex((item) => item.position === currentPosition);
        if (currentIndex < bookData.length - 1) {
            const nextItem = bookData[currentIndex + 1];
            nextItemPosition = nextItem.position;
        }
        const pagePosition = (currentPosition + nextItemPosition) / 2;
        navigation.navigate('TemplateList', { position: pagePosition })
    };

    const onPressEdit = (bookData, template) => {
        navigation.navigate('MainTemplate', {
            position: bookData.position,
            templateName: template.code, templateId: bookData.templateId, pageDetails: bookData.pageDetails, pageId: bookData._id
        })
    };

    const renderQuestionAnswerList = (item, index) => {
        return (
            <List.Item
                key={index}
                title={item.questionId.question}
                titleNumberOfLines={2}
                titleStyle={theme.fonts.titleMedium}
                description={`Answer: ${item.questionId.questionType != 'milestone' ? item.answer : null}`}
                descriptionNumberOfLines={20}
                descriptionStyle={[theme.fonts.default, { paddingTop: MMConstants.paddingLarge, lineHeight: 25 }]}
            />
        );
    };

    const renderTemplatePage = (template, pageDetails) => {
        const customPageDetails = _.map(pageDetails, (pageDetail, index) => {
            pageDetail.source = MMUtils.getImagePath(pageDetail.value);
            return pageDetail;
        });
        return (
            <CommonTemplate borderWidth={0} onPickImage={null} templateData={customPageDetails} isDisable={true}
                templateName={template.code} onSetTemplateData={null} />
        )
    };

    const renderNoData = () => {
        return (
            <MMSurface>
                <Text>No data found ! please add some chapters </Text>
            </MMSurface>
        )
    }

    const renderBookData = (item, index) => {
        if (!bookData || bookData.length === 0) return null;
        const isTemplate = item?.templateId ? true : false;
        const chapterImage = !isTemplate && item?.icon ? MMConstants.chapters[item.icon] : null;
        const template = isTemplate ? _.find(lookupData.template, { '_id': item?.templateId }) : null;
        return (
            <>
                <MMSurface key={item._id} margin={[0, 0, 0, 0]} padding={[0, 0, 0, 0]}>
                    {isTemplate ?
                        renderTemplatePage(template, item.pageDetails) :
                        (
                            <>
                                <View style={[styles(theme).title, { backgroundColor: item.color }]}>
                                    <Avatar.Image size={36} source={chapterImage} style={{ backgroundColor: theme.colors.secondaryContainer }} />
                                    <Text style={[theme.fonts.titleLarge, { marginLeft: MMConstants.marginLarge }]}>{item.title}</Text>
                                </View>
                                {_.map(item.pageDetails, (i, index) => {
                                    return renderQuestionAnswerList(i, index);
                                })}
                            </>
                        )
                    }
                </MMSurface>
                <View style={{ flexDirection: 'row', padding: MMConstants.marginMedium, marginBottom: bookData.length === index + 1 ? 10 : 0 }}>
                    <Icon name={'plus'} size={30} color={theme.colors.text.primary} onPress={() => onPressAdd(item.position)} />
                    {isTemplate ?
                        <Icon name={'edit-2'} size={24} color={theme.colors.text.primary}
                            onPress={() => onPressEdit(item, template)} style={{ marginLeft: 15, marginTop: MMConstants.marginSmall }} /> : null}
                    <View style={{ flexDirection: 'row-reverse', flex: 1 }}>
                        <Text>Page {index + 1}</Text>
                    </View>
                </View>
            </>
        );
    };

    const renderView = () => {
        return (
            <FlatList
                data={bookData}
                renderItem={({ item, index }) => {
                    return renderBookData(item, index);
                }}
                keyExtractor={(item, index) => {
                    return item._id;
                }}
                onScroll={handleScroll}
                onScrollEndDrag={handleScrollEndDrag}
                onMomentumScrollBegin={Keyboard.dismiss}
                keyboardShouldPersistTaps={'handled'}
                enableEmptySections={true}
            />
        );
    };

    return (
        <>
            <MMContentContainer>
                {!bookData || bookData.length === 0 ? renderNoData() : null}
            </MMContentContainer>
            <View style={{ backgroundColor: theme.colors.background }}>
                {isLoading ? <MMSpinner /> : renderView()}
            </View>
        </>
    );
}

BookPreview.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = (theme) => StyleSheet.create({
    title: {
        flexDirection: 'row',
        padding: MMConstants.paddingLarge
    }
});