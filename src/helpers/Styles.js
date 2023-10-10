import { Dimensions, StyleSheet } from 'react-native';
import MMColors from './Colors';
import MMConstants from './Constants';

const MMStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MMColors.white,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    textContainer: {
        backgroundColor: MMColors.menuContents,
        width: '100%',
        height: 350,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerPadding: {
        flex: 1,
        backgroundColor: MMColors.white,
        padding: 5,
    },
    flex1: {
        flex: 1,
    },
    h1: {
        fontFamily: MMConstants.fonts.bold,
        fontSize: 50,
    },
    h2: {
        fontSize: 40,
    },
    h3: {
        fontSize: 22,
    },
    h4: {
        fontSize: 18,
    },
    h5: {
        fontSize: 16,
    },
    h6: {
        fontSize: 14,
    },
    h7: {
        fontSize: 12,
    },
    h8: {
        fontSize: 10,
    },
    h9: {
        fontSize: 8,
    },
    responsiveImage: {
        width: '100%',
        // Without height undefined it won't work
        height: undefined,
        // figure out your image aspect ratio
        //aspectRatio: 666 / 686,
    },
    relativePosition: {
        position: 'relative',
    },
    absolutePosition: {
        position: 'absolute',
    },
    alignSelf: {
        alignSelf: 'center',
    },
    paddingHorizontal: {
        paddingHorizontal: 10
    },
    titleText: {
        // fontSize: 20,
        color: MMColors.gray,
        fontFamily: MMConstants.fonts.regular,
    },
    alignItems: {
        alignItems: 'center',
    },
    subTitle: {
        color: MMColors.gray,
        // fontSize: 16,
        fontFamily: MMConstants.fonts.regular,
        //opacity: 0.5,
    },
    labelTitle: {
        color: MMColors.label,
        // fontSize: 14,
        fontFamily: MMConstants.fonts.regular,
        opacity: 0.6,
    },
    orangeText: {
        color: MMColors.orange,
        fontFamily: MMConstants.fonts.medium,
    },
    whiteText: {
        color: MMColors.white,
        fontFamily: MMConstants.fonts.semiBlod,
    },
    cardHeaderText: {
        fontFamily: MMConstants.fonts.bold,
        fontSize: 22,
        color: MMColors.label,
        textAlign: 'center',
    },
    cardSubHeaderText: {
        fontFamily: MMConstants.fonts.bold,
        // fontSize: 15,
        color: MMColors.label,
    },
    errorText: {
        color: MMColors.error,
        // fontSize: 12,
        fontFamily: MMConstants.fonts.regular,
        marginLeft: 2
    },
    contentText: {
        // fontSize: 14,
        fontFamily: MMConstants.fonts.regular,
        color: MMColors.label,
        textAlign: 'justify',
    },
    formItemLabel: {
        color: MMColors.label,
        // fontSize: 14,
        marginBottom: 5,
        fontFamily: MMConstants.fonts.bold,
    },
    alignSelfCenter: {
        alignSelf: 'center',
    },
    formItemInput: {
        backgroundColor: MMColors.white,
        borderColor: MMColors.inputBorder,
        borderWidth: 0.1,
        marginTop: 5,
        marginBottom: 5
    },
    formItemInputError: {
        borderBottomWidth: 1,
        backgroundColor: MMColors.white,
        borderColor: MMColors.error,
        height: 50,
    },
    formInput: {
        fontFamily: MMConstants.fonts.regular,
        color: MMColors.label,
        fontSize: 14,
    },
    formInputArea: {
        fontFamily: MMConstants.fonts.regular,
        color: MMColors.label,
        fontSize: 14,
    },
    formItemsReverse: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    buttonPrimary: {
        // width: '100%',
        backgroundColor: MMColors.orange,
        borderRadius: 4,
        marginTop: 5,
        marginBottom: 5,
    },
    buttonPrimaryText: {
        // fontSize: 12,
        fontFamily: MMConstants.fonts.bold,
        color: MMColors.white,
    },
    buttonText: {
        color: MMColors.white,
        // fontSize: 11,
        fontFamily: MMConstants.fonts.bold,
    },
    roundButton: {
        borderRadius: 25,
        height: 45
    },
    transparentButtonText: {
        fontSize: 15,
        color: MMColors.disabled,
    },
    chip: {
        borderRadius: 14,
        backgroundColor: MMColors.white,
        borderWidth: 1,
        borderColor: MMColors.inputBorder,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // marginLeft: 5,

        minWidth: 100,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    /* card css */
    card: {
        backgroundColor: MMColors.white,
        padding: 10,
        borderRadius: 5,
        elevation: 10,
        margin: 10,
        shadowColor: '#000000',
        shadowOpacity: 0.4,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        },
    },

    divider: {
        backgroundColor: MMColors.menuTopBackground,
        height: 1,
    },
    iconStyle: {
        color: MMColors.orange,
        margin: 10,
        fontSize: 18,
    },
    buttonGroupSpacedBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerFilter: {
        flex: 0,
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: MMColors.menuTopBackground,
    },
    headerFilterText: {
        paddingLeft: 16,
        paddingTop: 10,
        fontSize: 15,
        color: MMColors.label,
        fontFamily: MMConstants.fonts.bold,
    },
    headerButton: {
        marginTop: -2,
        marginRight: 25,
    },
    headerButtonText: {
        marginRight: -25,
        fontSize: 15,
        color: MMColors.orange,
        fontFamily: MMConstants.fonts.bold,
    },

    // Tabs
    tabView: {
        marginTop: 0,
        borderTopWidth: 1,
        borderTopColor: MMColors.menuTopBackground,
        borderBottomColor: MMColors.menuTopBackground,
    },
    mt5: {
        marginTop: 5,
    },
    mt20: {
        marginTop: 20,
    },
    mt30: {
        marginTop: 30,
    },
    mt15: {
        marginTop: 15,
    },
    mtn20: {
        marginTop: -20,
    },
    mt10: {
        marginTop: 10,
    },
    mb20: {
        marginBottom: 20,
    },
    mb30: {
        marginBottom: 30,
    },
    mb10: {
        marginBottom: 10,
    },
    mb5: {
        marginBottom: 5,
    },
    mr20: {
        marginRight: 20,
    },
    mr10: {
        marginRight: 10,
    },
    ml20: {
        marginLeft: 20,
    },
    ml15: {
        marginLeft: 15,
    },
    ml10: {
        marginLeft: 10,
    },
    ml5: {
        marginLeft: 5,
    },
    m10: {
        margin: 10,
    },
    m20: {
        margin: 20,
    },
    p5: {
        padding: 5,
    },
    p10: {
        padding: 10,
    },
    paddingBottom: {
        paddingBottom: 20
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    row2Column: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paramRow: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    multiPickerContainer: {
        backgroundColor: MMColors.white,
        borderColor: MMColors.inputBorder,
        borderWidth: 1,
        borderRadius: 5,
        padding: 6,
        marginTop: 5,
        marginBottom: 5,
    },
    iconView: {
        borderWidth: 1,
        borderColor: MMColors.inputBorder,
        width: 100,
        height: 100,
        marginVertical: 10,
    },
    // new Design according
    mainLabelFont: {
        // fontSize: 16,
        color: MMColors.heading,
        fontFamily: MMConstants.fonts.semiBlod,
        margin: 5,
    },
    forDisplayView: {
        flex: 1,
        flexDirection: 'row-reverse',
    },
    forFlatListView: {
        backgroundColor: MMColors.background,
        flex: 1,
        margin: 5,
    },
    infoMediumText: {
        // fontSize: 12,
        color: MMColors.lightBlack,
        textAlign: 'justify',
        fontFamily: MMConstants.fonts.regular,
    },
    smallInfoText: {
        // fontSize: 10,
        color: MMColors.lightBlack,
        textAlign: 'justify',
        fontFamily: MMConstants.fonts.regular,
    },
    orangeFont: {
        color: MMColors.orange,
        fontFamily: MMConstants.fonts.regular,
        // fontSize: 11
    },
    isApiCallLoaderView: {
        bottom: 0,
        position: 'absolute',
        alignSelf: 'center',
    },
    formItemsSpacedBetween: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    categoryListItem: {
        marginLeft: 0,
        padding: 16,
    },
    welcomeImage: {
        width: 300,
        height: 300,
    },
    bottomView: {
        width: '100%',
        backgroundColor: MMColors.orange,
        position: 'absolute',
        bottom: 0,
    },
    textStyle: {
        color: MMColors.orange,
        fontSize: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    btnSecondary: {
        borderColor: MMColors.blue,
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        color: MMColors.blue,
        minWidth: 80,
        textAlign: "center"
    },
    btnMain: {
        backgroundColor: MMColors.orange,
        minWidth: 80
    },
});

export default MMStyles;
