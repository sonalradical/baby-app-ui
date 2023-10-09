import React, { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, Text, TouchableOpacity, View } from 'react-native';
import Svg, { ClipPath, Defs, Ellipse, G, Image as SvgImage, Path, Polygon, Rect } from 'react-native-svg';
import { round, min } from 'lodash';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

function SquareFrame({ image, imageWidth, imageHeight, color }) {
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

        const minScale = 1; // Adjust this value to set the minimum zoom level (e.g., 1 means no zoom)
        const maxScale = 3; // Adjust this value to set the maximum zoom level (e.g., 3 means 3 times zoom)

        // Apply constraints to newScale
        const constrainedScale = Math.min(Math.max(newScale, minScale), maxScale);

        // Calculate the position adjustment based on the focal point and new scale
        const focalXPercentage = (focalX - position.x) / (imageWidth * scaleFactor * scale);
        const focalYPercentage = (focalY - position.y) / (imageHeight * scaleFactor * scale);

        // Calculate the new position
        const newPosX = focalX - focalXPercentage * (imageWidth * scaleFactor * newScale);
        const newPosY = focalY - focalYPercentage * (imageHeight * scaleFactor * newScale);

        // Update the scale and position
        setScale(newScale);
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
                        <Rect x="80" y="55" width={svgSize / 2} height={svgSize / 2} fill={color} stroke={color} strokeWidth="2" />
                        <Defs>
                            <ClipPath id="clip">
                                <Rect x="80" y="55" width={svgSize / 2} height={svgSize / 2} fill={color} stroke={color} strokeWidth="2" />
                            </ClipPath>
                        </Defs>
                        <G>
                            <SvgImage
                                href={image}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="url(#clip)"
                                x={`${((position.x / svgSize) * 100)}%`}
                                y={`${((position.y / svgSize) * 100)}%`}
                                width={imageWidth * scaleFactor * scale}
                                height={imageHeight * scaleFactor * scale}
                                {...panResponder.panHandlers}
                            />
                        </G>
                    </Svg>
                </Animated.View>
            </PinchGestureHandler>
        </View>
    );
}

export default SquareFrame;