import React from 'react';
import MMUtils from '../../helpers/Utils';
import ImagePicker from 'react-native-image-crop-picker';

import Blank from '../../screens/templates/Blank';
import Column2 from '../../screens/templates/Column2';
import Row2 from '../../screens/templates/Row2';
import Row2Column2 from '../../screens/templates/Row2-Column2';
import RowColumn2 from '../../screens/templates/Row-Column2';
import Column2Row from '../../screens/templates/Column2-Row';

const CommonTemplate = (props) => {
    const { templateName, onPickImage, templateData, isDisable = false, borderWidth = 1, pageId, ImageProps, onImageChange } = props;

    const Components = {
        "Blank": Blank,
        "Column2": Column2,
        "Row2": Row2,
        "Row2-Column2": Row2Column2,
        "Row-Column2": RowColumn2,
        "Column2-Row": Column2Row
    }
    const TemplateComponents = Components[templateName];


    const onEditPicture = (name, width, height) => {
        const template = templateData.find(item => item.name === name);
        ImagePicker.openCropper({
            path: template?.source,
            width: width,
            height: height
        }).then((selectedImage) => {
            onImageChange({
                uri: selectedImage.path,
                width: selectedImage.width,
                height: selectedImage.height,
                mime: selectedImage.mime,
            }, template?.name, template?.type);
        }).catch((e) => MMUtils.showToastMessage(e.message ? e.message : e));
    }

    return (
        <TemplateComponents onPickImage={onPickImage}
            templateData={templateData}
            borderWidth={borderWidth}
            isDisable={isDisable}
            pageId={pageId}
            ImageProps={ImageProps}
            onEditPicture={onEditPicture}
            onImageChange={onImageChange} />
    );
};

export default CommonTemplate;