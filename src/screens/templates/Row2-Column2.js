import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, View, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';
import ImagePicker from 'react-native-image-crop-picker';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';

const Row2Column2 = (props) => {
    const theme = useTheme();
    const {
        onPickImage, templateData, pageId, isDisable = false, onImageChange } = props;


    const onEditPicture = (template) => {
        ImagePicker.openCropper({
            path: template?.source,
            width: Dimensions.get('window').width / 2,
            height: Dimensions.get('window').width / 2
        })
            .then((selectedImage) => {
                onImageChange({
                    uri: selectedImage.path,
                    width: selectedImage.width,
                    height: selectedImage.height,
                    mime: selectedImage.mime,
                }, template?.name, template?.type);
            })
            .catch((e) => {
                console.log(e);
                Alert.alert(e.message ? e.message : e);
            });
    }

    const renderImage = (name) => {
        const template = templateData.find(item => item.name === name);

        if (template) {
            return (
                <Image
                    style={{ width: Dimensions.get('window').width / 2, height: Dimensions.get('window').width / 2, resizeMode: 'contain' }}
                    source={{ uri: template?.source }}
                />
            );
        } else {
            return <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />;
        }
    };

    const renderImageBox = (name, pageId, extraStyle = {}) => {
        return (
            <>
                {
                    pageId ?
                        <TouchableOpacity style={[styles(theme).column, extraStyle]}
                            onPress={() => onEditPicture(templateData.find(item => item.name === name))} disabled={isDisable}>
                            {renderImage(name)}
                        </TouchableOpacity> :
                        <TouchableOpacity style={[styles(theme).column, extraStyle]}
                            onPress={() => onPickImage(name, 'img', Dimensions.get('window').width / 2, Dimensions.get('window').width / 2)}
                            disabled={isDisable}>
                            {renderImage(name)}
                        </TouchableOpacity>
                }
            </>
        );
    };

    return (
        <>
            {/* Row 1 */}
            <View style={styles(theme).row}>
                {renderImageBox('p1', pageId, { borderRightWidth: 1, borderColor: theme.colors.outline, borderBottomWidth: 1 })}
                {renderImageBox('p2', pageId, { borderBottomWidth: 1, borderColor: theme.colors.outline })}
            </View>

            {/* Row 2 */}
            <View style={styles(theme).row}>
                {renderImageBox('p3', pageId, { borderRightWidth: 1, borderColor: theme.colors.outline })}
                {renderImageBox('p4', pageId)}
            </View>
        </>
    );
};

const styles = (theme) => StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row', // main axis
    },
    column: {
        flex: 1,
        justifyContent: 'center', // main axis
        alignItems: 'center', // cross axis
    },
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50,
    },
});

export default Row2Column2;