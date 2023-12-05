import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';
import { Svg, Image as SvgImage } from 'react-native-svg';

const Row2Column2 = (props) => {
    const theme = useTheme();
    const {
        onPickImage, templateData } = props;
    console.log(templateData.find((item) => item.name === 'p1')?.imageParam?.x, 'templateData')

    const scaleFactor1 = templateData && templateData.find((item) => item.name === 'p1')?.width
        ? _.min([
            190 / templateData.find((item) => item.name === 'p1').width,
            155 / templateData.find((item) => item.name === 'p1').height,
        ])
        : 1;

    const scaleFactor2 = templateData && templateData.find((item) => item.name === 'p2')?.width
        ? _.min([
            190 / templateData.find((item) => item.name === 'p2').width,
            155 / templateData.find((item) => item.name === 'p2').height,
        ])
        : 1;
    const scaleFactor3 = templateData && templateData.find((item) => item.name === 'p3')?.width
        ? _.min([
            190 / templateData.find((item) => item.name === 'p3').width,
            155 / templateData.find((item) => item.name === 'p3').height,
        ])
        : 1;
    const scaleFactor4 = templateData && templateData.find((item) => item.name === 'p4')?.width
        ? _.min([
            190 / templateData.find((item) => item.name === 'p4').width,
            155 / templateData.find((item) => item.name === 'p4').height,
        ])
        : 1;

    return (
        <>
            {/* Row 1 */}
            <View style={styles(theme).row}>
                <TouchableOpacity style={[styles(theme).column, { borderRightWidth: 1, borderColor: theme.colors.outline, borderBottomWidth: 1 }]}
                    onPress={() => onPickImage('p1', 'img', 'Square')}>
                    {templateData.some(item => item.name === 'p1') ? (
                        <Svg height={155}
                            width={190}>
                            <SvgImage
                                href={templateData.find(item => item.name === 'p1').source}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="url(#clip)"
                                x={(templateData.find(item => item.name === 'p1').imageParam?.x)}
                                y={(templateData.find(item => item.name === 'p1').imageParam?.y)}
                                width={templateData.find((item) => item.name === 'p1').width * scaleFactor1 * templateData.find(item => item.name === 'p1').imageParam?.scale}
                                height={templateData.find((item) => item.name === 'p1').height * scaleFactor1 * templateData.find(item => item.name === 'p1').imageParam?.scale}
                            />
                        </Svg>
                    ) : (
                        <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={[styles(theme).column, { borderBottomWidth: 1, borderColor: theme.colors.outline }]} onPress={() => onPickImage('p2', 'img', 'Square')}>
                    {templateData.some(item => item.name === 'p2') ?
                        <Svg height={155}
                            width={190}>
                            <SvgImage
                                href={templateData.find(item => item.name === 'p2').source}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="url(#clip)"
                                x={(templateData.find(item => item.name === 'p2').imageParam?.x)}
                                y={(templateData.find(item => item.name === 'p2').imageParam?.y)}
                                width={templateData.find((item) => item.name === 'p2').width * scaleFactor2 * templateData.find(item => item.name === 'p2').imageParam?.scale}
                                height={templateData.find((item) => item.name === 'p2').height * scaleFactor2 * templateData.find(item => item.name === 'p2').imageParam?.scale}
                            />
                        </Svg> : (
                            <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />
                        )}
                </TouchableOpacity>
            </View>

            {/* Row 2 */}
            <View style={styles(theme).row}>
                <TouchableOpacity style={[styles(theme).column, { borderRightWidth: 1, borderColor: theme.colors.outline }]}
                    onPress={() => onPickImage('p3', 'img', 'Square')}>
                    {templateData.some(item => item.name === 'p3') ?
                        <Svg height={155}
                            width={190}>
                            <SvgImage
                                href={templateData.find(item => item.name === 'p3').source}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="url(#clip)"
                                x={(templateData.find(item => item.name === 'p3').imageParam?.x)}
                                y={(templateData.find(item => item.name === 'p3').imageParam?.y)}
                                width={templateData.find((item) => item.name === 'p3').width * scaleFactor3 * templateData.find(item => item.name === 'p3').imageParam?.scale}
                                height={templateData.find((item) => item.name === 'p3').height * scaleFactor3 * templateData.find(item => item.name === 'p3').imageParam?.scale}
                            />
                        </Svg>
                        : (
                            <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />
                        )}
                </TouchableOpacity>

                <TouchableOpacity style={styles(theme).column} onPress={() => onPickImage('p4', 'img', 'Square')}>
                    {templateData.some(item => item.name === 'p4') ?
                        <Svg height={155}
                            width={190}>
                            <SvgImage
                                href={templateData.find(item => item.name === 'p4').source}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="url(#clip)"
                                x={(templateData.find(item => item.name === 'p4').imageParam?.x)}
                                y={(templateData.find(item => item.name === 'p4').imageParam?.y)}
                                width={templateData.find((item) => item.name === 'p4').width * scaleFactor4 * templateData.find(item => item.name === 'p4').imageParam?.scale}
                                height={templateData.find((item) => item.name === 'p4').height * scaleFactor4 * templateData.find(item => item.name === 'p4').imageParam?.scale}
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