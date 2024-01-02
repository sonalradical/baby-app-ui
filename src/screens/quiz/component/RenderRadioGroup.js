import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { RadioButton } from 'react-native-paper';
import { View } from 'react-native';

export default function RenderRadioGroup({ option, selectedAnswers, handleOptionPress }) {

    const [optionA, optionB] = option.split('##');
    const _optionA = _.trim(optionA);
    const _optionB = _.trim(optionB);

    const value = useMemo(() => selectedAnswers[option], [selectedAnswers[option]]);

    return (
        <RadioButton.Group
            onValueChange={value => handleOptionPress(value, option)}
            value={value}
        >
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 5,
                width: '100%'
            }}>
                <RadioButton.Item
                    mode='android' position='leading'
                    label={_optionA} value={_optionA}

                />
                <RadioButton.Item
                    mode='android' position='leading'
                    label={_optionB} value={_optionB}
                    labelStyle={marginLeft = -30}
                    style={{ width: 155 }}
                />
            </View>
        </RadioButton.Group>


    );
}