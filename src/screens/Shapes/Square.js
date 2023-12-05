import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, PanResponder } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMContentContainer from '../../components/common/ContentContainer';
import Svg, { Image as SvgImage } from 'react-native-svg';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import MMFlexView from '../../components/common/FlexView';
import { MMButton, MMOutlineButton } from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import MMActionButtons from '../../components/common/ActionButtons';

const Square = (props) => {
    const theme = useTheme();
    const { templateData, templateName } = props;
    const navigation = useNavigation();

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);

    const baseScaleRef = useRef(1);
    const pinchRef = useRef(null);

    const scaleFactor = templateData && templateData[0]?.width
        ? _.min([
            190 / templateData[0].width,
            155 / templateData[0].height,
        ])
        : 1;

    useEffect(() => {
        if (templateData[0]?.width) {
            setPosition({ x: templateData[0].imageParam.x, y: templateData[0].imageParam.y });
            setScale(templateData[0].imageParam.scale);
        }
    }, [templateData[0]?.width]);

    useEffect(() => {
        if (templateData) {
            templateData.map((data, index) => {
                data.imageParam.x = position.x,
                    data.imageParam.y = position.y,
                    data.imageParam.scale = scale
            })
        }
    }, [position, scale]);

    const handlePinch = event => {
        const { focalX, focalY, scale: pinchScale } = event.nativeEvent;
        const newScale = baseScaleRef.current * pinchScale;

        // Calculate the position adjustment based on the focal point and new scale
        const focalXPercentage = (focalX - position.x) / (templateData[0].width * scaleFactor * scale);
        const focalYPercentage = (focalY - position.y) / (templateData[0].height * scaleFactor * scale);

        // Calculate the new position
        const newPosX = focalX - focalXPercentage * (templateData[0].width * scaleFactor * newScale);
        const newPosY = focalY - focalYPercentage * (templateData[0].height * scaleFactor * newScale);

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
                                href={templateData[0].source}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="url(#clip)"
                                x={`${((position.x / 190) * 100)}%`}
                                y={`${((position.y / 155) * 100)}%`}
                                width={templateData[0].width * scaleFactor * scale}
                                height={templateData[0].height * scaleFactor * scale}
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
            <MMActionButtons >
                <MMOutlineButton
                    label="Cancel"
                    onPress={() => navigation.goBack()}
                    width='45%'
                />
                <MMButton
                    label="Done"
                    onPress={() => navigation.navigate({
                        name: 'MainTemplate',
                        params: { imageConfig: templateData[0], templateName: templateName },
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