import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import PropTypes from 'prop-types';
import { Appbar, Checkbox, Chip, RadioButton, Text } from 'react-native-paper';

import _ from 'lodash';

import MMApiService from '../../services/ApiService';
import MMStyles from '../../helpers/Styles';
import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMSpinner from '../../components/common/Spinner';
import MMIcon from '../../components/common/Icon';
import MMColors from '../../helpers/Colors';
import MMActionButtons from '../../components/common/ActionButtons';
import MMInput from '../../components/common/Input';
import { MMRoundButton } from '../../components/common/Button';
import MMContentContainer from '../../components/common/ContentContainer';
import MMSurface from '../../components/common/Surface';

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
                        const sortedQuestions = _.sortBy(response.data.questionList, 'position');
                        setQuestionList(sortedQuestions);
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
            setSelectedAnswer(setSelectedAnswerByType(currentQuestionType, matchingAnswer.answer));
        }
        else {
            setSelectedAnswer({ option: "", checkboxes: [], text: "" });
        }
    }, [currentQuestion, questionList, answerList]);

    const onNextClick = () => {
        const currentAnswer = getAnswer();
        const questionId = questionList[currentQuestion]._id;

        if (!_.isEmpty(currentAnswer)) {
            onSaveQuiz(questionId, currentAnswer);
        }

        const existingAnswerIndex = answerList.findIndex((answer) => answer.questionId === questionId);

        const updatedAnswers = [...answerList];

        if (existingAnswerIndex !== -1) {
            updatedAnswers[existingAnswerIndex].answer = currentAnswer;
        } else {
            updatedAnswers.push({ questionId, answer: currentAnswer });
            setSelectedAnswer({ option: "", checkboxes: [], text: "" });
        }

        setAnswerList(updatedAnswers);

        if (currentQuestion === questionList.length - 1) {
            setCurrentQuestion(0);
            navigation.navigate('Home', { babyId });
        } else {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const setSelectedAnswerByType = (questionType, answer) => {
        console.log(questionType, '.....')
        switch (questionType) {
            case MMConstants.questionType.radio:
                return { option: answer, checkboxes: [], text: "" };
            case MMConstants.questionType.checkbox:
                return { checkboxes: answer, text: "", option: "" };
            case MMConstants.questionType.text:
                return { text: answer, checkboxes: [], option: "" };
            default:
                return { option: "", checkboxes: [], text: "" };
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

        if (currentQuestionType === MMConstants.questionType.radio) {
            return selectedAnswer.option;
        } else if (currentQuestionType === MMConstants.questionType.checkbox) {
            return selectedAnswer.checkboxes;
        } else if (currentQuestionType === MMConstants.questionType.text) {
            return selectedAnswer.text;
        }
        return null;
    };

    const onPreviousClick = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
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
            <MMSurface padding={[18, 18, 18, 18]} >
                <View style={{ height: Dimensions.get('window').height / 2 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={MMStyles.mb10}>{currentQuestion + 1}. </Text>
                        <Text style={[MMStyles.mb10, { alignSelf: 'center' }]} numberOfLines={2}>{questionList[currentQuestion].question}</Text>
                    </View>
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
                {renderActionButtons()}
            </MMSurface>
        );
    };

    const renderActionButtons = () => {
        return (
            <MMActionButtons>
                <MMIcon
                    iconName='chevron-left'
                    iconSize={24}
                    iconColor={MMColors.gray}
                    onPress={onPreviousClick}
                    disabled={currentQuestion === 0}
                />
                <Chip>{`${currentQuestion + 1}/${questionList ? questionList.length : 0}`}</Chip>
                {currentQuestion === questionList.length - 1 ?
                    <MMRoundButton
                        optionalTextStyle={[MMStyles.h5]}
                        label="Submit"
                        onPress={onNextClick} /> :
                    <MMIcon
                        iconName='chevron-right'
                        iconSize={24}
                        iconColor={MMColors.gray}
                        onPress={onNextClick}
                        disabled={questionList ? currentQuestion === questionList.length - 1 : false}
                    />}
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
            <MMContentContainer>
                {isLoading ? <MMSpinner /> : renderView()}
            </MMContentContainer >
        </>
    );
}

Quiz.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};