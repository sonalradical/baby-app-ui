import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import * as _ from 'lodash';
import { Svg, Image as SvgImage } from 'react-native-svg';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';
import MMSpinner from '../../components/common/Spinner';

const Row2 = (props) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const { onPickImage, templateData, pageId, templateName, isDisable = false } = props;


    const calculateScaleFactor = (templateName) => {
        const template = templateData.find((item) => item.name === templateName);

        if (!template || !template.imageParam || !template.imageParam.width) {
            return 1;
        }

        const widthScale = (Dimensions.get('window').width - 20) / template.imageParam.width;
        const heightScale = (Dimensions.get('window').width / 2) / template.imageParam.height;

        return _.min([widthScale, heightScale]);
    };

    const scaleFactor1 = calculateScaleFactor('p1');
    const scaleFactor2 = calculateScaleFactor('p2');

    const renderImage = (name, scaleFactor) => {
        const template = templateData.find(item => item.name === name);

        if (template) {
            return (
                <Svg height={Dimensions.get('window').width / 2} width={Dimensions.get('window').width - 20}>
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
            ? () => navigation.navigate('CommonShapes', { shapeName: 'Row', templateData: templateData.find(item => item.name === name), templateName })
            : () => onPickImage(name, 'img', 'Row');

        return (
            <TouchableOpacity style={[styles(theme).row, extraStyle]} onPress={onPressHandler} disabled={isDisable}>
                {renderImage(name, scaleFactor)}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles(theme).column}>
            {renderImageBox('p1', scaleFactor1, pageId, { borderBottomWidth: 1, borderBottomColor: theme.colors.outline })}
            {renderImageBox('p2', scaleFactor2, pageId)}
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