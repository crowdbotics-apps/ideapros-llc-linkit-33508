import React, { useEffect, useState } from "react"
import { View, StyleSheet, Text, ImageBackground } from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { SvgXml } from "react-native-svg"
import logo from "../../assets/svg/logo.svg"
import BG from "../../assets/images/splashBG.png"
import { COLORS, FONT1LIGHT, FONT1MEDIUM, FONT1REGULAR } from "../../constants"

function Splash({ navigation }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    setInterval(() => {
      setValue(pre => pre + 1)
    }, 300)
    setTimeout(() => {
      navigation.navigate("AuthLoading")
    }, 3000)
  }, [])
  return (
    <ImageBackground source={BG} style={styles.container}>
      <View style={{ height: 50 }} />
      <SvgXml xml={logo} />
      <View style={{ width: "80%", marginBottom: "25%" }}>
        <Text
          style={{
            color: COLORS.primary,
            fontFamily: FONT1MEDIUM,
            fontSize: hp(3.5)
          }}
        >
          {"Find and Get\nYour Best Food"}
        </Text>
        <Text
          style={{
            color: COLORS.black,
            width: "80%",
            fontFamily: FONT1REGULAR,
            fontSize: hp(2)
          }}
        >
          Find the most delicious food with the best quality and free delivery
          here
        </Text>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroud,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between"
  },
  slider: {
    alignItems: "center",
    width: "90%"
  },
  loadingText: {
    fontFamily: FONT1LIGHT,
    fontSize: hp(2),
    color: COLORS.secondary,
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20
  }
})

export default Splash
