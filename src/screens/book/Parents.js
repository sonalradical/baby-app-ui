import * as React from 'react';
import { FlatList, Dimensions, View, StyleSheet } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import _ from 'lodash';
import MMEnums from '../../helpers/Enums';

const Parents = ({ pageDetails, title = null }) => {
    const theme = useTheme();

    const renderPageDetails = (item, index) => {
        const { questionId, answer, } = item;
        const { question, questionType } = questionId || '';

        if (questionType === MMEnums.questionType.groupedradio) {
            return null;
        }

        return (
            <List.Item
                key={index}
                style={{ flex: 1 }}
                title={question}
                titleNumberOfLines={5}
                titleStyle={theme.fonts.titleSmall}
                description={answer}
                descriptionNumberOfLines={2000}
                descriptionStyle={[theme.fonts.default, { lineHeight: 25 }]}
            />
        );
    };



    const renderOptionDetails = (item, index, optionQuestions) => {
        const [optionA, optionB] = item.split('##').map((label) => label.trim());
        const isSelectedOptionA = _.includes(optionQuestions.answer, optionA);
        const isSelectedOptionB = _.includes(optionQuestions.answer, optionB);

        return (
            <>
                <View key={index} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 8 }}>
                    <Text style={[styles(theme).optionText, { backgroundColor: isSelectedOptionA ? 'yellow' : 'transparent' }]}>{optionA}</Text>
                    <Text style={styles(theme).optionText}> or </Text>
                    <Text style={[styles(theme).optionText, { backgroundColor: isSelectedOptionB ? 'yellow' : 'transparent' }]}>{optionB}</Text>
                </View>
                <View style={{ width: '10%' }}></View>
            </>
        )

    }

    const renderParentsOption = () => {
        const optionQuestions = _.chain(pageDetails)
            .filter((pageData) => pageData.questionId.questionType === MMEnums.questionType.groupedradio)
            .first()
            .value();

        return (
            <FlatList
                data={optionQuestions.questionId.options}
                ListHeaderComponent={<Text style={[theme.fonts.headlineMedium, { textAlign: 'center' }]}>This or That</Text>}
                columnWrapperStyle={{ width: Dimensions.get('window').width - 30, justifyContent: 'space-between', }}
                renderItem={({ item, index }) => {
                    return renderOptionDetails(item, index, optionQuestions);
                }}
                keyExtractor={(item, index) => index}
                numColumns={3}
            />
        )
    }

    return (
        <>
            <FlatList
                data={pageDetails}
                ListHeaderComponent={<Text style={[theme.fonts.headlineMedium, { textAlign: 'center' }]}>{title}</Text>}
                columnWrapperStyle={{ width: Dimensions.get('window').width - 50 }}
                renderItem={({ item, index }) => {
                    return renderPageDetails(item, index);
                }}
                keyExtractor={(item, index) => index}
                numColumns={3}
            />
            {renderParentsOption()}
        </>
    );
};

const styles = (theme) => StyleSheet.create({
    optionText: {
        fontSize: 6,
        width: 'auto'
    }
});

export default Parents;