import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';
import ImagePicker from 'react-native-image-crop-picker';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';

const Row2Column2 = (props) => {
    const theme = useTheme();
    const {
        templateData, pageId, isDisable = false, onPickImage, onEditPicture } = props;
    const deviceWidth = Dimensions.get('window').width;

    const renderImage = (name) => {
        const template = templateData.find(item => item.name === name);

        if (template) {
            return (
                <Image
                    style={{ width: deviceWidth / 2, height: deviceWidth / 2, resizeMode: 'contain' }}
                    source={{ uri: template?.source }}
                />
            );
        } else {
            return <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />;
        }
    };

    const renderImageBox = (name, extraStyle = {}) => {
        return (
            <>
                {
                    pageId ?
                        <TouchableOpacity style={[styles(theme).column, extraStyle]}
                            onPress={() => onEditPicture(name, deviceWidth / 2, deviceWidth / 2)} disabled={isDisable}>
                            {renderImage(name)}
                        </TouchableOpacity> :
                        <TouchableOpacity style={[styles(theme).column, extraStyle]}
                            onPress={() => onPickImage(name, 'img', deviceWidth / 2, deviceWidth / 2)}
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
                {renderImageBox('p1', { borderRightWidth: 1, borderColor: theme.colors.outline, borderBottomWidth: 1 })}
                {renderImageBox('p2', { borderBottomWidth: 1, borderColor: theme.colors.outline })}
            </View>

            {/* Row 2 */}
            <View style={styles(theme).row}>
                {renderImageBox('p3', { borderRightWidth: 1, borderColor: theme.colors.outline })}
                {renderImageBox('p4')}
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