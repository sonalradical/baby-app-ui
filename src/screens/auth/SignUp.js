import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, Checkbox } from 'native-base';

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
import MMProfileAvatar from '../../components/common/ImagePicker';
import MMPicker from '../../components/common/Picker';

export default function SignUp({ navigation, route }) {
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);

    const initState = {
        mobileNumber: '+91 8160421801',
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

    const onNavigate = () => {
        navigation.navigate('Login');
    }

    const onSubmit = () => {
        if (isOverlayLoading) {
            return;
        }

        const messages = {
            'mobileNumber.required': 'Please enter Mobile no.',
            'mobileNumber.min': 'Mobile number must be 14 digits.',
            'name.required': 'Please enter name.',
            'email.required': 'Please enter email.',
            'email.email': 'Please enter valid email.',
            'password.required': 'Please enter password.',
            'gender.required': 'Please select gender',
        };

        const rules = {
            mobileNumber: 'required|string|min:14',
            name: 'required|string',
            email: 'required|string|email',
            password: 'required|min:8|max:8',
            gender: 'required',
        };

        validateAll(state, rules, messages)
            .then(async () => {
                setIsOverlayLoading(true);
                const apiData = {
                    mobileNumber: state.mobileNumber,
                    name: state.name,
                    email: state.email,
                    password: state.password,
                    gender: state.gender,
                };
                const userSignup = await MMApiService.userSignup(apiData);
                if (userSignup) {
                    setIsOverlayLoading(false);
                    MMUtils.showToastSuccess('OTP Sent successfully.');
                }
                else {
                    setIsOverlayLoading(false);
                }
            })
            .catch((errorMessage) => {
                console.log('...', errorMessage)
                setIsOverlayLoading(false);
            });
    };


    const renderView = () => {
        return (
            <>
                <View style={MMStyles.containerPadding}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[MMStyles.titleText, MMStyles.h2]}>Your Profile</Text>
                    </View>
                    <MMProfileAvatar onImageSelect={handleImageSelect} />
                    <MMInput
                        optionalStyle={MMStyles.mt20}
                        maxLength={15}
                        value={state.mobileNumber}
                        onChangeText={(value) => { onInputChange('mobileNumber', value); }}
                        placeholder="Mobile Number"
                        name="mobileNumber"
                        iconName="mobile"
                        keyboardType="phone-pad"
                    />
                    <MMInput
                        maxLength={100}
                        optionalStyle={MMStyles.mt20}
                        value={state.name}
                        onChangeText={(value) => onInputChange('name', value)}
                        placeholder="Name"
                        iconName="user"
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
                        iconName="envelope"
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
                        errorMessage={state.errors.password}
                        optionalIconSize={20}
                        type={'password'}
                    />
                    <MMPicker
                        optionalStyle={MMStyles.mt20}
                        placeholder="Gender"
                        value={state.gender}
                        items={MMConstants.gender}
                        onValueChange={(value) => onInputChange('gender', value)}
                        labelParameter="value"
                        valueParameter="id"
                        selectedItem={{ bg: MMColors.orange }}
                        errorMessage={state.errors.gender}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            colorScheme="orange"
                            size="sm"
                            my={2}
                            mx={4}
                            isChecked={checked}
                            style={{ borderColor: MMColors.orange }}
                        >
                            <Text style={[MMStyles.h6, MMStyles.ml10]}>I accept <Text style={{ color: MMColors.orange }}>Terms of Use </Text>and <Text style={{ color: MMColors.orange }}>Privacy Policy</Text>.</Text>
                        </Checkbox>
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
                    <Button variant="none" transparent style={[MMStyles.subTitle, MMStyles.h6, { bottom: 10 }]} onPress={() => navigation.navigate('Login')}>
                        SIGN IN
                    </Button>
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
