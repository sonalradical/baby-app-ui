import * as React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const MMRoundBackground = ({ text }) => {

    return (
        <View style={{ width: 120, height: 50 }}>
            <ImageBackground
                source={{ uri: 'https://www.shutterstock.com/image-vector/oval-round-frame-banner-border-260nw-2112342833.jpg' }}
                style={styles.imageBackground}
                resizeMode="contain"
            >
                <View style={styles.overlay}>
                    <Text style={styles.centeredText}>{text}</Text>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top: 20
    },
    overlay: {
        borderRadius: 10, // Optional: Add border radius to the overlay
    },
    centeredText: {
        textAlign: 'center',
    },
});

export default MMRoundBackground;