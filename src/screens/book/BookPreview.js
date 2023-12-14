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
import { Dimensions, FlatList, Keyboard, StyleSheet, Touchable, TouchableOpacity, View } from 'react-native';
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
        let previousItemPosition = currentPosition - 10;
        const currentIndex = bookData.findIndex((item) => item.position === currentPosition);
        if (currentIndex > 0) {
            const perviousItem = bookData[currentIndex - 1];
            previousItemPosition = perviousItem.position;
        }
        const pagePosition = (currentPosition + previousItemPosition) / 2;
        navigation.navigate('TemplateList', { position: pagePosition })
    };

    const onPressEdit = (bookData, template) => {
        navigation.navigate('MainTemplate', {
            position: bookData.position,
            templateName: template.code, templateId: bookData.templateId, pageDetails: bookData.pageDetails, pageId: bookData._id,
            headerText: bookData.headerText, footerText: bookData.footerText
        })
    };

    const renderQuestionAnswerList = (item, index) => {
        return (
            <List.Item
                key={index}
                title={item.questionId.question}
                titleNumberOfLines={2}
                titleStyle={theme.fonts.titleMedium}
                description={`${item.questionId.questionType != 'milestone' ? item.answer : null}`}
                descriptionNumberOfLines={20}
                descriptionStyle={[theme.fonts.default, { lineHeight: 25 }]}
            />
        );
    };

    const renderTemplatePage = (template, pageDetails, headerText, footerText) => {
        const customPageDetails = _.map(pageDetails, (pageDetail, index) => {
            pageDetail.source = MMUtils.getImagePath(pageDetail.value);
            return pageDetail;
        });
        return (
            <View style={{ height: 300, paddingLeft: 20 }}>
                {headerText ? <Text style={{ textAlign: 'center', paddingBottom: MMConstants.paddingLarge }}>{headerText}</Text> : null}
                <CommonTemplate borderWidth={0} onPickImage={null} templateData={customPageDetails} isDisable={true}
                    templateName={template.code} />
                {footerText ? <Text style={{ textAlign: 'center', paddingTop: MMConstants.paddingLarge }}> {footerText}</Text> : null}
            </View>
        )
    };

    const renderNoData = () => {
        return (
            <MMSurface>
                <Text>No data found ! please add some chapters </Text>
            </MMSurface>
        )
    }

    const renderBookData = (item) => {
        if (!bookData || bookData.length === 0) return null;
        const isTemplate = item?.templateId ? true : false;
        const template = isTemplate ? _.find(lookupData.template, { '_id': item?.templateId }) : null;
        return (
            <>
                <View style={{ flexDirection: 'row-reverse', padding: MMConstants.paddingMedium }}>
                    <Icon name={'plus-square'} size={24} color={theme.colors.text.primary} onPress={() => onPressAdd(item.position)} />
                </View>
                <MMSurface key={item._id} margin={[0, 0, 10, 0]} padding={[0, 20, 0, 50]}>
                    <View style={{ borderLeftWidth: 1, borderStyle: 'dashed' }}>
                        {isTemplate ?
                            <TouchableOpacity onPress={() => onPressEdit(item, template)} style={{ paddingVertical: 30 }}>
                                {renderTemplatePage(template, item.pageDetails, item.headerText, item.footerText)}
                            </TouchableOpacity> :
                            (
                                <View style={{ paddingVertical: 30 }}>
                                    {_.map(item.pageDetails, (i, index) => {
                                        return renderQuestionAnswerList(i, index);
                                    })}
                                </View>
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