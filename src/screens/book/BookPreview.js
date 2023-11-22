import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import MMUtils from '../../helpers/Utils';
import MMApiService from '../../services/ApiService';
import MMContentContainer from '../../components/common/ContentContainer';
import MMSurface from '../../components/common/Surface';
import MMSpinner from '../../components/common/Spinner';
import MMPageTitle from '../../components/common/PageTitle';
import { Avatar, Button, List, Menu, Text, useTheme } from 'react-native-paper';
import { FlatList, Keyboard, View } from 'react-native';
import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';
import MMEnums from '../../helpers/Enums';

export default function BookPreview({ route, navigation }) {
    const theme = useTheme();
    const selectedBabyId = useSelector((state) => state.AppReducer.baby);
    const reloadBookPage = useSelector((state) => state.AppReducer.reloadBookPage)
    const lookupData = useSelector((state) => state.AuthReducer.lookupData);
    const [isLoading, setLoading] = useState(true);
    const [babyDetail, setBabyDetail] = useState();
    const [bookData, setBookData] = useState();

    useEffect(() => {
        if (selectedBabyId || reloadBookPage) {
            loadBabyProfileDetail();
            loadBookPreview();
        }
    }, [selectedBabyId, reloadBookPage]);

    const loadBookPreview = async () => {
        setLoading(true);
        try {
            const response = await MMApiService.getBookPreview(selectedBabyId);
            if (response.data) {
                setBookData(response.data);
            }
        } catch (error) {
            const serverError = MMUtils.apiErrorMessage(error);
            if (serverError) {
                MMUtils.showToastMessage(serverError);
            }
        }
        setLoading(false);
    };

    const loadBabyProfileDetail = async () => {
        setLoading(true);
        const response = await MMApiService.getBabyById(selectedBabyId);
        if (response.data) {
            setBabyDetail(response.data);
        }
        setLoading(false);
    }

    const onPressAdd = (currentPosition) => {
        let nextItemPosition = null;
        const currentIndex = bookData.findIndex((item) => item.position === currentPosition);
        if (currentIndex < bookData.length - 1) {
            const nextItem = bookData[currentIndex + 1];
            nextItemPosition = nextItem.position;
        }
        const pagePosition = (currentPosition + nextItemPosition) / 2;
        navigation.navigate('TemplateList', { position: pagePosition })
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
                descriptionStyle={[theme.fonts.default, { paddingTop: MMConstants.paddingLarge }]}
            />
        );
    };

    const renderPage = (templateId, pageDetails) => {
        let templateName = null;
        const template = _.find(lookupData.template, { '_id': templateId });
        templateName = template.code;
        const ComponentName = MMEnums.Components[templateName]
        const customPageDetails = _.map(pageDetails, (pageDetail, index) => {
            pageDetail.source = MMUtils.getImagePath(pageDetail.value)
            return pageDetail;
        });
        return (
            <ComponentName onPickImage={null} templateData={customPageDetails} />
            // <Text />
        )
    };

    const renderBookData = (item) => {
        if (!bookData || bookData.length === 0) return null;
        const isTemplate = item?.templateId ? true : false;

        return (
            <>
                <View style={{ flexDirection: 'row-reverse', paddingHorizontal: MMConstants.paddingMedium }}>
                    <MMIcon iconName={'pencil'} onPress={() => onPressAdd(item.position)} style={{ margin: MMConstants.marginSmall }} />
                    <MMIcon iconName={'plus'} onPress={() => onPressAdd(item.position)} style={{ margin: MMConstants.marginSmall }} />
                </View>
                <MMSurface key={item._id}>
                    {!isTemplate ? (
                        <>
                            <Text style={theme.fonts.titleLarge}>{item.title}</Text>
                            {_.map(item.pageDetails, (i, index) => {
                                return renderQuestionAnswerList(i, index);
                            })}
                        </>
                    ) :
                        renderPage(item.templateId, item.pageDetails)

                    }
                </MMSurface>
            </>
        );
    };

    const renderView = () => {
        return (
            <FlatList
                data={bookData}
                ListHeaderComponent={renderBabyProfile}
                renderItem={({ item, index }) => {
                    return renderBookData(item, index);
                }}
                keyExtractor={(item, index) => {
                    return item._id;
                }}
                onMomentumScrollBegin={Keyboard.dismiss}
                keyboardShouldPersistTaps={'handled'}
                enableEmptySections={true}
            />
        );
    };

    const renderBabyProfile = () => {
        if (!babyDetail || babyDetail.length === 0) return null;
        const birthDate = MMUtils.displayDate(babyDetail.birthDate)
        const babyImage = babyDetail.picture ? MMUtils.getImagePath(babyDetail.picture) : require('../../assets/images/parenthood.jpg')

        return (
            <MMSurface>
                <MMPageTitle title='Memory Book' />
                <View style={{ alignItems: 'center' }}>
                    <Text style={theme.fonts.titleMedium}>{birthDate}</Text>
                    <Avatar.Image size={150} source={{ uri: babyImage }} style={{ marginTop: MMConstants.marginMedium }} />
                    <Text style={[theme.fonts.headlineMedium, { marginTop: MMConstants.marginMedium }]}>{babyDetail.name}</Text>
                </View>
            </MMSurface>
        );
    };

    return (
        <>
            <MMContentContainer>
                {isLoading ? <MMSpinner /> : renderView()}
            </MMContentContainer>
        </>
    );
}

BookPreview.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};