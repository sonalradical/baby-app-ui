import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';
import CommonImageTemplate from './CommonImageTemplate';

const Blank = (props) => {
    const theme = useTheme();
    const { onPickImage, templateData, pageId, isDisable = false, onEditPicture } = props;
    const deviceWidth = Dimensions.get('window').width;

    const renderImage = (name) => {
        return (
            <CommonImageTemplate
                name={name}
                templateData={templateData}
            />
        );
    };

    return (
        <TouchableOpacity style={styles(theme).container} onPress={pageId
            ? () => onEditPicture('p1', deviceWidth - 20, deviceWidth)
            : () => onPickImage('p1', 'img', deviceWidth - 20, deviceWidth)} disabled={isDisable}>
            {renderImage('p1')}
        </TouchableOpacity>
    );
};

const styles = (theme) => StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    }
});

export default Blank;