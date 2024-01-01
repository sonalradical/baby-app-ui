import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { validateAll } from 'indicative/validator';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import MMInput from '../../components/common/Input';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMContentContainer from '../../components/common/ContentContainer';
import { MMButton } from '../../components/common/Button';
import MMPageTitle from '../../components/common/PageTitle';
import MMRadioButton from '../../components/common/RadioButton';

export default function AddFamilyMember({ navigation, route }) {
    const theme = useTheme();
    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const initState = {
        email: '',
        relationShipType: '',
        errors: {},
    };
    const [state, setState] = useState(initState);

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

    const onRelationChange = (value) => {
        setState({ ...state, relationShipType: value });
    };


    const onInviteMember = () => {
        if (isOverlayLoading) {
            return;
        }

        const messages = {
            'email.required': 'Please enter email.',
            'email.email': 'Email address is not in a valid format.',
            'relationShipType.required': 'Please select relation.',
        };

        const rules = {
            email: 'required|string|email',
            relationShipType: 'required'
        };

        validateAll(state, rules, messages)
            .then(async () => {
                setOverlayLoading(true);
                try {
                    const apiData = {
                        connectionEmail: state.email,
                        relationShipType: state.relationShipType
                    };
                    const { data } = await MMApiService.linkFamilyMember(apiData);
                    if (data) {
                        navigation.navigate(MMConstants.screens.home);
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
            <View style={{ paddingTop: MMConstants.paddingMedium }}>
                <MMPageTitle title={'Invite your family member'} />
                <MMInput
                    label='Connection Email Address *'
                    value={state.email}
                    onChangeText={(value) => onInputChange('email', value)}
                    placeholder="Enter Email Address"
                    keyboardType="email-address"
                    autoCorrect={false}
                    maxLength={150}
                    errorText={state.errors.email}
                />
                <MMRadioButton
                    label='RelationShip Type'
                    options={MMConstants.familyMember}
                    selectedValue={state.relationShipType}
                    onValueChange={onRelationChange}
                    errorText={state.errors.relationShipType}
                    flexDirection={'column'}
                />
                <MMButton
                    label={'Invite Member'}
                    onPress={() => onInviteMember()} />
            </View>
        );
    };

    return (
        <MMContentContainer>
            <MMScrollView>
                {renderView()}
            </MMScrollView>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </MMContentContainer>
    );
}

AddFamilyMember.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};