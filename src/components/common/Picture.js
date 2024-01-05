import * as React from 'react';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

const MMPicture = ({ textAlign, resizeMode, pictureUri, style }) => {

  return (
    <FastImage
      textAlign={textAlign}
      resizeMode={resizeMode}
      source={{
        uri: pictureUri
      }}
      style={style}
    />
  );

};

MMPicture.propTypes = {
  pictureUri: PropTypes.string
};

export default MMPicture;