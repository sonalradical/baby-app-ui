import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Card, RadioButton, Text, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { setBookDetail } from '../../redux/Slice/AppSlice';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMContentContainer from '../../components/common/ContentContainer';
import MMListView from '../../components/common/ListView';
import MMInput from '../../components/common/Input';
import MMTextInputNumeric from '../../components/common/TextInputNumeric';
import MMFormErrorText from '../../components/common/FormErrorText';

const BookSelection = ({ validStep, clickStep }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const bookDetail = useSelector((state) => state.AppReducer.bookDetail);
    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        loadProductList();
    }, []);

    const loadProductList = async () => {
        setOverlayLoading(true);
        const response = await MMApiService.getProductList();
        if (response.data) {
            setProductList(response.data);
            if (!bookDetail.productId) {
                dispatch(setBookDetail({ productId: response.data[0]._id }));
                dispatch(setBookDetail({ totalPrice: 1 * response.data[0].productPrice }));
            }
        }
        setOverlayLoading(false);
    }

    const onCoverChange = (value) => {
        dispatch(setBookDetail({ productId: value }));
        onUpdateTotalPrice(value, bookDetail.quantity);
    };

    const onChangeQuantity = (newQuantity) => {
        dispatch(setBookDetail({ quantity: newQuantity }));
        onUpdateTotalPrice(bookDetail.productId, newQuantity);
    };

    const onInputChange = (field, value) => {
        dispatch(setBookDetail({ [field]: value }));
    };

    const onUpdateTotalPrice = (productId, quantity = 1) => {
        const product = productList.find((item) => item._id === productId);
        if (product) {
            const price = quantity * product.productPrice;
            dispatch(setBookDetail({ totalPrice: price }))
        }
    };

    const renderView = () => {
        return (
            <View>
                <RadioButton.Group onValueChange={(value) => onCoverChange(value)} value={bookDetail.productId}>
                    <Text style={theme.fonts.titleMedium}>Book Cover</Text>
                    {productList.map((product, index) => (
                        <MMListView alignItems="center" key={index}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton.Android value={product._id} />
                                <Text style={[theme.fonts.default, { paddingTop: 8 }]}>{product.productName} </Text>
                            </View>
                            <Text style={theme.fonts.default}>{MMUtils.formatCurrency(product.productPrice)}</Text>
                        </MMListView>
                    ))}
                </RadioButton.Group>
                <View style={{ paddingTop: MMConstants.paddingMedium }}>
                    <MMInput
                        label='Book Title *'
                        maxLength={50}
                        value={bookDetail.bookTitle}
                        onChangeText={(value) => onInputChange('bookTitle', value)}
                        placeholder="Enter Book Title"
                    />
                    {(validStep === 0 && clickStep >= 1) && <MMFormErrorText errorText={'Please enter book title.'} />}
                </View>
                <View style={{ paddingTop: MMConstants.paddingMedium }}>
                    <MMInput
                        label='Book Sub Title '
                        maxLength={50}
                        value={bookDetail.bookSubTitle}
                        onChangeText={(value) => onInputChange('bookSubTitle', value)}
                        placeholder="Enter Book Sub Title"
                    />
                </View>
                <View style={{ paddingTop: MMConstants.paddingMedium }}>
                    <View style={{ width: '48%' }}>
                        <MMTextInputNumeric
                            label={'Quantity'}
                            minValue={1}
                            maxValue={10}
                            value={bookDetail.quantity}
                            onChange={onChangeQuantity}
                            reachMaxIncIconStyle={{ color: theme.colors.surfaceDisabled }}
                            reachMinDecIconStyle={{ color: theme.colors.surfaceDisabled }}
                            containerClass='containerSmall'
                        />
                    </View>
                </View>
            </View>
        );
    };

    const renderBookPreview = () => {
        if (!productList) return null;
        const product = productList.find((item) => item._id === bookDetail.productId);
        if (!product) return null;
        let productImage = MMConstants.product[product.productImage];

        return (
            bookDetail.productId && bookDetail.bookTitle && bookDetail.quantity ?
                <Card style={{ backgroundColor: theme.colors.secondaryContainer, padding: MMConstants.paddingMedium, marginTop: MMConstants.marginLarge }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            textAlign="center"
                            resizeMode="contain"
                            source={productImage}
                            style={styles(theme).image}
                        />
                        <View style={{ padding: MMConstants.paddingLarge }}>
                            <Text style={[theme.fonts.titleMedium]}>
                                {product.productName}</Text>
                            <Text style={[theme.fonts.titleSmall]}>
                                Title: {bookDetail.bookTitle}</Text>
                            {bookDetail.bookSubTitle ? <Text style={[theme.fonts.titleSmall]}>
                                Sub title: {bookDetail.bookSubTitle}</Text> : null}
                            <View style={{ paddingTop: MMConstants.paddingMedium, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>Qty: {bookDetail.quantity} </Text>
                                <Text>{MMUtils.formatCurrency(bookDetail.totalPrice)}</Text>
                            </View>
                        </View>
                    </View>
                </Card> : null
        );
    };


    return (
        <View style={{ padding: 10 }}>
            <MMScrollView>
                {renderView()}
                {renderBookPreview()}
            </MMScrollView>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </View>
    );
}

BookSelection.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = (theme) => StyleSheet.create({
    image: {
        width: Dimensions.get('window').width / 6,
        height: Dimensions.get('window').height / 8,
        padding: 10
    },
});
export default BookSelection;