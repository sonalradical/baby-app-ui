import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';

const Blank = (props) => {
    const theme = useTheme();
    const {
        onPickImage, templateData
    } = props;

    return (
        <>
            <TouchableOpacity style={[styles(theme).container, { borderRightWidth: 1, borderLeftColor: theme.colors.outline }]}
                onPress={() => onPickImage('p1', 'img')}>
                {templateData.some(item => item.name === 'p1') ? <Image source={{ uri: templateData.find(item => item.name === 'p1').source }}
                    style={styles(theme).image} /> :
                    <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />}
            </TouchableOpacity>
        </>
    );
};

const styles = (theme) => StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height / 2,
        margin: MMConstants.marginMedium,
        borderColor: theme.colors.outline,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50,
    },
    image: {
        width: '100%',
        height: Dimensions.get('window').height / 2,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: theme.colors.outline,
        borderRadius: 8,
    },
});

export default Blank;