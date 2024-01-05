import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, TouchableOpacity, View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';

import { useNavigation } from '@react-navigation/native';

import MMConstants from '../../helpers/Constants';
import MMUtils from '../../helpers/Utils';
import MMApiService from '../../services/ApiService';
import MMCommonTemplate from '../../components/common/CommonTemplate';
import MMContentContainer from '../../components/common/ContentContainer';
import MMRoundBackground from '../../components/common/RoundBackground';
import MMSpinner from '../../components/common/Spinner';
import MMSurface from '../../components/common/Surface';
import Parents from './Parents';
import Baby from './Baby';
import MMEnums from '../../helpers/Enums';
import WelcomeToWorld from './WelcomeToWorld';

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
            getBookPreview();
        }
    }, [selectedBaby, reloadBookPage]);

    const getBookPreview = async () => {
        setLoading(true);
        try {
            const { data } = await MMApiService.getBookPreview(selectedBaby._id);
            if (data) {
                const filteredData = _.filter(data, (item) => {
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

    const onPressAdd = (currentPosition, itemId, itemTitle) => {
        let previousItemPosition = currentPosition - 10;
        const currentIndex = bookData.findIndex((item) => item._id === itemId);
        if (currentIndex > 0) {
            const perviousItem = bookData[currentIndex - 1];
            previousItemPosition = perviousItem.position;
        }
        const pagePosition = (currentPosition + previousItemPosition) / 2;
        navigation.navigate('TemplateList', { position: pagePosition, itemTitle: itemTitle })
    };

    const onPressEdit = (bookData, template) => {
        navigation.navigate('MainTemplate', {
            position: bookData.position,
            templateName: template.code, templateId: bookData.templateId, pageDetails: bookData.pageDetails, pageId: bookData._id,
            headerText: bookData.headerText, footerText: bookData.footerText
        })
    };

    const renderQuestionAnswerList = (item, index) => {
        const { questionId, answer } = item;
        const { question, questionType, options } = questionId;

        return (
            <List.Item
                key={index}
                title={question}
                titleNumberOfLines={5}
                titleStyle={theme.fonts.titleMedium}
                description={
                    questionType === MMEnums.questionType.radio
                        ? options.map((option, optionIndex) => (
                            <React.Fragment key={option}>
                                {answer && answer[0] === option ? (
                                    <React.Fragment key={option}>
                                        <Text style={{ backgroundColor: 'yellow', margin: 10 }}>{option}</Text>
                                        {optionIndex < options.length - 1 && <Text>{"   "}</Text>}
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment key={option}>
                                        <Text>{option}</Text>
                                        {optionIndex < options.length - 1 && <Text>{"   "}</Text>}
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        ))
                        : questionType === MMEnums.questionType.checkbox
                            ? answer && answer.length > 0 && answer.join(', ')
                            : answer || null
                }
                descriptionNumberOfLines={2000}
                descriptionStyle={[
                    questionType === 'radio' ? { paddingTop: 20, lineHeight: 25 } : theme.fonts.default,
                    { lineHeight: 25 },
                ]}
            />
        );
    };

    const renderTemplatePage = (template, pageDetails, headerText, footerText) => {
        const customPageDetails = _.map(pageDetails, (pageDetail, index) => {
            pageDetail.source = MMUtils.getImagePath(pageDetail.value);
            return pageDetail;
        });
        return (
            <View style={{ paddingLeft: MMConstants.paddingLarge }}>
                {headerText ?
                    <Text style={[theme.fonts.headlineMedium, { textAlign: 'center', paddingBottom: MMConstants.paddingLarge }]}>{headerText}</Text>
                    : null}
                <View style={{ height: 250, width: 250, alignSelf: 'center' }}>
                    <MMCommonTemplate borderWidth={0} onPickImage={null} templateData={customPageDetails} isDisable={true}
                        templateName={template.code} />
                </View>
                {footerText ?
                    <Text style={[theme.fonts.headlineMedium, { textAlign: 'center', paddingTop: MMConstants.paddingLarge }]}> {footerText}</Text>
                    : null}
            </View>
        )
    };

    const renderBookData = (item) => {
        if (!bookData || bookData.length === 0) return null;
        const isTemplate = item?.templateId ? true : false;
        const template = isTemplate ? _.find(lookupData.templates, { '_id': item?.templateId }) : null;
        const chapterImage = isTemplate ? null : MMUtils.getImagePath(`Chapter/${item.icon}.png`);
        return (
            <>
                <View style={{ flexDirection: 'row-reverse', padding: MMConstants.paddingMedium }}>
                    <Icon name={'plus-square'} size={24} color={theme.colors.text.primary} onPress={() => onPressAdd(item.position, item._id, item.title ? item.title : item.headerText)} />
                </View>
                <MMSurface key={item._id} margin={[0, 0, 10, 0]} padding={[0, 20, 0, 50]}>
                    <View style={{ borderLeftWidth: 1, borderStyle: MMUtils.isPlatformIos ? 'solid' : 'dashed' }}>
                        {isTemplate ?
                            <TouchableOpacity onPress={() => onPressEdit(item, template)} style={{ paddingVertical: 30 }}>
                                {renderTemplatePage(template, item.pageDetails, item.headerText, item.footerText)}
                            </TouchableOpacity> :
                            (
                                < TouchableOpacity onPress={() =>
                                    navigation.navigate('ChapterQuiz', {
                                        babyId: selectedBaby._id, chapterId: item._id, chapterTitle: item.title,
                                        chapterImage: chapterImage
                                    })}
                                    style={{ paddingVertical: 30 }}>
                                    {item.type === MMEnums.chapterType.parents ? (
                                        <Parents pageDetails={item.pageDetails} title={item.title} />
                                    ) : item.type === MMEnums.chapterType.welcomeToWorld ? (
                                        <WelcomeToWorld pageDetails={item.pageDetails} title={item.title} />
                                    ) : (
                                        _.map(item.pageDetails, (i, index) => {
                                            return renderQuestionAnswerList(i, index)
                                        })
                                    )}
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </MMSurface>
            </>
        );
    };


    const renderView = () => {
        return (
            <FlatList
                data={bookData}
                ListHeaderComponent={<Baby></Baby>}
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
            <MMContentContainer paddingStyle='none'>
                {isLoading ? <MMSpinner /> : renderView()}
            </MMContentContainer>
        </>
    );
}

BookPreview.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};