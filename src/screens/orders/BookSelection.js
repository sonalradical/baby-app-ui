import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, RadioButton, Text, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMContentContainer from '../../components/common/ContentContainer';
import MMListView from '../../components/common/ListView';
import MMPageTitle from '../../components/common/PageTitle';
import MMInput from '../../components/common/Input';
import MMSurface from '../../components/common/Surface';

export default function BookSelection({ navigation, route }) {
    const theme = useTheme();
    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const [productList, setProductList] = useState([]);
    const initState = {
        productId: '',
        bookTitle: '',
        bookSubTitle: '',
        quantity: '',
        errors: {},
    };
    const [state, setState] = useState(initState);
    const [totalPrice, setTotalPrice] = useState();

    useEffect(() => {
        loadProductList();
    }, []);


    const loadProductList = async () => {
        setOverlayLoading(true);
        const response = await MMApiService.getProductList();
        if (response.data) {
            console.log(response.data)
            setProductList(response.data);
        }
        setOverlayLoading(false);
    }

    const onCoverChange = (value) => {
        setState({ ...state, productId: value });
    };

    const onChangeQuantity = (newQuantity) => {
        setState({ ...state, quantity: newQuantity });
        const product = productList.find((item) => item._id === state.productId);
        if (product) {
            const price = Number(newQuantity) * product.productPrice;
            setTotalPrice(price);
        }
    };

    const onInputChange = (field, value) => {
        setState({
            ...state,
            [field]: value,
            errors: {
                ...state.errors,
                [field]: '',
            },
        });
    };

    const renderView = () => {
        return (
            <View style={{ padding: MMConstants.paddingLarge }}>
                <MMPageTitle title='Book selection' />
                <RadioButton.Group onValueChange={(value) => onCoverChange(value)} value={state.productId}>
                    <Text style={theme.fonts.titleMedium}>Book Cover</Text>
                    {productList.map((product, index) => (
                        <MMListView alignItems="center" key={index}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton.Android value={product._id} />
                                <Text style={[theme.fonts.default, { paddingTop: 8 }]}>{product.productName} </Text>
                            </View>
                            <Text style={theme.fonts.default}>${product.productPrice}</Text>
                        </MMListView>
                    ))}
                </RadioButton.Group>
                <MMInput
                    label='Book Title *'
                    maxLength={50}
                    value={state.bookTitle}
                    onChangeText={(value) => onInputChange('bookTitle', value)}
                    placeholder="Enter Book Title"
                    errorText={state.errors.bookTitle}
                />
                <MMInput
                    label='Book Sub Title '
                    maxLength={50}
                    value={state.bookSubTitle}
                    onChangeText={(value) => onInputChange('bookSubTitle', value)}
                    placeholder="Enter Book Sub Title"
                />
                <MMInput
                    label='Book Quantity *'
                    disabled={!state.productId}
                    maxLength={50}
                    value={state.quantity.toString()}
                    onChangeText={(text) => onChangeQuantity(text)}
                    placeholder="Enter Book Quantity"
                    keyboardType='number-pad'
                />
            </View>
        );
    };

    const renderBookPreview = () => {
        if (!state.productId) return null;
        const product = productList.find((item) => item._id === state.productId);
        let productImage = MMConstants.product[product.productImage];

        return (
            state.productId && state.bookTitle && state.quantity ?
                <Card style={{ backgroundColor: theme.colors.secondaryContainer, padding: MMConstants.paddingMedium }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Image
                            textAlign="center"
                            resizeMode="contain"
                            source={productImage}
                            style={styles(theme).image}
                        />
                        <View style={{ paddingTop: MMConstants.paddingLarge }}>
                            <Text style={[theme.fonts.titleMedium]}>
                                {product.productName}</Text>
                            <Text style={[theme.fonts.titleSmall]}>
                                Title :{state.bookTitle}</Text>
                            <View style={{ paddingTop: MMConstants.paddingMedium, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>Qty: {state.quantity} </Text>
                                <Text>${totalPrice}</Text>

                            </View>
                        </View>
                        <View style={{ padding: MMConstants.paddingLarge }}>

                        </View>
                    </View>
                </Card> : null
        );
    };


    return (
        <MMContentContainer>
            <MMScrollView>
                {renderView()}
                {renderBookPreview()}
            </MMScrollView>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </MMContentContainer>
    );
}

BookSelection.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = (theme) => StyleSheet.create({
    image: {
        width: Dimensions.get('window').width / 7,
        height: Dimensions.get('window').height / 10,
        padding: 10
    },
});