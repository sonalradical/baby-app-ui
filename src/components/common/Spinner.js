import React from 'react';
import {
    View, ActivityIndicator,
    StyleSheet, Text
} from 'react-native';

import * as _ from 'lodash';
import PropTypes from 'prop-types';

import MMColors from '../../helpers/Colors';
import MMStyles from '../../helpers/Styles';


export default function MMSpinner(props) {
    const { size, text } = props;

    return (
        <View style={styles.spinnerWrap}>
            <View>
                <ActivityIndicator size={size ? size : 'large'} color={MMColors.orange}
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
    const { visible, optionalStyle } = props;
    const _renderSpinner = () => {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    animating={true}
                    color={MMColors.orange}
                    size="large"
                    // style={MMStyles.flex1}
                    style={optionalStyle ? [MMStyles.flex1, optionalStyle] : MMStyles.flex1}
                /></View>
        )
    };

    return visible ? _renderSpinner() : <></>;
}

MMOverlaySpinner.propTypes = {
    visible: PropTypes.bool.isRequired,
    optionalStyle: PropTypes.object,
};

const styles = StyleSheet.create({
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