import * as React from 'react';
import { FlatList, Dimensions, View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';

import { useSelector } from 'react-redux';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';

const WelcomeToWorld = ({ pageDetails, title = null }) => {
    const theme = useTheme();
    const selectedBaby = useSelector((state) => state.AppReducer.baby);
    const filteredPageDetails = pageDetails.filter(item =>
        !["Place/Hospital", "Time", "Birth Story", "Time capsule of the world at this time"].includes(item.questionId.question)
    );

    const renderPageDetails = ({ questionId, answer }, index) => {
        const { question } = questionId || '';

        return (
            <List.Item
                key={index}
                style={{ flex: 1 }}
                title={question}
                titleNumberOfLines={5}
                titleStyle={[theme.fonts.titleSmall, { fontSize: 8 }]}
                description={answer}
                descriptionNumberOfLines={20}
                descriptionStyle={[theme.fonts.default, { lineHeight: 25, fontSize: 8 }]}
            />
        );
    };

    const renderStory = () => {
        const getDetails = (question) => pageDetails.find(item => item.questionId.question === question);

        const questions = ["Birth Story", "Time capsule of the world at this time"];

        return (
            <View>
                {questions.map((question, index) => {
                    const details = getDetails(question);
                    if (details) {
                        return (
                            <React.Fragment key={index}>
                                <Text style={[theme.fonts.headlineMedium, { textAlign: 'center', paddingVertical: 15 }]}>{details.questionId.question}</Text>
                                <Text style={[theme.fonts.default, { fontSize: 11, textAlign: 'center', lineHeight: 20 }]}>{details.answer}</Text>
                            </React.Fragment>
                        );
                    }

                    return null; // Skip rendering if details are not found for the current question
                })}
            </View>
        );
    };

    return (
        <>
            <FlatList
                data={filteredPageDetails}
                ListHeaderComponent={
                    <>
                        <Text style={[theme.fonts.headlineMedium, { textAlign: 'center', paddingBottom: MMConstants.paddingLarge }]}>{title}</Text>
                        <Text style={[theme.fonts.default, { fontSize: 11, textAlign: 'center' }]}>
                            {'you were born '}
                            {pageDetails.some(item => item.questionId.question === "Place/Hospital") && (
                                <>at {pageDetails.find(item => item.questionId.question === "Place/Hospital").answer} </>
                            )}
                            {selectedBaby.birthDate && <>on {MMUtils.dispalyMonthDate(selectedBaby.birthDate)} </>}
                            {pageDetails.some(item => item.questionId.question === "Time") && (
                                <>at {MMUtils.displayTime(pageDetails.find(item => item.questionId.question === "Time").answer)}</>)}
                        </Text>
                    </>
                }
                columnWrapperStyle={{ width: Dimensions.get('window').width - 50 }}
                renderItem={({ item, index }) => renderPageDetails(item, index)}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
            />
            {renderStory()}
        </>
    );
};

export default WelcomeToWorld;
