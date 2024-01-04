import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Checkbox, Chip, RadioButton, Text, TextInput, useTheme } from 'react-native-paper';

import { useDispatch } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
import moment from 'moment';
import { reloadBookPage, reloadChapterList } from '../../redux/Slice/AppSlice';

import MMConstants from '../../helpers/Constants';
import MMEnums from '../../helpers/Enums';
import MMUtils from '../../helpers/Utils';
import MMApiService from '../../services/ApiService';

import { MMButton } from '../../components/common/Button';
import MMFlexView from '../../components/common/FlexView';
import MMInput from '../../components/common/Input';
import MMScrollView from '../../components/common/ScrollView';
import MMContentContainer from '../../components/common/ContentContainer';
import MMInputMultiline from '../../components/common/InputMultiline';
import MMSpinner from '../../components/common/Spinner';
import MMIcon from '../../components/common/Icon';
import MMImagePickerModal from '../../components/common/ImagePickerModal';
import MMDateTimePicker from '../../components/common/DateTimePicker';
import RenderRadioGroup from './component/RenderRadioGroup';

export default function ChapterQuiz({ navigation, route }) {
    const { babyId, chapterId, chapterTitle, chapterImage } = route.params;
    const theme = useTheme();
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(true);
    const [selectedQuestion, setSelectedQuestion] = useState();
    const [selectedAnswer, setSelectedAnswer] = useState([]);
    const [questionList, setQuestionList] = useState([]);
    const [answerList, setAnswerList] = useState([]);
    const [newOption, setNewOption] = useState('');
    const [showBirthTime, setShowBirthTime] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        getQuiz();
    }, [babyId, chapterId]);

    const getQuiz = async () => {
        if (babyId && chapterId) {
            setLoading(true);
            try {
                const { data } = await MMApiService.getQuiz(babyId, chapterId);
                if (data) {
                    const { questionList: questionsList, answerList: answersList } = data;
                    answersList.forEach(answer => {
                        const questions = _.find(questionsList, { questionId: answer.questionId });
                        if (questions.questionType === 'checkbox') {
                            const newOptions = _.difference(answer.answer, questions.options);
                            questions.options = questions.options.concat(newOptions);
                        }
                    });
                    setQuestionList(questionsList);
                    setAnswerList(answersList);

                    const indexOfNextUnansweredQuestion = findNextUnansweredQuestion(questionsList, answersList);
                    setSelectedQuestion(indexOfNextUnansweredQuestion);
                }
            } catch (error) {
                const serverError = MMUtils.apiErrorMessage(error);
                if (serverError) {
                    MMUtils.showToastMessage(serverError);
                }
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            dispatch(reloadChapterList({ reloadChapterList: true }));
            navigation.goBack();
            return true;
        });
        return () => backHandler.remove();
    }, [dispatch, navigation]);

    useEffect(() => {
        const currentQuestionId = questionList[selectedQuestion]?.questionId;
        const matchingAnswer = answerList.find(answer => answer.questionId === currentQuestionId);
        setSelectedAnswer(matchingAnswer && matchingAnswer.answer ? matchingAnswer.answer : []);
    }, [selectedQuestion]);


    // Function to find the next unanswered question
    const findNextUnansweredQuestion = (questions, answers) => {
        const index = _.findIndex(questions, (question) => {
            return !answers.some((answer) => answer.questionId === question.questionId);
        });

        return index ?? index == '-1' ? 0 : index;
    };

    const onAnswerChange = (value) => {
        setSelectedAnswer([value]);
    };

    const onCheckboxChange = (option) => {
        if (selectedAnswer.includes(option)) {
            setSelectedAnswer(selectedAnswer.filter((item) => item !== option));
        } else {
            setSelectedAnswer([...selectedAnswer, option]); // Use spread operator to create a new array
        }
    };

    const setImageUri = async (imageData) => {
        const photo = imageData.assets[0];
        try {
            setLoading(true);
            const { data } = await MMApiService.getPreSignedUrl(photo.fileName);
            if (data) {
                // setState({
                //     ...state,
                //     picture: responseData.storageFileKey
                // })
                setImageSource(photo.uri);
                const result = MMUtils.uploadPicture(photo, data.preSignedUrl);
                if (result) {
                    MMUtils.showToastMessage(`Uploading picture completed.`);
                } else {
                    MMUtils.showToastMessage(`Uploading picture failed...`);
                }
            } else {
                MMUtils.showToastMessage(`Getting presigned url for uploading picture failed. Error: ${data.message}`);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            MMUtils.consoleError(err);
        }
    };

    //for groupRadio
    const handleOptionPress = (option, options) => {
        // setSelectedAnswers({
        //     ...selectedAnswers,
        //     [options]: option,
        // });

        const [optionA, optionB] = options.split('##');
        const _optionA = _.trim(optionA);
        const _optionB = _.trim(optionB);

        const isSelectedOptionA = _.includes(selectedAnswer, _optionA);
        const isSelectedOptionB = _.includes(selectedAnswer, _optionB);

        if (isSelectedOptionA) {
            setSelectedAnswer(selectedAnswer.filter((ans) => ans !== _optionA));
        } else if (isSelectedOptionB) {
            setSelectedAnswer(selectedAnswer.filter((ans) => ans !== _optionB));
        }

        setSelectedAnswer((prevSelectedOptions) =>
            prevSelectedOptions.includes(option) ?
                prevSelectedOptions.filter((ans) => ans !== option) :
                [...prevSelectedOptions, option]
        );


    };

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const onPreviousClick = async () => {
        if (!_.isEmpty(selectedAnswer)) {
            await onSaveQuiz();
        }
        setSelectedAnswer([]);
        setLoading(false);
        if (selectedQuestion > 0) {
            dispatch(reloadChapterList({ reloadChapterList: true }));
            dispatch(reloadBookPage({ reloadBookPage: true }));
            setSelectedQuestion(selectedQuestion - 1);
        };
    }

    const onNextClick = async () => {
        if (!_.isEmpty(selectedAnswer)) {
            await onSaveQuiz();
        }
        setSelectedAnswer([]);
        setLoading(false);
        dispatch(reloadChapterList({ reloadChapterList: true }));
        dispatch(reloadBookPage({ reloadBookPage: true }));
        if (selectedQuestion === questionList.length - 1) {
            navigation.navigate(MMConstants.screens.home);
        } else {
            setSelectedQuestion(selectedQuestion + 1);
        }
    };

    const onSaveQuiz = async () => {
        try {
            setLoading(true);
            const questionId = questionList[selectedQuestion].questionId;
            const apiData = {
                chapterId,
                babyId,
                questionId,
                answer: selectedAnswer
            }
            await MMApiService.saveQuiz(apiData);
            const updatedAnswers = [...answerList];
            const existingAnswerIndex = updatedAnswers.findIndex((answer) => answer.questionId === questionId);
            if (existingAnswerIndex >= 0) { //Answer exist then update
                updatedAnswers[existingAnswerIndex].answer = selectedAnswer;
            } else {
                updatedAnswers.push({ questionId, answer: selectedAnswer });
            }
            setAnswerList(updatedAnswers);

        } catch (error) {
            const serverError = MMUtils.apiErrorMessage(error);
            if (serverError) {
                MMUtils.showToastMessage(serverError);
            }
            setLoading(false);
        }

    };

    const onAddOption = () => {
        if (newOption.trim() !== '') {
            const updatedOptions = [...questionList[selectedQuestion].options, newOption];

            // Update the specific question in the array
            setQuestionList((prevQuestionList) => {
                const updatedQuestions = [...prevQuestionList];
                updatedQuestions[selectedQuestion] = {
                    ...updatedQuestions[selectedQuestion],
                    options: updatedOptions,
                };
                return updatedQuestions;
            });
            setSelectedAnswer([...selectedAnswer, newOption]);
            setNewOption('');
        }
    };

    const onSwipe = (index) => {
        if (index < selectedQuestion) {
            onPreviousClick();
        } else if (index > selectedQuestion) {
            onNextClick();
        }
    };

    const renderView = () => {
        if (!questionList || questionList.length === 0) return null;
        const currentQuestionType = questionList[selectedQuestion].questionType;
        const questionTitle = questionList[selectedQuestion].questionType === MMEnums.questionType.groupedradio ? '' : questionList[selectedQuestion].question
        return (
            <>
                <View style={{ padding: MMConstants.paddingLarge }}>
                    <Text style={theme.fonts.titleMedium} >{questionTitle}</Text>
                    {currentQuestionType === MMEnums.questionType.radio && (
                        <View style={{ paddingTop: MMConstants.paddingLarge }}>
                            {questionList[selectedQuestion].options.map((option, index) => (
                                <View style={{ flexDirection: 'row', paddingTop: MMConstants.paddingLarge }} key={index}>
                                    <RadioButton.Android
                                        value={option}
                                        status={selectedAnswer.length > 0 && selectedAnswer[0] === option ? 'checked' : 'unchecked'}
                                        onPress={() => onAnswerChange(option)}
                                        position='leading'
                                    />
                                    <Text style={[theme.fonts.default, { paddingTop: MMConstants.paddingLarge }]}>{option}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    {currentQuestionType === MMEnums.questionType.checkbox && (
                        <MMScrollView style={{ height: '90%' }}>
                            <View style={{ paddingTop: MMConstants.paddingLarge }}>

                                {questionList[selectedQuestion].options.map((option, index) => (
                                    <View style={{ flexDirection: 'row', paddingTop: MMConstants.paddingLarge }} key={index}>
                                        <Checkbox.Android
                                            status={selectedAnswer.length > 0 && selectedAnswer.includes(option) ? 'checked' : 'unchecked'}
                                            onPress={() => onCheckboxChange(option)}
                                            position='leading'
                                        />
                                        <Text style={[theme.fonts.default, { paddingTop: MMConstants.paddingLarge }]}>{option}</Text>
                                    </View>
                                ))}

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: MMConstants.paddingLarge }}>

                                    <MMInput placeholder='Add something different' value={newOption}
                                        onChangeText={(text) => setNewOption(text)}
                                        containerWidth={'75%'}
                                    />
                                    <MMButton label={'Add'}
                                        width={'22%'}
                                        marginVertical={0}
                                        onPress={onAddOption}
                                        borderRadius={10} />
                                </View>
                            </View>
                        </MMScrollView>
                    )}
                    {currentQuestionType === MMEnums.questionType.textArea && (
                        <View style={{ paddingTop: MMConstants.paddingLarge }}>
                            <MMInputMultiline
                                placeholder="Your answer..."
                                value={selectedAnswer.length > 0 ? selectedAnswer[0] : ''}
                                onChangeText={(text) => onAnswerChange(text)}
                                maxLength={2000}
                            />
                            <Text style={{ textAlign: 'right' }}>
                                {selectedAnswer.length > 0 ? `${selectedAnswer[0].length} / 2000` : '0 / 2000'}</Text>
                        </View>
                    )}
                    {currentQuestionType === MMEnums.questionType.text && (
                        <View style={{ paddingTop: MMConstants.paddingLarge }}>
                            <MMInput
                                placeholder="Your answer..."
                                value={selectedAnswer.length > 0 ? selectedAnswer[0] : ''}
                                onChangeText={(text) => onAnswerChange(text)}
                                maxLength={30}
                            />
                        </View>
                    )}
                    {currentQuestionType === MMEnums.questionType.textImage && (
                        <View style={{ paddingTop: MMConstants.paddingLarge }}>
                            <MMInput
                                placeholder="Your answer..."
                                value={selectedAnswer.length > 0 ? selectedAnswer[0] : ''}
                                onChangeText={(text) => onAnswerChange(text)}
                                maxLength={30}
                            />
                            {/* <>
                                {!imageSource ?
                                    <View style={styles(theme).imagePickerSquare}>
                                        <MMIcon iconName="cloud-upload" iconSize={50} iconColor={theme.colors.primary} onPress={toggleModal} />
                                        <Text style={theme.fonts.default} >Upload Photo</Text>
                                    </View> : null
                                }
                                {imageSource ?
                                    <TouchableOpacity onPress={toggleModal}>
                                        <Image source={{ uri: imageSource }}
                                            style={{ height: Dimensions.get('window').width, width: '100%' }} />
                                    </TouchableOpacity> : null}
                            </> */}
                        </View>
                    )}
                    {currentQuestionType === MMEnums.questionType.timepicker &&
                        (
                            <View style={{ paddingTop: MMConstants.paddingLarge }}>
                                <MMInput
                                    name='birthTime'
                                    placeholder='Enter Birth Time'
                                    value={selectedAnswer.length > 0 ? moment(selectedAnswer[0]).format(MMConstants.dateTimePickerTime) : ''}
                                    onPressIn={() => setShowBirthTime(true)}
                                    onKeyPress={() => setShowBirthTime(true)}
                                    left={<TextInput.Icon
                                        icon='clock-time-four-outline'
                                        forceTextInputFocus={false}
                                        onPress={() => setShowBirthTime(true)}
                                    />}
                                />
                                {
                                    showBirthTime &&
                                    <MMDateTimePicker
                                        name='birthTime'
                                        mode='time'
                                        date={_.isNil(selectedAnswer[0]) ? new Date() : new Date(selectedAnswer[0])}
                                        minimumDate={new Date()}
                                        maximumDate={null}
                                        onConfirm={(date) => {
                                            setSelectedAnswer([new Date(date)]);
                                            setShowBirthTime(false);
                                        }}
                                        onCancel={() => {
                                            setShowBirthTime(false);
                                        }}
                                    />
                                }
                            </View>
                        )
                    }
                    {currentQuestionType === MMEnums.questionType.groupedradio ?

                        <FlatList
                            data={questionList[selectedQuestion].options}
                            renderItem={({ item, index }) => <RenderRadioGroup key={index}
                                option={item}
                                selectedAnswer={selectedAnswer}
                                handleOptionPress={handleOptionPress} />}
                        />


                        : null}
                </View>
                <MMImagePickerModal
                    visible={isModalVisible}
                    toggleModal={toggleModal}
                    onImageChange={(imageUri) => setImageUri(imageUri)} />
            </>
        );
    };

    const renderActionButtons = () => {
        return (
            <MMFlexView>
                <MMButton
                    label="Previous"
                    onPress={onPreviousClick}
                    disabled={selectedQuestion === 0}
                    width={'30%'}
                    borderRadius={100}
                    bgColor={selectedQuestion === 0 ? theme.colors.outline : null}
                />
                <View style={{ paddingTop: 20 }}>
                    <Chip>{`${selectedQuestion + 1}/${questionList ? questionList.length : 0}`}</Chip>
                </View>
                {selectedQuestion === questionList.length - 1 ?
                    <MMButton
                        label="Save"
                        onPress={onNextClick}
                        width={'30%'}
                        borderRadius={100}
                    /> :
                    <MMButton
                        label="Next"
                        onPress={onNextClick}
                        disabled={questionList ? selectedQuestion === questionList.length - 1 : false}
                        width={'30%'}
                        borderRadius={100}
                    />}
            </MMFlexView>
        );
    };

    const renderScreenHeader = () => {
        return (
            <View style={{
                flexDirection: 'row',
                padding: MMConstants.paddingMedium,
                paddingLeft: MMConstants.paddingLarge,
                backgroundColor: theme.colors.primary,
                elevation: 20,
                shadowColor: theme.colors.shadow,
                shadowOpacity: 0.2,
                shadowRadius: 4,
                shadowOffset: { width: -2, height: 4 }
            }}>
                <Avatar.Image size={36} source={{ uri: chapterImage }} style={{ backgroundColor: theme.colors.secondaryContainer }} />
                <Text style={[theme.fonts.titleLarge, { marginLeft: MMConstants.marginLarge }]}>{chapterTitle}</Text>
            </View>
        );
    };

    const renderQuestionSlides = () => {
        return questionList.map((question, index) => (
            <View key={index}>
                {renderView()}
            </View>
        ));
    };

    return (
        <>
            {renderScreenHeader()}
            <MMContentContainer>
                {isLoading ? <MMSpinner /> :
                    // <Swiper
                    //     loop={false}
                    //     index={selectedQuestion}
                    //     onIndexChanged={onSwipe}
                    //     showsPagination={false}
                    //     showsButtons={false}
                    //     removeClippedSubviews={true}
                    // >
                    renderView()}

            </MMContentContainer >
            <View style={[{ backgroundColor: theme.colors.secondaryContainer, padding: MMConstants.paddingLarge }]}>
                {renderActionButtons()}
            </View>
        </>
    );
}

ChapterQuiz.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = (theme) => StyleSheet.create({
    imagePickerSquare: {
        width: '100%',
        height: Dimensions.get('window').width,
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