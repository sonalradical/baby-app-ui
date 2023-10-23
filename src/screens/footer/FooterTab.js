import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native-safe-area-context';

import MMColors from '../../helpers/Colors';
import MMIcon from '../../components/common/Icon';
import MMStyles from '../../helpers/Styles';

export default function FooterTab({ navigation }) {
    const TabChange = (screen) => {
        navigation.navigate(screen);
    };

    return (
        <SafeAreaView>
            <View style={MMStyles.bottomView}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }} >
                    <View>
                        <TouchableOpacity
                            style={MMStyles.tabBarView}
                            onPress={() => TabChange('Home')}
                        >
                            <Text
                                style={[MMStyles.buttonText, MMStyles.h8, { color: MMColors.white }]}
                            >
                                Home
                            </Text>
                            <MMIcon
                                iconName="home"
                                iconSize={30}
                                iconColor={MMColors.white}
                            />

                        </TouchableOpacity>
                    </View>

                    <View>
                        <TouchableOpacity
                            style={MMStyles.tabBarView}
                            onPress={() => TabChange('ChapterList')}
                        >
                            <Text style={[MMStyles.buttonText, MMStyles.h8, { color: MMColors.white }]}>
                                Chapter
                            </Text>
                            <MMIcon iconName="book" iconSize={30} iconColor={MMColors.white} />

                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={MMStyles.tabBarView}
                        >
                            <Text style={[MMStyles.buttonText, MMStyles.h8, { color: MMColors.white }]}>
                                Order
                            </Text>
                            <MMIcon iconName="shopping-bag" iconSize={30} iconColor={MMColors.white} />

                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={MMStyles.tabBarView}
                        >
                            <Text style={[MMStyles.buttonText, MMStyles.h8, { color: MMColors.white }]}>
                                Setting
                            </Text>
                            <MMIcon iconName="tasks" iconSize={30} iconColor={MMColors.white} />

                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
FooterTab.propTypes = {
    navigation: PropTypes.object,
};
