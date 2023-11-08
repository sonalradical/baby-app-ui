import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, Modal, TouchableOpacity } from 'react-native';
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MMUtils from '../../helpers/Utils';
import { Divider, IconButton, useTheme } from 'react-native-paper';

const MMProfileAvatar = (props) => {
    const theme = useTheme();
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
            onImageChange(response);
        }
    };

    return (
        <View>
            <TouchableOpacity onPress={showBottomSheet} style={{ alignItems: 'center' }}>
                <View
                    style={[
                        styles(theme).avatarContainer
                    ]}
                >
                    {image ? (
                        <Image source={source ? source : require('../../assets/images/parenthood.jpg')} style={styles(theme).avatar} />
                    ) : (
                        <Text style={theme.fonts.default}>{`Upload \n Photo`}</Text>
                    )}

                    <IconButton
                        icon="camera"
                        color={theme.colors.text.primary}
                        size={24}
                        style={styles(theme).iconButton}
                        onPress={showBottomSheet}
                    />
                </View>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={bottomSheetVisible}
                onRequestClose={hideBottomSheet}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}>
                    <View style={styles(theme).bottomSheet}>
                        <TouchableOpacity onPress={() => handleImageSelect('photo')}>
                            <Text style={styles(theme).bottomSheetOption}>Choose from Photos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleImageSelect('camera')}>
                            <Text style={styles(theme).bottomSheetOption}>Take Photo</Text>
                        </TouchableOpacity>
                        <Divider />
                        <TouchableOpacity onPress={hideBottomSheet}>
                            <Text style={[styles(theme).bottomSheetOption, { color: theme.colors.text.secondary }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = (theme) => StyleSheet.create({
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
        backgroundColor: theme.colors.onPrimary,
        borderColor: theme.colors.outline,
        borderWidth: 1,
        marginBottom: 30
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
        backgroundColor: theme.colors.onPrimary,
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
        color: theme.colors.text.primary,
    },
    iconButton: {
        position: 'absolute',
        bottom: -12,
        right: -12,
        backgroundColor: theme.colors.onPrimary,
        zIndex: 1,
        borderWidth: 1,
    },
});

export default MMProfileAvatar;