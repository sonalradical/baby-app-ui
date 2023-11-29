import React, { useEffect, useState } from 'react';
import { Text, useTheme } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import MMContentContainer from '../../components/common/ContentContainer';
import MMScrollView from '../../components/common/ScrollView';
import { Dimensions, Image, Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import MMInput from '../../components/common/Input';
import MMDateTimePicker from '../../components/common/DateTimePicker';
import MMSpinner, { MMOverlaySpinner } from '../../components/common/Spinner';
import { MMButton, MMOutlineButton } from '../../components/common/Button';
import MMIcon from '../../components/common/Icon';
import MMImagePickerModal from '../../components/common/imagePickerModal';
import MMInputMultiline from '../../components/common/InputMultiline';
import MMPageTitle from '../../components/common/PageTitle';
import MMFlexView from '../../components/common/FlexView';

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
        loadQuiz();
    }, [babyId, milestoneId]);

    const loadQuiz = async () => {
        if (babyId && milestoneId) {
            try {
                setLoading(true);
                const response = await MMApiService.getQuiz(babyId, milestoneId);
                if (response.data) {
                    setQuestions(response.data.questionList);
                    const answer = response.data.answerList[0].answer;
                    setState({
                        ...state,
                        description: answer.description,
                        date: answer.date,
                        picture: answer.picture
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
            let picIndex = 0;

            for (const pic of imageData.assets) {
                picIndex++;

                await MMApiService.getPreSignedUrl(photo.fileName)
                    .then(function (response) {
                        (async () => {
                            const responseData = response.data;
                            if (responseData) {
                                const result = MMUtils.uploadPicture(pic, responseData.preSignedUrl);
                                if (_.isNil(result)) {
                                    setOverlayLoading(false);
                                    MMUtils.showToastMessage(`Uploading picture ${picIndex} failed...`);
                                } else {
                                    setOverlayLoading(false);
                                    MMUtils.showToastMessage(`Uploading picture ${picIndex} completed.`);
                                    setState({
                                        ...state,
                                        picture: responseData.storageFileKey
                                    })
                                    setImageSource(photo.uri);
                                    storageFileKeys.push({ storageFileKey: responseData.storageFileKey });
                                }
                            } else {
                                setLoading(false);
                                MMUtils.showToastMessage(`Getting presigned url for uploading picture ${picIndex} failed. Error: ${responseData.message}`);
                            }
                        })();
                    })
                    .catch(function (error) {
                        setOverlayLoading(false);
                        const serverError = MMUtils.apiErrorMessage(error);
                        if (serverError) {
                            MMUtils.showToastMessage(serverError);
                        }
                    });
            }
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
            const response = await MMApiService.saveQuiz(apiData);
            if (response) {
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
                    <MMInputMultiline
                        value={state.description}
                        onChangeText={onTextChange}
                        placeholder="Enter Description"
                        maxLength={2000}
                    />
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
                                <MMIcon iconName="cloud-upload" iconSize={50} iconColor={theme.colors.primary} onPress={toggleModal} />
                                <Text style={theme.fonts.default} >Upload Photo</Text>
                            </View> : null
                        }
                        {imageSource ?
                            <TouchableOpacity onPress={toggleModal}>
                                <Image source={{ uri: imageSource }}
                                    style={{ height: Dimensions.get('window').height / 4, width: '100%' }} />
                            </TouchableOpacity> : null}
                    </>
                    <MMFlexView paddingTop={20}>
                        <MMOutlineButton label='Cancel' width='45%' onPress={() => navigation.goBack()} />
                        <MMButton label='Save' width='45%' onPress={() => onSubmit()} />
                    </MMFlexView>
                </View>
                <MMImagePickerModal visible={isModalVisible} toggleModal={toggleModal} onImageChange={(imageUri) => setImageUri(imageUri)} />
            </>
        );
    };

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
