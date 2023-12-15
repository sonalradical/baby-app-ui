import * as React from 'react';
import { FlatList, Dimensions } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';

const Parents = ({ pageDetails, title = null }) => {
    const theme = useTheme()

    const renderPageDetails = (item, index) => {
        const { questionId, answer } = item;
        const { question } = questionId || '';

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

    return (
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
    );
};

export default Parents;