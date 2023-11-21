import React, { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import PropTypes from 'prop-types';
import { Appbar, Checkbox, Chip, RadioButton, Text, useTheme } from 'react-native-paper';

import _ from 'lodash';
import { useDispatch } from 'react-redux';

import { reloadChapterList } from '../../redux/Slice/AppSlice';

import MMEnums from '../../helpers/Enums';
import MMUtils from '../../helpers/Utils';
import MMApiService from '../../services/ApiService';
import MMSpinner from '../../components/common/Spinner';
import MMIcon from '../../components/common/Icon';
import MMActionButtons from '../../components/common/ActionButtons';
import MMContentContainer from '../../components/common/ContentContainer';
import MMInputMultiline from '../../components/common/InputMultiline';

export default function ChapterQuiz({ navigation, route }) {
    const { babyId, chapterId, title } = route.params;
    const theme = useTheme();
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState({
        option: "",
        checkboxes: [],
        text: ""
    });
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
        // Update selectedAnswer based on the currentQuestionType
        const currentQuestionType = questionList[currentQuestion]?.questionType;
        const currentQuestionId = questionList[currentQuestion]?.questionId;

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
        const questionId = questionList[currentQuestion].questionId;

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
            dispatch(reloadChapterList({ reloadChapterList: true }))
            navigation.navigate('Home');
        } else {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const setSelectedAnswerByType = (questionType, answer) => {
        switch (questionType) {
            case MMEnums.questionType.radio:
                return { option: answer, checkboxes: [], text: "" };
            case MMEnums.questionType.checkbox:
                return { checkboxes: answer, text: "", option: "" };
            case MMEnums.questionType.text:
                return { text: answer, checkboxes: [], option: "" };
            default:
                return { option: "", checkboxes: [], text: "" };
        }
    };

    const onSaveQuiz = async (questionId, answer) => {
        if (questionId && !_.isEmpty(answer)) {
            try {
                setLoading(true);
                const apiData = {
                    chapterId,
                    babyId,
                    questionId,
                    answer
                }
                const response = await MMApiService.saveQuiz(apiData);
                if (response) {
                    console.log('saved...', response)
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

    const getAnswer = () => {
        const currentQuestionType = questionList[currentQuestion].questionType;

        if (currentQuestionType === MMEnums.questionType.radio) {
            return selectedAnswer.option;
        } else if (currentQuestionType === MMEnums.questionType.checkbox) {
            return selectedAnswer.checkboxes;
        } else if (currentQuestionType === MMEnums.questionType.text) {
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
                <View style={{ padding: 10 }}>
                    <Text style={theme.fonts.titleMedium} >{questionList[currentQuestion].question}</Text>
                    {currentQuestionType === MMEnums.questionType.radio && (
                        <View style={{ paddingTop: 10 }}>
                            {questionList[currentQuestion].options.map((option, index) => (
                                <View style={{ flexDirection: 'row' }} key={index}>
                                    <RadioButton.Android
                                        value={option}
                                        status={selectedAnswer.option === option ? 'checked' : 'unchecked'}
                                        onPress={() => onOptionChange(option)}
                                        position='leading'
                                    />
                                    <Text style={[theme.fonts.default, { paddingTop: 10 }]}>{option}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    {currentQuestionType === MMEnums.questionType.checkbox && (
                        <View style={{ paddingTop: 10 }}>
                            {questionList[currentQuestion].options.map((option, index) => (
                                <View style={{ flexDirection: 'row' }} key={index}>
                                    <Checkbox.Android
                                        status={selectedAnswer.checkboxes.includes(option) ? 'checked' : 'unchecked'}
                                        onPress={() => onCheckboxChange(option)}
                                        position='leading'
                                    />
                                    <Text style={[theme.fonts.default, { paddingTop: 10 }]}>{option}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    {currentQuestionType === MMEnums.questionType.text && (
                        <View style={{ paddingTop: 10 }}>

                            <MMInputMultiline
                                placeholder="Your answer..."
                                value={selectedAnswer.text}
                                onChangeText={(text) => onTextChange(text)}
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
                    iconColor={currentQuestion === 0 ? theme.colors.outline : theme.colors.primary}
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
            <View style={[{ backgroundColor: theme.colors.secondaryContainer, padding: 10 }]}>
                {renderActionButtons()}
            </View>
        </>
    );
}

ChapterQuiz.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};