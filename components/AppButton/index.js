import React from "react"
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native"
import { COLORS, FONT2MEDIUM, FONT2REGULAR } from "../../constants"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"

export default function AppButton({
  title,
  height,
  onPress,
  prefix,
  postfix,
  backgroundColor,
  disabled,
  loading,
  outlined,
  titleLight,
  color,
  borderColor,
  fontSize,
  paddingHorizontal,
  width,
  marginTop,
  borderWidth,
  borderRadius,
  minWidth
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.buttonContainer,
        {
          marginTop: marginTop || hp("2%"),
          paddingHorizontal: paddingHorizontal ? paddingHorizontal : 20,
          borderWidth: outlined || borderWidth ? 1 : 0,
          justifyContent: postfix ? "space-between" : "center",
          borderColor: borderColor || COLORS.primary,
          backgroundColor: backgroundColor ? backgroundColor : COLORS.primary,
          borderRadius: borderRadius ? borderRadius : 8,
          opacity: disabled ? 0.5 : 1,
          height: height ? height : hp(6),
          minWidth: minWidth ? minWidth : "auto",
          width: width ? width : "100%"
        }
      ]}
      onPress={loading ? console.log("") : onPress}
    >
      {prefix && prefix}
      {loading ? (
        <ActivityIndicator color={color ? color : COLORS.white} />
      ) : (
        <Text
          style={[
            styles.title,
            {
              fontSize: fontSize || hp(1.8),
              fontFamily: titleLight ? FONT2REGULAR : FONT2MEDIUM,
              color: color ? color : outlined ? COLORS.primary : COLORS.white
            }
          ]}
        >
          {title}
        </Text>
      )}
      {postfix && postfix}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center"
  },
  title: { fontSize: hp(2.3) }
})
