import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import MMApiService from '../../services/ApiService';
import MMConstants from '../../helpers/Constants';
import MMUtils from '../../helpers/Utils';
import MMIcon from '../../components/common/Icon';
import MMImagePickerModal from '../../components/common/imagePickerModal';
import MMPageTitle from '../../components/common/PageTitle';

const Row2 = () => {
    const theme = useTheme();
    const [templateData, setTemplateData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const [selectedName, setSelectedName] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const onImageChange = async (imageData) => {
        if (selectedName && selectedType) {
            const photo = imageData.assets[0];
            let storageFileKeys = [];
            try {
                setOverlayLoading(true);
                let picIndex = 0;

                for (const pic of imageData.assets) {
                    picIndex++;

                    await MMApiService.getPreSignedUrl(photo.fileName)
                        .then(function (response) {
                            (async () => {
                                const responseData = response.data;
                                if (responseData) {
                                    const result = MMUtils.uploadPicture(pic, responseData.preSignedUrl);
                                    if (_.isNil(result)) {
                                        setOverlayLoading(false);
                                        MMUtils.showToastMessage(`Uploading picture ${picIndex} failed...`);
                                    } else {
                                        setOverlayLoading(false);
                                        MMUtils.showToastMessage(`Uploading picture ${picIndex} completed.`);
                                        setTemplateData((prevData) => {
                                            const newData = [...prevData];
                                            const existingItemIndex = newData.findIndex(item => item.name === selectedName);

                                            if (existingItemIndex !== -1) {
                                                // Update existing item with new image URI and dynamic type
                                                newData[existingItemIndex] = {
                                                    ...newData[existingItemIndex],
                                                    type: selectedType,
                                                    value: responseData.storageFileKey,
                                                    source: photo.uri
                                                };
                                            } else {
                                                // Create a new item if it doesn't exist
                                                newData.push({
                                                    name: selectedName, type: selectedType, value: responseData.storageFileKey,
                                                    source: photo.uri
                                                });
                                            }
                                            return newData;
                                        });
                                        storageFileKeys.push({ storageFileKey: responseData.storageFileKey });
                                    }
                                } else {
                                    setOverlayLoading(false);
                                    MMUtils.showToastMessage(`Getting presigned url for uploading picture ${picIndex} failed. Error: ${responseData.message}`);
                                }
                            })();
                        })
                        .catch(function (error) {
                            setOverlayLoading(false);
                            setState({
                                ...state,
                                errors: MMUtils.apiErrorParamMessages(error)
                            });

                            const serverError = MMUtils.apiErrorMessage(error);
                            if (serverError) {
                                MMUtils.showToastMessage(serverError);
                            }
                        });
                }
            } catch (err) {
                setOverlayLoading(false);
                MMUtils.consoleError(err);
            }
            return storageFileKeys;
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
            <View style={styles(theme).container}>
                <TouchableOpacity style={[styles(theme).row, { borderBottomWidth: 1, borderBottomColor: theme.colors.outline }]}
                    onPress={() => onPickImage('p1', 'img')}>
                    {templateData.some(item => item.name === 'p1') ? <Image source={{ uri: templateData.find(item => item.name === 'p1').value }}
                        style={styles(theme).image} /> :
                        <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />}
                </TouchableOpacity>
                <TouchableOpacity style={styles(theme).row} onPress={() => onPickImage('p2', 'img')}>
                    {templateData.some(item => item.name === 'p2') ? <Image source={{ uri: templateData.find(item => item.name === 'p2').value }}
                        style={styles(theme).image} /> :
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