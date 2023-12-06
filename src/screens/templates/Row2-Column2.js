import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';
import { Svg, Image as SvgImage } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

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
        const heightScale = 155 / template.imageParam.height;

        return _.min([widthScale, heightScale]);
    };

    const scaleFactor1 = calculateScaleFactor('p1');
    const scaleFactor2 = calculateScaleFactor('p2');
    const scaleFactor3 = calculateScaleFactor('p3');
    const scaleFactor4 = calculateScaleFactor('p4');

    return (
        <>
            {/* Row 1 */}
            <View style={styles(theme).row}>
                <TouchableOpacity style={[styles(theme).column, { borderRightWidth: 1, borderColor: theme.colors.outline, borderBottomWidth: 1 }]}
                    onPress={pageId ? () => navigation.navigate('CommonShapes', { shapeName: 'Square', templateData: [templateData.find(item => item.name === 'p1')], templateName: templateName }) :
                        () => onPickImage('p1', 'img', 'Square')} disabled={isDisable}>
                    {templateData.some(item => item.name === 'p1') ? (
                        <Svg height={155}
                            width={190}>
                            <SvgImage
                                href={templateData.find(item => item.name === 'p1').source}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="url(#clip)"
                                x={(templateData.find(item => item.name === 'p1').imageParam?.x)}
                                y={(templateData.find(item => item.name === 'p1').imageParam?.y)}
                                width={templateData.find((item) => item.name === 'p1').imageParam?.width * scaleFactor1 * templateData.find(item => item.name === 'p1').imageParam?.scale}
                                height={templateData.find((item) => item.name === 'p1').imageParam?.height * scaleFactor1 * templateData.find(item => item.name === 'p1').imageParam?.scale}
                            />
                        </Svg>
                    ) : (
                        <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={[styles(theme).column, { borderBottomWidth: 1, borderColor: theme.colors.outline }]} onPress={pageId ? () => navigation.navigate('CommonShapes', { shapeName: 'Square', templateData: [templateData.find(item => item.name === 'p2')], templateName: templateName }) :
                    () => onPickImage('p2', 'img', 'Square')} disabled={isDisable}>
                    {templateData.some(item => item.name === 'p2') ?
                        <Svg height={155}
                            width={190}>
                            <SvgImage
                                href={templateData.find(item => item.name === 'p2').source}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="url(#clip)"
                                x={(templateData.find(item => item.name === 'p2').imageParam?.x)}
                                y={(templateData.find(item => item.name === 'p2').imageParam?.y)}
                                width={templateData.find((item) => item.name === 'p2').imageParam?.width * scaleFactor2 * templateData.find(item => item.name === 'p2').imageParam?.scale}
                                height={templateData.find((item) => item.name === 'p2').imageParam?.height * scaleFactor2 * templateData.find(item => item.name === 'p2').imageParam?.scale}
                            />
                        </Svg> : (
                            <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />
                        )}
                </TouchableOpacity>
            </View>

            {/* Row 2 */}
            <View style={styles(theme).row}>
                <TouchableOpacity style={[styles(theme).column, { borderRightWidth: 1, borderColor: theme.colors.outline }]}
                    onPress={pageId ? () => navigation.navigate('CommonShapes', { shapeName: 'Square', templateData: [templateData.find(item => item.name === 'p3')], templateName: templateName }) :
                        () => onPickImage('p3', 'img', 'Square')} disabled={isDisable}>
                    {templateData.some(item => item.name === 'p3') ?
                        <Svg height={155}
                            width={190}>
                            <SvgImage
                                href={templateData.find(item => item.name === 'p3').source}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="url(#clip)"
                                x={(templateData.find(item => item.name === 'p3').imageParam?.x)}
                                y={(templateData.find(item => item.name === 'p3').imageParam?.y)}
                                width={templateData.find((item) => item.name === 'p3').imageParam?.width * scaleFactor3 * templateData.find(item => item.name === 'p3').imageParam?.scale}
                                height={templateData.find((item) => item.name === 'p3').imageParam?.height * scaleFactor3 * templateData.find(item => item.name === 'p3').imageParam?.scale}
                            />
                        </Svg>
                        : (
                            <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />
                        )}
                </TouchableOpacity>

                <TouchableOpacity style={styles(theme).column} onPress={pageId ? () => navigation.navigate('CommonShapes', { shapeName: 'Square', templateData: [templateData.find(item => item.name === 'p4')], templateName: templateName }) :
                    () => onPickImage('p4', 'img', 'Square')} disabled={isDisable}>
                    {templateData.some(item => item.name === 'p4') ?
                        <Svg height={155}
                            width={190}>
                            <SvgImage
                                href={templateData.find(item => item.name === 'p4').source}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="url(#clip)"
                                x={(templateData.find(item => item.name === 'p4').imageParam?.x)}
                                y={(templateData.find(item => item.name === 'p4').imageParam?.y)}
                                width={templateData.find((item) => item.name === 'p4').imageParam?.width * scaleFactor4 * templateData.find(item => item.name === 'p4').imageParam?.scale}
                                height={templateData.find((item) => item.name === 'p4').imageParam?.height * scaleFactor4 * templateData.find(item => item.name === 'p4').imageParam?.scale}
                            />
                        </Svg> : (
                            <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />
                        )}
                </TouchableOpacity>
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
        padding: 16,
    },
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50,
    },
});

export default Row2Column2;