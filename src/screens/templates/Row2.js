import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';
import ImagePicker from 'react-native-image-crop-picker';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';

const Row2 = (props) => {
    const theme = useTheme();
    const { onPickImage, templateData, pageId, isDisable = false, onImageChange } = props;

    const onEditPicture = (template) => {
        ImagePicker.openCropper({
            path: template?.source,
            width: Dimensions.get('window').width - 20,
            height: Dimensions.get('window').width / 2
        })
            .then((selectedImage) => {
                onImageChange({
                    uri: selectedImage.path,
                    width: selectedImage.width,
                    height: selectedImage.height,
                    mime: selectedImage.mime,
                }, template?.name, template?.type);
            })
            .catch((e) => MMUtils.showToastMessage(e.message ? e.message : e));
    }

    const renderImage = (name) => {
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

    const renderImageBox = (name, extraStyle = {}) => {
        return (
            <>
                {pageId ?
                    <TouchableOpacity style={[styles(theme).row, extraStyle]}
                        onPress={() => onEditPicture(templateData.find(item => item.name === name))} disabled={isDisable}>
                        {renderImage(name)}
                    </TouchableOpacity> :
                    <TouchableOpacity style={[styles(theme).row, extraStyle]}
                        onPress={() => onPickImage(name, 'img', Dimensions.get('window').width - 20, Dimensions.get('window').width / 2)}
                        disabled={isDisable}>
                        {renderImage(name)}
                    </TouchableOpacity>
                }
            </>
        );
    };

    return (
        <View style={styles(theme).column}>
            {renderImageBox('p1', { borderBottomWidth: 1, borderBottomColor: theme.colors.outline })}
            {renderImageBox('p2')}
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