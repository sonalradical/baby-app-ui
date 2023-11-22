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

export default function BookPreview({ route, navigation }) {
    const theme = useTheme();
    const selectedBabyId = useSelector((state) => state.AppReducer.baby);
    const [isLoading, setLoading] = useState(true);
    const [babyDetail, setBabyDetail] = useState();
    const [bookData, setBookData] = useState();
    const [visibleMenu, setVisibleMenu] = useState(null);


    useEffect(() => {
        if (selectedBabyId) {
            loadBabyProfileDetail();
            loadBookPreview();
        }
    }, [selectedBabyId]);

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

    const openMenu = (itemId) => {
        setVisibleMenu(itemId);
    };

    const closeMenu = () => {
        setVisibleMenu(null);
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

    const renderBookData = (item) => {
        if (!bookData || bookData.length === 0) return null;

        return (
            <MMSurface key={item._id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={theme.fonts.titleLarge}>{item.title}</Text>
                    <Menu
                        visible={visibleMenu === item._id}
                        onDismiss={closeMenu}
                        anchor={
                            <MMIcon iconName={'plus'} onPress={() => openMenu(item._id)} />
                        }>
                        <View style={{ backgroundColor: theme.colors.secondaryContainer }}>
                            <Menu.Item
                                title='Add Page Before'
                            />
                            <Menu.Item
                                title='Add Page After'
                            />
                        </View>
                    </Menu>
                </View>
                {_.map(item.pageDetails, (i, index) => {
                    return renderQuestionAnswerList(i, index);
                })
                }
            </MMSurface>
        );
    };

    const renderView = () => {
        return (
            <FlatList
                data={bookData}
                ListHeaderComponent={renderBabyProfile}
                renderItem={({ item }) => {
                    return renderBookData(item);
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