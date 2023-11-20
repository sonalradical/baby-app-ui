import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import MMIcon from '../../components/common/Icon';
import MMImagePickerModal from '../../components/common/imagePickerModal';
import MMPageTitle from '../../components/common/PageTitle';

const Column2 = () => {
    const theme = useTheme();
    const [col1Image, setCol1Image] = useState(null);
    const [col2Image, setCol2Image] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState(null);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const onImageChange = (response) => {
        if (selectedColumn === 'col1') {
            console.log(response.assets[0].uri, 'response.uri')
            setCol1Image(response.assets[0].uri);
        } else if (selectedColumn === 'col2') {
            setCol2Image(response.assets[0].uri);
        }
    };

    const onPickImage = (column) => {
        setSelectedColumn(column);
        toggleModal();
    };

    return (
        <>
            <MMPageTitle title={`Select your baby's photo`} />
            <View style={styles(theme).container}>
                <TouchableOpacity style={[styles(theme).column, { borderRightWidth: 1, borderLeftColor: theme.colors.outline }]}
                    onPress={() => onPickImage('col1')}>
                    {col1Image ? <Image source={{ uri: col1Image }} style={styles(theme).image} /> :
                        <MMIcon iconName={'plus-circle'} iconSize={24} style={styles(theme).imagePickerButton} />}
                </TouchableOpacity>

                <TouchableOpacity style={styles(theme).column} onPress={() => onPickImage('col2')}>
                    {col2Image ? <Image source={{ uri: col2Image }} style={styles(theme).image} /> :
                        <MMIcon iconName={'plus-circle'} iconSize={24} style={styles(theme).imagePickerButton} />}
                </TouchableOpacity>
                <MMImagePickerModal
                    visible={modalVisible}
                    toggleModal={toggleModal}
                    onImageChange={onImageChange}
                />
            </View>
        </>
    );
};

const styles = (theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: Dimensions.get('window').height / 2,
        borderColor: theme.colors.outline,
        borderWidth: 1,
        margin: 15,
        borderStyle: 'dashed'
    },
    column: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
    },
});

export default Column2;