import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import MMIcon from '../../components/common/Icon';
import MMImagePickerModal from '../../components/common/imagePickerModal';

const Blank = () => {
    const theme = useTheme();
    const [image, setImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const onImageChange = (response) => {
        console.log(response.assets[0].uri, 'response.uri')
        setImage(response.assets[0].uri);
    };

    const onPickImage = () => {
        toggleModal();
    };

    return (
        <>
            <Text style={[theme.fonts.headlineMedium, { textAlign: 'center', paddingVertical: 20 }]}>Select your baby's photo</Text>
            <TouchableOpacity style={styles(theme).container} onPress={() => onPickImage()}>
                {image ? <Image source={{ uri: image }} style={styles(theme).image} /> :
                    <MMIcon iconName={'plus-circle'} iconSize={24} style={styles(theme).imagePickerButton} />}
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
        margin: 15,
        borderColor: theme.colors.outline,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    imagePickerButton: {
        padding: 10,
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