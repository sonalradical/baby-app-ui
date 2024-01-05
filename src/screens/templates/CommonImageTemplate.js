import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';

const CommonImageTemplate = ({ name, templateData }) => {
    const theme = useTheme();
    const template = templateData.find(item => item.name === name);

    if (template) {
        return (
            <Image
                style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    resizeMode: MMUtils.isPlatformAndroid ? 'contain' : 'cover'
                }}
                source={{ uri: template?.source }}
            />
        );
    } else {
        return <MMIcon iconName={'add-circle-sharp'} style={styles(theme).imagePickerButton} />;
    }
};

const styles = (theme) => StyleSheet.create({
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50,
    },
});


export default CommonImageTemplate;
