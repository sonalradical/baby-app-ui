import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import CommonImageTemplate from './CommonImageTemplate';

const Row4Column4 = (props) => {
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
    }
});

export default Row4Column4;