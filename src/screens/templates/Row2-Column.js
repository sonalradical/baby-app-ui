import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import CommonImageTemplate from './CommonImageTemplate';

const Row2Column = (props) => {
    const theme = useTheme();
    const {
        templateData, pageId, isDisable = false, onPickImage, onEditPicture, borderWidth = 1 } = props;
    const deviceWidth = Dimensions.get('window').width;


    const renderImage = (name) => {
        return (
            <CommonImageTemplate
                name={name}
                templateData={templateData}
            />
        );
    };


    const renderImageRowBox = (name, extraStyle = {}) => {
        return (
            <>
                {
                    pageId ?
                        <TouchableOpacity style={[styles(theme).rowInner, extraStyle]}
                            onPress={() => onEditPicture(name, deviceWidth / 2, deviceWidth / 2)} disabled={isDisable}>
                            {renderImage(name)}
                        </TouchableOpacity> :
                        <TouchableOpacity style={[styles(theme).rowInner, extraStyle]}
                            onPress={() => onPickImage(name, 'img', deviceWidth / 2, deviceWidth / 2)}
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
                {/* Row 2 */}
                <View style={[styles(theme).column, { width: isDisable ? 125 : deviceWidth / 2 }]}>
                    {renderImageRowBox('p1', {
                        borderBottomWidth: borderWidth, borderColor: theme.colors.outline,
                        width: isDisable ? 125 : deviceWidth / 2
                    })}
                    {renderImageRowBox('p2', { width: isDisable ? 125 : deviceWidth / 2 })}
                </View>
                {renderImageBox('p3', {
                    borderLeftWidth: borderWidth, borderColor: theme.colors.outline,
                    width: isDisable ? 125 : deviceWidth / 2
                })}
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
    }
});

export default Row2Column;