import React, { useState } from 'react';
import { View, Text } from 'react-native';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { validateAll } from 'indicative/validator';

import MMStyles from '../../helpers/Styles';
import MMConstants from '../../helpers/Constants';
import MMColors from '../../helpers/Colors';
import MMUtils from '../../helpers/Utils'
import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMInput from '../../components/common/Input';
import MMScrollView from '../../components/common/ScrollView';
import { MMRoundButton } from '../../components/common/Button';
//import MMProfileAvatar from '../../components/common/ImagePicker';
import { Button, Checkbox } from 'react-native-paper';
import MMPicker from '../../components/common/Picker';

export default function SignUp({ navigation, route }) {
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);

    const initState = {
        mobileNumber: '+918160421801',
        name: 'Nupur',
        email: 'nupur@radicalrack.com',
        password: 'Rack@123',
        gender: 'female',
        errors: {},
    };
    const [state, setState] = useState(initState);
    const [checked, setChecked] = useState(false);

    const handleImageSelect = (selectedImage) => {
        console.log('Selected Image:', selectedImage);
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

    const onSubmit = () => {
        if (isOverlayLoading) {
            return;
        }

        const messages = {
            'mobileNumber.required': 'Please enter mobile no.',
            'mobileNumber.min': 'Mobile number must be 13 digits.',
            'name.required': 'Please enter name.',
            'email.required': 'Please enter email.',
            'email.email': 'Email address is not in a valid format.',
            'password.required': 'Please enter password.',
            'password.min': 'Password should have a minimum of 8 characters.',
            'gender.required': 'Please select gender',
        };

        const rules = {
            mobileNumber: 'required|string|min:13',
            name: 'required|string',
            email: 'required|string|email',
            password: 'required|min:8|max:8',
            gender: 'required',
        };

        validateAll(state, rules, messages)
            .then(async () => {
                setIsOverlayLoading(true);
                onSignUp();
            })
            .catch((errors) => {
                console.log("Validation Errors:", errors);
                setState({
                    ...state,
                    errors: MMUtils.clientErrorMessages(errors)
                });
                setIsOverlayLoading(false);
            });
    };

    async function onSignUp() {
        try {
            const apiData = {
                mobileNumber: state.mobileNumber,
                name: state.name,
                email: state.email,
                password: state.password,
                gender: state.gender,
            };

            await MMApiService.userSignup(apiData)
                .then(function (response) {
                    if (response) {
                        navigation.navigate('Otp', { mobileNumber: state.mobileNumber });
                    }
                    setIsOverlayLoading(false);
                })
                .catch(function (error) {
                    setIsOverlayLoading(false);
                    setState({
                        ...state,
                        errors: MMUtils.apiErrorParamMessages(error)
                    });
                });
        } catch (err) {
            MMUtils.consoleError(err);
        }
    }


    const renderView = () => {
        return (
            <>
                <View style={MMStyles.containerPadding}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[MMStyles.titleText, MMStyles.h2]}>Your Profile</Text>
                    </View>
                    {/* <MMProfileAvatar onImageSelect={handleImageSelect} /> */}
                    <MMInput
                        optionalStyle={MMStyles.mt20}
                        maxLength={13}
                        value={state.mobileNumber}
                        onChangeText={(value) => { onInputChange('mobileNumber', value); }}
                        placeholder="Mobile Number"
                        name="mobileNumber"
                        iconName="cellphone"
                        errorMessage={state.errors.mobileNumber}
                        keyboardType="phone-pad"
                    />
                    <MMInput
                        maxLength={50}
                        optionalStyle={MMStyles.mt20}
                        value={state.name}
                        onChangeText={(value) => onInputChange('name', value)}
                        placeholder="Name"
                        iconName="account"
                        errorMessage={state.errors.name}
                        optionalIconSize={20}
                    />
                    <MMInput
                        optionalStyle={MMStyles.mt20}
                        value={state.email}
                        onChangeText={(value) => onInputChange('email', value)}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCorrect={false}
                        iconName="email"
                        maxLength={150}
                        errorMessage={state.errors.email}
                        optionalIconSize={20}
                    />
                    <MMInput
                        optionalStyle={MMStyles.mt20}
                        value={state.password}
                        onChangeText={(value) => onInputChange('password', value)}
                        placeholder="Password"
                        iconName="lock"
                        maxLength={8}
                        errorMessage={state.errors.password}
                        optionalIconSize={20}
                        type={'password'}
                    />
                    <MMPicker
                        optionalStyle={MMStyles.mt20}
                        label="Gender"
                        value={state.gender}
                        items={MMConstants.gender}
                        onValueChange={(value) => onInputChange('gender', value)}
                        errorMessage={state.errors.gender}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            color={MMColors.orange}
                            size="sm"
                            status={checked ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked(!checked);
                            }}
                            style={{ borderColor: MMColors.orange }} />
                        <Text style={[MMStyles.h6, MMStyles.ml5]}>I accept <Text style={{ color: MMColors.orange }}>Terms of Use </Text>and <Text style={{ color: MMColors.orange }}>Privacy Policy</Text>.</Text>

                    </View>
                    <MMRoundButton
                        optionalTextStyle={[MMStyles.h5]}
                        label="Sign Up"
                        onPress={() => onSubmit()}
                        optionalStyle={[MMStyles.mt10]}
                    />
                </View>
                <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                    <Text style={[MMStyles.subTitle, MMStyles.h5]}>Already have an account?</Text>
                    <Button variant="none" transparent style={[MMStyles.subTitle, MMStyles.h6, { bottom: 10 }]}
                        onPress={() => navigation.navigate('Login')}> SIGN IN </Button>
                </View>
            </>
        );
    };

    return (
        <View style={MMStyles.container}>
            <MMScrollView>
                {renderView()}

            </MMScrollView>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </View>
    );
}

SignUp.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};
