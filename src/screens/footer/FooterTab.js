import React from 'react';
import { BottomNavigation, Text, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import { View } from 'react-native';

export default function FooterTab({ navigation, state, descriptors, insets }) {
    const theme = useTheme();

    return (
        <View style={{
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            overflow: 'hidden',
            elevation: 5
        }}>
            <BottomNavigation.Bar
                style={{ backgroundColor: theme.colors.secondaryContainer }}
                navigationState={state}
                safeAreaInsets={insets}
                onTabPress={({ route, preventDefault }) => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (event.defaultPrevented) {
                        preventDefault();
                    } else {
                        navigation.navigate(route.name, route.params);
                    }
                }}
                renderIcon={({ route, focused, color }) => {
                    const { options } = descriptors[route.key];
                    if (options.tabBarIcon) {
                        return options.tabBarIcon({ focused, color, size: 24 });
                    }

                    return null;
                }}
                getLabelText={({ route }) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.title;

                    return label;
                }}
            />
        </View>
    );
}
FooterTab.propTypes = {
    navigation: PropTypes.object,
};
