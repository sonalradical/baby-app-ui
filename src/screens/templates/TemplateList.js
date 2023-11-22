import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMEnums from '../../helpers/Enums';
import MMApiService from '../../services/ApiService';
import MMContentContainer from '../../components/common/ContentContainer';
import MMSpinner from '../../components/common/Spinner';
import MMPageTitle from '../../components/common/PageTitle';

export default function TemplateList({ navigation, route }) {
    const theme = useTheme();
    const lookupData = useSelector((state) => state.AuthReducer.lookupData);
    const selectedBabyId = useSelector((state) => state.AppReducer.baby);
    //const [isLoading, setLoading] = useState(true);


    const renderTemplate = ({ item }) => {
        const templateImage = MMConstants.templates[item.icon];
        return (
            <TouchableOpacity style={{ flexDirection: 'column', paddingHorizontal: 22, marginVertical: MMConstants.marginMedium }}
                onPress={() => navigation.navigate('MilestoneQuiz', { babyId: selectedBabyId, milestoneId: item._id })}>
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
                data={lookupData.template}
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
