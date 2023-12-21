import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Surface, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { useSelector } from 'react-redux';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMIcon from '../../components/common/Icon';
import MMContentContainer from '../../components/common/ContentContainer';
import Address from './Address';
import BookSelection from './BookSelection';
import Payment from './Payment';

const labels = ['Cart', 'Address', 'Payment'];

export default function Order() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [validStep, setValidStep] = useState(0);
    const [clickStep, setclickstep] = useState(0);
    const bookDetail = useSelector((state) => state.AppReducer.bookDetail);
    const { addressId } = useSelector((state) => state.AppReducer.addressId);
    const paymentId = useSelector((state) => state.AppReducer.paymentId);

    const onStepPress = (step) => {
        setclickstep(step);
        if (step <= validStep) {
            setActiveStep(step);
        }
    };

    const onValidField = () => {
        const hasBookTitle = !_.isEmpty(bookDetail.bookTitle);
        const hasAddressId = !_.isEmpty(addressId);
        const hasPaymentId = !_.isEmpty(paymentId);

        const steps = [hasBookTitle, hasAddressId, hasPaymentId];

        const maxValidStep = steps.lastIndexOf(true) + 1;

        setValidStep(maxValidStep);
    };

    useEffect(() => {
        onValidField();
    }, [bookDetail, addressId, paymentId]);

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
            <TouchableOpacity onPress={activeStep < 2 ? () => onStepPress(activeStep + 1) : null}>
                <Surface style={styles(theme).surfaceStyle}>
                    <View style={{ flexDirection: 'column', width: '48%', paddingTop: 5 }}>
                        <Text style={theme.fonts.labelLarge}>My Order</Text>
                        <Text style={[theme.fonts.default]} numberOfLines={2}>{bookDetail.bookTitle ? bookDetail.bookTitle : null}</Text>
                    </View>
                    <Card style={{ backgroundColor: theme.colors.primary, padding: 5, width: '50%', borderRadius: 10 }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={[theme.fonts.titleMedium, { color: 'white' }]}>
                                    {bookDetail.quantity === 1 ? `${bookDetail.quantity} Item` : `${bookDetail.quantity} Items`} </Text>
                                <Text style={[theme.fonts.titleMedium, { color: 'white' }]}>Place Order</Text>
                            </View>
                            <View style={{
                                height: '100%',
                                width: 1,
                                backgroundColor: 'white',
                                marginHorizontal: 10,
                            }} />
                            <Text style={[theme.fonts.titleMedium, { color: 'white' }]}>
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
                            <MMIcon iconName='circle'
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
        </MMContentContainer>
    );
};

const styles = (theme) => StyleSheet.create({
    stepContent: {
        flex: 1,
    },
    stepper: {
        flexDirection: 'row',
        padding: MMConstants.paddingMedium
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
        padding: MMConstants.paddingLarge,
    }
});

Order.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};
