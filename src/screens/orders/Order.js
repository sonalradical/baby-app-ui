import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Divider, Surface, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { useSelector } from 'react-redux';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import MMIcon from '../../components/common/Icon';
import MMContentContainer from '../../components/common/ContentContainer';
import Address from './Address';
import BookSelection from './BookSelection';
import Payment from './Payment';
import MMPopUpModal from '../../components/common/PopUpModal';
import MMFlexView from '../../components/common/FlexView';
import { MMButton, MMOutlineButton } from '../../components/common/Button';
import { MMOverlaySpinner } from '../../components/common/Spinner';

const labels = ['Cart', 'Address', 'Payment'];

export default function Order({ navigation }) {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [validStep, setValidStep] = useState(0);
    const [clickStep, setclickstep] = useState(0);
    const [popUpVisible, setPopUpVisible] = useState(false);
    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const selectedBaby = useSelector((state) => state.AppReducer.baby);
    const bookDetail = useSelector((state) => state.AppReducer.bookDetail);
    const addressDetail = useSelector((state) => state.AppReducer.addressDetail);
    const paymentId = useSelector((state) => state.AppReducer.paymentId);

    useEffect(() => {
        onValidField();
    }, [bookDetail, addressDetail._id, paymentId]);

    const onStepPress = (step) => {
        setclickstep(step);
        if (step <= validStep) {
            setActiveStep(step);
        }
    };

    const onValidField = () => {
        const hasBookTitle = !_.isEmpty(bookDetail.bookTitle);
        const hasAddressId = !_.isEmpty(addressDetail._id);
        const hasPaymentId = !_.isEmpty(paymentId);
        if (hasBookTitle && hasAddressId && hasPaymentId) {
            setValidStep(3);
        }
        else if (hasBookTitle && hasAddressId) {
            setValidStep(2)
        }
        else if (hasBookTitle) {
            setValidStep(1);
        }
        else {
            setValidStep(0)
        }
    };

    const onConfirmOrder = () => {
        switch (validStep) {
            case 3:
                setPopUpVisible(true);
                break;
            case 2:
                setActiveStep(2);
                setclickstep(3);
                break;
            case 1:
                setActiveStep(1);
                setclickstep(2);
                break;
            case 0:
                setActiveStep(0);
                setclickstep(1);
                break;
            default:
                break;
        }
    };

    const renderOrderModal = () => {
        const address = `${addressDetail.addressLine1}, ${addressDetail.addressLine2 ? `${addressDetail.addressLine2},` : ''}${addressDetail.suburb}, ${addressDetail.state}, ${addressDetail.postcode}, ${addressDetail.country}`;
        return (
            <MMPopUpModal
                isModalOpen={popUpVisible}
            >
                <View style={{ padding: MMConstants.paddingLarge }}>
                    <Text style={theme.fonts.headlineSmall}>
                        {`Confirm Order`}
                    </Text>
                    <Divider />
                    <View style={{ padding: MMConstants.paddingLarge }}>
                        <View>
                            <Text style={[theme.fonts.titleMedium]}>Book cover:</Text>
                            <Text style={[theme.fonts.default, { lineHeight: 20 }]} numberOfLines={2} >{bookDetail.productName}</Text>
                        </View>
                        <View style={{ paddingTop: MMConstants.paddingMedium }}>
                            <Text style={[theme.fonts.titleMedium]} numberOfLines={1}>
                                Delivery at {_.capitalize(addressDetail.addressType)}</Text>
                            <Text style={[theme.fonts.default, { lineHeight: 20 }]} numberOfLines={4} >{address} </Text>
                        </View>
                        <View style={{ paddingTop: MMConstants.paddingMedium, flexDirection: 'row' }}>
                            <Text style={[theme.fonts.titleMedium]}>Qty: </Text>
                            <Text style={[theme.fonts.default, { paddingTop: 4 }]} >{bookDetail.quantity}</Text>
                        </View>
                        <View style={{ paddingTop: MMConstants.paddingMedium, flexDirection: 'row' }}>
                            <Text style={[theme.fonts.titleMedium]}>Total price: </Text>
                            <Text style={[theme.fonts.default, { paddingTop: 4 }]} >{MMUtils.formatCurrency(bookDetail.totalPrice)} </Text>
                        </View>
                    </View>
                    <Divider />
                    <MMFlexView paddingTop={MMConstants.paddingMedium}>
                        <MMOutlineButton
                            label='Cancel'
                            mode='text'
                            width='auto'
                            onPress={() => setPopUpVisible(false)}
                        ></MMOutlineButton>
                        <MMButton
                            label='Confirm'
                            width='auto'
                            onPress={() => onPlaceOrder()}
                        ></MMButton>
                    </MMFlexView>
                </View>
            </MMPopUpModal>
        );
    };

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
            const { data } = await MMApiService.saveOrder(apiData);
            if (data) {
                setPopUpVisible(false);
                navigation.navigate('Home');
            }
        } catch (err) {
            MMUtils.consoleError(err);
        }
        setOverlayLoading(false);

    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <BookSelection validStep={validStep} clickStep={clickStep} />;
            case 1:
                return <Address validStep={validStep} clickStep={clickStep} />;
            case 2:
                return <Payment validStep={validStep} />;
            default:
                return null;
        }
    };

    const renderActionButtons = () => {
        return (
            <TouchableOpacity onPress={() => onConfirmOrder()}>
                <Surface style={styles(theme).surfaceStyle}>
                    <View style={{ flexDirection: 'column', width: '35%', paddingTop: 5, justifyContent: 'space-around' }}>
                        <Text style={theme.fonts.labelLarge}>My Order</Text>
                        <Text style={[theme.fonts.default]} numberOfLines={2}>{bookDetail.bookTitle ? bookDetail.bookTitle : null}</Text>
                    </View>
                    <Card style={{ backgroundColor: theme.colors.primary, borderRadius: 10 }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            alignSelf: 'center',
                            padding: MMConstants.paddingMedium
                        }}>
                            <View style={{ flexDirection: 'column', alignSelf: 'center', padding: MMConstants.paddingMedium, paddingHorizontal: 20 }}>
                                <Text style={[theme.fonts.bodyMedium, { color: 'white' }]}>
                                    {bookDetail.quantity === 1 ? `${bookDetail.quantity} Item` : `${bookDetail.quantity} Items`} </Text>
                                <Text style={[theme.fonts.titleMedium, { color: 'white' }]}>Place Order</Text>
                            </View>
                            <View style={{
                                height: '100%',
                                width: 1,
                                backgroundColor: 'white',
                                marginHorizontal: MMConstants.paddingMedium
                            }} />
                            <Text style={[theme.fonts.titleMedium, { color: 'white', padding: MMConstants.paddingMedium, paddingHorizontal: MMConstants.paddingLarge }]}>
                                {bookDetail.totalPrice ? MMUtils.formatCurrency(bookDetail.totalPrice) : null}</Text>
                        </View>
                    </Card>
                </Surface>
            </TouchableOpacity>
        );
    };

    const renderStepper = () => {
        return (
            <View style={styles(theme).stepper}>
                {labels.map((label, index) => (
                    <React.Fragment key={label}>
                        <TouchableOpacity onPress={() => onStepPress(index)} style={styles(theme).stepItem}>
                            <MMIcon iconName='ellipse-sharp'
                                iconColor={index === activeStep ? theme.colors.secondary : theme.colors.surfaceDisabled}
                                iconSize={15} />
                            <Text style={[{ color: index === activeStep ? theme.colors.secondary : theme.colors.outline }]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                        {index < labels.length - 1 && <View style={styles(theme).dashLine} />}
                    </React.Fragment>
                ))}
            </View>
        );
    };

    return (
        <MMContentContainer>
            {renderStepper()}
            <View style={styles(theme).stepContent}>{getStepContent(activeStep)}</View>
            {renderActionButtons()}
            {
                popUpVisible &&
                renderOrderModal()
            }
            <MMOverlaySpinner visible={isOverlayLoading} />
        </MMContentContainer>
    );
};

const styles = (theme) => StyleSheet.create({
    stepContent: {
        flex: 1,
        paddingTop: MMConstants.paddingMedium
    },
    stepper: {
        flexDirection: 'row',
        marginVertical: 16,
        paddingHorizontal: MMConstants.paddingMedium
    },
    stepItem: {
        alignItems: 'center',
    },
    dashLine: {
        flex: 1,
        height: 1,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: theme.colors.surfaceDisabled,
        marginTop: 5
    },
    surfaceStyle: {
        borderRadius: 20,
        marginBottom: MMConstants.marginMedium,
        backgroundColor: theme.colors.secondaryContainer,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
    }
});

Order.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};