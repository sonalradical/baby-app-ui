import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Appbar, Checkbox, Chip, RadioButton, Text } from 'react-native-paper';

import _ from 'lodash';

import MMApiService from '../../services/ApiService';
import MMStyles from '../../helpers/Styles';
import MMUtils from '../../helpers/Utils';
import MMSpinner from '../../components/common/Spinner';
import MMIcon from '../../components/common/Icon';
import MMColors from '../../helpers/Colors';
import MMActionButtons from '../../components/common/ActionButtons';
import MMInput from '../../components/common/Input';

export default function Quiz({ navigation, route }) {
    const { babyId, chapterId } = route.params;

    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState({
        option: "",
        checkboxes: [],
        text: ""
    });
    const [questionList, setQuestionList] = useState([]);
    const [answerList, setAnswerList] = useState([]);

    useEffect(() => {
        const loadQuiz = async () => {
            if (babyId && chapterId) {
                try {
                    setIsLoading(true);
                    const response = await MMApiService.getQuiz(babyId, chapterId);
                    if (response.data) {
                        setQuestionList(response.data.questionList);
                        setAnswerList(response.data.answerList);
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
    }, [babyId, chapterId]);

    useEffect(() => {
        // Update selectedAnswer based on the currentQuestionType
        const currentQuestionType = questionList[currentQuestion]?.questionType;
        const currentQuestionId = questionList[currentQuestion]?._id;

        const matchingAnswer = answerList.find(answer => answer.questionId === currentQuestionId);

        if (matchingAnswer && matchingAnswer.questionId === currentQuestionId) {
            if (currentQuestionType === "radio") {
                setSelectedAnswer({ option: matchingAnswer.answer });
            } else if (currentQuestionType === "checkbox") {
                setSelectedAnswer({ checkboxes: matchingAnswer.answer });
            } else if (currentQuestionType === "text") {
                setSelectedAnswer({ text: matchingAnswer.answer });
            }
        }
    }, [currentQuestion, questionList, answerList]);

    const onNextClick = () => {
        if (currentQuestion < questionList.length - 1) {
            // Get the current answer
            const currentAnswer = getAnswer();

            // Store the current answer
            const questionId = questionList[currentQuestion]._id;

            if (!_.isEmpty(currentAnswer)) {
                onSaveQuiz(questionId, currentAnswer);
            }
            const existingAnswerIndex = answerList.findIndex((answer) => answer.questionId === questionId);
            if (existingAnswerIndex !== -1) {
                // Update the existing answer in the answers array
                const updatedAnswers = [...answerList];
                updatedAnswers[existingAnswerIndex].answer = currentAnswer;
                setAnswerList(updatedAnswers);
            } else {
                // Push a new answer into the answers array
                const newAnswer = {
                    questionId: questionId,
                    answer: currentAnswer,
                };
                setAnswerList([...answerList, newAnswer]);
                setSelectedAnswer({ option: "", checkboxes: [], text: "" });
            }

            // Restore the selected answer when returning to the next question
            const nextQuestionId = questionList[currentQuestion + 1]._id;
            const nextQuestionAnswer = answerList.find((answer) => answer.questionId === nextQuestionId);
            const nextQuestionType = questionList[currentQuestion + 1].questionType;

            if (nextQuestionAnswer) {
                if (nextQuestionType === "radio") {
                    setSelectedAnswer({ option: nextQuestionAnswer.answer } || "");
                } else if (nextQuestionType === "checkbox") {
                    setSelectedAnswer({ checkboxes: nextQuestionAnswer.answer } || []);
                } else if (nextQuestionType === "text") {
                    setSelectedAnswer({ text: nextQuestionAnswer.answer } || "");
                }
            }
            else {
                // If there's no answer for the next question, set it to an empty answer
                setSelectedAnswer({ option: "", checkboxes: [], text: "" });
            }

            // Move to the next question
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const onSaveQuiz = async (questionId, answer) => {
        if (questionId && !_.isEmpty(answer)) {
            try {
                setIsLoading(true);
                const apiData = {
                    chapterId,
                    babyId,
                    questionId,
                    answer
                }
                const response = await MMApiService.saveQuiz(apiData);
                if (response) {
                    console.log('saved...', response)
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

    const getAnswer = () => {
        const currentQuestionType = questionList[currentQuestion].questionType;

        if (currentQuestionType === "radio") {
            return selectedAnswer.option;
        } else if (currentQuestionType === "checkbox") {
            return selectedAnswer.checkboxes;
        } else if (currentQuestionType === "text") {
            return selectedAnswer.text;
        }
        return null;
    };

    const onPreviousClick = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);

            const questionId = questionList[currentQuestion - 1]._id;
            const previousAnswer = answerList.find((answer) => answer.questionId === questionId);
            const previousQuestionType = questionList[currentQuestion - 1].questionType;

            if (previousAnswer) {
                if (previousQuestionType === "radio") {
                    setSelectedAnswer({ option: previousAnswer.answer });
                } else if (previousQuestionType === "checkbox") {
                    setSelectedAnswer({ checkboxes: previousAnswer.answer });
                } else if (previousQuestionType === "text") {
                    setSelectedAnswer({ text: previousAnswer.answer });
                }
            }
        };
    }

    const onOptionChange = (value) => {
        setSelectedAnswer({ ...selectedAnswer, option: value });
    };

    const onTextChange = (value) => {
        setSelectedAnswer({ ...selectedAnswer, text: value });
    };

    const onCheckboxChange = (option) => {
        const { checkboxes } = selectedAnswer;
        if (checkboxes.includes(option)) {
            setSelectedAnswer({ ...selectedAnswer, checkboxes: checkboxes.filter((item) => item !== option) });
        } else {
            setSelectedAnswer({ ...selectedAnswer, checkboxes: [...checkboxes, option] });
        }
    };

    const renderView = () => {
        if (!questionList || questionList.length === 0) return null;

        const currentQuestionType = questionList[currentQuestion].questionType;

        return (
            <View style={MMStyles.containerPadding}>
                <Text style={[MMStyles.mb10, { alignSelf: 'center' }]}>{questionList[currentQuestion].question}</Text>
                {currentQuestionType === "radio" && (
                    <View style={{ alignItems: 'flex-start' }}>
                        {questionList[currentQuestion].options.map((option, index) => (
                            <RadioButton.Item
                                key={index}
                                label={option}
                                value={option}
                                status={selectedAnswer.option === option ? 'checked' : 'unchecked'}
                                onPress={() => onOptionChange(option)}
                                position='leading'
                            />
                        ))}
                    </View>
                )}
                {currentQuestionType === "checkbox" && (
                    <View style={{ alignItems: 'flex-start' }}>
                        {questionList[currentQuestion].options.map((option, index) => (
                            <View key={index}>
                                <Checkbox.Item
                                    label={option}
                                    status={selectedAnswer.checkboxes.includes(option) ? 'checked' : 'unchecked'}
                                    onPress={() => onCheckboxChange(option)}
                                    position='leading'
                                />
                            </View>
                        ))}
                    </View>
                )}
                {currentQuestionType === "text" && (
                    <MMInput
                        placeholder="Your answer..."
                        value={selectedAnswer.text}
                        onChangeText={(text) => onTextChange(text)}
                    />
                )}
            </View>
        );
    };

    const renderActionButtons = () => {
        return (
            <MMActionButtons>
                <MMIcon
                    iconName='chevron-left'
                    iconSize={24}
                    iconColor={MMColors.purple}
                    onPress={onPreviousClick}
                    disabled={currentQuestion === 0}
                />
                <Chip>{`${currentQuestion + 1}/${questionList ? questionList.length : 0}`}</Chip>
                <MMIcon
                    iconName='chevron-right'
                    iconSize={24}
                    iconColor={MMColors.purple}
                    onPress={onNextClick}
                    disabled={questionList ? currentQuestion === questionList.length - 1 : false}
                />
            </MMActionButtons>
        );
    };

    const renderScreenHeader = () => {
        return (
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Content title='Quiz' />
            </Appbar.Header>
        );
    };

    return (
        <>
            {renderScreenHeader()}
            <View style={MMStyles.container}>
                {isLoading ? <MMSpinner /> : renderView()}
                {renderActionButtons()}
            </View>
        </>
    );
}

Quiz.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};