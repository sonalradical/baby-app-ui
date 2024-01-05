import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, ImageBackground } from 'react-native';

const MMImageBackground = ({ children, imgSource = require('../../assets/images/backgroundImage.png') }) => {

    return (
        <View style={styles.container}>
            <ImageBackground
                source={imgSource} style={styles.image}
            >
                {children}
            </ImageBackground>
        </View>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default MMImageBackground;