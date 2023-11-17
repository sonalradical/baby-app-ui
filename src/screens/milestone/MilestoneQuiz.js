import React, { useEffect, useState } from 'react';
import { Appbar, IconButton, Text, TextInput, useTheme } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';

import MMUtils from '../../helpers/Utils';
import MMApiService from '../../services/ApiService';
import MMContentContainer from '../../components/common/ContentContainer';
import MMScrollView from '../../components/common/ScrollView';
import { Dimensions, Image, Keyboard, StyleSheet, View } from 'react-native';
import MMInput from '../../components/common/Input';
import MMDateTimePicker from '../../components/common/DateTimePicker';
import MMSpinner, { MMOverlaySpinner } from '../../components/common/Spinner';
import { MMButton } from '../../components/common/Button';
import MMIcon from '../../components/common/Icon';
import MMImagePickerModal from '../../components/common/imagePickerModal';
import MMInputMultiline from '../../components/common/InputMultiline';

export default function MilestoneQuiz({ navigation, route }) {
    const { babyId, milestoneId } = route.params;
    const theme = useTheme();
    const [isLoading, setLoading] = useState(false);
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
                    setLoading(false);
                }
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
                console.log('saved...', response)
                setLoading(false);
                navigation.navigate('MilestoneList', { milestoneId: milestoneId })
            }
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
                <Text style={[theme.fonts.headlineMedium, { textAlign: 'center', marginBottom: 10 }]}>{questions[0].question}</Text>
                <View style={{ padding: 10 }}>
                    <MMInputMultiline
                        label='Description'
                        value={state.description}
                        onChangeText={onTextChange}
                        placeholder="Enter Description"
                    />
                    <View>
                        <MMInput
                            label='Date'
                            name='date'
                            placeholder='Enter Date'
                            value={_.isNil(state.date) ? '' : MMUtils.displayDate(state.date)}
                            onPressIn={onPressDate}
                            onKeyPress={onPressDate}
                            left={<TextInput.Icon
                                icon='calendar-range'
                                forceTextInputFocus={false}
                                onPress={onPressDate}
                            />}
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
                        <Text style={theme.fonts.titleMedium}>Photo</Text>
                        {!imageSource ?
                            <View style={styles(theme).imagePickerSquare}>
                                <MMIcon iconName="cloud-upload" iconSize={50} iconColor={theme.colors.primary} onPress={toggleModal} />
                                <Text style={theme.fonts.default} >Upload Photo</Text>
                            </View> : null
                        }
                        {imageSource ? <Image source={{ uri: imageSource }}
                            style={{ height: Dimensions.get('window').height / 2, width: '100%' }} onPress={toggleModal} /> : null}
                    </>
                    <MMButton label='Save' style={{ marginTop: 20 }} onPress={() => onSubmit()} />
                </View>
                <MMImagePickerModal visible={isModalVisible} toggleModal={toggleModal} onImageChange={(imageUri) => setImageUri(imageUri)} />
            </>
        );
    };

    const renderScreenHeader = () => {
        return (
            <Appbar.Header style={{ backgroundColor: theme.colors.secondaryContainer }}>
                <Appbar.BackAction onPress={() => { navigation.goBack(); }} />
                <Appbar.Content title={'Milestone Quiz'} titleStyle={theme.fonts.headlineMedium} />
            </Appbar.Header>
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
        marginTop: 6,
        borderColor: theme.colors.outline,
        borderStyle: 'dashed'
    },
});
