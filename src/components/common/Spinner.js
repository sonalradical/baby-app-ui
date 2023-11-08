import React from 'react';
import {
    View, ActivityIndicator,
    StyleSheet, Text
} from 'react-native';

import * as _ from 'lodash';
import PropTypes from 'prop-types';

import { useTheme } from 'react-native-paper';


export default function MMSpinner(props) {
    const theme = useTheme();
    const { size, text } = props;

    return (
        <View style={styles.spinnerWrap}>
            <View>
                <ActivityIndicator size={size ? size : 'large'} color={theme.colors.primary}
                    style={{
                        position: 'absolute', left: 0, right: 0, bottom: 0, top: 0
                    }} />
            </View>
            {
                _.isEmpty(text) ? null
                    :
                    <View>
                        <Text>{text}</Text>
                    </View>
            }
        </View>
    );
}

MMSpinner.propTypes = {
    size: PropTypes.string,
    text: PropTypes.string
};
export function MMOverlaySpinner(props) {
    const theme = useTheme();
    const { visible, optionalStyle } = props;
    const _renderSpinner = () => {
        return (
            <View style={styles(theme).container}>
                <ActivityIndicator
                    animating={true}
                    color={theme.colors.primary}
                    size="large"
                    style={optionalStyle ? [{ flex: 1 }, optionalStyle] : { flex: 1 }}
                /></View>
        )
    };

    return visible ? _renderSpinner() : <></>;
}

MMOverlaySpinner.propTypes = {
    visible: PropTypes.bool.isRequired,
    optionalStyle: PropTypes.object,
};

const styles = (theme) => StyleSheet.create({
    spinnerWrap: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        bottom: 0,
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    }
});