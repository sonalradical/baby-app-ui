import React from 'react';
import { Divider, useTheme } from 'react-native-paper';
import { View, StyleSheet, Text, Modal, TouchableOpacity, Platform } from 'react-native';
import * as _ from 'lodash';
import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import ImagePicker from 'react-native-image-crop-picker';


const MMImageCrop = (props) => {
    const theme = useTheme();
    const { visible, toggleModal, onImageChange, containerSize } = props;

    const pickSingleWithCamera = (mediaType = 'photo') => {
        ImagePicker.openCamera({
            cropping: true,
            width: containerSize.width,
            height: containerSize.height,
            includeExif: true,
            mediaType,
        })
            .then((selectedImage) => {
                onImageChange({
                    uri: selectedImage.path,
                    width: selectedImage.width,
                    height: selectedImage.height,
                    mime: selectedImage.mime,
                })
                toggleModal();
            })
            .catch((e) => { MMUtils.showToastMessage(e.message ? e.message : e), toggleModal() });

    };

    const pickSingle = (cropit, circular = false) => {
        ImagePicker.openPicker({
            width: containerSize.width,
            height: containerSize.height,
            cropping: true,
            cropperCircleOverlay: circular,
            sortOrder: 'none',
            compressImageQuality: 1,
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000,
            compressVideoPreset: 'MediumQuality',
            includeExif: true,
            cropperStatusBarColor: 'white',
            cropperToolbarColor: 'white',
            cropperActiveWidgetColor: 'white',
            cropperToolbarWidgetColor: '#3498DB',
        })
            .then((selectedImage) => {
                onImageChange({
                    uri: selectedImage.path,
                    width: selectedImage.width,
                    height: selectedImage.height,
                    mime: selectedImage.mime,
                })
                toggleModal();
            })
            .catch((e) => { MMUtils.showToastMessage(e.message ? e.message : e), toggleModal() });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={toggleModal}
        >
            <View style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}>
                <View style={styles(theme).bottomSheet}>
                    <TouchableOpacity onPress={() => pickSingle()}>
                        <Text style={styles(theme).bottomSheetOption}>Choose from Photos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pickSingleWithCamera()}>
                        <Text style={styles(theme).bottomSheetOption}>Take Photo</Text>
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity onPress={toggleModal}>
                        <Text style={[styles(theme).bottomSheetOption, { color: theme.colors.text.secondory }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = (theme) => StyleSheet.create({
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: theme.colors.secondaryContainer,
        padding: MMConstants.paddingLarge,
        shadowColor: theme.colors.shadow,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        shadowOpacity: 30,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        },
    },
    bottomSheetOption: {
        fontSize: 18,
        padding: MMConstants.paddingLarge,
        textAlign: 'center',
        color: theme.colors.text.primary,
    },
});

export default MMImageCrop;