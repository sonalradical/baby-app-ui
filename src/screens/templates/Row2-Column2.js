import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';

const Row2Column2 = (props) => {
    const theme = useTheme();
    const {
        onPickImage, templateData
    } = props;

    return (
        <>
            {/* Row 1 */}
            <View style={styles(theme).row}>
                <TouchableOpacity style={[styles(theme).column, { borderRightWidth: 1, borderColor: theme.colors.outline, borderBottomWidth: 1 }]}
                    onPress={() => onPickImage('p1', 'img')}>
                    {templateData.some(item => item.name === 'p1') ? (
                        <Image source={{ uri: templateData.find(item => item.name === 'p1').source }}
                            style={styles(theme).image} />
                    ) : (
                        <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={[styles(theme).column, { borderBottomWidth: 1, borderColor: theme.colors.outline }]} onPress={() => onPickImage('p2', 'img')}>
                    {templateData.some(item => item.name === 'p2') ? (
                        <Image source={{ uri: templateData.find(item => item.name === 'p2').source }}
                            style={styles(theme).image} />
                    ) : (
                        <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />
                    )}
                </TouchableOpacity>
            </View>

            {/* Row 2 */}
            <View style={styles(theme).row}>
                <TouchableOpacity style={[styles(theme).column, { borderRightWidth: 1, borderColor: theme.colors.outline }]}
                    onPress={() => onPickImage('p3', 'img')}>
                    {templateData.some(item => item.name === 'p3') ? (
                        <Image source={{ uri: templateData.find(item => item.name === 'p3').source }}
                            style={styles(theme).image} />
                    ) : (
                        <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles(theme).column} onPress={() => onPickImage('p4', 'img')}>
                    {templateData.some(item => item.name === 'p4') ? (
                        <Image source={{ uri: templateData.find(item => item.name === 'p4').source }}
                            style={styles(theme).image} />
                    ) : (
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
    image: {
        width: Dimensions.get('window').width / 2,
        height: Dimensions.get('window').height / 5,
        resizeMode: 'cover',
    },
});

export default Row2Column2;