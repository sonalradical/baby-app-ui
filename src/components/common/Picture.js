import * as React from 'react';
import PropTypes from 'prop-types';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

const MMPicture = ({ pictureUrl, onPressPicture, type = 'cardTitle' }) => {
  const theme = useTheme();

  return (
    <Image
      resizeMode={'contain'}
      style={{ height: 100, width: 100, borderRadius: 4 }}
      source={{ uri: pictureUrl }}
    />
  );

};

const styles = (theme) => StyleSheet.create({
  cardTitleView: {
    marginTop: -12,
    marginRight: 12,
    paddingBottom: 12,
    paddingLeft: 16,
  },
  multipleView: {
    marginTop: 4,
    marginRight: 12,
  },
});

MMPicture.propTypes = {
  pictureUrl: PropTypes.string,
  onPressPicture: PropTypes.func,
  type: PropTypes.oneOf(['cardTitle', 'multiple']),
};

export default MMPicture;
