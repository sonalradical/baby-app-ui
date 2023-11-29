import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';

const Row2 = (props) => {
    const theme = useTheme();
    const { onPickImage, templateData, borderWidth = 1, isDisable = false } = props;

    return (
        <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between', flex: 1
        }
        }>
            <TouchableOpacity style={[styles(theme).row, { borderBottomWidth: borderWidth, borderBottomColor: theme.colors.outline }]}
                onPress={() => onPickImage('p1', 'img')} disabled={isDisable}>
                {templateData.some(item => item.name === 'p1') ? <Image source={{ uri: templateData.find(item => item.name === 'p1').source }}
                    style={styles(theme).image} /> :
                    <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles(theme).row} onPress={() => onPickImage('p2', 'img')} disabled={isDisable}>
                {templateData.some(item => item.name === 'p2') ? <Image source={{ uri: templateData.find(item => item.name === 'p2').source }}
                    style={styles(theme).image} /> :
                    <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />}
            </TouchableOpacity>
        </View>
    );
};

const styles = (theme) => StyleSheet.create({
    row: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 1,

    },
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50,
    },
    image: {
        width: '100%',
        height: Dimensions.get('window').height / 4,
        resizeMode: 'cover',
        flex: 1
    },
});

export default Row2;