import { Dimensions } from 'react-native'
import { StyleSheet } from 'react-native';

export const dimensions = {
    fullHeight: Dimensions.get('window').height,
    fullWidth: Dimensions.get('window').width
}

export const colors = {
    PRIMARY: '#004bed',
    SECONDARY: '#ff00dd',
    TERTIARY: '#001e63',
    BLACK: '#1b1725',
    WHITE: '#ffffff',
    GREEN: '#30cf0c',
    BORDER: '#C8C8C8',
    GRAY: '#585b61',
    SCREEN: '#F8F8F8'
}

export const spacing = {
    SMALL: 5,
    MEDIUM: 10,
    LARGE: 20,
}

export const width = {
    SMALL: 90,
    MEDIUM: 160,
    LARGE: 200,
}

export const height = {
    SMALL: 30,
    MEDIUM: 40,
    LARGE: 60,
}

export const fonts = {
    SMALL: 16,
    MEDIUM: 18,
    LARGE: 20,
    PRIMARY: 'ArialRoundedMTBold',
    WEIGHT_LIGHT: "200",
    WEIGHT_MEDIUM: "600",
    WEIGHT_HEAVY: "800"
}

// containers

export const container = {
    width: dimensions.fullWidth,
    height: dimensions.fullHeight,
    backgroundColor: colors.SCREEN
}



export const formContainer = {
    margin: '3%',
    marginRight: '5%',
    marginLeft: '5%',
    padding: 30,
    borderRadius: 5,
    width: dimensions.fullWidth * .85,
    // shadowColor: colors.BLACK,
    // shadowOffset: { width: 4, height: 4 },
    // shadowOpacity: 0.5,
    // shadowRadius: 10,
}

export const infoContainer = {
    margin: '3%',
}

// components

export const input = {
    color: colors.TERTIARY,
    fontSize: fonts.MEDIUM,
    fontWeight: fonts.WEIGHT_LEIGHT,
    height: height.MEDIUM,
    width: width.LARGE,
    borderColor: colors.TERTIARY,
    borderBottomWidth: 1,
}

export const inputView = {
    color: colors.TERTIARY,
    fontWeight: fonts.WEIGHT_LEIGHT,
    width: dimensions.fullWidth * 0.6,
    minHeight: height.MEDIUM,
    borderColor: colors.BORDER,
    borderWidth: 0,
    borderBottomWidth: 1,
    fontSize: fonts.MEDIUM
}



export const inputLabel = {
    padding: 0,
    margin: 0,
    color: colors.TERTIARY,
    marginTop: spacing.SMALL,
    marginBottom: spacing.MEDIUM,
    fontSize: fonts.SMALL,
    textTransform: 'uppercase',
    fontWeight: fonts.WEIGHT_LEIGHT,
    fontFamily: fonts.PRIMARY,
}

export const inputViewLabel = {

    textTransform: 'uppercase',
    color: colors.TERTIARY,
    fontWeight: fonts.WEIGHT_LEIGHT,
    marginBottom: spacing.MEDIUM,
    margin: 0,
    minWidth: width.MEDIUM,
    height: height.MEDIUM,
    fontSize: fonts.SMALL,
    paddingTop: spacing.MEDIUM * 0.8
}

export const boolSelect = {
    height: 100,
    padding: spacing.MEDIUM
}

export const select = {
    height: 100,
    color: colors.PRIMARY
}

export const form = {
    controlLabel: {
        normal: {
            ...inputLabel
        },
        error: {

        }
    },
    textbox: {
        normal: {
            ...input
        },
        error: {

        }
    },
    checkbox: {
        normal: {
            ...boolSelect
        }
    }
}


export const base = StyleSheet.create(
    {
        slider: {
            height: 20,
            justifyContent: 'center',
            borderWidth: 0.5,
            borderRadius: 10,
            padding: spacing.SMALL * 0.5,
            paddingLeft: 0,
            paddingRight: 0,
            borderColor: colors.PRIMARY
        },
        inputStyle: {
            color: colors.TERTIARY,
            fontSize: fonts.MEDIUM,
            fontWeight: fonts.WEIGHT_MEDIUM,
        },
        btnView: {
            alignItems: 'center',
        }
    });