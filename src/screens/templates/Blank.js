import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';

const Blank = (props) => {
    const theme = useTheme();
    const {
        onPickImage, templateData, isDisable = false
    } = props;

    return (
        <TouchableOpacity style={styles(theme).container}
            onPress={() => onPickImage('p1', 'img')} disabled={isDisable}>
            {templateData.some(item => item.name === 'p1') ? <Image source={{ uri: templateData.find(item => item.name === 'p1').source }}
                style={styles(theme).image} /> :
                <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />}
        </TouchableOpacity>
    );
};

const styles = (theme) => StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50,
    },
    image: {
        width: '100%',
        height: Dimensions.get('window').height / 2 - 48,
        resizeMode: 'cover',
    },
});

export default Blank;