import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
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
        <View style={{ marginHorizontal: MMConstants.marginLarge, marginVertical: MMConstants.marginMedium }}>
            <MMSurface style={{ alignItems: 'center', borderRadius: 20 }} margin={[0, 0, 0, 0]}>
                <Text style={theme.fonts.headlineMedium}>Only</Text>
                <View style={{ flexDirection: 'row' }}>
                    {state.months > 0 &&
                        <Card style={{
                            backgroundColor: theme.colors.primary, padding: MMConstants.paddingLarge,
                            margin: MMConstants.marginMedium
                        }}>
                            <Text style={[theme.fonts.titleLarge, { textAlign: 'center' }]}>{state.months}</Text>
                            <Text style={{ color: theme.colors.secondaryContainer }}>{state.months === 1 ? 'month' : 'months'}</Text>
                        </Card>}
                    {state.weeks > 0 &&
                        <Card style={{
                            backgroundColor: theme.colors.primary, padding: MMConstants.paddingLarge,
                            margin: MMConstants.marginMedium
                        }}>
                            <Text style={[theme.fonts.titleLarge, { textAlign: 'center' }]}>{state.weeks}</Text>
                            <Text style={{ color: theme.colors.secondaryContainer }}>{state.weeks === 1 ? 'week' : 'weeks'}</Text>
                        </Card>}
                    {state.days > 0 &&
                        <Card style={{
                            backgroundColor: theme.colors.primary, padding: MMConstants.paddingLarge,
                            paddingHorizontal: 20, margin: MMConstants.marginMedium
                        }}>
                            <Text style={[theme.fonts.titleLarge, { textAlign: 'center' }]}>{state.days}</Text>
                            <Text style={{ color: theme.colors.secondaryContainer }}>{state.days === 1 ? 'day' : 'days'}</Text>
                        </Card>}
                </View>
                <Text style={theme.fonts.headlineMedium}>to arrive</Text>
                <Text> Due date {dueDate}</Text>
            </MMSurface>
        </View>
    );
}
export default CountDownBanner;
