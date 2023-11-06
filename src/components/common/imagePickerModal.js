import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, Modal, TouchableOpacity } from 'react-native';
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MMUtils from '../../helpers/Utils';
import MMColors from '../../helpers/Colors';
import MMStyles from '../../helpers/Styles';
import { Divider } from 'react-native-paper';

const MMImagePickerModal = (props) => {
    const { visible, toggleModal, onImageChange } = props;

    const handleImageSelect = (type) => {
        const options = {
            mediaType: type === 'camera' ? 'camera' : 'photo',
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
        };

        if (type === 'camera') {
            launchCamera(options, (response) => {
                handleImageResponse(response);
            });
        } else {
            launchImageLibrary(options, (response) => {
                handleImageResponse(response);
            });
        }
        toggleModal();
    };

    const handleImageResponse = (response) => {
        if (response.didCancel) {
            MMUtils.displayConsoleLog('User cancelled image picker');
        } else if (response.errorCode === 'camera_unavailable') {
            MMUtils.displayConsoleLog('Camera not available on device');
        } else if (response.errorCode === 'permission') {
            MMUtils.displayConsoleLog('Permission not satisfied');
        } else if (response.errorCode === 'others') {
            MMUtils.displayConsoleLog(response.errorMessage);
        } else {
            console.log(response, 'response');
            onImageChange(response);
        }
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
                <View style={styles.bottomSheet}>
                    <TouchableOpacity onPress={() => handleImageSelect('photo')}>
                        <Text style={styles.bottomSheetOption}>Choose from Photos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleImageSelect('camera')}>
                        <Text style={styles.bottomSheetOption}>Take Photo</Text>
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity onPress={toggleModal}>
                        <Text style={[styles.bottomSheetOption, { color: MMColors.textContent }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: MMColors.white,
        padding: 16,
        shadowColor: '#000000',
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
        padding: 10,
        textAlign: 'center',
        color: MMColors.black,
    },
});

export default MMImagePickerModal;