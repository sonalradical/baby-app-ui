import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import * as _ from 'lodash';
import { useSelector } from 'react-redux';

import MMConstants from '../../helpers/Constants';
import MMUtils from '../../helpers/Utils';
import MMSurface from '../../components/common/Surface';


const CountDownBanner = ({ }) => {
    const theme = useTheme();
    const { userDetail } = useSelector((state) => state.AuthReducer.auth);
    const [state, setState] = useState({
        months: '',
        weeks: '',
        days: '',
    });
    const dueDate = MMUtils.displayDateMonthYear(userDetail.dueDate);

    useEffect(() => {
        if (userDetail.dueDate) {
            // Calculate the duration between the current date and the due date
            const duration = MMUtils.getDuration(userDetail.dueDate);

            setState({
                months: _.floor(duration.asMonths()),
                weeks: _.floor(duration.asWeeks()) % 4,
                days: _.floor(duration.asDays()) % 7
            })
        }
    }, [userDetail.dueDate]);

    return (
        // <View style={{ marginHorizontal: MMConstants.marginLarge, marginVertical: MMConstants.marginMedium }}>
        //     <MMSurface style={{ alignItems: 'center', borderRadius: 20 }} margin={[0, 0, 0, 0]}>
        //         <Text style={theme.fonts.headlineMedium}>Only</Text>
        //         <View style={{ flexDirection: 'row' }}>
        //             {state.months > 0 &&
        //                 <Card style={{
        //                     backgroundColor: theme.colors.primary, padding: MMConstants.paddingLarge,
        //                     margin: MMConstants.marginMedium
        //                 }}>
        //                     <Text style={[theme.fonts.titleLarge, { textAlign: 'center' }]}>{state.months}</Text>
        //                     <Text style={{ color: theme.colors.secondaryContainer }}>{state.months === 1 ? 'month' : 'months'}</Text>
        //                 </Card>}
        //             {state.weeks > 0 &&
        //                 <Card style={{
        //                     backgroundColor: theme.colors.primary, padding: MMConstants.paddingLarge,
        //                     margin: MMConstants.marginMedium
        //                 }}>
        //                     <Text style={[theme.fonts.titleLarge, { textAlign: 'center' }]}>{state.weeks}</Text>
        //                     <Text style={{ color: theme.colors.secondaryContainer }}>{state.weeks === 1 ? 'week' : 'weeks'}</Text>
        //                 </Card>}
        //             {state.days > 0 &&
        //                 <Card style={{
        //                     backgroundColor: theme.colors.primary, padding: MMConstants.paddingLarge,
        //                     paddingHorizontal: 20, margin: MMConstants.marginMedium
        //                 }}>
        //                     <Text style={[theme.fonts.titleLarge, { textAlign: 'center' }]}>{state.days}</Text>
        //                     <Text style={{ color: theme.colors.secondaryContainer }}>{state.days === 1 ? 'day' : 'days'}</Text>
        //                 </Card>}
        //         </View>
        //         <Text style={theme.fonts.headlineMedium}>to arrive</Text>
        //         <Text> Due date {dueDate}</Text>
        //     </MMSurface>
        // </View>

        <View style={{ marginVertical: MMConstants.marginLarge }}>

            <ImageBackground
                resizeMode="cover"
                source={require('../../assets/images/coundown-banner1.png')}
                style={styles(theme).image}
            >

                <Text style={[theme.fonts.titleLarge]}>Baby Countdown</Text>
                <View style={{ flexDirection: 'row', }}>
                    {state.weeks > 0 &&
                        <View style={[styles(theme).card]}>
                            <Text style={[theme.fonts.titleLarge, { textAlign: 'center' }]}>{state.weeks}</Text>
                            <Text style={{ color: theme.colors.secondaryContainer, textAlign: 'center' }}>
                                {state.weeks === 1 ? 'Week' : 'Weeks'}
                            </Text>
                        </View>
                    }
                    {state.days > 0 &&
                        <View style={[styles(theme).card]}>
                            <Text style={[theme.fonts.titleLarge, { textAlign: 'center' }]}>{state.days}</Text>
                            <Text style={{ color: theme.colors.secondaryContainer, textAlign: 'center' }}>
                                {state.days === 1 ? 'Day' : 'Days'}
                            </Text>
                        </View>

                    }
                    {state.months > 0 &&
                        <View style={[styles(theme).card]}>
                            <Text style={[theme.fonts.titleLarge, { textAlign: 'center' }]}>{state.months}</Text>
                            <Text style={{ color: theme.colors.secondaryContainer, textAlign: 'center' }}>
                                {state.months === 1 ? 'Month' : 'Months'}
                            </Text>
                        </View>
                    }
                </View>
                <Text style={[theme.fonts.titleMedium, { textAlign: 'center', color: 'white' }]}>until our baby is born</Text>

            </ImageBackground>

        </View>

    );
}

const styles = (theme) => StyleSheet.create({

    card: {
        marginHorizontal: 5,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0,0,0, 0.7)', // Transparent white background
    },
    image: {
        width: 'auto',
        height: Dimensions.get('window').height / 4,

    },

});
export default CountDownBanner;
