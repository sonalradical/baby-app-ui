import React from 'react';
import { View } from 'react-native';
import { Avatar, Card, Text, useTheme } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import MMConstants from '../../helpers/Constants';
import MMContentContainer from '../../components/common/ContentContainer';
import MMSurface from '../../components/common/Surface';
import MMScrollView from '../../components/common/ScrollView';
import MMIcon from '../../components/common/Icon';

export default function Profile({ route }) {
    const navigation = useNavigation();
    const theme = useTheme();
    const { userDetail } = useSelector((state) => state.AuthReducer.auth);

    const MMItemCard = ({ name, icon, routeName, routeParams = null }) => {
        return (
            <Card style={{
                backgroundColor: theme.colors.secondaryContainer,
                marginBottom: MMConstants.marginMedium, borderRadius: 20,
                paddingHorizontal: 10,
                elevation: 3
            }}
                onPress={() => navigation.navigate(routeName, routeParams)}>
                <Card.Title
                    title={name}
                    titleStyle={[theme.fonts.bodyLarge, { marginTop: MMConstants.marginSmall }]}
                    left={() => <MMIcon iconName={icon} iconSize={30} iconColor={theme.colors.primary} />}
                    right={() => <MMIcon iconName={'chevron-forward'} iconSize={28} iconColor={theme.colors.primary} />}
                />
            </Card>
        )
    };

    const renderScreenHeader = () => {
        const firstLetter = _.first(userDetail.name);
        return (
            <MMSurface style={{ borderRadius: 20 }} padding={[10, 10, 10, 20]}>
                <View style={{ flexDirection: 'row' }}>
                    <Avatar.Text label={firstLetter} />
                    <View style={{ padding: MMConstants.paddingLarge }}>
                        <Text style={[theme.fonts.headlineMedium]}> {userDetail.name}</Text>
                        <Text style={theme.fonts.labelSmall}> {userDetail.gender}</Text>
                    </View>
                </View>
            </MMSurface>
        )
    };

    const renderView = () => {
        return (
            <>
                <MMItemCard name={'Your Profile'} icon={'person-outline'} routeName={"SignUp"} routeParams={{ mobileNumber: userDetail.mobileNumber }} />
                <MMItemCard name={'Address Book'} icon={'book-outline'} routeName={"AddressBook"} />
                <MMItemCard name={'Orders'} icon={'cart-outline'} routeName={"Home"} />
                <MMItemCard name={'Add Family Member'} icon={'heart-outline'} routeName={"AddFamilyMember"} />
                <MMItemCard name={'Notifications'} icon={'notifications-outline'} routeName={"Home"} />
                <MMItemCard name={'Privacy'} icon={'shield-checkmark-outline'} routeName={"Home"} />
                <MMItemCard name={'Contact Us'} icon={'mail-outline'} routeName={"Home"} />
                <MMItemCard name={'Logout'} icon={'exit-outline'} routeName={"Logout"} />
            </>
        );
    };

    return (
        <>
            <MMContentContainer>
                <MMScrollView>
                    {renderScreenHeader()}
                    {renderView()}
                </MMScrollView>
            </MMContentContainer>
        </>
    );
}

Profile.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};