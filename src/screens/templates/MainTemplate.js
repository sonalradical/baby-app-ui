import React, { useEffect, useState } from 'react';

import * as _ from 'lodash';
import PropTypes from 'prop-types';

import MMApiService from '../../services/ApiService';
import MMUtils from '../../helpers/Utils';
import MMContentContainer from '../../components/common/ContentContainer';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { MMButton, MMOutlineButton } from '../../components/common/Button';
import { reloadBookPage } from '../../redux/Slice/AppSlice';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import MMPageTitle from '../../components/common/PageTitle';
import MMConfirmDialog from '../../components/common/ConfirmDialog';
import CommonTemplate from '../../components/common/CommonTemplate';
import MMActionButtons from '../../components/common/ActionButtons';
import MMImageCrop from '../../components/common/ImageCrop';

export default function MainTemplate({ navigation, route }) {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { position, templateName, templateId, pageId, pageDetails } = route.params || '';
    const selectedBaby = useSelector((state) => state.AppReducer.baby);
    const [templateData, setTemplateData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const [selectedName, setSelectedName] = useState('p1');
    const [selectedType, setSelectedType] = useState(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    //Use for edit mode
    useEffect(() => {
        if (pageId && pageDetails) {
            setTemplateData(pageDetails);
        }
    }, [pageDetails, pageId]);

    const onImageChange = async (photo, key = '') => {
        let storageFileKeys = [];
        try {
            setOverlayLoading(true);
            const fileName = _.head(photo.uri.match(/[^\/]+$/));
            const response = await MMApiService.getPreSignedUrl(fileName);
            const responseData = response.data;
            if (responseData) {
                const imageDetails = [...templateData];

                //find selected box index
                const boxName = pageId ? key : selectedName;
                const existingItemIndex = imageDetails.findIndex(item => item.name === boxName);

                // Update existing item with new image URI and dynamic type
                if (existingItemIndex >= 0) {
                    imageDetails[existingItemIndex] = {
                        ...imageDetails[existingItemIndex],
                        value: responseData.storageFileKey,
                        source: photo.uri, imageParam: {
                            height: containerSize.height,
                            width: containerSize.width,
                        }
                    };
                } else {
                    // Create a new item if it doesn't exist
                    imageDetails.push({
                        name: selectedName, type: selectedType,
                        value: responseData.storageFileKey,
                        source: photo.uri, imageParam: {
                            height: photo.height,
                            width: photo.width
                        }
                    });
                }

                setTemplateData(imageDetails);
                const result = MMUtils.uploadPicture(photo, responseData.preSignedUrl, fileName);
                if (_.isNil(result)) {
                    MMUtils.showToastMessage(`Uploading picture failed...`);
                } else {
                    MMUtils.showToastMessage(`Uploading picture completed.`);
                }
            } else {
                MMUtils.showToastMessage(`Getting presigned url for uploading picture failed. Error: ${responseData.message}`);
            }
            setOverlayLoading(false);
        } catch (err) {
            setOverlayLoading(false);
            MMUtils.consoleError(err);
        }
        return storageFileKeys;

    };

    const onPickImage = (name, type, width, height) => {
        setSelectedName(name);
        setSelectedType(type);
        setContainerSize({
            width: width,
            height: height
        });
        toggleModal();
    };

    const onSavePage = async () => {
        const pageDetails = _.map(templateData, _.partialRight(_.omit, 'source'));
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
        setOverlayLoading(false);
    };

    const onDeletePage = async () => {

        setOverlayLoading(true);
        const response = await MMApiService.deletePage(pageId);
        if (response) {
            setOverlayLoading(false);
            dispatch(reloadBookPage({ reloadBookPage: true }));
            navigation.navigate('Home');
        }
        setOverlayLoading(false);
    }

    const renderActionButtons = () => {
        return (
            <MMActionButtons type='bottomFixed'>
                {
                    pageId ?
                        <>
                            <MMOutlineButton
                                label="Delete"
                                onPress={() => MMConfirmDialog({
                                    message: "Are you sure you want to delete this page?",
                                    onConfirm: onDeletePage
                                })}
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
                        pageId={pageId}
                        onImageChange={onImageChange} />
                </View>
                <MMImageCrop
                    visible={modalVisible}
                    toggleModal={toggleModal}
                    onImageChange={onImageChange}
                    containerSize={containerSize}
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

