import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import MMIcon from '../../components/common/Icon';
import MMConstants from '../../helpers/Constants';

const Column2 = (props) => {
    const theme = useTheme();
    const { templateData, pageId = null, isDisable = false, onPickImage, onEditPicture } = props;
    const deviceWidth = Dimensions.get('window').width;

    const renderImage = (name) => {
        const template = templateData.find(item => item.name === name);
        if (template) {
            return (
                <Image style={{ width: deviceWidth / 2, height: deviceWidth, resizeMode: 'contain' }}
                    source={{ uri: template?.source }} />
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
                            onPress={() => onEditPicture(name, deviceWidth / 2, deviceWidth)}
                            disabled={isDisable}>
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
            <View style={styles(theme).row}>
                {renderImageBox('p1', { borderRightWidth: 1, borderColor: theme.colors.outline })}
                {renderImageBox('p2')}
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 1,
    },
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50
    }
});

export default Column2;