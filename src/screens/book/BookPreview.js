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
import { Avatar, Button, Divider, List, Menu, Text, useTheme } from 'react-native-paper';
import { Dimensions, FlatList, Image, Keyboard, StyleSheet, View } from 'react-native';
import MMConstants from '../../helpers/Constants';
import Icon from 'react-native-vector-icons/Feather';
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
                descriptionStyle={[theme.fonts.default, { paddingTop: MMConstants.paddingLarge, lineHeight: 25 }]}
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
            <ComponentName borderWidth={0} onPickImage={null} templateData={customPageDetails} />
        )
    };

    const renderBookData = (item, index) => {
        if (!bookData || bookData.length === 0) return null;
        const isTemplate = item?.templateId ? true : false;
        const chapterImage = !isTemplate && item?.icon ? MMConstants.chapters[item.icon] : null;
        return (
            <>
                <MMSurface key={item._id} margin={[0, 0, 0, 0]} padding={[0, 0, 0, 0]}>
                    {!isTemplate ? (
                        <>
                            <View style={[styles(theme).title, { backgroundColor: item.color }]}>
                                <View style={styles(theme).imageView}>
                                    <Image
                                        textAlign="center"
                                        resizeMode="contain"
                                        source={chapterImage}
                                        style={styles(theme).image}
                                    />
                                </View>
                                <MMPageTitle title={item.title}
                                    optionalStyle={{
                                        marginTop: MMConstants.marginLarge,
                                        paddingHorizontal: MMConstants.paddingLarge,
                                        color: theme.colors.secondaryContainer,
                                        marginLeft: 50
                                    }} />
                            </View>
                            {_.map(item.pageDetails, (i, index) => {
                                return renderQuestionAnswerList(i, index);
                            })}
                        </>
                    ) :
                        renderPage(item.templateId, item.pageDetails)
                    }
                </MMSurface>
                <View style={{ flexDirection: 'row', padding: MMConstants.marginMedium }}>
                    <Icon name={'plus'} size={30} color={theme.colors.text.primary} onPress={() => onPressAdd(item.position)} />
                    {isTemplate ?
                        <Icon name={'edit-2'} size={24} color={theme.colors.text.primary}
                            onPress={() => onPressAdd(item.position)} style={{ marginLeft: 15, marginTop: 5 }} /> : null}
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
                //ListHeaderComponent={renderBabyProfile}
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
        <View style={{ backgroundColor: theme.colors.background }}>
            {isLoading ? <MMSpinner /> : renderView()}
        </View>
    );
}

BookPreview.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = (theme) => StyleSheet.create({
    title: {
        flexDirection: 'row',
        paddingLeft: 10,
    },
    image: {
        width: Dimensions.get('window').width / 8,
        height: Dimensions.get('window').height / 16,
        borderRadius: 50,
    },
    imageView: {
        borderRadius: 50,
        backgroundColor: theme.colors.secondaryContainer,
        width: Dimensions.get('window').width / 8 + 8,
        height: Dimensions.get('window').height / 16 + 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: MMConstants.marginSmall,
    }
});