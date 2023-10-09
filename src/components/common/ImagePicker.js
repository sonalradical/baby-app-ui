import React, { useState } from 'react';
import { TouchableOpacity, Image, View, StyleSheet, Text } from 'react-native';

import PropTypes from 'prop-types';
import ImagePicker, { launchImageLibrary } from 'react-native-image-picker';

import MMUtils from '../../helpers/Utils';
import MMColors from '../../helpers/Colors';
import MMStyles from '../../helpers/Styles';

const MMProfileAvatar = ({ onImageSelect }) => {
    const [avatarSource, setAvatarSource] = useState(null);

    const handleImageSelect = (type) => {
        const options = {
            mediaType: type,
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                MMUtils.displayConsoleLog('User cancelled camera picker');
                return;
            } if (response.errorCode === 'camera_unavailable') {
                MMUtils.displayConsoleLog('Camera not available on device');
                return;
            } if (response.errorCode === 'permission') {
                MMUtils.displayConsoleLog('Permission not satisfied');
                return;
            } if (response.errorCode === 'others') {
                MMUtils.displayConsoleLog(response.errorMessage);
                return;
            }
            onImageChange(response);
            setImage(response.assets[0].uri);
        });
    };

    return (
        <TouchableOpacity onPress={() => handleImageSelect('photo')} style={{ alignItems: 'center' }}>
            <View
                style={[styles.avatarContainer, { backgroundColor: MMColors.lightGray },]}>
                {avatarSource ? (
                    <Image source={avatarSource} style={styles.avatar} />
                ) : (
                    <Text style={MMStyles.titleText}>{`Upload \n Photo`}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

MMProfileAvatar.propTypes = {
    onImageSelect: PropTypes.func.isRequired,
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
});

export default MMProfileAvatar;