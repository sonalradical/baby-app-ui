import * as React from 'react';
import { View } from 'react-native';
import { RadioButton, Text, useTheme } from 'react-native-paper';
import MMFormErrorText from './FormErrorText';

const MMRadioButton = ({ label, options, selectedValue, onValueChange, errorText }) => {
    const theme = useTheme();

    return (
        <View>
            <Text style={theme.fonts.titleMedium}>{label}</Text>
            <View style={{ flexDirection: 'row' }}>
                {options.map((option) => (
                    <View key={option.value} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton.Android
                            value={option.value}
                            status={selectedValue === option.value ? 'checked' : 'unchecked'}
                            onPress={() => onValueChange(option.value)}
                        />
                        <Text style={theme.fonts.default}>{option.label}</Text>
                    </View>
                ))}
            </View>
            <MMFormErrorText errorText={errorText} />
        </View>
    );
};


export default MMRadioButton;