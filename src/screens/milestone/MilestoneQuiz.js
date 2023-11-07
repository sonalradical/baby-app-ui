import React, { useEffect, useState } from 'react';
import { Appbar, IconButton, Text, TextInput, useTheme } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';

import MMUtils from '../../helpers/Utils';
import MMColors from '../../helpers/Colors';
import MMStyles from '../../helpers/Styles';
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

export default function MilestoneQuiz({ navigation, route }) {
    const { babyId, milestoneId } = route.params;
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);
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
        const loadQuiz = async () => {
            if (babyId && milestoneId) {
                try {
                    setIsLoading(true);
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
                        setIsLoading(false);
                    }
                } catch (error) {
                    const serverError = MMUtils.apiErrorMessage(error);
                    if (serverError) {
                        MMUtils.showToastMessage(serverError);
                    }
                    setIsLoading(false);
                }
            }
        };
        loadQuiz();
    }, [babyId, milestoneId]);

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
            setIsOverlayLoading(true);
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
                                    setIsOverlayLoading(false);
                                    MMUtils.showToastMessage(`Uploading picture ${picIndex} failed...`);
                                } else {
                                    setIsOverlayLoading(false);
                                    MMUtils.showToastMessage(`Uploading picture ${picIndex} completed.`);
                                    setState({
                                        ...state,
                                        picture: responseData.storageFileKey
                                    })
                                    setImageSource(photo.uri);
                                    storageFileKeys.push({ storageFileKey: responseData.storageFileKey });
                                }
                            } else {
                                setIsLoading(false);
                                MMUtils.showToastMessage(`Getting presigned url for uploading picture ${picIndex} failed. Error: ${responseData.message}`);
                            }
                        })();
                    })
                    .catch(function (error) {
                        setIsOverlayLoading(false);
                        const serverError = MMUtils.apiErrorMessage(error);
                        if (serverError) {
                            MMUtils.showToastMessage(serverError);
                        }
                    });
            }
        } catch (err) {
            setIsOverlayLoading(false);
            MMUtils.consoleError(err);
        }

        return storageFileKeys;
    };

    const onSubmit = async () => {
        try {
            setIsLoading(true);
            const apiData = {
                chapterId: milestoneId,
                babyId: babyId,
                questionId: questions[0]._id,
                answer: {
                    description: state.description,
                    date: state.date,
                    picture: state.picture
                }
            }
            const response = await MMApiService.saveQuiz(apiData);
            if (response) {
                console.log('saved...', response)
                setIsLoading(false);
                navigation.navigate('MilestoneList', { milestoneId: milestoneId })
            }
        } catch (error) {
            const serverError = MMUtils.apiErrorMessage(error);
            if (serverError) {
                MMUtils.showToastMessage(serverError);
            }
            setIsLoading(false);
        }
    }

    const renderView = () => {
        if (!questions || questions.length === 0) return null;
        return (
            <>
                <Text style={[MMStyles.cardHeaderText, MMStyles.mb10]}>{questions[0].question}</Text>
                <View style={MMStyles.p10}>
                    <MMInput
                        label='Description'
                        numberOfLines={4}
                        maxLength={100}
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
                        <Text style={[MMStyles.boldText, MMStyles.mb5]}>Photo</Text>
                        {!imageSource ?
                            <View style={styles.imagePickerSquare}>
                                <MMIcon iconName="cloud-upload" iconSize={50} iconColor={theme.colors.primary} onPress={toggleModal} />
                                <Text style={MMStyles.subTitle}>Upload Photo</Text>
                            </View> : null
                        }
                        {imageSource ? <Image source={{ uri: imageSource }}
                            style={[MMStyles.responsiveImage, { height: Dimensions.get('window').height / 2 }]} onPress={toggleModal} /> : null}
                    </>
                    <MMButton label='Save' style={MMStyles.mt20} onPress={() => onSubmit()} />
                </View>
                <MMImagePickerModal visible={isModalVisible} toggleModal={toggleModal} onImageChange={(imageUri) => setImageUri(imageUri)} />
            </>
        );
    };

    const renderScreenHeader = () => {
        return (
            <Appbar.Header style={{ backgroundColor: MMColors.white }}>
                <Appbar.BackAction onPress={() => { navigation.goBack(); }} />
                <Appbar.Content title={'Milestone Quiz'} titleStyle={[MMStyles.mediumText]} />
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

const styles = StyleSheet.create({
    imagePickerSquare: {
        width: '100%',
        height: Dimensions.get('window').height / 6,
        backgroundColor: MMColors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: MMColors.inputBorder
    },
});
