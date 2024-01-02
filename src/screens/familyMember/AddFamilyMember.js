import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Divider, List, Text, useTheme } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { validateAll } from 'indicative/validator';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import MMInput from '../../components/common/Input';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMContentContainer from '../../components/common/ContentContainer';
import { MMButton } from '../../components/common/Button';
import MMPageTitle from '../../components/common/PageTitle';
import MMIcon from '../../components/common/Icon';
import MMFormErrorText from '../../components/common/FormErrorText';

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
        setState({
            ...state,
            relationShipType: value,
            errors: {
                ...state.errors,
                relationShipType: '',
            },
        });
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

    const renderItem = ({ item, index }) => (
        <>
            <List.Item
                title={item.label}
                titleStyle={theme.fonts.bodyMedium}
                onPress={() => {
                    onRelationChange(item.value);
                }}
                right={(props) => state.relationShipType === item.value ? <MMIcon iconName='check' iconColor={theme.colors.primary} /> : null}
            />
            {_.size(MMConstants.familyMember) - 1 === index ? null : <Divider />}
        </>
    );

    const renderRelationType = () => {
        return (
            <>
                <FlatList
                    data={MMConstants.familyMember}
                    ListHeaderComponent={<Text style={theme.fonts.titleMedium}>RelationShip Type *</Text>}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.value}
                />
                <MMFormErrorText errorText={state.errors.relationShipType} />
            </>
        )

    }

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
            </View>
        );
    };

    return (
        <MMContentContainer>
            {renderView()}
            {renderRelationType()}
            <View style={{ paddingTop: MMConstants.paddingMedium }}>
                <MMButton
                    label={'Invite Member'}
                    onPress={() => onInviteMember()} />
            </View>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </MMContentContainer>
    );
}

AddFamilyMember.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};