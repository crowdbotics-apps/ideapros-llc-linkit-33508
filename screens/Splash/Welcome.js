import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useEffect, useState } from "react"
import { TouchableOpacity } from "react-native"
import { View, StyleSheet, Text, ImageBackground } from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import BG from "../../assets/images/welcomeBG.png"
import { AppButton } from "../../components"
import { COLORS, FONT1LIGHT, FONT1MEDIUM, FONT1REGULAR } from "../../constants"

function Welcome({ navigation }) {
  const [env, setEnv] = useState("")
  const handleSubmit = async () => {
    await AsyncStorage.setItem("env", env)
    navigation.navigate("GettingStarted")
  }
  return (
    <ImageBackground source={BG} style={styles.container}>
      <View style={styles.body}>
        <View style={{ width: "80%", alignItems: "center" }}>
          <Text
            style={{
              color: COLORS.primary,
              fontFamily: FONT1MEDIUM,
              fontSize: hp(3.5),
              width: "100%"
            }}
          >
            {"Welcome to\nLinKitch"}
          </Text>
          <Text
            style={{
              color: COLORS.black,
              fontFamily: FONT1REGULAR,
              width: "100%",
              fontSize: hp(2)
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Felis
            praesent turpis adipiscing mattis vel orci id. Ut nisi, lacus diam
            consequat
          </Text>
          <Text style={styles.continue}>Continue As:</Text>
          <TouchableOpacity
            style={[
              styles.borderButton,
              {
                backgroundColor: env === "Kitch" ? COLORS.primary : COLORS.white
              }
            ]}
            onPress={() => setEnv(env === "Kitch" ? "" : "Kitch")}
          >
            <Text
              style={[
                styles.title,
                { color: env === "Kitch" ? COLORS.white : COLORS.black }
              ]}
            >
              Kitch/Provider
            </Text>
            <Text
              style={[
                styles.description,
                { color: env === "Kitch" ? COLORS.white : COLORS.black }
              ]}
            >
              Nullam pellentesque at aliquet a non ut.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.borderButton,
              {
                backgroundColor: env === "Litch" ? COLORS.primary : COLORS.white
              }
            ]}
            onPress={() => setEnv(env === "Litch" ? "" : "Litch")}
          >
            <Text
              style={[
                styles.title,
                { color: env === "Litch" ? COLORS.white : COLORS.black }
              ]}
            >
              Litch/Consumer
            </Text>
            <Text
              style={[
                styles.description,
                { color: env === "Litch" ? COLORS.white : COLORS.black }
              ]}
            >
              Nullam pellentesque at aliquet a non ut.
            </Text>
          </TouchableOpacity>
          <AppButton
            disabled={!env}
            marginTop={50}
            onPress={handleSubmit}
            title={"Continue"}
          />
        </View>
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
    justifyContent: "flex-end"
  },
  borderButton: {
    width: "90%",
    marginTop: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    borderColor: COLORS.primary
  },
  title: {
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2)
  },
  description: {
    fontFamily: FONT1REGULAR,
    fontSize: hp(1.8)
  },
  continue: {
    color: COLORS.black,
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2),
    textAlign: "center",
    marginTop: hp(5)
  },
  body: {
    width: "100%",
    height: "80%",
    alignItems: "center",
    paddingTop: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: COLORS.white
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

export default Welcome
