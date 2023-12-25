import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MMUtils from '../../helpers/Utils';
import MMEnums from '../../helpers/Enums';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import MMContentContainer from '../../components/common/ContentContainer';
import MMScrollView from '../../components/common/ScrollView';
import MMSurface from '../../components/common/Surface';
import MMPageTitle from '../../components/common/PageTitle';
import { MMButton } from '../../components/common/Button';

export default function PlaceOrder({ navigation, route }) {
    const theme = useTheme();
    const bookDetail = useSelector((state) => state.AppReducer.bookDetail);
    const addressDetail = useSelector((state) => state.AppReducer.addressDetail);
    const selectedBaby = useSelector((state) => state.AppReducer.baby);
    const [isOverlayLoading, setOverlayLoading] = useState(false);

    const onPlaceOrder = async () => {
        if (isOverlayLoading) {
            return;
        }
        setOverlayLoading(true);
        try {
            const apiData = {
                babyId: selectedBaby._id,
                productId: bookDetail.productId,
                bookTitle: bookDetail.bookTitle,
                bookSubTitle: bookDetail.bookSubTitle,
                quantity: bookDetail.quantity,
                totalPrice: bookDetail.totalPrice,
                addressId: addressDetail._id
            };
            await MMApiService.saveOrder(apiData)
                .then(function (response) {
                    if (response) {
                        navigation.navigate('Home');
                    }
                })
                .catch(function (error) {
                    setState({
                        ...state,
                        errors: MMUtils.apiErrorParamMessages(error)
                    });
                });
        } catch (err) {
            MMUtils.consoleError(err);
        }
        setOverlayLoading(false);

    };

    const renderBookDetail = () => {
        let productImage = MMUtils.getImagePath(bookDetail.productImage);
        return (
            <View style={{ flexDirection: 'row' }}>
                <Image
                    textAlign="center"
                    resizeMode="contain"
                    source={{ uri: productImage }}
                    style={styles(theme).image}
                />
                <View style={{ padding: MMConstants.paddingLarge }}>
                    <Text style={[theme.fonts.titleMedium]}>
                        {bookDetail.productName}</Text>
                    <Text style={[theme.fonts.titleSmall, { width: '70%' }]} numberOfLines={2}>
                        Title: {bookDetail.bookTitle}</Text>
                    {bookDetail.bookSubTitle ? <Text style={[theme.fonts.titleSmall, { width: '70%' }]} numberOfLines={2}>
                        Sub title: {bookDetail.bookSubTitle}</Text> : null}
                    <View style={{ paddingTop: MMConstants.paddingMedium, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Qty: {bookDetail.quantity} </Text>
                        <Text>{MMUtils.formatCurrency(bookDetail.totalPrice)}</Text>
                    </View>
                </View>
            </View>
        );
    };
    const renderAddressDetail = () => {
        const address = `${addressDetail.addressLine1}, ${addressDetail.addressLine2 ? `${addressDetail.addressLine2},` : ''}${addressDetail.suburb},\n${addressDetail.state}, ${addressDetail.postcode}, ${addressDetail.country}`;
        return (
            <>
                <View style={{ flexDirection: 'row' }}>
                    {addressDetail.addressType === MMEnums.addressType.home ? <Feather name={'home'} size={30} color={theme.colors.primary} /> :
                        addressDetail.addressType === MMEnums.addressType.work ? <Ionicons name={'business-outline'} size={30} color={theme.colors.primary} /> :
                            <Ionicons name={'location-outline'} size={30} color={theme.colors.primary} />}
                    <View style={{ paddingLeft: MMConstants.paddingLarge }}>
                        <Text style={[theme.fonts.titleMedium]} numberOfLines={1}>
                            Delivery at {_.capitalize(addressDetail.addressType)}</Text>
                        <Text style={[theme.fonts.default, { lineHeight: 20 }]} numberOfLines={4} >{address} </Text>
                    </View>
                </View>
            </>
        );
    };

    const renderView = () => {
        return (
            <>
                <MMPageTitle title={'Place order'} />
                <MMSurface>
                    {renderBookDetail()}
                    <Divider style={{ marginVertical: 10 }} />
                    {addressDetail._id ? renderAddressDetail() : null}
                    <MMButton label={'Place Order'} onPress={() => onPlaceOrder()} />
                </MMSurface>
            </>
        );
    };

    return (
        <MMContentContainer>
            <MMScrollView>
                {renderView()}
            </MMScrollView>
        </MMContentContainer>
    );
}

PlaceOrder.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = (theme) => StyleSheet.create({
    image: {
        width: Dimensions.get('window').width / 3,
        height: Dimensions.get('window').height / 4,
    },
});
