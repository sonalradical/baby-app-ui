import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Card, Divider, RadioButton, Text, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';

import { setBookDetail } from '../../redux/Slice/AppSlice';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMListView from '../../components/common/ListView';
import MMInput from '../../components/common/Input';
import MMTextInputNumeric from '../../components/common/TextInputNumeric';
import MMFormErrorText from '../../components/common/FormErrorText';
import MMPicture from '../../components/common/Picture';
import MMSurface from '../../components/common/Surface';

const BookSelection = ({ validStep, clickStep }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const bookDetail = useSelector((state) => state.AppReducer.bookDetail);
    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        getProductList();
    }, []);

    const getProductList = async () => {
        setOverlayLoading(true);
        const { data } = await MMApiService.getProductList();
        if (data) {
            setProductList(data);
            const productDetail = data[0];
            if (!bookDetail.productId) {
                dispatch(setBookDetail({
                    productId: productDetail._id,
                    totalPrice: productDetail.productPrice,
                    productName: productDetail.productName,
                    productImage: productDetail.productImage
                }));
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
            dispatch(setBookDetail({
                totalPrice: price,
                productName: product.productName,
                productImage: product.productImage
            }))
        }
    };

    const renderView = () => {
        return (
            <View style={{ padding: MMConstants.paddingLarge }}>
                <RadioButton.Group onValueChange={(value) => onCoverChange(value)} value={bookDetail.productId}>
                    <Text style={theme.fonts.titleMedium}>Cover</Text>
                    {productList.map((product, index) => (
                        <MMListView alignItems="center" key={index}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton.Android value={product._id} />
                                <Text style={[theme.fonts.default, { paddingTop: 8 }]}>{product.productName} </Text>
                            </View>
                            <Text style={theme.fonts.titleSmall}>{MMUtils.formatCurrency(product.productPrice)}</Text>
                        </MMListView>
                    ))}
                </RadioButton.Group>
                <View style={{ paddingTop: MMConstants.paddingMedium }}>
                    <MMInput
                        label='Title *'
                        maxLength={50}
                        value={bookDetail.bookTitle}
                        onChangeText={(value) => onInputChange('bookTitle', value)}
                        placeholder="Enter Book Title"
                    />
                    {(validStep === 0 && clickStep >= 1) && <MMFormErrorText errorText={'Please enter book title.'} />}
                </View>
                <View style={{ paddingTop: MMConstants.paddingMedium }}>
                    <MMInput
                        maxLength={50}
                        value={bookDetail.bookSubTitle}
                        onChangeText={(value) => onInputChange('bookSubTitle', value)}
                        placeholder="Enter Book Sub Title"
                    />
                </View>
                <View style={{ paddingVertical: MMConstants.paddingMedium }}>
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
        let productImage = MMUtils.getImagePath(bookDetail.productImage);

        return (
            bookDetail.productId && bookDetail.bookTitle && bookDetail.quantity ?
                <View style={{ backgroundColor: theme.colors.secondaryContainer, padding: MMConstants.paddingLarge }}>
                    <View style={{ flexDirection: 'row' }}>
                        <MMPicture
                            textAlign="center"
                            resizeMode="contain"
                            pictureUri={productImage}
                            style={styles(theme).image}
                        />
                        <View style={{ alignItems: 'flex-start', paddingLeft: MMConstants.paddingLarge }}>
                            <Text style={[theme.fonts.titleSmall]}>
                                {bookDetail.productName}</Text>
                            <Text style={{ width: '70%' }} numberOfLines={2}>
                                Title: {bookDetail.bookTitle}</Text>
                            {bookDetail.bookSubTitle ? <Text style={[theme.fonts.titleSmall, { width: '70%' }]} numberOfLines={2}>
                                Sub title: {bookDetail.bookSubTitle}</Text> : null}
                            <Text>Quantity: {bookDetail.quantity} </Text>
                            <Text style={{ color: theme.colors.secondary }}>Price: {MMUtils.formatCurrency(bookDetail.totalPrice)}</Text>
                        </View>
                    </View>
                </View> : null
        );
    };


    return (
        <MMSurface padding={[0, 0, 0, 0]}>
            <MMScrollView>
                {renderView()}
                <Divider />
                {renderBookPreview()}
            </MMScrollView>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </MMSurface>
    );
}

BookSelection.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = (theme) => StyleSheet.create({
    image: {
        width: Dimensions.get('window').width / 5,
        height: Dimensions.get('window').height / 8,
    },
});
export default BookSelection;