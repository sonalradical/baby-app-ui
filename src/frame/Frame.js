import React, { useEffect, useState } from 'react';
import { View, PanResponder, Animated, Image, resolveAssetSource } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CircleFrame from '../shape/CircleFrame';
import EllipseFrame from '../shape/EllipseFrame';
import HexagonFrame from '../shape/HexagonFrame';
import SquareFrame from '../shape/SquareFrame';

function Frame() {
    const [circleImageSize, setCircleImageSize] = useState({ width: 0, height: 0 });
    const [ellipseImageSize, setEllipseImageSize] = useState({ width: 0, height: 0 });
    const [squareImageSize, setSquareImageSize] = useState({ width: 0, height: 0 });

    const circleImagePath = require('../assets/images/girl.jpeg');
    const ellipseImagePath = require('../assets/images/baby.jpg');
    const squareImagePath = require('../assets/images/baby2.jpeg');


    const circleJson = {
        x: circleImageSize.width,
        y: circleImageSize.height,
        image: circleImagePath,
        color: 'red'
    }

    const ellipseJson = {
        x: ellipseImageSize.width,
        y: ellipseImageSize.height,
        imagePath: ellipseImagePath,
        color: 'gray'
    }

    const squareJson = {
        x: squareImageSize.width,
        y: squareImageSize.height,
        image: squareImagePath,
        color: 'lightblue'
    }

    useEffect(() => {
        fetchImageSize(circleImagePath, setCircleImageSize);
        fetchImageSize(ellipseImagePath, setEllipseImageSize);
        fetchImageSize(squareImagePath, setSquareImageSize);
    }, [circleImagePath, ellipseImagePath, squareImagePath]);

    const fetchImageSize = (imagePath, setImageSize) => {
        const image = Image.resolveAssetSource(imagePath);
        setImageSize({ width: image.width, height: image.height });
    };

    return (
        <>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <CircleFrame image={circleJson.image} color={circleJson.color} imageWidth={circleJson.x} imageHeight={circleJson.y} />
                <EllipseFrame imagePath={ellipseJson.imagePath} color={ellipseJson.color} imageWidth={ellipseJson.x} imageHeight={ellipseJson.y} />
                <SquareFrame image={squareJson.image} color={squareJson.color} imageWidth={squareJson.x} imageHeight={squareJson.y} />
                {/* <HexagonFrame image={circleJson.image} color={circleJson.color} imageWidth={circleJson.x} imageHeight={circleJson.y} /> */}
            </GestureHandlerRootView>
        </>
    );
}

export default Frame;