import React, { useEffect, useState } from 'react';

import * as _ from 'lodash';
import PropTypes from 'prop-types';

import MMApiService from '../../services/ApiService';
import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMImagePickerModal from '../../components/common/imagePickerModal';
import MMContentContainer from '../../components/common/ContentContainer';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { MMButton, MMOutlineButton } from '../../components/common/Button';
import { reloadBookPage } from '../../redux/Slice/AppSlice';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import MMFlexView from '../../components/common/FlexView';
import MMPageTitle from '../../components/common/PageTitle';
import MMConfirmDialog from '../../components/common/ConfirmDialog';
import CommonTemplate from '../../components/common/CommonTemplate';
import MMActionButtons from '../../components/common/ActionButtons';

export default function MainTemplate({ navigation, route }) {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { position, templateName, templateId, pageId, pageDetails, imageConfig } = route.params || '';
    const selectedBaby = useSelector((state) => state.AppReducer.baby);
    const [templateData, setTemplateData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const [selectedName, setSelectedName] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedShape, setSelectedShape] = useState(null);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    useEffect(() => {
        if (pageId && pageDetails) {
            setTemplateData(pageDetails);
        }
    }, [pageDetails, pageId]);

    useEffect(() => {
        if (imageConfig) {
            const existingIndex = templateData.findIndex(item => item.name === imageConfig.name);
            if (existingIndex !== -1) {
                // If imageConfig.name already exists, update the existing record
                const updatedTemplateData = [...templateData];
                updatedTemplateData[existingIndex] = imageConfig;
                setTemplateData(updatedTemplateData);
            } else {
                // If imageConfig.name does not exist, add a new record
                setTemplateData([...templateData, imageConfig]);
            }
        }
    }, [imageConfig]);

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
                                        let newData;
                                        // Create a new item if it doesn't exist
                                        newData = {
                                            name: selectedName, type: selectedType, value: responseData.storageFileKey,
                                            source: photo.uri, imageParam: {
                                                height: photo.height,
                                                width: photo.width,
                                                x: 0,
                                                y: 0,
                                                scale: 1
                                            }
                                        };
                                        storageFileKeys.push({ storageFileKey: responseData.storageFileKey });
                                        navigation.navigate('CommonShapes', { shapeName: selectedShape, templateData: newData, templateName: templateName });
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

    const onPickImage = (name, type, shape) => {
        setSelectedName(name);
        setSelectedType(type);
        setSelectedShape(shape);
        toggleModal();
    };

    const onSavePage = async () => {
        const pageDetails = _.map(templateData, _.partialRight(_.omit, 'source'));
        try {
            setOverlayLoading(true);
            const apiData = {
                id: pageId ? pageId : null,
                babyId: selectedBaby._id,
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

    async function onDeletePage() {
        try {
            setOverlayLoading(true);
            const response = await MMApiService.deletePage(pageId);
            if (response) {
                setOverlayLoading(false);
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
    }

    const onConfirm = () => {
        MMConfirmDialog({
            message: "Are you sure you want to delete this page?",
            onConfirm: onDeletePage
        });
    };

    const onSetTemplateData = (State) => {
        setTemplateData(State);
    };

    const renderActionButtons = () => {
        return (
            <MMActionButtons type='bottomFixed'>
                {
                    pageId ?
                        <>
                            <MMOutlineButton
                                label="Delete"
                                onPress={() => onConfirm()}
                                width='45%'
                            />
                            <MMButton
                                label="Save"
                                onPress={() => onSavePage()}
                                width={'45%'}
                            />
                        </> :
                        < >
                            <MMOutlineButton
                                label="Cancel"
                                onPress={() => navigation.goBack()}
                                width='45%'
                            />
                            <MMButton
                                label="Save Page"
                                onPress={() => onSavePage()}
                                width={'45%'}
                            />
                        </>

                }
            </MMActionButtons>
        )
    }

    const renderView = () => {
        return (
            <>
                <MMPageTitle title='Select Image' paddingBottom={20} />
                <View style={[styles(theme).container]}>
                    <CommonTemplate onPickImage={onPickImage}
                        templateData={templateData}
                        templateName={templateName}
                        onSetTemplateData={onSetTemplateData}
                        pageId={pageId} />
                </View>
                <MMImagePickerModal
                    visible={modalVisible}
                    toggleModal={toggleModal}
                    onImageChange={onImageChange}
                />
            </>
        )
    };

    return (
        <>
            <MMContentContainer>
                {renderView()}
                <MMOverlaySpinner visible={isOverlayLoading} />
            </MMContentContainer>
            {renderActionButtons()}
        </>
    );
}



const styles = (theme) => StyleSheet.create({
    container: {
        height: Dimensions.get('window').width,
        borderColor: theme.colors.outline,
        borderStyle: 'dashed',
        borderWidth: 1,
    }
});

MainTemplate.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

