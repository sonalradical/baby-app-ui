import { StyleSheet } from 'react-native';
import MMColors from './Colors';
import MMConstants from './Constants';

const MMStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MMColors.backgroundColor,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  // Headings
  h1: {
    fontSize: 50, // Large headings
    fontWeight: 400, // Bold style for emphasis
    fontFamily: 'Wulkan display',
    color: MMColors.textDark,
  },
  h2: {
    fontSize: 20, // Secondary headings
    fontWeight: 700, // Bold style for emphasis
    color: MMColors.label,
    fontFamily: 'Maison Neue',
  },
  h3: {
    fontSize: 20, // Secondary headings
    fontWeight: 400, // Bold style for emphasis
    color: MMColors.label,
    fontFamily: 'Maison Neue',
  },
  // Labels
  label: {
    fontSize: 15, // Secondary headings
    fontWeight: 400, // Bold style for emphasis
    color: MMColors.label,
    fontFamily: 'Maison Neue',
  },
  appTitle: {
    fontSize: 20, // Secondary headings
    fontWeight: 500, // Bold style for emphasis
    color: MMColors.textDark,
    fontFamily: 'Wulkan display',
  },
  // Captions
  caption: {
    fontSize: 12, // Secondary headings
    fontWeight: 400, // Bold style for emphasis
    color: MMColors.textDark,
    fontFamily: 'Wulkan display',
  },
  // Link Text
  link: {
    fontSize: 16, // Hyperlinks
    color: MMColors.secondary, // Blue color for links
    textDecorationLine: 'underline', // Underlined style for links
  },
  // Highlighted Text
  highlight: {
    fontSize: 16, // Text that needs to stand out
    fontWeight: 700, // Bold style for emphasis
    color: MMColors.error, // Red color for emphasis
  },
  // Placeholder Text (Hint Text)
  placeholder: {
    fontSize: 16, // Placeholder text in form fields
    color: MMColors.hint, // Light gray color
  },
  // Error Text
  error: {
    fontSize: 14, // Text indicating errors or warnings
    color: MMColors.error, // Red color for error messages
  },
  // textContainer: {
  //     backgroundColor: MMColors.menuContents,
  //     width: '100%',
  //     height: 350,
  //     alignItems: 'center',
  //     justifyContent: 'center',
  // },
  // containerPadding: {
  //     flex: 1,
  //     backgroundColor: MMColors.white,
  //     padding: 5,
  //     marginBottom: 50
  // },
  // flex1: {
  //     flex: 1,
  // },
  // h1: {
  //     fontFamily: MMConstants.fonts.bold,
  //     fontSize: 50,
  // },
  // h2: {
  //     fontSize: 40,
  // },
  // h3: {
  //     fontSize: 22,
  // },
  // h4: {
  //     fontSize: 18,
  // },
  // h5: {
  //     fontSize: 16,
  // },
  // h6: {
  //     fontSize: 14,
  // },
  // h7: {
  //     fontSize: 12,
  // },
  // h8: {
  //     fontSize: 10,
  // },
  // h9: {
  //     fontSize: 8,
  // },
  // responsiveImage: {
  //     width: '100%',
  //     // Without height undefined it won't work
  //     height: undefined,
  //     // figure out your image aspect ratio
  //     //aspectRatio: 666 / 686,
  // },
  // relativePosition: {
  //     position: 'relative',
  // },
  // absolutePosition: {
  //     position: 'absolute',
  // },
  // alignSelf: {
  //     alignSelf: 'center',
  // },
  // paddingHorizontal: {
  //     paddingHorizontal: 10
  // },
  // title: {
  //     fontFamily: MMConstants.fonts.wulkanDisplaymedium,
  //     fontSize: 22,
  //     color: MMColors.black
  // },
  // alignItems: {
  //     alignItems: 'center',
  // },
  // subTitle: {
  //     color: MMColors.black,
  //     fontFamily: MMConstants.fonts.book,
  // },
  // labelTitle: {
  //     color: MMColors.label,
  //     fontFamily: MMConstants.fonts.book,
  // },
  // mediumText: {
  //     color: MMColors.black,
  //     fontFamily: MMConstants.fonts.wulkanDisplaymedium,
  // },
  // boldText: {
  //     color: MMColors.black,
  //     fontFamily: MMConstants.fonts.bold,
  // },
  // cardHeaderText: {
  //     fontFamily: MMConstants.fonts.tangerineregular,
  //     fontSize: 22,
  //     color: MMColors.label,
  //     textAlign: 'center',
  // },
  // cardSubHeaderText: {
  //     fontFamily: MMConstants.fonts.bold,
  //     color: MMColors.label,
  // },
  // errorText: {
  //     color: MMColors.error,
  //     fontFamily: MMConstants.fonts.book,
  //     marginLeft: 2,
  //     fontSize: 13,
  //     paddingTop: 2,
  //     paddingLeft: 2,
  // },
  // contentText: {
  //     // fontSize: 14,
  //     fontFamily: MMConstants.fonts.book,
  //     color: MMColors.label,
  //     textAlign: 'justify',
  // },
  // formItemLabel: {
  //     color: MMColors.label,
  //     // fontSize: 14,
  //     marginBottom: 5,
  //     fontFamily: MMConstants.fonts.bold,
  // },
  // alignSelfCenter: {
  //     alignSelf: 'center',
  // },
  // formItemInput: {
  //     backgroundColor: MMColors.white,
  //     borderColor: MMColors.inputBorder,
  //     borderWidth: 0.1,
  //     marginTop: 5,
  //     marginBottom: 5
  // },
  // formItemInputError: {
  //     borderBottomWidth: 1,
  //     backgroundColor: MMColors.white,
  //     borderColor: MMColors.error,
  //     height: 50,
  // },
  // formInput: {
  //     fontFamily: MMConstants.fonts.book,
  //     color: MMColors.label,
  //     fontSize: 14,
  // },
  // formInputArea: {
  //     fontFamily: MMConstants.fonts.book,
  //     color: MMColors.label,
  //     fontSize: 14,
  // },
  // formItemsReverse: {
  //     flexDirection: 'row-reverse',
  //     justifyContent: 'space-between',
  //     alignItems: 'flex-end',
  // },
  // buttonPrimary: {
  //     // width: '100%',
  //     borderRadius: 4,
  //     marginTop: 5,
  //     marginBottom: 5,
  // },
  // buttonPrimaryText: {
  //     // fontSize: 12,
  //     fontFamily: MMConstants.fonts.bold,
  //     color: MMColors.white,
  // },
  // buttonText: {
  //     color: MMColors.white,
  //     // fontSize: 11,
  //     fontFamily: MMConstants.fonts.bold,
  // },
  // roundButton: {
  //     borderRadius: 25,
  //     fontFamily: MMConstants.fonts.bold
  // },
  // transparentButtonText: {
  //     fontSize: 15,
  //     color: MMColors.disabled,
  // },
  // chip: {
  //     borderRadius: 14,
  //     backgroundColor: MMColors.white,
  //     borderWidth: 1,
  //     borderColor: MMColors.inputBorder,
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     // marginLeft: 5,

  //     minWidth: 100,
  //     paddingVertical: 5,
  //     paddingHorizontal: 10,
  // },
  // /* card css */
  // card: {
  //     backgroundColor: MMColors.white,
  //     padding: 10,
  //     borderRadius: 20,
  //     elevation: 10,
  //     margin: 20,
  //     shadowColor: '#000000',
  //     shadowOpacity: 0.4,
  //     shadowRadius: 2,
  //     shadowOffset: {
  //         height: 1,
  //         width: 1,
  //     },
  // },

  // divider: {
  //     backgroundColor: MMColors.menuTopBackground,
  //     height: 1,
  // },
  // iconStyle: {
  //     color: MMColors.orange,
  //     margin: 10,
  //     fontSize: 18,
  // },
  // buttonGroupSpacedBetween: {
  //     flexDirection: 'row',
  //     justifyContent: 'space-between',
  // },
  // headerFilter: {
  //     flex: 0,
  //     height: 40,
  //     borderBottomWidth: 1,
  //     borderBottomColor: MMColors.menuTopBackground,
  // },
  // headerFilterText: {
  //     paddingLeft: 16,
  //     paddingTop: 10,
  //     fontSize: 15,
  //     color: MMColors.label,
  //     fontFamily: MMConstants.fonts.bold,
  // },
  // headerButton: {
  //     marginTop: -2,
  //     marginRight: 25,
  // },
  // headerButtonText: {
  //     marginRight: -25,
  //     fontSize: 15,
  //     color: MMColors.orange,
  //     fontFamily: MMConstants.fonts.bold,
  // },

  // // Tabs
  // tabView: {
  //     marginTop: 0,
  //     borderTopWidth: 1,
  //     borderTopColor: MMColors.menuTopBackground,
  //     borderBottomColor: MMColors.menuTopBackground,
  // },
  // mt5: {
  //     marginTop: 5,
  // },
  // mt20: {
  //     marginTop: 20,
  // },
  // mt30: {
  //     marginTop: 30,
  // },
  // mt15: {
  //     marginTop: 15,
  // },
  // mtn20: {
  //     marginTop: -20,
  // },
  // mt10: {
  //     marginTop: 10,
  // },
  // mb20: {
  //     marginBottom: 20,
  // },
  // mb30: {
  //     marginBottom: 30,
  // },
  // mb10: {
  //     marginBottom: 10,
  // },
  // mb5: {
  //     marginBottom: 5,
  // },
  // mr20: {
  //     marginRight: 20,
  // },
  // mr10: {
  //     marginRight: 10,
  // },
  // ml20: {
  //     marginLeft: 20,
  // },
  // ml15: {
  //     marginLeft: 15,
  // },
  // ml10: {
  //     marginLeft: 10,
  // },
  // ml5: {
  //     marginLeft: 5,
  // },
  // m10: {
  //     margin: 10,
  // },
  // m15: {
  //     margin: 15,
  // },
  // m20: {
  //     margin: 20,
  // },
  // p5: {
  //     padding: 5,
  // },
  // p10: {
  //     padding: 10,
  // },
  // p15: {
  //     padding: 15,
  // },
  // p20: {
  //     padding: 20,
  // },
  // paddingBottom: {
  //     paddingBottom: 20
  // },
  // rowCenter: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  // },
  // row2Column: {
  //     flexDirection: 'row',
  //     justifyContent: 'space-between',
  //     alignItems: 'center',
  // },
  // paramRow: {
  //     width: '100%',
  //     flexDirection: 'row',
  //     flexWrap: 'wrap',
  // },
  // multiPickerContainer: {
  //     backgroundColor: MMColors.white,
  //     borderColor: MMColors.inputBorder,
  //     borderWidth: 1,
  //     borderRadius: 5,
  //     padding: 6,
  //     marginTop: 5,
  //     marginBottom: 5,
  // },
  // iconView: {
  //     borderWidth: 1,
  //     borderColor: MMColors.inputBorder,
  //     width: 100,
  //     height: 100,
  //     marginVertical: 10,
  // },
  // // new Design according
  // mainLabelFont: {
  //     // fontSize: 16,
  //     color: MMColors.heading,
  //     fontFamily: MMConstants.fonts.bold,
  //     margin: 5,
  // },
  // forDisplayView: {
  //     flex: 1,
  //     flexDirection: 'row-reverse',
  // },
  // forFlatListView: {
  //     backgroundColor: MMColors.background,
  //     flex: 1,
  //     margin: 5,
  // },
  // infoMediumText: {
  //     // fontSize: 12,
  //     color: MMColors.lightBlack,
  //     textAlign: 'justify',
  //     fontFamily: MMConstants.fonts.book,
  // },
  // smallInfoText: {
  //     // fontSize: 10,
  //     color: MMColors.lightBlack,
  //     textAlign: 'justify',
  //     fontFamily: MMConstants.fonts.book,
  // },
  // orangeFont: {
  //     color: MMColors.orange,
  //     fontFamily: MMConstants.fonts.book,
  //     // fontSize: 11
  // },
  // isApiCallLoaderView: {
  //     bottom: 0,
  //     position: 'absolute',
  //     alignSelf: 'center',
  // },
  // formItemsSpacedBetween: {
  //     flex: 1,
  //     flexDirection: 'row',
  //     justifyContent: 'space-between',
  //     alignItems: 'flex-start',
  // },
  // categoryListItem: {
  //     marginLeft: 0,
  //     padding: 16,
  // },
  // welcomeImage: {
  //     width: 300,
  //     height: 300,
  // },
  // bottomView: {
  //     width: '100%',
  //     backgroundColor: MMColors.orange,
  //     position: 'absolute',
  //     bottom: 0,
  // },
  // textStyle: {
  //     color: MMColors.orange,
  //     fontSize: 10,
  //     paddingLeft: 10,
  //     paddingRight: 10,
  // },
  // tabBarView: {
  //     padding: 10,
  //     paddingLeft: 10,
  //     paddingRight: 10,
  //     alignItems: 'center',
  // },
  // btnSecondary: {
  //     borderColor: MMColors.blue,
  //     borderWidth: 1,
  //     borderRadius: 4,
  //     padding: 8,
  //     color: MMColors.blue,
  //     minWidth: 80,
  //     textAlign: "center"
  // },
  // btnMain: {
  //     backgroundColor: MMColors.orange,
  //     minWidth: 80
  // },
});

export default MMStyles;
