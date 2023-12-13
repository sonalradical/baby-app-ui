import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';
import { Svg, Image as SvgImage } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import MMSpinner from '../../components/common/Spinner';

const Row2Column2 = (props) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const {
        onPickImage, templateData, pageId, isDisable = false } = props;


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
        const onPressHandler = pageId
            ? () => onPickImage(name, 'img', Dimensions.get('window').width / 2, Dimensions.get('window').width / 2)
            : () => onPickImage(name, 'img', Dimensions.get('window').width / 2, Dimensions.get('window').width / 2);

        return (
            <TouchableOpacity style={[styles(theme).column, extraStyle]} onPress={onPressHandler} disabled={isDisable}>
                {renderImage(name)}
            </TouchableOpacity>
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