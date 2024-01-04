import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import MMConstants from '../../helpers/Constants';
import MMContentContainer from '../../components/common/ContentContainer';
import MMPageTitle from '../../components/common/PageTitle';

export default function TemplateList({ navigation, route }) {
    const { position, itemTitle } = route.params;
    const theme = useTheme();
    const lookupData = useSelector((state) => state.AuthReducer.lookupData);

    const renderTemplate = ({ item }) => {
        const templateImage = MMConstants.templates[item.icon];
        return (
            <TouchableOpacity style={{ flexDirection: 'column', paddingHorizontal: 22, marginVertical: MMConstants.marginMedium }}
                onPress={() => navigation.navigate(MMConstants.screens.mainTemplate, { position: position, templateName: item.code, templateId: item._id, itemTitle: itemTitle })} >
                <Image
                    textAlign="center"
                    resizeMode="contain"
                    source={templateImage}
                    style={styles(theme).image}
                />
            </TouchableOpacity>
        );
    };

    const renderView = () => {
        return (
            <FlatList
                data={lookupData.templates}
                columnWrapperStyle={{ alignContent: 'center' }}
                ListHeaderComponent={<MMPageTitle title='Select Layout' />}
                renderItem={renderTemplate}
                keyExtractor={(item) => item._id}
                numColumns={2}
            />
        );
    };

    return (
        <MMContentContainer>
            {renderView()}
        </MMContentContainer>
    );
}

TemplateList.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = (theme) => StyleSheet.create({
    image: {
        width: Dimensions.get('window').width / 3,
        height: Dimensions.get('window').height / 6,
    },
});
