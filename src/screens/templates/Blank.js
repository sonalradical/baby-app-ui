import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import MMConstants from '../../helpers/Constants';

import MMIcon from '../../components/common/Icon';
import MMImagePickerModal from '../../components/common/imagePickerModal';
import MMPageTitle from '../../components/common/PageTitle';

const Blank = () => {
    const theme = useTheme();
    const [templateData, setTemplateData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedName, setSelectedName] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const onImageChange = (response) => {
        if (selectedName && selectedType) {
            setTemplateData((prevData) => {
                const newData = [...prevData];
                const existingItemIndex = newData.findIndex(item => item.name === selectedName);

                if (existingItemIndex !== -1) {
                    // Update existing item with new image URI and dynamic type
                    newData[existingItemIndex] = { ...newData[existingItemIndex], type: selectedType, value: response.assets[0].uri };
                } else {
                    // Create a new item if it doesn't exist
                    newData.push({ name: selectedName, type: selectedType, value: response.assets[0].uri });
                }

                return newData;
            });
        }

    };

    const onPickImage = (name, type) => {
        setSelectedName(name);
        setSelectedType(type);
        toggleModal();
    };

    return (
        <>
            <MMPageTitle title={`Select your baby's photo`} />
            <TouchableOpacity style={[styles(theme).container, { borderRightWidth: 1, borderLeftColor: theme.colors.outline }]}
                onPress={() => onPickImage('p1', 'img')}>
                {templateData.some(item => item.name === 'p1') ? <Image source={{ uri: templateData.find(item => item.name === 'p1').value }}
                    style={styles(theme).image} /> :
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