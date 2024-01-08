import * as _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import MMConstants from '../../helpers/Constants';
import MMUtils from '../../helpers/Utils';

const CountDownBanner = ({ }) => {
    const theme = useTheme();
    const { userDetail } = useSelector((state) => state.AuthReducer.auth);
    const [state, setState] = useState({
        months: '',
        weeks: '',
        days: '',
    });

    useEffect(() => {
        if (userDetail.dueDate) {
            const currentDate = MMUtils.getTodayDateTime();
            const dueDate = MMUtils.parseMoment(userDetail.dueDate);

            if (dueDate.isBefore(currentDate)) {
                console.log("Due date is in the past");
            } else {
                const duration = MMUtils.getDuration(dueDate);

                setState({
                    months: Math.floor(duration.asMonths()),
                    weeks: Math.floor(duration.asWeeks()) % 4,
                    days: Math.floor(duration.asDays()) % 7
                });
            }
        }
    }, [userDetail.dueDate]);

    return (
        <Card style={{ marginVertical: MMConstants.marginMedium, backgroundColor: theme.colors.primary }}>

            <ImageBackground
                resizeMode="contain"
                source={require('../../assets/images/countdown_banner.png')}
                style={styles(theme).image}
            >

                <Text style={[theme.fonts.titleLarge, { paddingHorizontal: 12, paddingVertical: 8 }]}>Baby Countdown</Text>
                <View style={{ flexDirection: 'row', paddingHorizontal: 12 }}>
                    {state.weeks > 0 &&
                        <View style={[styles(theme).card]}>
                            <Text style={[theme.fonts.titleMedium, { textAlign: 'center' }]}>{state.weeks}</Text>
                            <Text style={styles(theme).subText}>
                                {state.weeks === 1 ? 'Week' : 'Weeks'}
                            </Text>
                        </View>
                    }
                    {state.days > 0 &&
                        <View style={[styles(theme).card]}>
                            <Text style={[theme.fonts.titleMedium, { textAlign: 'center' }]}>{state.days}</Text>
                            <Text style={styles(theme).subText}>
                                {state.days === 1 ? 'Day' : 'Days'}
                            </Text>
                        </View>

                    }
                    {state.months > 0 &&
                        <View style={[styles(theme).card]}>
                            <Text style={[theme.fonts.titleMedium, { textAlign: 'center' }]}>{state.months}</Text>
                            <Text style={styles(theme).subText}>
                                {state.months === 1 ? 'Month' : 'Months'}
                            </Text>
                        </View>
                    }
                </View>
                <Text style={[theme.fonts.titleMedium, { color: 'white', paddingHorizontal: 12, paddingVertical: 8 }]}>until our baby is born</Text>

            </ImageBackground>

        </Card >

    );
}

const styles = (theme) => StyleSheet.create({

    card: {
        marginRight: 5,
        width: '25%',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
        , // Transparent white background
    },
    image: {
        width: Dimensions.get('window').width - 24,
        // height: 180
    },
    subText: {
        // color: 'white',
        fontSize: 8,
        fontWeight: 700,
        textAlign: 'center'
    }

});
export default CountDownBanner;
