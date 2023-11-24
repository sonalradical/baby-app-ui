import React from 'react';

import Blank from '../../screens/templates/Blank';
import Column2 from '../../screens/templates/Column2';
import Row2 from '../../screens/templates/Row2';
import Row2Column2 from '../../screens/templates/Row2-Column2';
import Column2Row from '../../screens/templates/Column2-Row';

const CommonTemplate = (props) => {
    const { templateName, onPickImage, templateData, isDisable = false, borderWidth = 1 } = props;

    const Components = {
        "Blank": Blank,
        "Column2": Column2,
        "Row2": Row2,
        "Row2-Column2": Row2Column2,
        "Column2-Row": Column2Row
    }
    const TemplateComponents = Components[templateName];

    return (
        <TemplateComponents onPickImage={onPickImage} templateData={templateData} borderWidth={borderWidth} isDisable={isDisable} />
    );
};

export default CommonTemplate;