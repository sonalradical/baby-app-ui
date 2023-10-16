import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Avatar, Title } from 'react-native-paper';
import MMIcon from './Icon';
import MMColors from '../../helpers/Colors';
import MMStyles from '../../helpers/Styles';


export default function MMProfileCard({ profileData, onPress, onEdit = null, onDelete = null }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Card style={MMStyles.mb10}>
                <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar.Image
                        size={56}
                        source={require('../../assets/images/girl.jpeg')}
                    />
                    <Card.Title title={profileData.name} subtitle={profileData.gender} style={{ width: 100 }} />
                    {onEdit && (
                        <MMIcon
                            iconName="edit"
                            iconColor={MMColors.orange} // Edit icon color
                            iconSize={24}
                            onPress={onEdit}
                        />
                    )}
                    {onDelete && (
                        <MMIcon
                            iconName="trash-o"
                            style={MMStyles.ml5}
                            iconColor={MMColors.orange}  // Delete icon color
                            iconSize={24}
                            onPress={onDelete}
                        />
                    )}
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    avatarIcon: {
        backgroundColor: 'transparent',
    },
    chevronIcon: {
        marginLeft: 'auto',
        backgroundColor: 'blue'
    },
});