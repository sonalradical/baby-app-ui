import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import * as _ from 'lodash';
import { Svg, Image as SvgImage } from 'react-native-svg';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';

const Column2 = (props) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const { onPickImage, templateData, pageId, templateName, isDisable = false } = props;


    const renderImage = (name, scaleFactor) => {
        const template = templateData.find(item => item.name === name);

        if (template) {
            return (
                <Image
                    style={{ width: Dimensions.get('window').width / 2, height: Dimensions.get('window').width, resizeMode: 'contain' }}
                    source={{ uri: template?.source }}
                />
            );
        } else {
            return <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />;
        }
    };

    const renderImageBox = (name, scaleFactor, pageId, extraStyle = {}) => {
        const onPressHandler = () => onPickImage(name, 'img', Dimensions.get('window').width / 2, Dimensions.get('window').width);

        return (
            <TouchableOpacity style={[styles(theme).column, extraStyle]} onPress={onPressHandler} disabled={isDisable}>
                {renderImage(name, scaleFactor)}
            </TouchableOpacity>
        );
    };

    return (
        <>
            <View style={styles(theme).row}>
                {renderImageBox('p1', pageId, { borderRightWidth: 1, borderColor: theme.colors.outline })}
                {renderImageBox('p2', pageId)}
            </View>
        </>
    );
};

const styles = (theme) => StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row', // main axis
    },
    column: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 1,
    },
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50
    }
});

export default Column2;