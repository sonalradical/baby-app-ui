import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import PropTypes from 'prop-types';
import { Appbar, Checkbox, Chip, RadioButton, Text, useTheme } from 'react-native-paper';

import _ from 'lodash';
import { useDispatch } from 'react-redux';

import { setReloadChapterList, setSelectedBabyId } from '../../redux/Slice/AppSlice';

import MMApiService from '../../services/ApiService';
import MMStyles from '../../helpers/Styles';
import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMColors from '../../helpers/Colors';
import MMSpinner from '../../components/common/Spinner';
import MMIcon from '../../components/common/Icon';
import MMActionButtons from '../../components/common/ActionButtons';
import MMInput from '../../components/common/Input';
import MMContentContainer from '../../components/common/ContentContainer';

export default function Quiz({ navigation, route }) {
    const { babyId, chapterId, title } = route.params;
    const theme = useTheme();
    const dispatch = useDispatch();
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
            dispatch(setReloadChapterList({ reloadChapterList: true }))
            navigation.navigate('Home');
        } else {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const setSelectedAnswerByType = (questionType, answer) => {
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
            <>
                <Text style={[MMStyles.cardHeaderText, MMStyles.mb10]}>{title}</Text>
                <View style={MMStyles.p10}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={MMStyles.mb10}>{currentQuestion + 1}. </Text>
                        <Text style={[MMStyles.subTitle, MMStyles.h5]} numberOfLines={2}>{questionList[currentQuestion].question}</Text>
                    </View>
                    {currentQuestionType === "radio" && (
                        <View>
                            {questionList[currentQuestion].options.map((option, index) => (
                                <View style={{ flexDirection: 'row' }} key={index}>
                                    <RadioButton.Android
                                        value={option}
                                        status={selectedAnswer.option === option ? 'checked' : 'unchecked'}
                                        onPress={() => onOptionChange(option)}
                                        position='leading'
                                    />
                                    <Text style={MMStyles.mt10}>{option}</Text>
                                </View>
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
            </>
        );
    };

    const renderActionButtons = () => {
        return (
            <MMActionButtons>
                <MMIcon
                    iconName='arrow-circle-o-left'
                    iconSize={30}
                    iconColor={currentQuestion === 0 ? MMColors.disabled : theme.colors.primary}
                    onPress={onPreviousClick}
                    disabled={currentQuestion === 0}
                />
                <Chip>{`${currentQuestion + 1}/${questionList ? questionList.length : 0}`}</Chip>
                {currentQuestion === questionList.length - 1 ?
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
                        disabled={questionList ? currentQuestion === questionList.length - 1 : false}
                    />}
            </MMActionButtons>
        );
    };
    const onPressBack = () => {
        dispatch(setReloadChapterList({ reloadChapterList: true }));
        navigation.goBack();
    }

    const renderScreenHeader = () => {
        return (
            <Appbar.Header style={{ backgroundColor: MMColors.white }}>
                <Appbar.BackAction onPress={() => { onPressBack(); }} />
                <Appbar.Content title={'Quiz'} titleStyle={[MMStyles.mediumText]} />
            </Appbar.Header>
        );
    };

    return (
        <>
            {renderScreenHeader()}
            <MMContentContainer>
                {isLoading ? <MMSpinner /> : renderView()}
            </MMContentContainer >
            <View style={[MMStyles.p10, { backgroundColor: MMColors.white }]}>
                {renderActionButtons()}
            </View>
        </>
    );
}

Quiz.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};