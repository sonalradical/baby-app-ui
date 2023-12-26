import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import * as _ from 'lodash';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { setBaby } from '../../redux/Slice/AppSlice';

import MMUtils from '../../helpers/Utils';
import MMEnums from '../../helpers/Enums';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import MMContentContainer from '../../components/common/ContentContainer';
import MMSurface from '../../components/common/Surface';
import MMScrollView from '../../components/common/ScrollView';

import ChapterList from '../chapter/ChapterList';
import CountDownBanner from '../banners/CountDownBanner';
import OrderNowBanner from '../banners/OrderNowBanner';

export default function Home({ updateFooterVisibility }) {
    const theme = useTheme();
    const navigation = useNavigation()
    const scrollViewRef = useRef(null);
    const [isScrollingUp, setIsScrollingUp] = useState(true);
    const dispatch = useDispatch();
    const selectedBaby = useSelector((state) => state.AppReducer.baby);
    const { userDetail } = useSelector((state) => state.AuthReducer.auth);
    const [state, setState] = useState({
        months: '',
        weeks: '',
        days: '',
    });

    useEffect(() => {
        if (selectedBaby?.isBorn === 'No') {
            // Calculate the duration between the current date and the due date
            const duration = MMUtils.getDuration(userDetail.dueDate);

            setState({
                months: _.floor(duration.asMonths()),
                weeks: _.floor(duration.asWeeks()) % 4,
                days: _.floor(duration.asDays()) % 7
            })
        }
    }, [selectedBaby]);

    useEffect(() => { //  when there is no selectedBabyId set 1st baby
        if (_.isEmpty(selectedBaby)) {
            Init();
        }
    }, [selectedBaby]);

    async function Init() {
        const response = await MMApiService.babyList();
        if (response.data) {
            const babyProfiles = response.data;
            MMUtils.setItemToStorage(MMEnums.storage.selectedBaby, JSON.stringify(babyProfiles[0]));
            dispatch(setBaby(babyProfiles[0]));
        }
    }

    const handleScroll = (offsetY) => {
        const currentOffset = offsetY;
        const previousOffset = scrollViewRef.current ? scrollViewRef.current : 0;
        setIsScrollingUp(currentOffset <= previousOffset);
        scrollViewRef.current = currentOffset;
    };

    const handleScrollEndDrag = () => {
        updateFooterVisibility(true);
    };

    const renderCountDownBanner = () => {
        const dueDate = MMUtils.displayDateMonthYear(userDetail.dueDate);

        return (
            userDetail.dueDate ?
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
                </View> : null
        );
    };

    return (
        <>
            <MMContentContainer>
                {selectedBaby?.isBorn === 'Yes' ? <MMScrollView
                    onScroll={(event) => handleScroll(event.nativeEvent.contentOffset.y)}
                    onScrollEndDrag={handleScrollEndDrag}>
                    <OrderNowBanner onPress={() => navigation.navigate('Order')} />
                    <ChapterList />
                </MMScrollView> :
                    <>
                        {renderCountDownBanner()}
                        <ChapterList />
                    </>}
            </MMContentContainer>
        </>
    );
}

