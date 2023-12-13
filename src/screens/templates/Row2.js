import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';
import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';

const Row2 = (props) => {
    const theme = useTheme();
    const { templateData, pageId = null, isDisable = false, onPickImage, onEditPicture } = props;
    const deviceWidth = Dimensions.get('window').width;

    const renderImage = (name) => {
        const template = templateData.find(item => item.name === name);
        if (template) {
            return (
                <Image
                    style={{ width: deviceWidth - 20, height: deviceWidth / 2, resizeMode: 'contain' }}
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
            {renderImageBox('p1', { borderBottomWidth: 1, borderBottomColor: theme.colors.outline })}
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

    },
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50,
    }
});

export default Row2;