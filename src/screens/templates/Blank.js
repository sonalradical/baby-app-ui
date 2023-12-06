import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';
import { Svg, Image as SvgImage } from 'react-native-svg';
import MMSpinner from '../../components/common/Spinner';
import { useNavigation } from '@react-navigation/native';

const Blank = (props) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const {
        onPickImage, templateData, pageId, templateName, isDisable = false
    } = props;

    const calculateScaleFactor = (templateName) => {
        const template = templateData.find((item) => item.name === templateName);

        if (!template || !template.imageParam || !template.imageParam.width) {
            return 1;
        }

        const widthScale = (Dimensions.get('window').width - 20) / template.imageParam.width;
        const heightScale = Dimensions.get('window').width / template.imageParam.height;

        return _.min([widthScale, heightScale]);
    };

    const scaleFactor = calculateScaleFactor('p1');

    const renderImage = (name, scaleFactor) => {
        const template = templateData.find(item => item.name === name);

        if (template) {
            return (
                <Svg height={Dimensions.get('window').width} width={Dimensions.get('window').width - 20}>
                    {template.source ?
                        <SvgImage
                            href={template?.source}
                            preserveAspectRatio="xMidYMid slice"
                            clipPath="url(#clip)"
                            x={template.imageParam?.x}
                            y={template.imageParam?.y}
                            width={template.imageParam?.width * scaleFactor * template.imageParam?.scale}
                            height={template.imageParam?.height * scaleFactor * template.imageParam?.scale}
                        /> : <MMSpinner />}
                </Svg>
            );
        } else {
            return <MMIcon iconName={'plus-circle'} style={styles(theme).imagePickerButton} />;
        }
    };

    return (
        <TouchableOpacity style={styles(theme).container} onPress={pageId
            ? () => navigation.navigate('CommonShapes', { shapeName: 'Square', templateData: templateData.find(item => item.name === 'p1'), templateName })
            : () => onPickImage('p1', 'img', 'Square')} disabled={isDisable}>
            {renderImage('p1', scaleFactor)}
        </TouchableOpacity>
    );
};

const styles = (theme) => StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50,
    },
});

export default Blank;