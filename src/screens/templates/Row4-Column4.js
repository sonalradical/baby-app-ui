import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';

const Row4Column4 = (props) => {
    const theme = useTheme();
    const {
        templateData, pageId, isDisable = false, onPickImage, onEditPicture, borderWidth = 1 } = props;
    const deviceWidth = Dimensions.get('window').width;


    const renderImage = (name) => {
        const template = templateData.find(item => item.name === name);

        if (template) {
            return (
                <Image
                    style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain'
                    }}
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
                            onPress={() => onEditPicture(name, deviceWidth / 4, deviceWidth / 2)} disabled={isDisable}>
                            {renderImage(name)}
                        </TouchableOpacity> :
                        <TouchableOpacity style={[styles(theme).column, extraStyle]}
                            onPress={() => onPickImage(name, 'img', deviceWidth / 4, deviceWidth / 2)}
                            disabled={isDisable}>
                            {renderImage(name)}
                        </TouchableOpacity>
                }
            </>
        );
    };

    return (
        <>
            {/* Row 2 */}
            <View style={styles(theme).row}>
                {renderImageBox('p1', { borderRightWidth: borderWidth, borderColor: theme.colors.outline, borderBottomWidth: borderWidth })}
                {renderImageBox('p2', { borderRightWidth: borderWidth, borderColor: theme.colors.outline, borderBottomWidth: borderWidth })}
                {renderImageBox('p3', { borderRightWidth: borderWidth, borderColor: theme.colors.outline, borderBottomWidth: borderWidth })}
                {renderImageBox('p4', { borderBottomWidth: borderWidth })}
            </View>
            {/* Row 1 */}
            <View style={styles(theme).row}>
                {renderImageBox('p5', { borderRightWidth: borderWidth, borderColor: theme.colors.outline })}
                {renderImageBox('p6', { borderRightWidth: borderWidth, borderColor: theme.colors.outline })}
                {renderImageBox('p7', { borderRightWidth: borderWidth, borderColor: theme.colors.outline })}
                {renderImageBox('p8')}
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

export default Row4Column4;