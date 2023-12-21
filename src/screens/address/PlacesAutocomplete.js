import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { View } from 'react-native';
import MMConfig from '../../helpers/Config';
import { useTheme } from 'react-native-paper';
import MMIcon from '../../components/common/Icon';
navigator.geolocation = require('@react-native-community/geolocation');

function MMPlacesAutocomplete(props) {
    const theme = useTheme();

    const {
        placeholder, updatedLatLong, defaultValue = ''
    } = props;

    const ref = useRef();

    useEffect(() => {
        if (defaultValue) {
            ref.current?.setAddressText(defaultValue);
        }
    }, [defaultValue]);


    const onChange = async ({ data, details }) => {
        if (!data) {
            return;
        }
        ref?.current?.clear();

        const location = { addressLine1: '', latitude: details.geometry.location.lat, longitude: details.geometry.location.lng };
        _.map(details.address_components, (item) => {

            if (item.types.includes('administrative_area_level_2') || item.types.includes('locality')) {
                location.suburb = item.long_name;
            } else if (item.types.includes('administrative_area_level_1')) {
                location.state = item.long_name;
            } else if (item.types.includes('country')) {
                location.country = item.long_name;
            } else if (item.types.includes('postal_code')) {
                location.postcode = item.long_name;
            }
            else if (item.long_name) {
                location.addressLine1 = location.addressLine1 + item.long_name + ', ';
            }
        });
        if (location.addressLine1.length > 3) {
            location.addressLine1 = location.addressLine1.substring(0, location.addressLine1.length - 2);
        }
        updatedLatLong(location);
    }

    return (
        <View style={{ height: 50, zIndex: 1000 }}>
            <GooglePlacesAutocomplete
                currentLocation={true}
                currentLocationLabel='My Location'
                placeholder={placeholder}
                onPress={(data, details = null) => onChange({ data, details })}
                query={{ key: MMConfig().REACT_APP_GOOGLE_PLACES_API_KEY, components: "country:au", type: "address", language: 'en' }}
                fetchDetails={true}
                onFail={error => console.log(error)}
                onNotFound={() => console.log('no results')}
                renderLeftButton={() => (
                    <View style={{ position: 'absolute', marginLeft: 8, zIndex: 9, height: '90%', display: 'flex', justifyContent: 'center' }}>
                        <MMIcon iconName='search' iconSize={26} iconColor={theme.colors.primary} />
                    </View>
                )}
                enablePoweredByContainer={false}
                styles={{
                    textInput: {
                        color: theme.colors.text.secondory,
                        borderWidth: 1,
                        borderColor: theme.colors.outline,
                        paddingLeft: 40
                    },
                    listView: {
                        zIndex: 1000,
                        position: 'absolute',
                        top: 45
                    },
                    description: {
                        fontWeight: 'bold',
                    }
                }}
                ref={ref}
            />
        </View>
    )
}

MMPlacesAutocomplete.propTypes = {
    placeholder: PropTypes.string
};

export default MMPlacesAutocomplete;