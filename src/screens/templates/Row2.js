import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import * as _ from 'lodash';
import { Svg, Image as SvgImage } from 'react-native-svg';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';
import MMSpinner from '../../components/common/Spinner';

const Row2 = (props) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const { onPickImage, templateData, pageId, isDisable = false } = props;

    const renderImage = (name, scaleFactor) => {
        const template = templateData.find(item => item.name === name);

        if (template) {
            return (
                <Image
                    style={{ width: Dimensions.get('window').width - 20, height: Dimensions.get('window').width / 2, resizeMode: 'contain' }}
                    source={{ uri: template?.source }}
                />
            );
        } else {
            return <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />;
        }
    };

    const renderImageBox = (name, pageId, extraStyle = {}) => {
        const onPressHandler = pageId
            ? () => onPickImage(name, 'img', Dimensions.get('window').width - 20, Dimensions.get('window').width / 2)
            : () => onPickImage(name, 'img', Dimensions.get('window').width - 20, Dimensions.get('window').width / 2);

        return (
            <TouchableOpacity style={[styles(theme).row, extraStyle]} onPress={onPressHandler} disabled={isDisable}>
                {renderImage(name)}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles(theme).column}>
            {renderImageBox('p1', pageId, { borderBottomWidth: 1, borderBottomColor: theme.colors.outline })}
            {renderImageBox('p2', pageId)}
        </View>
    );
};

const styles = (theme) => StyleSheet.create({
    column: {
        flex: 1,
        flexDirection: 'column', // main axis
    },
    row: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 1,

    },
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50,
    }
});

export default Row2;