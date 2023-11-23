import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';

const Column2 = (props) => {
    const theme = useTheme();
    const { onPickImage, borderWidth = 1, templateData } = props;

    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1
        }}>
            <TouchableOpacity style={[styles(theme).column, { borderRightWidth: borderWidth, borderColor: theme.colors.outline, borderStyle: 'dashed' }]}
                onPress={() => onPickImage('p1', 'img')}>
                {templateData.some(item => item.name === 'p1') ? <Image source={{ uri: templateData.find(item => item.name === 'p1').source }}
                    style={styles(theme).image} /> :
                    <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles(theme).column} onPress={() => onPickImage('p2', 'img')}>
                {templateData.some(item => item.name === 'p2') ? <Image source={{ uri: templateData.find(item => item.name === 'p2').source }}
                    style={styles(theme).image} /> :
                    <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />}
            </TouchableOpacity>
        </View>
    );
};

const styles = (theme) => StyleSheet.create({

    column: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 1,
    },
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50
    },
    image: {
        width: '100%',
        height: Dimensions.get('window').height / 2,
        resizeMode: 'cover'
    },
});

export default Column2;