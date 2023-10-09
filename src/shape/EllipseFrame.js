import React, { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, View } from 'react-native';
import Svg, { ClipPath, Defs, Ellipse, G, Image as SvgImage } from 'react-native-svg';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { round, min } from 'lodash';

function EllipseFrame({ imagePath, imageWidth, imageHeight, color }) {
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

        const minScale = 1 / 3; // Adjust this value to set the minimum zoom level.
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
                        <Ellipse
                            cx={svgSize / 2}
                            cy={120}
                            rx={120}
                            ry={83}
                            fill={color}
                            stroke={color}
                            strokeWidth={2}
                        />
                        <Defs>
                            <ClipPath id="clip">
                                <Ellipse
                                    cx={svgSize / 2}
                                    cy={120}
                                    rx={120}
                                    ry={83}
                                    fill={color}
                                    stroke={color}
                                    strokeWidth={2}
                                />
                            </ClipPath>
                        </Defs>
                        <G>
                            <SvgImage
                                href={imagePath}
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

export default EllipseFrame;