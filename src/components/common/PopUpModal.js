import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import MMConstants from '../../helpers/Constants';

const MMPopUpModal = ({ children, isModalOpen }) => {
    const theme = useTheme();

    return (
        <View style={styles(theme).container}>
            <Modal visible={isModalOpen} animationType='fade' transparent>
                <View style={styles(theme).modalContainer}>
                    <View style={styles(theme).modalContent}>
                        {children}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = (theme) => StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: theme.colors.secondaryContainer,
        padding: MMConstants.paddingLarge,
        marginHorizontal: 8,
        borderRadius: 6,
    },
});

export default MMPopUpModal;