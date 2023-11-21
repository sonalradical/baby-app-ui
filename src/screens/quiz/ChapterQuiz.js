import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { Appbar, Checkbox, Chip, RadioButton, Text, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import MMActionButtons from '../../components/common/ActionButtons';
import MMContentContainer from '../../components/common/ContentContainer';
import MMIcon from '../../components/common/Icon';
import MMInputMultiline from '../../components/common/InputMultiline';
import MMSpinner from '../../components/common/Spinner';

import MMConstants from '../../helpers/Constants';
import MMEnums from '../../helpers/Enums';
import MMUtils from '../../helpers/Utils';

import { reloadChapterList } from '../../redux/Slice/AppSlice';
import MMApiService from '../../services/ApiService';

export default function ChapterQuiz({ navigation, route }) {
    const { babyId, chapterId, title } = route.params;
    const theme = useTheme();
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(true);
    const [selectedQuestion, setSelectedQuestion] = useState();
    const [selectedAnswer, setSelectedAnswer] = useState([]);
    const [questionList, setQuestionList] = useState([]);
    const [answerList, setAnswerList] = useState([]);

    useEffect(() => {
        loadQuiz();
    }, [babyId, chapterId]);

    const loadQuiz = async () => {
        if (babyId && chapterId) {
            setLoading(true);
            try {
                const response = await MMApiService.getQuiz(babyId, chapterId);
                if (response.data) {
                    setQuestionList(response.data.questionList);
                    setAnswerList(response.data.answerList);
                    const indexOfNextUnansweredQuestion = findNextUnansweredQuestion(response.data.questionList, response.data.answerList);
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

        return index ?? 0;
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

    const onPreviousClick = async () => {
        if (!_.isEmpty(selectedAnswer)) {
            await onSaveQuiz();
        }
        setSelectedAnswer([]);
        setLoading(false);
        if (selectedQuestion > 0) {
            setSelectedQuestion(selectedQuestion - 1);
        };
    }

    const onNextClick = async () => {

        if (!_.isEmpty(selectedAnswer)) {
            await onSaveQuiz();
        }
        setSelectedAnswer([]);
        setLoading(false);
        if (selectedQuestion === questionList.length - 1) {
            dispatch(reloadChapterList({ reloadChapterList: true }))
            navigation.navigate('Home');
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

    const renderView = () => {
        if (!questionList || questionList.length === 0) return null;
        const currentQuestionType = questionList[selectedQuestion].questionType;

        return (
            <>
                <View style={{ padding: MMConstants.paddingLarge }}>
                    <Text style={theme.fonts.titleMedium} >{questionList[selectedQuestion].question}</Text>
                    {currentQuestionType === MMEnums.questionType.radio && (
                        <View style={{ paddingTop: MMConstants.paddingLarge }}>
                            {questionList[selectedQuestion].options.map((option, index) => (
                                <View style={{ flexDirection: 'row' }} key={index}>
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
                        <View style={{ paddingTop: MMConstants.paddingLarge }}>
                            {questionList[selectedQuestion].options.map((option, index) => (
                                <View style={{ flexDirection: 'row' }} key={index}>
                                    <Checkbox.Android
                                        status={selectedAnswer.length > 0 && selectedAnswer.includes(option) ? 'checked' : 'unchecked'}
                                        onPress={() => onCheckboxChange(option)}
                                        position='leading'
                                    />
                                    <Text style={[theme.fonts.default, { paddingTop: MMConstants.paddingLarge }]}>{option}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    {currentQuestionType === MMEnums.questionType.text && (
                        <View style={{ paddingTop: MMConstants.paddingLarge }}>
                            <MMInputMultiline
                                placeholder="Your answer..."
                                value={selectedAnswer.length > 0 ? selectedAnswer[0] : ''}
                                onChangeText={(text) => onAnswerChange(text)}
                                maxLength={2000}
                            />
                        </View>
                    )}
                </View>
            </>
        );
    };

    const renderActionButtons = () => {
        return (
            <MMActionButtons>
                <MMIcon
                    iconName='arrow-circle-o-left'
                    iconSize={30}
                    iconColor={selectedQuestion === 0 ? theme.colors.outline : theme.colors.primary}
                    onPress={onPreviousClick}
                    disabled={selectedQuestion === 0}
                />
                <Chip>{`${selectedQuestion + 1}/${questionList ? questionList.length : 0}`}</Chip>
                {selectedQuestion === questionList.length - 1 ?
                    <MMIcon
                        iconName='check-circle-o'
                        iconSize={30}
                        iconColor={theme.colors.primary}
                        onPress={onNextClick}
                    /> :
                    <MMIcon
                        iconName='arrow-circle-o-right'
                        iconSize={30}
                        iconColor={theme.colors.primary}
                        onPress={onNextClick}
                        disabled={questionList ? selectedQuestion === questionList.length - 1 : false}
                    />}
            </MMActionButtons>
        );
    };

    const renderScreenHeader = () => {
        return (
            <Appbar.Header style={{ backgroundColor: theme.colors.primaryContainer }}>
                <Appbar.Content title={title} titleStyle={[theme.fonts.headlineMedium, { alignSelf: 'center' }]} />
            </Appbar.Header>
        );
    };

    return (
        <>
            {renderScreenHeader()}
            <MMContentContainer>
                {isLoading ? <MMSpinner /> : renderView()}
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