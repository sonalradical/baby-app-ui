import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Text, TouchableOpacity, View } from 'react-native';
import { round, min } from 'lodash';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import Svg, { Circle, ClipPath, Defs, G, Image as SvgImage, Path, Polygon } from 'react-native-svg';


function HexagonFrame({ image, imageWidth, imageHeight, color }) {
    const initialScale = 1;
    const [scale, setScale] = useState(initialScale);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const svgSize = 250;
    const scaleFactor = min([svgSize / imageWidth, svgSize / imageHeight]);

    useEffect(() => {
        const offsetX = (svgSize - imageWidth * scaleFactor) / 2;
        const offsetY = (svgSize - imageHeight * scaleFactor) / 2;
        setPosition({ x: offsetX, y: offsetY });
    }, [imageWidth, imageHeight, svgSize]);

    const baseScaleRef = useRef(initialScale);
    const pinchRef = useRef(null);

    const handlePinch = event => {
        const { focalX, focalY, scale: pinchScale } = event.nativeEvent;
        const newScale = baseScaleRef.current * pinchScale;

        const minScale = 1 / 3; // Adjust this value to set the minimum zoom level (e.g., 1 means no zoom)
        const maxScale = 5; // Adjust this value to set the maximum zoom level (e.g., 5 means 5 times zoom)

        // Apply constraints to newScale
        const constrainedScale = Math.min(Math.max(newScale, minScale), maxScale);

        // Calculate the position adjustment based on the focal point and scale
        const focalXPercentage = (focalX - position.x) / (imageWidth * scaleFactor * scale);
        const focalYPercentage = (focalY - position.y) / (imageHeight * scaleFactor * scale);

        // Calculate the new position
        const newPosX = focalX - focalXPercentage * (imageWidth * scaleFactor * constrainedScale);
        const newPosY = focalY - focalYPercentage * (imageHeight * scaleFactor * constrainedScale);

        // Update the scale and position
        setScale(constrainedScale);
        setPosition({ x: newPosX, y: newPosY });
    };

    const handlePinchEnd = () => {
        baseScaleRef.current = scale;
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
            // Check if the pinch gesture is active, and if so, don't set the pan responder
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

    return (
        <View>
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
                    <Svg height={svgSize} width={svgSize}>
                        <Polygon
                            fill="red"
                            stroke="purple"
                            strokeWidth="1"
                            points="43.75 0, 131.25 0, 175 87.5, 131.25 175, 43.75 175, 0 87.5"
                        />
                        <Defs>
                            <ClipPath id="clip">
                                <Polygon points="43.75 0, 131.25 0, 175 87.5, 131.25 175, 43.75 175, 0 87.5" />
                            </ClipPath>
                        </Defs>
                        <G>
                            <SvgImage
                                href={image}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath='url(#clip)'
                                x={`${round((position.x / svgSize) * 100)}%`}
                                y={`${round((position.y / svgSize) * 100)}%`}
                                width={newWidth}
                                height={newHeight}
                                {...panResponder.panHandlers}
                            />
                        </G>
                    </Svg>
                </Animated.View>
            </PinchGestureHandler>
        </View>
    );

}


export default HexagonFrame;