import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';

const Column1Row3 = (props) => {
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

    const renderImageRowBox = (name, extraStyle = {}) => {
        return (
            <>
                {
                    pageId ?
                        <TouchableOpacity style={[styles(theme).rowInner, extraStyle]}
                            onPress={() => onEditPicture(name, deviceWidth / 1, deviceWidth / 1.5)} disabled={isDisable}>
                            {renderImage(name)}
                        </TouchableOpacity> :
                        <TouchableOpacity style={[styles(theme).rowInner, extraStyle]}
                            onPress={() => onPickImage(name, 'img', deviceWidth / 1, deviceWidth / 1.5)}
                            disabled={isDisable}>
                            {renderImage(name)}
                        </TouchableOpacity>
                }
            </>
        );
    };

    const renderImageBox = (name, extraStyle = {}) => {
        return (
            <>
                {
                    pageId ?
                        <TouchableOpacity style={[styles(theme).column, extraStyle]}
                            onPress={() => onEditPicture(name, deviceWidth / 2, deviceWidth)} disabled={isDisable}>
                            {renderImage(name)}
                        </TouchableOpacity> :
                        <TouchableOpacity style={[styles(theme).column, extraStyle]}
                            onPress={() => onPickImage(name, 'img', deviceWidth / 2, deviceWidth)}
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
                {renderImageBox('p1', {
                    borderRightWidth: borderWidth, borderColor: theme.colors.outline,
                    width: isDisable ? 125 : deviceWidth / 2
                })}

                {/* Row 2 */}
                <View style={[styles(theme).column, { width: isDisable ? 125 : deviceWidth / 2 }]}>
                    {renderImageRowBox('p2', {
                        borderBottomWidth: borderWidth, borderColor: theme.colors.outline,
                        width: isDisable ? 125 : deviceWidth / 2
                    })}
                    {renderImageRowBox('p3', {
                        borderBottomWidth: borderWidth, borderColor: theme.colors.outline,
                        width: isDisable ? 125 : deviceWidth / 2
                    })}
                    {renderImageRowBox('p4', { width: isDisable ? 125 : deviceWidth / 2 })}
                </View>
            </View>
        </>
    );
};

const styles = (theme) => StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row', // main axis
    },
    rowInner: {
        flex: 1,
        flexDirection: 'row', // main axis
        justifyContent: 'center', // main axis
        alignItems: 'center',
    },
    column: {
        justifyContent: 'center', // main axis
        alignItems: 'center', // cross axis
    },
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50,
    },
});

export default Column1Row3;