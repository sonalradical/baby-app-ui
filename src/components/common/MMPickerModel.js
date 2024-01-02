import React from 'react';
import { FlatList, Modal, View } from 'react-native';
import { Divider, List, Text, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';

import MMConstants from '../../helpers/Constants';
import { MMButton } from './Button';
import MMIcon from './Icon';
import MMActionButtons from './ActionButtons';
import MMContentContainer from './ContentContainer';

export default function MMPickerModel(props) {
    const theme = useTheme();
    const { items, visible, onClose, onSelect, filterName = 'Items', selectedItem } = props;

    const renderItem = ({ item, index }) => (
        <>
            <List.Item
                title={item.label}
                titleStyle={theme.fonts.bodyLarge}
                onPress={() => {
                    onSelect(item.value);
                }}
                right={(props) => selectedItem === item.value ? <MMIcon iconName='check' iconColor={theme.colors.primary} /> : null}
            />
            {_.size(items) - 1 === index ? null : <Divider />}
        </>
    );

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}>
            <MMContentContainer paddingStyle={'none'}>
                <View style={[{
                    flex: 0,
                    alignItems: 'flex-start',
                    borderBottomWidth: 1,
                    padding: MMConstants.paddingLarge,
                    backgroundColor: theme.colors.primary
                }]}>
                    <Text style={[theme.fonts.headlineMedium, { color: theme.colors.secondaryContainer }]}>Select {filterName} </Text>
                </View>
                <List.Section>
                    <FlatList
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.value}
                    />
                </List.Section>
            </MMContentContainer>
            <MMActionButtons type={'bottomFixed'}>
                <MMButton onPress={onClose} label={'Close'} />
            </MMActionButtons>

        </Modal>


    );
}

MMPickerModel.propTypes = {
    items: PropTypes.any,
    onClose: PropTypes.any,
    filterName: PropTypes.any,
};
