import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';
import ImageCropPicker from 'react-native-image-crop-picker';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';

const Blank = (props) => {
    const theme = useTheme();
    const {
        onPickImage, templateData, pageId, isDisable = false, onImageChange
    } = props;

    const onEditPicture = (template) => {
        ImageCropPicker.openCropper({
            path: template.source,
            width: Dimensions.get('window').width - 20,
            height: Dimensions.get('window').width
        })
            .then((selectedImage) => {
                onImageChange({
                    uri: selectedImage.path,
                    width: selectedImage.width,
                    height: selectedImage.height,
                    mime: selectedImage.mime,
                }, template?.name, template?.type);
            })
            .catch((e) => {
                console.log(e);
                Alert.alert(e.message ? e.message : e);
            });
    }

    const renderImage = (name) => {
        const template = templateData.find(item => item.name === name);
        if (template) {
            return (
                <Image
                    style={{ width: Dimensions.get('window').width - 20, height: Dimensions.get('window').width, resizeMode: 'contain' }}
                    source={{ uri: template?.source }}
                />
            );
        } else {
            return <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />;
        }
    };

    return (
        <TouchableOpacity style={styles(theme).container} onPress={pageId
            ? () => onEditPicture(templateData.find(item => item.name === 'p1'))
            : () => onPickImage('p1', 'img', Dimensions.get('window').width - 20, Dimensions.get('window').width)} disabled={isDisable}>
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