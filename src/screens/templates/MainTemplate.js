import React, { useState } from 'react';

import * as _ from 'lodash';
import PropTypes from 'prop-types';

import MMApiService from '../../services/ApiService';
import MMUtils from '../../helpers/Utils';
import MMEnums from '../../helpers/Enums';
import MMImagePickerModal from '../../components/common/imagePickerModal';
import MMContentContainer from '../../components/common/ContentContainer';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { MMButton } from '../../components/common/Button';
import { reloadBookPage } from '../../redux/Slice/AppSlice';

export default function MainTemplate({ navigation, route }) {
    const dispatch = useDispatch();
    const { position, templateName, templateId } = route.params || '';
    const selectedBabyId = useSelector((state) => state.AppReducer.baby);
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

                    await MMApiService.getPagePreSignedUrl(selectedBabyId, photo.fileName)
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

    const onSavePage = async () => {
        const pageDetails = _.map(templateData, _.partialRight(_.omit, 'source'));
        try {
            setOverlayLoading(true);
            const apiData = {
                babyId: selectedBabyId,
                templateId,
                position,
                pageDetails
            }
            const response = await MMApiService.savePage(apiData);
            if (response) {
                dispatch(reloadBookPage({ reloadBookPage: true }));
                navigation.navigate('Home');
            }
        } catch (error) {
            const serverError = MMUtils.apiErrorMessage(error);
            if (serverError) {
                MMUtils.showToastMessage(serverError);
            }
            setOverlayLoading(false);
        }

    };

    const renderView = () => {
        const ComponentName = MMEnums.Components[templateName]
        return (
            <>
                <ComponentName onPickImage={onPickImage} templateData={templateData} />
                <MMButton label='Save Page' onPress={() => onSavePage()} />
                <MMImagePickerModal
                    visible={modalVisible}
                    toggleModal={toggleModal}
                    onImageChange={onImageChange}
                />
            </>
        )
    };

    return (
        <MMContentContainer>
            {renderView()}
            <MMOverlaySpinner visible={isOverlayLoading} />
        </MMContentContainer>
    );
}

MainTemplate.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

