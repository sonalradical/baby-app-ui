import * as React from 'react';
import PropTypes from 'prop-types';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

const MMPicture = ({ pictureUrl, onPressPicture, }) => {
  const theme = useTheme();

  return (
    <Image
      resizeMode={'contain'}
      style={{ height: 100, width: 100, borderRadius: 4 }}
      source={{ uri: pictureUrl }}
    />
  );

};

MMPicture.propTypes = {
  pictureUrl: PropTypes.string,
  onPressPicture: PropTypes.func,
};

export default MMPicture;
