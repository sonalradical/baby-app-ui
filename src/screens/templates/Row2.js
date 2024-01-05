import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import CommonImageTemplate from './CommonImageTemplate';

const Row2 = (props) => {
    const theme = useTheme();
    const { templateData, pageId = null, isDisable = false, onPickImage, onEditPicture, borderWidth = 1 } = props;
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
                {pageId ?
                    <TouchableOpacity style={[styles(theme).row, extraStyle]}
                        onPress={() => onEditPicture(name, deviceWidth - 20, deviceWidth / 2)} disabled={isDisable}>
                        {renderImage(name)}
                    </TouchableOpacity> :
                    <TouchableOpacity style={[styles(theme).row, extraStyle]}
                        onPress={() => onPickImage(name, 'img', deviceWidth - 20, deviceWidth / 2)}
                        disabled={isDisable}>
                        {renderImage(name)}
                    </TouchableOpacity>
                }
            </>
        );
    };

    return (
        <View style={styles(theme).column}>
            {renderImageBox('p1', { borderBottomWidth: borderWidth, borderBottomColor: theme.colors.outline })}
            {renderImageBox('p2')}
        </View>
    );
};

const styles = (theme) => StyleSheet.create({
    column: {
        flex: 1,
        flexDirection: 'column', // main axis
    },
    row: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 1,

    }
});

export default Row2;