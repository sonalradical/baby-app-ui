import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import MMConstants from '../../helpers/Constants';

import MMIcon from '../../components/common/Icon';
import MMImagePickerModal from '../../components/common/imagePickerModal';
import MMPageTitle from '../../components/common/PageTitle';

const Row2 = () => {
    const theme = useTheme();
    const [row1Image, setRow1Image] = useState(null);
    const [row2Image, setRow2Image] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const onImageChange = (response) => {
        if (selectedRow === 'row1') {
            setRow1Image(response.assets[0].uri);
        } else if (selectedRow === 'row2') {
            setRow2Image(response.assets[0].uri);
        }
    };

    const onPickImage = (row) => {
        setSelectedRow(row);
        toggleModal();
    };

    return (
        <>
            <MMPageTitle title={`Select your baby's photo`} />
            <View style={styles(theme).container}>
                <TouchableOpacity style={[styles(theme).row, { borderBottomWidth: 1, borderBottomColor: theme.colors.outline }]}
                    onPress={() => onPickImage('row1')}>
                    {row1Image ? <Image source={{ uri: row1Image }} style={styles(theme).image} /> :
                        <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />}
                </TouchableOpacity>
                <TouchableOpacity style={styles(theme).row} onPress={() => onPickImage('row2')}>
                    {row2Image ? <Image source={{ uri: row2Image }} style={styles(theme).image} /> :
                        <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />}
                </TouchableOpacity>
            </View>
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
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: Dimensions.get('window').height / 2,
        borderColor: theme.colors.outline,
        borderWidth: 1,
        margin: MMConstants.marginMedium,
        borderStyle: 'dashed',
    },
    row: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50,
    },
    image: {
        width: '100%',
        height: Dimensions.get('window').height / 4,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: theme.colors.outline,
    },
});

export default Row2;