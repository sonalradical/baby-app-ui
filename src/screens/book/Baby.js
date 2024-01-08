import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { useSelector } from 'react-redux';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMSurface from '../../components/common/Surface';


const Baby = () => {
    const theme = useTheme();
    const selectedBaby = useSelector((state) => state.AppReducer.baby);

    return (
        <MMSurface margin={[10, 0, 10, 0]} padding={[0, 20, 0, 50]}>
            <View style={{ borderLeftWidth: 1, borderStyle: MMUtils.isPlatformIos() ? 'solid' : 'dashed' }}>
                <View style={{ paddingVertical: 30 }}>
                    <Text style={[theme.fonts.headlineMedium, { textAlign: 'center', paddingBottom: MMConstants.paddingLarge }]}>
                        {selectedBaby.isBorn === 'Yes' ? selectedBaby.name : 'Little One'}</Text>
                    <Image
                        source={selectedBaby.isBorn === 'Yes' ? { uri: MMUtils.getImagePath(selectedBaby.picture) } :
                            require('../../assets/images/parenthood.jpg')}
                        style={{ alignSelf: 'center', width: 250, height: 200 }}
                    />
                    {selectedBaby.isBorn === 'Yes' ?
                        <View style={styles(theme).textView}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={theme.fonts.labelSmall}>{MMUtils.displayDate(selectedBaby.birthDate)}</Text>
                                <Text style={theme.fonts.labelSmall}>Date of birth</Text>
                            </View>

                            <View style={{ alignItems: 'center' }}>
                                <Text style={theme.fonts.labelSmall}>2.5 kg</Text>
                                <Text style={theme.fonts.labelSmall}>Weight</Text>
                            </View>

                            <View style={{ alignItems: 'center' }}>
                                <Text style={theme.fonts.labelSmall}>50 cm</Text>
                                <Text style={theme.fonts.labelSmall}>Length</Text>
                            </View>
                        </View> : null}
                </View>
            </View>
        </MMSurface>
    );
};

const styles = (theme) => StyleSheet.create({
    textView: {
        flexDirection: 'row',
        paddingTop: MMConstants.paddingLarge,
        justifyContent: 'space-between',
        width: '80%',
        alignSelf: 'center'
    }
});

export default Baby;