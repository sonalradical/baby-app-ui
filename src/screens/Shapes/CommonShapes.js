import React from 'react';
import Square from './Square';
import Column from './Column';
import Row from './Row';

export default function CommonShapes({ navigation, route }) {
    const { shapeName, templateData, templateName } = route.params;

    const Components = {
        "Square": Square,
        "Column": Column,
        "Row": Row
    }
    const TemplateComponents = Components[shapeName];

    return (
        <TemplateComponents
            templateData={templateData}
            templateName={templateName} />
    );
};