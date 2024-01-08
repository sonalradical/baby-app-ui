import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Checkbox, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { validateAll } from 'indicative/validator';
import { useDispatch, useSelector } from 'react-redux';

import { setLogin } from '../../redux/Slice/AuthSlice';

import MMUtils from '../../helpers/Utils';
import MMEnums from '../../helpers/Enums';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMInput from '../../components/common/Input';
import MMScrollView from '../../components/common/ScrollView';
import { MMButton, MMTransparentButton } from '../../components/common/Button';
import MMFormErrorText from '../../components/common/FormErrorText';
import MMContentContainer from '../../components/common/ContentContainer';
import MMRadioButton from '../../components/common/RadioButton';
import MMAuthHeader from '../../components/common/AuthHeader';
import MMSurface from '../../components/common/Surface';
import MMImageBackground from '../../components/common/ImageBackground';

export default function SignUp({ navigation, route }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { deviceId, mobileNumber } = route.params || '';
    const lookupData = useSelector((state) => state.AuthReducer.lookupData);
    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const [passwordHide, setPasswordHide] = useState(true);

    const initState = {
        mobileNumber: '',
        name: '',
        email: '',
        password: '',
        gender: '',
        terms: false,
        errors: {},
    };
    const [state, setState] = useState(initState);

    useEffect(() => {
        if (mobileNumber) {
            Init();
        }
    }, [mobileNumber]);

    async function Init() {
        try {
            setOverlayLoading(true);
            const { data } = await MMApiService.getUserDetail(mobileNumber);
            if (data) {
                const userDetail = data.userDetail;
                setState({
                    ...state,
                    mobileNumber: userDetail.mobileNumber,
                    name: userDetail.name,
                    email: userDetail.email,
                    gender: userDetail.gender
                })
            }
            setOverlayLoading(false);
        } catch (error) {
            setOverlayLoading(false);
            const serverError = MMUtils.apiErrorMessage(error);
            if (serverError) {
                MMUtils.showToastMessage(serverError);
            }
        }
    }

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

    const messages = {
        'mobileNumber.required': 'Please enter mobile no.',
        'mobileNumber.min': 'Mobile number must be 10 digits.',
        'name.required': 'Please enter name.',
        'email.required': 'Please enter email.',
        'email.email': 'Email address is not in a valid format.',
        'password.required': 'Please enter password.',
        'password.min': 'Password should have a minimum of 8 characters.',
        'gender.required': 'Please select gender.',
        'terms.required': 'Please accept terms.',
    };

    const onSubmit = () => {
        if (isOverlayLoading) {
            return;
        }

        const rules = {
            mobileNumber: 'required|string|min:10',
            name: 'required|string',
            email: 'required|string|email',
            password: 'required|min:8|max:50',
            gender: 'required',
            terms: 'required'
        };

        validateAll(state, rules, messages)
            .then(async () => {
                if (!state.terms) {
                    setState({
                        ...state,
                        errors: {
                            ...state.errors,
                            terms: messages['terms.required'],
                        },
                    });
                    return;
                }
                setOverlayLoading(true);
                if (state.terms) {
                    onSignUp();
                }
                setOverlayLoading(false);
            })
            .catch((errors) => {
                setState({
                    ...state,
                    errors: MMUtils.clientErrorMessages(errors)
                });
            });
        setOverlayLoading(false);
    };

    const onGenderChange = (value) => {
        setState({
            ...state,
            gender: value,
            errors: {
                ...state.errors,
                gender: '',
            },
        });
    };
    const onTermsCheck = () => {
        // Update the checkbox state in the form data
        setState({
            ...state,
            terms: !state.terms,
            errors: {
                ...state.errors,
                terms: '',
            },
        });
    };

    const onSignUp = async () => {
        try {
            const apiData = {
                mobileNumber: state.mobileNumber,
                name: state.name,
                email: state.email,
                password: state.password,
                gender: state.gender,
            };
            const { data, error } = await MMApiService.userSignup(apiData);
            if (data) {
                navigation.navigate('Otp', { mobileNumber: state.mobileNumber, deviceId: deviceId });
            }
            else {
                setState({
                    ...state,
                    errors: error
                });
            }
            setOverlayLoading(false);
        } catch (err) {
            MMUtils.consoleError(err);
            setOverlayLoading(false);
        }
    }

    const onUpdateProfile = () => {
        if (isOverlayLoading) {
            return;
        }
        const rules = {
            name: 'required|string',
        };
        validateAll(state, rules, messages)
            .then(async () => {
                setOverlayLoading(true);
                try {
                    const apiData = {
                        mobileNumber: state.mobileNumber,
                        name: state.name,
                        email: state.email,
                        gender: state.gender,
                    };
                    const { data } = await MMApiService.updateProfile(apiData)
                    if (data) {
                        const { accessToken, updatedUser } = data;
                        const userDetails = {
                            accessToken,
                            userDetail: {
                                _id: updatedUser._id,
                                mobileNumber: updatedUser.mobileNumber,
                                name: updatedUser.name,
                                email: updatedUser.email,
                                childCount: updatedUser.childCount ? updatedUser.childCount : 0,
                                dueDate: updatedUser.dueDate ? updatedUser.dueDate : null
                            },
                        };
                        MMUtils.setItemToStorage(MMEnums.storage.accessToken, userDetails.accessToken);
                        MMUtils.setItemToStorage(MMEnums.storage.userDetail, JSON.stringify(userDetails.userDetail));

                        dispatch(setLogin({
                            userDetail: userDetails.userDetail,
                            accessToken: userDetails.accessToken,
                        }));
                        navigation.navigate('Home');
                    }
                } catch (err) {
                    MMUtils.consoleError(err);
                }
                setOverlayLoading(false);
            })
            .catch((errors) => {
                setState({
                    ...state,
                    errors: MMUtils.clientErrorMessages(errors)
                });
                setOverlayLoading(false);
            });
    };


    const renderView = () => {
        return (
            <MMSurface margin={[0, 0, 0, 0]} style={styles(theme).surface}>
                <Image
                    textAlign="center"
                    source={require('../../assets/images/minimemoirs.png')}
                    style={{
                        height: Dimensions.get('window').height / 8, width: Dimensions.get('window').width / 4,
                        alignSelf: 'center'
                    }}
                />
                <MMAuthHeader title='Your profile' alignItems='flex-start' paddingBottom={0} />
                <Text style={[theme.fonts.labelMedium, { paddingBottom: MMConstants.paddingLarge, marginBottom: MMConstants.marginMedium }]} >To start things off, kindly share some
                    details about yourself. You can add more
                    information later.</Text>
                <MMInput
                    label='Name *'
                    maxLength={50}
                    value={state.name}
                    onChangeText={(value) => onInputChange('name', value)}
                    placeholder="Enter Your Name"
                    errorText={state.errors.name}
                />
                <MMInput
                    label='Phone Number *'
                    maxLength={10}
                    value={state.mobileNumber}
                    onChangeText={(value) => { onInputChange('mobileNumber', value); }}
                    placeholder="Enter Phone Number"
                    name="mobileNumber"
                    errorText={state.errors.mobileNumber}
                    editable={!mobileNumber}
                    keyboardType="phone-pad"
                />
                <MMInput
                    label='Email Address *'
                    value={state.email}
                    onChangeText={(value) => onInputChange('email', value)}
                    placeholder="Enter Email Address"
                    keyboardType="email-address"
                    autoCorrect={false}
                    editable={!mobileNumber}
                    maxLength={150}
                    errorText={state.errors.email}
                />{mobileNumber ? null :
                    <MMInput
                        label='Password *'
                        value={state.password}
                        onChangeText={(value) => onInputChange('password', value)}
                        placeholder="Enter Password"
                        maxLength={50}
                        errorText={state.errors.password}
                        secureTextEntry={passwordHide}
                        name="password"
                        rightIcon={passwordHide ? 'eye-off' : 'eye'}
                        onPress={passwordHide ? () => setPasswordHide(false) : () => setPasswordHide(true)}
                    />}
                <MMRadioButton
                    label='Gender *'
                    options={lookupData.gender}
                    selectedValue={state.gender}
                    onValueChange={onGenderChange}
                    disabled={mobileNumber}
                    errorText={state.errors.gender}
                />
                {mobileNumber ? null :
                    <View style={{ paddingTop: 30, paddingBottom: MMConstants.paddingMedium, flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox.Android
                            color={theme.colors.primary}
                            size="sm"
                            status={state.terms ? 'checked' : 'unchecked'}
                            onPress={onTermsCheck}
                            value={state.terms}
                            style={{ borderColor: theme.colors.primary }} />
                        <Text style={theme.fonts.default}>I accept <Text style={{ color: theme.colors.primary }}>Terms of Use </Text> and
                            <Text style={{ color: theme.colors.primary }}>  Privacy Policy</Text>.</Text>
                    </View>}
                <MMFormErrorText errorText={state.errors.terms} />
                {mobileNumber ? <MMButton
                    label="Save"
                    onPress={() => onUpdateProfile()}
                /> :
                    <MMButton
                        label="Sign Up"
                        onPress={() => onSubmit()}
                    />}
                {mobileNumber ? null :
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={[theme.fonts.default]}>Already have an account? </Text>
                        <MMTransparentButton label='SIGN IN' onPress={() => navigation.navigate('Login')} />
                    </View>}
            </MMSurface>
        );
    };

    return (
        <MMImageBackground>

            <MMScrollView>
                {renderView()}
            </MMScrollView>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </MMImageBackground>
    );
}

SignUp.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};


const styles = (theme) => StyleSheet.create({
    surface: {
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        bottom: 0,
        position: 'absolute',
        backgroundColor: theme.colors.background
    }
});