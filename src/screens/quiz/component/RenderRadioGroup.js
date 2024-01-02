import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { RadioButton, Text } from 'react-native-paper';
import { View } from 'react-native';

export default function RenderRadioGroup({ option, selectedAnswer, handleOptionPress }) {

    const [optionA, optionB] = option.split('##');
    const _optionA = _.trim(optionA);
    const _optionB = _.trim(optionB);

    const isSelectedOptionA = _.includes(selectedAnswer, _optionA);
    const isSelectedOptionB = _.includes(selectedAnswer, _optionB);
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 5
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }}>
                <RadioButton.Android
                    value={_optionA}
                    status={isSelectedOptionA ? 'checked' : 'unchecked'}
                    onPress={() => handleOptionPress(_optionA, option)}
                />
                <Text>{_optionA}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }}>
                <RadioButton.Android
                    value={_optionB}
                    status={isSelectedOptionB ? 'checked' : 'unchecked'}
                    onPress={() => handleOptionPress(_optionB, option)}
                />
                <Text>{_optionB}</Text>
            </View>
        </View>


    );
}