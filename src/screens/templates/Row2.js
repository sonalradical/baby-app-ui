import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, PanResponder } from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';
import _ from 'lodash';
import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';
import Svg, { Image as SvgImage } from 'react-native-svg';

const Row2 = (props) => {
    const theme = useTheme();
    const {
        onPickImage,
        templateData,
        borderWidth = 1,
        isDisable = false,
    } = props;

    const [position1, setPosition1] = useState({ x: 0, y: 0 });
    const [position2, setPosition2] = useState({ x: 0, y: 0 });

    const calculateScaleFactor = (index) => {
        const scaleFactor = templateData[index]?.width
            ? _.min([
                Dimensions.get('window').width /
                templateData[index].width,
                (Dimensions.get('window').height / 4) /
                templateData[index].height,
            ])
            : 1;
        return scaleFactor;
    };

    const updatePosition = (index, scaleFactor) => {
        const offsetX =
            (Dimensions.get('window').width -
                templateData[index].width * scaleFactor) /
            2;
        const offsetY =
            (Dimensions.get('window').height / 4 -
                templateData[index].height * scaleFactor) /
            2;
        const position = { x: offsetX, y: offsetY };
        index === 0 ? setPosition1(position) : setPosition2(position);
    };

    // useEffect(() => {
    //     if (templateData[0]?.width) {
    //         const scaleFactor = calculateScaleFactor(0);
    //         updatePosition(0, scaleFactor);
    //     }
    // }, [templateData[0]?.width]);

    // useEffect(() => {
    //     if (templateData[1]?.width) {
    //         const scaleFactor = calculateScaleFactor(1);
    //         updatePosition(1, scaleFactor);
    //     }
    // }, [templateData[1]?.width]);

    const createPanResponder = (positionState) =>
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Check if the pinch gesture is active, and if so, don't set the pan responder
                if (gestureState.numberActiveTouches > 1) {
                    return false;
                }
                return true;
            },
            onPanResponderMove: (_, gestureState) => {
                const { dx, dy } = gestureState;
                positionState((prevPosition) => ({
                    x: prevPosition.x + dx,
                    y: prevPosition.y + dy,
                }));
            },
            onPanResponderTerminationRequest: () => false,
        });

    const panResponder1 = createPanResponder(setPosition1);
    const panResponder2 = createPanResponder(setPosition2);

    const renderImage = (index, position, panResponder) => {
        if (templateData[index]?.width) {
            return (
                <Svg
                    height={Dimensions.get('window').height / 4}
                    width={Dimensions.get('window').width}
                    style={[
                        styles(theme).row,
                        { borderBottomWidth: borderWidth, borderBottomColor: theme.colors.outline },
                    ]}
                >
                    <SvgImage
                        href={templateData[index].source}
                        preserveAspectRatio="xMidYMid slice"
                        clipPath="url(#clip)"
                        width={Dimensions.get('window').width}
                        x={`${((position.x / Dimensions.get('window').width) * 100)}%`}
                        y={`${((position.y / Dimensions.get('window').height) * 100)}%`}
                        {...panResponder.panHandlers}
                    />
                </Svg>
            );
        } else {
            return (
                <MMIcon
                    iconName="plus-circle"
                    style={styles(theme).imagePickerButton}
                    onPress={() => onPickImage(`p${index + 1}`, 'img')}
                />
            );
        }
    };

    return (
        <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
        }}>
            <View style={[
                styles(theme).row,
                { borderBottomWidth: borderWidth, borderBottomColor: theme.colors.outline },
            ]}
                disabled={isDisable}>
                {renderImage(0, position1, panResponder1)}
            </View>

            <View style={styles(theme).row} disabled={isDisable}>
                {renderImage(1, position2, panResponder2)}
            </View>

            {!templateData.some((item) => item.name === 'p1') || isDisable ? null : (
                <MMIcon
                    iconName="camera"
                    style={{
                        position: 'absolute',
                        top: 0,
                    }}
                    onPress={() => onPickImage('p1', 'img')}
                />
            )}

            {!templateData.some((item) => item.name === 'p2') || isDisable ? null : (
                <MMIcon
                    iconName="camera"
                    style={{
                        position: 'absolute',
                        bottom: 2,
                    }}
                    onPress={() => onPickImage('p2', 'img')}
                />
            )}
        </View>
    );
};

const styles = (theme) => StyleSheet.create({
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
        height: Dimensions.get('window').height / 4,
        resizeMode: 'cover',
        flex: 1,
    },
});

export default Row2;
