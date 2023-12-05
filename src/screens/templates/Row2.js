import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, Animated } from 'react-native';
import { useTheme, IconButton, Text } from 'react-native-paper';
import _ from 'lodash';
import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';
import Svg, { Image as SvgImage } from 'react-native-svg';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

const Row2 = (props) => {
    const theme = useTheme();
    const { onPickImage, templateData, borderWidth = 1, isDisable = false, onSetTemplateData } = props;

    const [position1, setPosition1] = useState({ x: 0, y: 0 });
    const [position2, setPosition2] = useState({ x: 0, y: 0 });
    const [scale1, setScale1] = useState(1);
    const [scale2, setScale2] = useState(1);

    const baseScaleRef1 = useRef(1);
    const pinchRef1 = useRef(null);

    const baseScaleRef2 = useRef(1);
    const pinchRef2 = useRef(null);

    const scaleFactor1 = templateData && templateData.find((item) => item.name === 'p1')?.width
        ? _.min([
            Dimensions.get('window').width / templateData.find((item) => item.name === 'p1').width,
            170 / templateData.find((item) => item.name === 'p1').height,
        ])
        : 1;

    const scaleFactor2 = templateData && templateData.find((item) => item.name === 'p2')?.width
        ? _.min([
            Dimensions.get('window').width / templateData.find((item) => item.name === 'p2').width,
            170 / templateData.find((item) => item.name === 'p2').height,
        ])
        : 1;

    useEffect(() => {
        if (templateData.find((item) => item.name === 'p1')?.width) {
            setPosition1({ x: templateData.find((item) => item.name === 'p1').x, y: templateData.find((item) => item.name === 'p1').y });
            setScale1(templateData.find((item) => item.name === 'p1').scale)
        }
    }, [templateData.find((item) => item.name === 'p1')?.width]);


    useEffect(() => {
        if (templateData.find((item) => item.name === 'p2')?.width) {
            setPosition2({ x: templateData.find((item) => item.name === 'p2').x, y: templateData.find((item) => item.name === 'p2').y });
            setScale2(templateData.find((item) => item.name === 'p2').scale)
        }
    }, [templateData.find((item) => item.name === 'p2')?.width]);

    useEffect(() => {
        if (templateData, onSetTemplateData) {
            templateData.map((data, index) => {
                if (data.name === 'p1') {
                    data.x = position1.x,
                        data.y = position1.y,
                        data.scale = scale1
                } else if (data.name === 'p2') {
                    data.x = position2.x,
                        data.y = position2.y,
                        data.scale = scale2
                }
            })
            onSetTemplateData(templateData);
        }
    }, [position1, position2, scale1, scale2]);

    const handlePinch1 = event => {
        const { focalX, focalY, scale: pinchScale } = event.nativeEvent;
        const newScale = baseScaleRef1.current * pinchScale;

        // Calculate the position adjustment based on the focal point and new scale
        const focalXPercentage = (focalX - position1.x) / (templateData.find((item) => item.name === 'p1').width * scaleFactor1 * scale1);
        const focalYPercentage = (focalY - position1.y) / (templateData.find((item) => item.name === 'p1').height * scaleFactor1 * scale1);

        // Calculate the new position
        const newPosX = focalX - focalXPercentage * (templateData.find((item) => item.name === 'p1').width * scaleFactor1 * newScale);
        const newPosY = focalY - focalYPercentage * (templateData.find((item) => item.name === 'p1').height * scaleFactor1 * newScale);

        // Update the scale and position
        setScale1(newScale);
        setPosition1({ x: newPosX, y: newPosY });
    };

    const handlePinchEnd1 = () => {
        baseScaleRef1.current = scale1;
    };

    const handlePinch2 = event => {
        const { focalX, focalY, scale: pinchScale } = event.nativeEvent;
        const newScale = baseScaleRef2.current * pinchScale;

        const minScale = 1; // Adjust this value to set the minimum zoom level.
        const maxScale = 4; // Adjust this value to set the maximum zoom level (e.g., 5 means 5 times zoom)

        // Apply constraints to newScale
        //const constrainedScale = Math.min(Math.max(newScale, minScale), maxScale);

        // Calculate the position adjustment based on the focal point and new scale
        const focalXPercentage = (focalX - position2.x) / (templateData.find((item) => item.name === 'p2').width * scaleFactor2 * scale2);
        const focalYPercentage = (focalY - position2.y) / (templateData.find((item) => item.name === 'p2').height * scaleFactor2 * scale2);

        // Calculate the new position
        const newPosX = focalX - focalXPercentage * (templateData.find((item) => item.name === 'p2').width * scaleFactor2 * newScale);
        const newPosY = focalY - focalYPercentage * (templateData.find((item) => item.name === 'p2').height * scaleFactor2 * newScale);

        // Update the scale and position
        setScale2(newScale);
        setPosition2({ x: newPosX, y: newPosY });
    };

    const handlePinchEnd2 = () => {
        baseScaleRef2.current = scale2;
    };

    const panResponder1 = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
            if (gestureState.numberActiveTouches > 1) {
                return false;
            }
            return true;
        },
        onPanResponderMove: (_, gestureState) => {
            const { dx, dy } = gestureState;
            setPosition1(prevPosition1 => ({
                x: prevPosition1.x + dx * scale1,
                y: prevPosition1.y + dy * scale1,
            }));
        },
        onPanResponderTerminationRequest: () => false,
    });

    const panResponder2 = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
            if (gestureState.numberActiveTouches > 1) {
                return false;
            }
            return true;
        },
        onPanResponderMove: (_, gestureState) => {
            const { dx, dy } = gestureState;
            setPosition2(prevPosition2 => ({
                x: prevPosition2.x + dx * scale2,
                y: prevPosition2.y + dy * scale2,
            }));
        },
        onPanResponderTerminationRequest: () => false,
    });

    return (
        <>
            <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <View
                    style={[
                        styles(theme).row,
                        { borderBottomWidth: borderWidth, borderBottomColor: theme.colors.outline },
                    ]}
                >
                    {isDisable ?
                        templateData.some(item => item.name === 'p1') &&
                        <Svg height={170}
                            width={Dimensions.get('window').width}
                            style={[styles(theme).row, { borderBottomWidth: borderWidth, borderBottomColor: theme.colors.outline }]}>
                            <SvgImage
                                href={templateData.find(item => item.name === 'p1').source}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="url(#clip)"
                                x={`${((templateData.find(item => item.name === 'p1').x / Dimensions.get('window').width) * 100)}%`}
                                y={`${((templateData.find(item => item.name === 'p1').y / 170) * 100)}%`}
                                width={templateData.find((item) => item.name === 'p1').width * scaleFactor1 * templateData.find(item => item.name === 'p1').scale}
                                height={templateData.find((item) => item.name === 'p1').height * scaleFactor1 * templateData.find(item => item.name === 'p1').scale}
                            />
                        </Svg>
                        :
                        <PinchGestureHandler
                            ref={pinchRef1}
                            onGestureEvent={handlePinch1}
                            onHandlerStateChange={event => {
                                if (event.nativeEvent.oldState === State.ACTIVE) {
                                    handlePinchEnd1();
                                }
                            }}
                        >
                            <Animated.View>
                                {templateData.some((item) => item.name === 'p1') ? (
                                    <Svg
                                        height={170}
                                        width={Dimensions.get('window').width}
                                        style={[
                                            styles(theme).row,
                                            { borderBottomWidth: borderWidth, borderBottomColor: theme.colors.outline },
                                        ]}>
                                        <SvgImage
                                            href={templateData.find((item) => item.name === 'p1').source}
                                            preserveAspectRatio="xMidYMid slice"
                                            clipPath="url(#clip)"
                                            x={`${((position1.x / Dimensions.get('window').width) * 100)}%`}
                                            y={`${((position1.y / 170) * 100)}%`}
                                            width={templateData.find((item) => item.name === 'p1').width * scaleFactor1 * scale1}
                                            height={templateData.find((item) => item.name === 'p1').height * scaleFactor1 * scale1}
                                            {...panResponder1.panHandlers}
                                        />
                                    </Svg>
                                ) : (
                                    <MMIcon
                                        iconName={'plus-circle'}
                                        style={styles(theme).imagePickerButton}
                                        onPress={() => onPickImage('p1', 'img')}
                                    />
                                )}
                            </Animated.View>
                        </PinchGestureHandler>
                    }
                </View>

                <View style={styles(theme).row}>
                    {isDisable ?
                        templateData.some(item => item.name === 'p2') &&
                        <Svg height={170}
                            width={Dimensions.get('window').width}
                            style={[styles(theme).row, { borderBottomWidth: borderWidth, borderBottomColor: theme.colors.outline }]}>
                            <SvgImage
                                href={templateData.find(item => item.name === 'p2').source}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="url(#clip)"
                                x={`${((templateData.find(item => item.name === 'p2').x / Dimensions.get('window').width) * 100)}%`}
                                y={`${((templateData.find(item => item.name === 'p2').y / 170) * 100)}%`}
                                width={templateData.find((item) => item.name === 'p2').width * scaleFactor2 * templateData.find(item => item.name === 'p2').scale}
                                height={templateData.find((item) => item.name === 'p2').height * scaleFactor2 * templateData.find(item => item.name === 'p2').scale}
                            />
                        </Svg>
                        :
                        <PinchGestureHandler
                            ref={pinchRef2}
                            onGestureEvent={handlePinch2}
                            onHandlerStateChange={event => {
                                if (event.nativeEvent.oldState === State.ACTIVE) {
                                    handlePinchEnd2();
                                }
                            }}
                        >
                            <Animated.View>
                                {templateData.some((item) => item.name === 'p2') ? (
                                    <Svg
                                        height={170}
                                        width={Dimensions.get('window').width}
                                        style={[
                                            styles(theme).row,
                                            { borderBottomWidth: borderWidth, borderBottomColor: theme.colors.outline },
                                        ]}>
                                        <SvgImage
                                            href={templateData.find((item) => item.name === 'p2').source}
                                            preserveAspectRatio="xMidYMid slice"
                                            clipPath="url(#clip)"
                                            x={`${((position2.x / Dimensions.get('window').width) * 100)}%`}
                                            y={`${((position2.y / 170) * 100)}%`}
                                            width={templateData.find((item) => item.name === 'p2').width * scaleFactor2 * scale2}
                                            height={templateData.find((item) => item.name === 'p2').height * scaleFactor2 * scale2}
                                            {...panResponder2.panHandlers}
                                        />
                                    </Svg>
                                ) : (
                                    <MMIcon
                                        iconName={'plus-circle'}
                                        style={styles(theme).imagePickerButton}
                                        onPress={() => onPickImage('p2', 'img')}
                                    />
                                )}
                            </Animated.View>
                        </PinchGestureHandler>}
                </View>
            </View>
            {!templateData.some((item) => item.name === 'p1') || isDisable ? null : (
                <MMIcon
                    iconName={'camera'}
                    style={{
                        position: 'absolute',
                        top: 0,
                    }}
                    onPress={() => onPickImage('p1', 'img')}
                />
            )}
            {!templateData.some((item) => item.name === 'p2') || isDisable ? null : (
                <MMIcon
                    iconName={'camera'}
                    style={{
                        position: 'absolute',
                        bottom: 2,
                    }}
                    onPress={() => onPickImage('p2', 'img')}
                />
            )}
        </>
    );
};

const styles = (theme) =>
    StyleSheet.create({
        row: {
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            paddingVertical: 1,
        },
        imagePickerButton: {
            padding: MMConstants.paddingLarge,
            borderRadius: 50,
        },
        image: {
            width: '100%',
            height: 170,
        },
    });

export default Row2;
