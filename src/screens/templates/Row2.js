import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';

const Row2 = (props) => {
    const theme = useTheme();
    const { onPickImage, templateData } = props;

    return (
        <View style={styles(theme).container}>
            <TouchableOpacity style={[styles(theme).row, { borderBottomWidth: 1, borderBottomColor: theme.colors.outline }]}
                onPress={() => onPickImage('p1', 'img')}>
                {templateData.some(item => item.name === 'p1') ? <Image source={{ uri: templateData.find(item => item.name === 'p1').value }}
                    style={styles(theme).image} /> :
                    <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles(theme).row} onPress={() => onPickImage('p2', 'img')}>
                {templateData.some(item => item.name === 'p2') ? <Image source={{ uri: templateData.find(item => item.name === 'p2').value }}
                    style={styles(theme).image} /> :
                    <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />}
            </TouchableOpacity>
        </View>
    );
};

const styles = (theme) => StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: Dimensions.get('window').height / 2,
        borderColor: theme.colors.outline,
        borderWidth: 1,
        margin: MMConstants.marginMedium,
        borderStyle: 'dashed',
    },
    row: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50,
    },
    image: {
        width: '100%',
        height: Dimensions.get('window').height / 4,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: theme.colors.outline,
    },
});

export default Row2;