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
import MMCommonTemplate from '../../components/common/CommonTemplate';
import MMActionButtons from '../../components/common/ActionButtons';
import MMImageCrop from '../../components/common/ImageCrop';
import MMInput from '../../components/common/Input';
import MMConstants from '../../helpers/Constants';
import MMScrollView from '../../components/common/ScrollView';

export default function MainTemplate({ navigation, route }) {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { position, templateName, templateId, pageId, pageDetails, headerText, footerText } = route.params || '';
    const selectedBaby = useSelector((state) => state.AppReducer.baby);
    const [templateData, setTemplateData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const [selectedName, setSelectedName] = useState('p1');
    const [selectedType, setSelectedType] = useState(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [pageText, setPageText] = useState({
        headerText: '',
        footerText: ''
    })

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    //Use for edit mode
    useEffect(() => {
        if (pageId && pageDetails) {
            setTemplateData(pageDetails);
            setPageText({ headerText: headerText, footerText: footerText })
        }
    }, [pageDetails, pageId]);

    const onImageChange = async (photo, key = '') => {
        let storageFileKeys = [];
        try {
            setOverlayLoading(true);
            const fileName = _.head(photo.uri.match(/[^\/]+$/));
            const response = await MMApiService.getPagePreSignedUrl(selectedBaby._id, fileName);
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
                const result = await MMUtils.uploadPicture(photo, responseData.preSignedUrl, fileName);
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
            pageDetails,
            headerText: pageText.headerText,
            footerText: pageText.footerText
        }
        const response = await MMApiService.savePage(apiData);
        if (response) {
            dispatch(reloadBookPage({ reloadBookPage: true }));
            navigation.navigate('BookPreview');
        }
        setOverlayLoading(false);
    };

    const onDeletePage = async () => {

        setOverlayLoading(true);
        const response = await MMApiService.deletePage(pageId);
        if (response) {
            setOverlayLoading(false);
            dispatch(reloadBookPage({ reloadBookPage: true }));
            navigation.navigate('BookPreview');
        }
        setOverlayLoading(false);
    }

    const onInputChange = (field, value) => {
        setPageText({
            ...pageText,
            [field]: value
        });
    };

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
                    <MMCommonTemplate onPickImage={onPickImage}
                        templateData={templateData}
                        templateName={templateName}
                        pageId={pageId}
                        onImageChange={onImageChange} />
                </View>
                <View style={{ marginTop: MMConstants.marginLarge }}>
                    <MMInput
                        maxLength={50}
                        value={pageText.headerText}
                        onChangeText={(value) => onInputChange('headerText', value)}
                        placeholder="Enter Page Header"
                    />
                </View>
                <View style={{ marginTop: MMConstants.marginSmall }}>
                    <MMInput
                        maxLength={50}
                        value={pageText.footerText}
                        onChangeText={(value) => onInputChange('footerText', value)}
                        placeholder="Enter Page Footer"
                    />
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
                <MMScrollView>
                    {renderView()}
                </MMScrollView>
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

