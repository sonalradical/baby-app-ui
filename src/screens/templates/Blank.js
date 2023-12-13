import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';
import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';

const Blank = (props) => {
    const theme = useTheme();
    const { onPickImage, templateData, pageId, isDisable = false, onEditPicture } = props;
    const deviceWidth = Dimensions.get('window').width;

    const renderImage = (name) => {
        const template = templateData.find(item => item.name === name);
        if (template) {
            return (
                <Image
                    style={{ width: deviceWidth - 20, height: deviceWidth, resizeMode: 'contain' }}
                    source={{ uri: template?.source }}
                />
            );
        } else {
            return <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />;
        }
    };

    return (
        <TouchableOpacity style={styles(theme).container} onPress={pageId
            ? () => onEditPicture('p1', deviceWidth - 20, deviceWidth)
            : () => onPickImage('p1', 'img', deviceWidth - 20, deviceWidth)} disabled={isDisable}>
            {renderImage('p1')}
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
});

export default Blank;