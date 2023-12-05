import React from 'react';

import Blank from '../../screens/templates/Blank';
import Column2 from '../../screens/templates/Column2';
import Row2 from '../../screens/templates/Row2';
import Row2Column2 from '../../screens/templates/Row2-Column2';
import RowColumn2 from '../../screens/templates/Row-Column2';

const CommonTemplate = (props) => {
    const { templateName, onPickImage, templateData, isDisable = false, borderWidth = 1, onSetTemplateData } = props;

    const Components = {
        "Blank": Blank,
        "Column2": Column2,
        "Row2": Row2,
        "Row2-Column2": Row2Column2,
        "Row-Column2": RowColumn2
    }
    const TemplateComponents = Components[templateName];

    return (
        <TemplateComponents onPickImage={onPickImage}
            templateData={templateData}
            borderWidth={borderWidth}
            isDisable={isDisable}
            onSetTemplateData={onSetTemplateData} />
    );
};

export default CommonTemplate;