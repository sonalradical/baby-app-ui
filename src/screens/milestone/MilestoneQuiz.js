import React, { useEffect, useState } from 'react';
import { Text, useTheme } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';

import { Dimensions, Image, Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MMButton, MMOutlineButton } from '../../components/common/Button';
import MMContentContainer from '../../components/common/ContentContainer';
import MMDateTimePicker from '../../components/common/DateTimePicker';
import MMFlexView from '../../components/common/FlexView';
import MMIcon from '../../components/common/Icon';
import MMImagePickerModal from '../../components/common/ImagePickerModal';
import MMInput from '../../components/common/Input';
import MMInputMultiline from '../../components/common/InputMultiline';
import MMScrollView from '../../components/common/ScrollView';
import MMSpinner, { MMOverlaySpinner } from '../../components/common/Spinner';
import MMConstants from '../../helpers/Constants';
import MMUtils from '../../helpers/Utils';
import MMApiService from '../../services/ApiService';
import MMActionButtons from '../../components/common/ActionButtons';

export default function MilestoneQuiz({ navigation, route }) {
    const { babyId, milestoneId } = route.params;
    const theme = useTheme();
    const [isLoading, setLoading] = useState(true);
    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const initialState = {
        description: '',
        date: null,
        picture: '',
        showDate: false
    };
    const [state, setState] = useState(initialState);
    const [imageSource, setImageSource] = useState();
    const [questions, setQuestions] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        getQuiz();
    }, [babyId, milestoneId]);

    const getQuiz = async () => {
        if (babyId && milestoneId) {
            try {
                setLoading(true);
                const { data } = await MMApiService.getQuiz(babyId, milestoneId);
                if (data) {
                    setQuestions(data.questionList);
                    const answer = data.answerList[0].answer;
                    setState({
                        ...state,
                        ...answer,
                    })
                    if (answer.picture) {
                        imageSourceUri = MMUtils.getImagePath(answer.picture);
                        setImageSource(imageSourceUri);
                    }
                }
                setLoading(false);
            } catch (error) {
                const serverError = MMUtils.apiErrorMessage(error);
                if (serverError) {
                    MMUtils.showToastMessage(serverError);
                }
                setLoading(false);
            }
        }
    };

    const onTextChange = (value) => {
        setState({
            ...state,
            description: value
        });
    };

    const onPressDate = () => {
        Keyboard.dismiss();
        setState({
            ...state,
            showDate: true
        });
    };

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const setImageUri = async (imageData) => {
        const photo = imageData.assets[0];
        let storageFileKeys = [];
        try {
            setOverlayLoading(true);
            const { data } = await MMApiService.getPreSignedUrl(photo.fileName);
            if (data) {
                const result = MMUtils.uploadPicture(pic, data.preSignedUrl);
                if (result) {
                    MMUtils.showToastMessage(`Uploading picture completed.`);
                    setState({
                        ...state,
                        picture: data.storageFileKey
                    })
                    setImageSource(photo.uri);
                    storageFileKeys.push({ storageFileKey: data.storageFileKey });
                } else {
                    MMUtils.showToastMessage(`Uploading picture failed...`);
                }
                setOverlayLoading(false);
            } else {
                MMUtils.showToastMessage(`Getting presigned url for uploading picture failed. Error: ${data.message}`);
            }
            setOverlayLoading(false);
        } catch (err) {
            setOverlayLoading(false);
            MMUtils.consoleError(err);
        }
        return storageFileKeys;
    };

    const onSubmit = async () => {
        try {
            setLoading(true);
            const apiData = {
                chapterId: milestoneId,
                babyId: babyId,
                questionId: questions[0].questionId,
                answer: {
                    description: state.description,
                    date: state.date,
                    picture: state.picture
                }
            }
            const { data } = await MMApiService.saveQuiz(apiData);
            if (data) {
                navigation.navigate('MilestoneList', { milestoneId: milestoneId })
            }
            setLoading(false);
        } catch (error) {
            const serverError = MMUtils.apiErrorMessage(error);
            if (serverError) {
                MMUtils.showToastMessage(serverError);
            }
            setLoading(false);
        }
    }

    const renderView = () => {
        if (!questions || questions.length === 0) return null;
        return (
            <>
                <View style={{ padding: MMConstants.paddingLarge }}>
                    <View style={{ paddingTop: MMConstants.paddingLarge }}>
                        <MMInputMultiline
                            value={state.description}
                            onChangeText={onTextChange}
                            placeholder="Enter Description"
                            maxLength={2000}
                        />
                        <Text style={{ textAlign: 'right' }}>
                            {state.description.length > 0 ? `${state.description.length} / 2000` : '0 / 2000'}</Text>
                    </View>
                    <View style={{ paddingTop: MMConstants.paddingLarge }}>
                        <MMInput
                            name='date'
                            placeholder='Enter Date'
                            value={_.isNil(state.date) ? '' : MMUtils.displayDate(state.date)}
                            onPressIn={onPressDate}
                            onKeyPress={onPressDate}
                            leftIcon='calendar-range'
                            onPress={onPressDate}
                        />
                        {
                            state.showDate &&
                            <MMDateTimePicker
                                name='date'
                                mode='date'
                                display={MMUtils.isPlatformIos() ? 'inline' : 'default'}
                                date={_.isNil(state.date) ? new Date() : new Date(state.date)}
                                maximumDate={new Date()}
                                onConfirm={(date) => {
                                    setState({
                                        ...state,
                                        date: new Date(date),
                                        showDate: false,
                                    })
                                }}
                                onCancel={() => {
                                    setState({
                                        ...state,
                                        showDate: false
                                    })
                                }}
                            />
                        }
                    </View>
                    <>
                        {!imageSource ?
                            <View style={styles(theme).imagePickerSquare}>
                                <MMIcon iconName="cloud-upload-outline" iconSize={50} iconColor={theme.colors.primary} onPress={toggleModal} />
                                <Text style={theme.fonts.default} >Upload Photo</Text>
                            </View> : null
                        }
                        {imageSource ?
                            <TouchableOpacity onPress={toggleModal} style={{ paddingTop: MMConstants.paddingMedium }}>
                                <Image source={{ uri: imageSource }}
                                    style={{ height: Dimensions.get('window').height / 4, width: '100%' }} />
                            </TouchableOpacity> : null}
                    </>
                </View>
                <MMImagePickerModal visible={isModalVisible} toggleModal={toggleModal} onImageChange={(imageUri) => setImageUri(imageUri)} />
            </>
        );
    };

    const renderActionButtons = () => {
        return (
            <MMActionButtons type='bottomFixed'>
                <MMOutlineButton label='Cancel' width='45%' onPress={() => navigation.goBack()} />
                <MMButton label='Save' width='45%' onPress={() => onSubmit()} />
            </MMActionButtons>
        )
    }

    const renderScreenHeader = () => {
        if (!questions || questions.length === 0) return null;
        return (
            <View style={{
                padding: MMConstants.paddingMedium,
                backgroundColor: theme.colors.primary
            }}>
                <Text style={[theme.fonts.titleLarge, { textAlign: 'center' }]}>{questions[0].question}</Text>
            </View>
        );
    };


    return (
        <>
            {renderScreenHeader()}
            <MMContentContainer>
                <MMScrollView>
                    {isLoading ? <MMSpinner /> : renderView()}
                </MMScrollView>
                {renderActionButtons()}
                <MMOverlaySpinner visible={isOverlayLoading} />
            </MMContentContainer>
        </>
    );
}

MilestoneQuiz.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = (theme) => StyleSheet.create({
    imagePickerSquare: {
        width: '100%',
        height: Dimensions.get('window').height / 6,
        backgroundColor: theme.colors.secondaryContainer,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: MMConstants.marginSmall,
        borderColor: theme.colors.outline,
        borderStyle: 'dashed'
    },
});
