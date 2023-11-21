import React from 'react';
import { Alert } from 'react-native';

const MMConfirmDialog = ({ message, onConfirm }) => {
    return Alert.alert(
        "Alert",
        message,
        [
            {
                text: 'No',
                style: 'cancel'
            },
            {
                text: 'Yes',
                onPress: onConfirm
            }
        ],
        { cancelable: true }
    );
};

export default MMConfirmDialog;