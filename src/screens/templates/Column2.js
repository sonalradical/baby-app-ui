import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import * as _ from 'lodash';
import { Svg, Image as SvgImage } from 'react-native-svg';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';
import MMSpinner from '../../components/common/Spinner';

const Column2 = (props) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const { onPickImage, templateData, pageId, templateName, isDisable = false } = props;

    const calculateScaleFactor = (templateName) => {
        const template = templateData.find((item) => item.name === templateName);

        if (!template || !template.imageParam || !template.imageParam.width) {
            return 1;
        }

        const widthScale = (Dimensions.get('window').width / 2) / template.imageParam.width;
        const heightScale = (Dimensions.get('window').width) / template.imageParam.height;

        return _.min([widthScale, heightScale]);
    };

    const scaleFactor1 = calculateScaleFactor('p1');
    const scaleFactor2 = calculateScaleFactor('p2');

    const renderImage = (name, scaleFactor) => {
        const template = templateData.find(item => item.name === name);

        if (template) {
            return (
                <Svg height={Dimensions.get('window').width} width={Dimensions.get('window').width / 2}>
                    {template.source ?
                        <SvgImage
                            href={template?.source}
                            preserveAspectRatio="xMidYMid slice"
                            clipPath="url(#clip)"
                            x={template.imageParam?.x / 2}
                            y={template.imageParam?.y / 2}
                            width={template.imageParam?.width * scaleFactor * template.imageParam?.scale}
                            height={template.imageParam?.height * scaleFactor * template.imageParam?.scale}
                        /> : <MMSpinner />}
                </Svg>
            );
        } else {
            return <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />;
        }
    };

    const renderImageBox = (name, scaleFactor, pageId, extraStyle = {}) => {
        const onPressHandler = pageId
            ? () => navigation.navigate('CommonShapes', { shapeName: 'Column', templateData: templateData.find(item => item.name === name), templateName })
            : () => onPickImage(name, 'img', 'Column');

        return (
            <TouchableOpacity style={[styles(theme).column, extraStyle]} onPress={onPressHandler} disabled={isDisable}>
                {renderImage(name, scaleFactor)}
            </TouchableOpacity>
        );
    };

    return (
        <>
            <View style={styles(theme).row}>
                {renderImageBox('p1', scaleFactor1, pageId, { borderRightWidth: 1, borderColor: theme.colors.outline })}
                {renderImageBox('p2', scaleFactor2, pageId)}
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