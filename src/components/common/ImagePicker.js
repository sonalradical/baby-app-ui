import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, Modal, TouchableOpacity } from 'react-native';
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MMUtils from '../../helpers/Utils';
import MMColors from '../../helpers/Colors';
import MMStyles from '../../helpers/Styles';
import { Divider } from 'react-native-paper';

const MMProfileAvatar = (props) => {
    const { image, source, onImageChange } = props;
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

    const showBottomSheet = () => setBottomSheetVisible(true);
    const hideBottomSheet = () => setBottomSheetVisible(false);

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

        hideBottomSheet();
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
        <View>
            <TouchableOpacity onPress={showBottomSheet} style={{ alignItems: 'center' }}>
                <View
                    style={[
                        styles.avatarContainer,
                        { backgroundColor: MMColors.lightGray },
                    ]}
                >
                    {image ? (
                        <Image source={source} style={styles.avatar} />
                    ) : (
                        <Text style={MMStyles.titleText}>{`Upload \n Photo`}</Text>
                    )}
                </View>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={bottomSheetVisible}
                onRequestClose={hideBottomSheet}
            >
                <View style={styles.bottomSheet}>
                    <TouchableOpacity onPress={() => handleImageSelect('photo')}>
                        <Text style={styles.bottomSheetOption}>Choose from Photos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleImageSelect('camera')}>
                        <Text style={styles.bottomSheetOption}>Take Photo</Text>
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity onPress={hideBottomSheet}>
                        <Text style={[styles.bottomSheetOption, { color: MMColors.textContent }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 75,
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        padding: 16,
    },
    bottomSheetOption: {
        fontSize: 18,
        padding: 10,
        textAlign: 'center',
        color: MMColors.black
    },
});

export default MMProfileAvatar;