import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, PanResponder } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMContentContainer from '../../components/common/ContentContainer';
import Svg, { Image as SvgImage } from 'react-native-svg';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { MMButton, MMOutlineButton } from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import MMActionButtons from '../../components/common/ActionButtons';

const Square = (props) => {
    const theme = useTheme();
    const { templateData, templateName } = props;
    const navigation = useNavigation();

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [imageConfig, setImageConfig] = useState(templateData);

    const baseScaleRef = useRef(1);
    const pinchRef = useRef(null);

    const scaleFactor = templateData && templateData?.imageParam?.width
        ? _.min([
            190 / templateData.imageParam.width,
            155 / templateData.imageParam.height,
        ])
        : 1;

    useEffect(() => {
        if (templateData?.imageParam?.width) {
            setPosition({ x: templateData.imageParam.x, y: templateData.imageParam?.y });
            setScale(templateData.imageParam.scale);
        }
    }, [templateData?.imageParam?.width]);

    useEffect(() => {
        if (templateData) {
            setImageConfig((prevTemplateData) => ({
                ...prevTemplateData,
                imageParam: {
                    ...prevTemplateData.imageParam,
                    x: position.x,
                    y: position.y,
                    scale: scale,
                },
            }));
        }
    }, [position, scale]);

    const handlePinch = event => {
        const { focalX, focalY, scale: pinchScale } = event.nativeEvent;
        const newScale = baseScaleRef.current * pinchScale;

        // Calculate the position adjustment based on the focal point and new scale
        const focalXPercentage = (focalX - position.x) / (templateData.imageParam.width * scaleFactor * scale);
        const focalYPercentage = (focalY - position.y) / (templateData.imageParam.height * scaleFactor * scale);

        // Calculate the new position
        const newPosX = focalX - focalXPercentage * (templateData.imageParam.width * scaleFactor * newScale);
        const newPosY = focalY - focalYPercentage * (templateData.imageParam.height * scaleFactor * newScale);

        // Update the scale and position
        setScale(newScale);
        setPosition({ x: newPosX, y: newPosY });
    };

    const handlePinchEnd = () => {
        baseScaleRef.current = scale;
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
            if (gestureState.numberActiveTouches > 1) {
                return false;
            }
            return true;
        },
        onPanResponderMove: (_, gestureState) => {
            const { dx, dy } = gestureState;
            setPosition(prevPosition => ({
                x: prevPosition.x + dx * scale,
                y: prevPosition.y + dy * scale,
            }));
        },
        onPanResponderTerminationRequest: () => false,
    });

    const renderView = () => {
        return (
            <View style={[styles(theme).container]}>
                <PinchGestureHandler
                    ref={pinchRef}
                    onGestureEvent={handlePinch}
                    onHandlerStateChange={event => {
                        if (event.nativeEvent.oldState === State.ACTIVE) {
                            handlePinchEnd();
                        }
                    }}
                >
                    <Animated.View>
                        <Svg
                            height={155}
                            width={190}
                            style={styles(theme).row}>
                            <SvgImage
                                href={templateData.source}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="url(#clip)"
                                x={`${((position.x / 190) * 100)}%`}
                                y={`${((position.y / 155) * 100)}%`}
                                width={templateData.imageParam.width * scaleFactor * scale}
                                height={templateData.imageParam.height * scaleFactor * scale}
                                {...panResponder.panHandlers}
                            />
                        </Svg>
                    </Animated.View>
                </PinchGestureHandler>
            </View>
        )
    }

    const renderButtons = () => {
        return (
            <MMActionButtons type='bottomFixed'>
                <MMOutlineButton
                    label="Cancel"
                    onPress={() => navigation.goBack()}
                    width='45%'
                />
                <MMButton
                    label="Done"
                    onPress={() => navigation.navigate({
                        name: 'MainTemplate',
                        params: { imageConfig: imageConfig, templateName: templateName },
                        merge: true,
                    })}
                    width={'45%'}
                />
            </MMActionButtons>)
    }

    return (
        <>
            <MMContentContainer>
                {renderView()}
            </MMContentContainer>
            {renderButtons()}
        </>
    );
};

const styles = (theme) => StyleSheet.create({
    container: {
        height: 155,
        width: 190,
        borderColor: theme.colors.outline,
        borderStyle: 'dashed',
        borderWidth: 1,
        alignSelf: 'center',
        top: 50
    },
    row: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    imagePickerButton: {
        padding: MMConstants.paddingLarge,
        borderRadius: 50,
    },
    image: {
        width: 190,
        height: 170,
        resizeMode: 'cover',
    },
    imageRow: {
        width: '100%',
        height: 170,
        resizeMode: 'cover',
    }
});

export default Square;