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
        onPickImage, templateData, pageId, templateName, isDisable = false } = props;

    const calculateScaleFactor = (templateName) => {
        const template = templateData.find((item) => item.name === templateName);

        if (!template || !template.imageParam || !template.imageParam.width) {
            return 1;
        }

        const widthScale = 190 / template.imageParam.width;
        const heightScale = 165 / template.imageParam.height;

        return _.min([widthScale, heightScale]);
    };

    const scaleFactor1 = calculateScaleFactor('p1');
    const scaleFactor2 = calculateScaleFactor('p2');
    const scaleFactor3 = calculateScaleFactor('p3');
    const scaleFactor4 = calculateScaleFactor('p4');

    const renderImage = (name, scaleFactor) => {
        const template = templateData.find(item => item.name === name);

        if (template) {
            return (
                <Svg height={165} width={190}>
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
            ? () => navigation.navigate('CommonShapes', { shapeName: 'Square', templateData: templateData.find(item => item.name === name), templateName })
            : () => onPickImage(name, 'img', 'Square');

        return (
            <TouchableOpacity style={[styles(theme).column, extraStyle]} onPress={onPressHandler} disabled={isDisable}>
                {renderImage(name, scaleFactor)}
            </TouchableOpacity>
        );
    };

    return (
        <>
            {/* Row 1 */}
            <View style={styles(theme).row}>
                {renderImageBox('p1', scaleFactor1, pageId, { borderRightWidth: 1, borderColor: theme.colors.outline, borderBottomWidth: 1 })}
                {renderImageBox('p2', scaleFactor2, pageId, { borderBottomWidth: 1, borderColor: theme.colors.outline })}
            </View>

            {/* Row 2 */}
            <View style={styles(theme).row}>
                {renderImageBox('p3', scaleFactor3, pageId, { borderRightWidth: 1, borderColor: theme.colors.outline })}
                {renderImageBox('p4', scaleFactor4, pageId)}
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