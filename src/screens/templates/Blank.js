import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import MMConstants from '../../helpers/Constants';

import MMIcon from '../../components/common/Icon';
import MMImagePickerModal from '../../components/common/imagePickerModal';
import MMPageTitle from '../../components/common/PageTitle';

const Blank = () => {
    const theme = useTheme();
    const [image, setImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const onImageChange = (response) => {
        setImage(response.assets[0].uri);
    };

    const onPickImage = () => {
        toggleModal();
    };

    return (
        <>
            <MMPageTitle title={`Select your baby's photo`} />
            <TouchableOpacity style={styles(theme).container} onPress={() => onPickImage()}>
                {image ? <Image source={{ uri: image }} style={styles(theme).image} /> :
                    <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />}
            </TouchableOpacity>
            <MMImagePickerModal
                visible={modalVisible}
                toggleModal={toggleModal}
                onImageChange={onImageChange}
            />
        </>
    );
};

const styles = (theme) => StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height / 2,
        margin: MMConstants.marginMedium,
        borderColor: theme.colors.outline,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50,
    },
    image: {
        width: '100%',
        height: Dimensions.get('window').height / 2,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: theme.colors.outline,
        borderRadius: 8,
    },
});

export default Blank;