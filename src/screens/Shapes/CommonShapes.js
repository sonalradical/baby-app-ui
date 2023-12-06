import React from 'react';
import Square from './Square';

export default function CommonShapes({ navigation, route }) {
    const { shapeName, templateData, templateName } = route.params;

    const Components = {
        "Square": Square
    }
    const TemplateComponents = Components[shapeName];

    return (
        <TemplateComponents
            templateData={templateData}
            templateName={templateName} />
    );
};