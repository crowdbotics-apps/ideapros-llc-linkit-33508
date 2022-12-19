import React, { useContext, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"
import { SvgXml } from "react-native-svg"
import { validateEmail } from "../../utils/ValidateEmail"
import {
  COLORS,
  FONT1MEDIUM,
  FONT1REGULAR,
  FONT1SEMIBOLD
} from "../../constants"
import { AppButton, AppInput } from "../../components"
import Toast from "react-native-simple-toast"
import { forgotpassword } from "../../api/auth"
import logo from "../../assets/svg/logo.svg"

function ForgotPassword({ navigation }) {
  // State
  const [state, setState] = useState({
    email: "",
    isEmailValid: false,
    loading: false
  })

  const { email, loading } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const isEmailValid = () => {
    const isValid = validateEmail(state.email)
    if (!isValid) {
      handleChange("email", "")
      Toast.show("Email is not valid!")
    } else {
      handleChange("isEmailValid", true)
    }
  }

  const onSubmit = async () => {
    try {
      handleChange("loading", true)
      const payload = {
        email
      }
      const res = await forgotpassword(payload)
      console.warn("res?.data", res?.data)
      handleChange("loading", false)
      Toast.show(`Email has been sent to ${email}`, Toast.SHORT)
      navigation.goBack()
    } catch (error) {
      handleChange("loading", false)
      const errorText = Object.values(error?.response?.data)
      if (errorText?.length > 0) {
        Toast.show(`Error: ${errorText[0]}`)
      } else {
        Toast.show(`Error: ${error.message}`)
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.logoTop}>
          <SvgXml xml={logo} width={100} style={{ marginBottom: 20 }} />
          <View style={[styles.tabs, { justifyContent: "center" }]}>
            <View style={styles.activeTab}>
              <Text style={styles.activeTabText}>Forgot password</Text>
            </View>
          </View>
        </View>
        <View style={styles.textInputContainer}>
          <AppInput
            inputLabel={"Email"}
            placeholder={"Email"}
            name={"email"}
            prefixBGTransparent
            value={state.email}
            onChange={handleChange}
            onBlur={isEmailValid}
            isValid={state.isEmailValid}
          />
        </View>
      </View>
      <View style={styles.buttonWidth}>
        <AppButton
          title={"Submit"}
          loading={loading}
          disabled={!email}
          onPress={() => onSubmit()}
        />
        <AppButton
          title={"Cancel"}
          outlined
          backgroundColor={"transparent"}
          onPress={() => navigation.goBack()}
        />
        <AppButton
          title={"Resend Link"}
          outlined
          disabled={!email}
          borderColor={"transparent"}
          color={COLORS.darkRed}
          backgroundColor={"transparent"}
          onPress={() => onSubmit()}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    backgroundColor: COLORS.backgroud,
    height: "100%",
    alignItems: "center"
  },
  top: {
    width: "100%",
    alignItems: "center"
  },
  logoTop: {
    width: "100%",
    backgroundColor: COLORS.white,
    marginBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    alignItems: "center"
  },
  backContainer: { width: "90%", alignItems: "flex-start", marginBottom: 30 },
  header: { width: "90%", marginBottom: "10%" },
  buttonWidth: { width: "80%", marginBottom: 20, marginTop: 50 },
  row: { flexDirection: "row", alignItems: "center" },
  hLine: { height: 1, width: 100, backgroundColor: COLORS.grey },
  textInputContainer: {
    marginBottom: hp("2%"),
    marginTop: hp("5%"),
    width: "90%"
  },
  remeberContainer: {
    alignItems: "flex-end",
    width: "90%",
    marginBottom: hp("2%")
  },
  forgotText: { color: COLORS.black, fontFamily: FONT1REGULAR },
  orText: {
    color: COLORS.black,
    fontFamily: FONT1REGULAR,
    marginHorizontal: 10
  },
  invalid: {
    color: COLORS.alertButon,
    fontFamily: FONT1REGULAR
  },
  loginText: {
    color: COLORS.black,
    fontSize: hp("4%"),
    fontFamily: FONT1SEMIBOLD
  },
  lightText: {
    color: COLORS.grey,
    marginTop: 10,
    lineHeight: 22,
    fontSize: hp(2),
    fontFamily: FONT1REGULAR
  },
  tabs: {
    width: "90%",
    paddingHorizontal: 5,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
    width: "45%",
    justifyContent: "center",
    height: hp(5),
    alignItems: "center"
  },
  activeTabText: {
    color: COLORS.darkBlack,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  }
})

export default ForgotPassword
